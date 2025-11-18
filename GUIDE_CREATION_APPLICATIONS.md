# 📚 Guide Complet : Création des 3 Applications Séparées

## 🎯 Objectif
Créer 3 applications distinctes (Professeur, Parent, Élève) qui partagent la même base de données Supabase mais avec des interfaces et permissions différentes.

---

## 📁 ÉTAPE 1 : Créer la Structure des Dossiers

### Sur votre Bureau, créez les dossiers suivants :

```
C:\Users\WEVVXG\Desktop\
├── Sahel-school\              (Application Admin - EXISTANTE)
│   ├── index.html
│   ├── app.js
│   └── styles.css
│
├── Sahel-school-professeur\   (NOUVELLE Application Professeur)
│   ├── index.html
│   ├── app.js
│   └── styles.css
│
├── Sahel-school-parent\       (NOUVELLE Application Parent)
│   ├── index.html
│   ├── app.js
│   └── styles.css
│
└── Sahel-school-eleve\        (NOUVELLE Application Élève)
    ├── index.html
    ├── app.js
    └── styles.css
```

**Action à faire maintenant :**
1. Créez les 3 dossiers sur votre Bureau
2. Nommez-les exactement comme indiqué ci-dessus

---

## 🔐 ÉTAPE 2 : Configuration Supabase - RLS et Fonctions SQL

### A. Créer la fonction pour créer un membre ÉLÈVE

Dans votre dashboard Supabase, allez dans **SQL Editor** et exécutez :

```sql
-- Fonction pour créer un membre ÉLÈVE
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
    -- 1. Créer l'utilisateur dans auth.users
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        confirmation_token,
        recovery_token,
        email_change_token_new,
        email_change
    )
    VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        member_email,
        crypt(member_password, gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"provider":"email","providers":["email"]}',
        '{}',
        false,
        '',
        '',
        '',
        ''
    )
    RETURNING id INTO new_auth_user_id;

    -- 2. Créer l'entrée dans la table members
    INSERT INTO members (
        email,
        role,
        owner_user_id,
        auth_user_id,
        assigned_student_ids
    )
    VALUES (
        member_email,
        'eleve',
        owner_id,
        new_auth_user_id,
        ARRAY[student_id]::UUID[]
    )
    RETURNING id INTO new_member_id;

    -- 3. Retourner les informations
    RETURN json_build_object(
        'id', new_member_id,
        'email', member_email,
        'role', 'eleve',
        'auth_user_id', new_auth_user_id
    );
END;
$$;
```

### B. Mettre à jour les règles RLS (Row Level Security)

```sql
-- RLS pour la table members
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Les administrateurs voient leurs propres membres
CREATE POLICY "Admins voient leurs membres"
ON members FOR SELECT
USING (owner_user_id = auth.uid());

-- Les membres voient leur propre profil
CREATE POLICY "Membres voient leur profil"
ON members FOR SELECT
USING (auth_user_id = auth.uid());

-- RLS pour students - Isolation par administrateur
CREATE POLICY "Students isolation par admin"
ON students FOR ALL
USING (user_id = (
    SELECT COALESCE(
        (SELECT owner_user_id FROM members WHERE auth_user_id = auth.uid()),
        auth.uid()
    )
));

-- RLS pour classes - Isolation par administrateur
CREATE POLICY "Classes isolation par admin"
ON classes FOR ALL
USING (user_id = (
    SELECT COALESCE(
        (SELECT owner_user_id FROM members WHERE auth_user_id = auth.uid()),
        auth.uid()
    )
));

-- RLS pour subjects - Isolation par administrateur
CREATE POLICY "Subjects isolation par admin"
ON subjects FOR ALL
USING (user_id = (
    SELECT COALESCE(
        (SELECT owner_user_id FROM members WHERE auth_user_id = auth.uid()),
        auth.uid()
    )
));

-- RLS pour grades - Professeurs voient seulement leurs matières assignées
CREATE POLICY "Grades pour professeurs"
ON grades FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM members m
        WHERE m.auth_user_id = auth.uid()
        AND m.role = 'proffesseur'
        AND subject_id = ANY(m.assigned_subject_ids)
    )
    OR
    -- Les admins voient toutes leurs notes
    user_id = (
        SELECT COALESCE(
            (SELECT owner_user_id FROM members WHERE auth_user_id = auth.uid()),
            auth.uid()
        )
    )
);

-- RLS pour attendance - Professeurs voient seulement leurs classes
CREATE POLICY "Attendance pour professeurs"
ON attendance FOR SELECT
USING (
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
);
```

