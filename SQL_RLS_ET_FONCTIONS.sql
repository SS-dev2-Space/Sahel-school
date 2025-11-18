-- ============================================
-- FICHIER SQL POUR CONFIGURER SUPABASE
-- ============================================
-- Exécutez ce fichier dans l'éditeur SQL de Supabase
-- ============================================

-- 1. FONCTION POUR CRÉER UN MEMBRE ÉLÈVE
-- ============================================
CREATE OR REPLACE FUNCTION creer_membre_eleve(
    member_email TEXT,
    member_password TEXT,
    student_id UUID,
    owner_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_auth_user_id UUID;
    new_member_id UUID;
BEGIN
    -- 1. Créer l'utilisateur dans auth.users via Supabase Auth
    -- Note: Cette partie doit être gérée par une Edge Function car on ne peut pas insérer directement dans auth.users
    -- Pour l'instant, on crée juste l'entrée dans members
    -- L'admin devra créer le compte auth via l'interface Supabase ou une Edge Function
    
    -- 2. Créer l'entrée dans la table members
    INSERT INTO members (
        email,
        role,
        owner_user_id,
        assigned_student_ids
    )
    VALUES (
        member_email,
        'eleve',
        owner_id,
        ARRAY[student_id]::UUID[]
    )
    RETURNING id INTO new_member_id;

    -- 3. Retourner les informations
    RETURN json_build_object(
        'id', new_member_id,
        'email', member_email,
        'role', 'eleve',
        'student_id', student_id
    );
END;
$$;

-- 2. RÈGLES RLS (ROW LEVEL SECURITY)
-- ============================================

-- Activer RLS sur toutes les tables
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE absence_justifications ENABLE ROW LEVEL SECURITY;

-- MEMBERS: Les admins voient leurs propres membres
DROP POLICY IF EXISTS "Admins voient leurs membres" ON members;
CREATE POLICY "Admins voient leurs membres"
ON members FOR SELECT
USING (owner_user_id = auth.uid());

-- MEMBERS: Les membres voient leur propre profil
DROP POLICY IF EXISTS "Membres voient leur profil" ON members;
CREATE POLICY "Membres voient leur profil"
ON members FOR SELECT
USING (auth_user_id = auth.uid());

-- MEMBERS: Les admins peuvent créer des membres
DROP POLICY IF EXISTS "Admins créent membres" ON members;
CREATE POLICY "Admins créent membres"
ON members FOR INSERT
WITH CHECK (owner_user_id = auth.uid());

-- MEMBERS: Les admins peuvent modifier leurs membres
DROP POLICY IF EXISTS "Admins modifient membres" ON members;
CREATE POLICY "Admins modifient membres"
ON members FOR UPDATE
USING (owner_user_id = auth.uid())
WITH CHECK (owner_user_id = auth.uid());

-- MEMBERS: Les admins peuvent supprimer leurs membres
DROP POLICY IF EXISTS "Admins suppriment membres" ON members;
CREATE POLICY "Admins suppriment membres"
ON members FOR DELETE
USING (owner_user_id = auth.uid());

-- STUDENTS: Isolation par administrateur
DROP POLICY IF EXISTS "Students isolation par admin" ON students;
CREATE POLICY "Students isolation par admin"
ON students FOR ALL
USING (
    user_id = (
        SELECT COALESCE(
            (SELECT owner_user_id FROM members WHERE auth_user_id = auth.uid()),
            auth.uid()
        )
    )
);

-- CLASSES: Isolation par administrateur
DROP POLICY IF EXISTS "Classes isolation par admin" ON classes;
CREATE POLICY "Classes isolation par admin"
ON classes FOR ALL
USING (
    user_id = (
        SELECT COALESCE(
            (SELECT owner_user_id FROM members WHERE auth_user_id = auth.uid()),
            auth.uid()
        )
    )
);

-- SUBJECTS: Isolation par administrateur
DROP POLICY IF EXISTS "Subjects isolation par admin" ON subjects;
CREATE POLICY "Subjects isolation par admin"
ON subjects FOR ALL
USING (
    user_id = (
        SELECT COALESCE(
            (SELECT owner_user_id FROM members WHERE auth_user_id = auth.uid()),
            auth.uid()
        )
    )
);

-- GRADES: Professeurs voient seulement leurs matières assignées
DROP POLICY IF EXISTS "Grades pour professeurs" ON grades;
CREATE POLICY "Grades pour professeurs"
ON grades FOR SELECT
USING (
    -- Les professeurs voient les notes de leurs matières assignées
    EXISTS (
        SELECT 1 FROM members m
        WHERE m.auth_user_id = auth.uid()
        AND m.role = 'proffesseur'
        AND grades.subject_id = ANY(m.assigned_subject_ids)
    )
    OR
    -- Les admins voient toutes leurs notes
    user_id = (
        SELECT COALESCE(
            (SELECT owner_user_id FROM members WHERE auth_user_id = auth.uid()),
            auth.uid()
        )
    )
    OR
    -- Les élèves voient leurs propres notes
    EXISTS (
        SELECT 1 FROM members m
        JOIN students s ON s.id = grades.student_id
        WHERE m.auth_user_id = auth.uid()
        AND m.role = 'eleve'
        AND s.id = ANY(m.assigned_student_ids)
    )
    OR
    -- Les parents voient les notes de leurs enfants
    EXISTS (
        SELECT 1 FROM members m
        WHERE m.auth_user_id = auth.uid()
        AND m.role = 'parent'
        AND grades.student_id = ANY(m.assigned_student_ids)
    )
);

-- GRADES: Professeurs peuvent créer/modifier des notes dans leurs matières
DROP POLICY IF EXISTS "Grades professeurs create update" ON grades;
CREATE POLICY "Grades professeurs create update"
ON grades FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM members m
        WHERE m.auth_user_id = auth.uid()
        AND m.role = 'proffesseur'
        AND grades.subject_id = ANY(m.assigned_subject_ids)
    )
    OR
    user_id = (
        SELECT COALESCE(
            (SELECT owner_user_id FROM members WHERE auth_user_id = auth.uid()),
            auth.uid()
        )
    )
);