---

## 📱 ÉTAPE 3 : Créer l'Application PROFESSEUR

### Fichier : `Sahel-school-professeur/index.html`

[Le contenu sera créé dans le prochain fichier]

### Fonctionnalités de l'application Professeur :
- ✅ Connexion avec email/mot de passe créé par l'admin
- ✅ Voir les classes assignées
- ✅ Voir les matières assignées
- ✅ Ajouter des notes dans les matières assignées
- ✅ Modifier les notes qu'il a créées
- ✅ Voir l'historique de présence des élèves de ses classes
- ✅ Interface mobile-friendly

---

## 👨‍👩‍👧 ÉTAPE 4 : Créer l'Application PARENT

### Fichier : `Sahel-school-parent/index.html`

[Le contenu sera créé dans le prochain fichier]

### Fonctionnalités de l'application Parent :
- ✅ Connexion avec email/mot de passe créé par l'admin
- ✅ Voir l'historique de présence de son enfant
- ✅ Voir les notes de son enfant
- ✅ Voir les informations de l'élève
- ✅ Communiquer avec l'administration via carnet de liaison
- ✅ Interface mobile-friendly

---

## 🎓 ÉTAPE 5 : Créer l'Application ÉLÈVE

### Fichier : `Sahel-school-eleve/index.html`

[Le contenu sera créé dans le prochain fichier]

### Fonctionnalités de l'application Élève :
- ✅ Connexion avec email/mot de passe créé par l'admin
- ✅ Voir ses propres notes
- ✅ Voir ses propres présences
- ✅ Voir ses informations personnelles
- ✅ Interface mobile-friendly et simple

---

## 🔒 ÉTAPE 6 : Sécurité et Isolation des Données

### Règles importantes :

1. **Isolation par administrateur** :
   - Chaque admin ne voit que ses propres données
   - Les membres d'un admin ne voient que les données de leur admin

2. **Isolation par rôle** :
   - Professeur : Voit seulement ses classes/matières assignées
   - Parent : Voit seulement son enfant assigné
   - Élève : Voit seulement ses propres données

3. **Pas d'inscription** :
   - Seuls les admins peuvent créer des comptes
   - Les membres se connectent uniquement avec les identifiants fournis

---

## 🚀 ÉTAPE 7 : Déploiement

### Pour chaque application :

1. **Testez localement** :
   - Ouvrez `index.html` dans un navigateur
   - Testez la connexion
   - Vérifiez les fonctionnalités

2. **Déployez** (optionnel) :
   - Utilisez Netlify, Vercel, ou GitHub Pages
   - Configurez les variables d'environnement Supabase

---

## 📝 Notes Importantes

- ✅ Toutes les applications partagent la même base de données Supabase
- ✅ Les RLS garantissent l'isolation des données
- ✅ L'application Admin reste un site web
- ✅ Les 3 nouvelles applications sont des applications mobiles/web
- ✅ Les professeurs peuvent aussi utiliser le site web admin s'ils le souhaitent

---

## ✅ Checklist de Vérification

- [ ] Dossiers créés
- [ ] Fonctions SQL exécutées dans Supabase
- [ ] RLS configurées
- [ ] Application Professeur créée et testée
- [ ] Application Parent créée et testée
- [ ] Application Élève créée et testée
- [ ] Isolation des données vérifiée
- [ ] Connexions testées pour chaque rôle

---

**Prochaine étape :** Je vais maintenant créer les fichiers HTML, CSS et JS pour chaque application.