-- ATTENDANCE: Professeurs voient seulement leurs classes
DROP POLICY IF EXISTS "Attendance pour professeurs" ON attendance;
CREATE POLICY "Attendance pour professeurs"
ON attendance FOR SELECT
USING (
    -- Les professeurs voient les présences de leurs classes assignées
    EXISTS (
        SELECT 1 FROM members m
        JOIN students s ON s.id = attendance.student_id
        WHERE m.auth_user_id = auth.uid()
        AND m.role = 'proffesseur'
        AND s.class_id = ANY(m.assigned_class_ids)
    )
    OR
    -- Les admins voient toutes leurs présences
    user_id = (
        SELECT COALESCE(
            (SELECT owner_user_id FROM members WHERE auth_user_id = auth.uid()),
            auth.uid()
        )
    )
    OR
    -- Les élèves voient leurs propres présences
    EXISTS (
        SELECT 1 FROM members m
        JOIN students s ON s.id = attendance.student_id
        WHERE m.auth_user_id = auth.uid()
        AND m.role = 'eleve'
        AND s.id = ANY(m.assigned_student_ids)
    )
    OR
    -- Les parents voient les présences de leurs enfants
    EXISTS (
        SELECT 1 FROM members m
        WHERE m.auth_user_id = auth.uid()
        AND m.role = 'parent'
        AND attendance.student_id = ANY(m.assigned_student_ids)
    )
);

-- ABSENCE_JUSTIFICATIONS: Même logique que attendance
DROP POLICY IF EXISTS "Justifications isolation" ON absence_justifications;
CREATE POLICY "Justifications isolation"
ON absence_justifications FOR ALL
USING (
    -- Les admins voient toutes leurs justifications
    user_id = (
        SELECT COALESCE(
            (SELECT owner_user_id FROM members WHERE auth_user_id = auth.uid()),
            auth.uid()
        )
    )
    OR
    -- Les professeurs voient les justifications de leurs classes
    EXISTS (
        SELECT 1 FROM members m
        JOIN students s ON s.id = absence_justifications.student_id
        WHERE m.auth_user_id = auth.uid()
        AND m.role = 'proffesseur'
        AND s.class_id = ANY(m.assigned_class_ids)
    )
    OR
    -- Les élèves voient leurs propres justifications
    EXISTS (
        SELECT 1 FROM members m
        WHERE m.auth_user_id = auth.uid()
        AND m.role = 'eleve'
        AND absence_justifications.student_id = ANY(m.assigned_student_ids)
    )
    OR
    -- Les parents voient les justifications de leurs enfants
    EXISTS (
        SELECT 1 FROM members m
        WHERE m.auth_user_id = auth.uid()
        AND m.role = 'parent'
        AND absence_justifications.student_id = ANY(m.assigned_student_ids)
    )
);

-- ============================================
-- FIN DU FICHIER SQL
-- ============================================
-- Après avoir exécuté ce fichier :
-- 1. Vérifiez que toutes les politiques sont créées
-- 2. Testez la connexion avec un compte membre
-- 3. Vérifiez que les données sont bien isolées
-- ============================================

