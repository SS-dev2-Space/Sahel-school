# 📘 Guide d'Implémentation Complète - Applications Séparées

## 🎯 Vue d'ensemble

Ce guide vous explique comment créer les 3 applications séparées (Professeur, Parent, Élève) qui partagent la même base de données Supabase.

---

## 📋 ÉTAPE 1 : Créer les Dossiers

**Sur votre Bureau, créez manuellement ces 3 dossiers :**

1. `Sahel-school-professeur`
2. `Sahel-school-parent`
3. `Sahel-school-eleve`

**Action :** Créez-les maintenant avec l'explorateur Windows.

---

## 📋 ÉTAPE 2 : Configurer Supabase

### A. Exécuter le fichier SQL

1. Ouvrez votre dashboard Supabase
2. Allez dans **SQL Editor**
3. Ouvrez le fichier `SQL_RLS_ET_FONCTIONS.sql` que j'ai créé
4. Copiez tout le contenu
5. Collez dans l'éditeur SQL de Supabase
6. Cliquez sur **Run** pour exécuter

**✅ Vérification :** Vérifiez que toutes les politiques RLS sont créées dans l'onglet **Authentication > Policies**

---

## 📋 ÉTAPE 3 : Créer les Fichiers pour l'Application PROFESSEUR

### Fichiers à créer dans `Sahel-school-professeur/` :

1. ✅ `index.html` - DÉJÀ CRÉÉ
2. ⏳ `styles.css` - À COPIER depuis `Sahel-school/styles.css`
3. ⏳ `app.js` - À CRÉER (voir ci-dessous)

### Instructions pour `styles.css` :

**Action :** Copiez manuellement le fichier `Sahel-school/styles.css` vers `Sahel-school-professeur/styles.css`

### Instructions pour `app.js` :

Le fichier `app.js` pour l'application Professeur doit :

1. **Vérifier le rôle lors de la connexion** - Rediriger si ce n'est pas un professeur
2. **Charger seulement les classes/matières assignées**
3. **Permettre d'ajouter/modifier des notes**
4. **Afficher l'historique de présence**

**Le fichier complet sera créé dans la prochaine étape.**

---

## 📋 ÉTAPE 4 : Créer les Fichiers pour l'Application PARENT

### Fichiers à créer dans `Sahel-school-parent/` :

1. ⏳ `index.html` - À CRÉER
2. ⏳ `styles.css` - À COPIER depuis `Sahel-school/styles.css`
3. ⏳ `app.js` - À CRÉER

---

## 📋 ÉTAPE 5 : Créer les Fichiers pour l'Application ÉLÈVE

### Fichiers à créer dans `Sahel-school-eleve/` :

1. ⏳ `index.html` - À CRÉER
2. ⏳ `styles.css` - À COPIER depuis `Sahel-school/styles.css`
3. ⏳ `app.js` - À CRÉER

---

## 🔐 RÈGLES DE SÉCURITÉ IMPORTANTES

### 1. Vérification du Rôle lors de la Connexion

**Dans chaque application, vous DEVEZ vérifier le rôle :**

```javascript
// Exemple pour l'application Professeur
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) throw error;
        
        // VÉRIFIER LE RÔLE
        const { data: member } = await supabase
            .from('members')
            .select('*')
            .eq('auth_user_id', data.user.id)
            .maybeSingle();
        
        if (!member) {
            throw new Error('Compte non trouvé. Contactez l\'administrateur.');
        }
        
        // REDIRIGER SI CE N'EST PAS LE BON RÔLE
        if (member.role !== 'proffesseur') {
            await supabase.auth.signOut();
            throw new Error('Ce compte n\'est pas autorisé à accéder à l\'application Professeur.');
        }
        
        // Continuer avec la session...
    } catch (error) {
        // Afficher l'erreur
    }
}
```

### 2. Isolation des Données

Les RLS (Row Level Security) que nous avons créées garantissent que :
- Chaque administrateur ne voit que ses propres données
- Les professeurs ne voient que leurs classes/matières assignées
- Les parents ne voient que leurs enfants assignés
- Les élèves ne voient que leurs propres données

---

## 📱 FONCTIONNALITÉS PAR APPLICATION

### Application PROFESSEUR

**Pages disponibles :**
- ✅ Dashboard (vue d'ensemble)
- ✅ Classes (liste des classes assignées)
- ✅ Matières (liste des matières assignées)
- ✅ Notes (ajouter/modifier des notes)
- ✅ Présence (voir les présences des élèves)
- ✅ Historique (historique complet)

**Actions possibles :**
- ✅ Ajouter une note dans une matière assignée
- ✅ Modifier une note qu'il a créée
- ✅ Voir l'historique de présence des élèves de ses classes
- ❌ Ne peut PAS créer/modifier des matières
- ❌ Ne peut PAS créer/modifier des élèves
- ❌ Ne peut PAS créer/modifier des classes

### Application PARENT

**Pages disponibles :**
- ✅ Dashboard (vue d'ensemble de l'enfant)
- ✅ Notes (notes de l'enfant)
- ✅ Présence (présence de l'enfant)
- ✅ Historique (historique de l'enfant)
- ✅ Messages (carnet de liaison)

**Actions possibles :**
- ✅ Voir toutes les informations de son enfant
- ✅ Voir les notes de son enfant
- ✅ Voir les présences de son enfant
- ✅ Envoyer des messages à l'administration
- ❌ Ne peut PAS modifier quoi que ce soit

### Application ÉLÈVE

**Pages disponibles :**
- ✅ Dashboard (vue d'ensemble)
- ✅ Notes (mes notes)
- ✅ Présence (mes présences)
- ✅ Profil (mes informations)

**Actions possibles :**
- ✅ Voir ses propres notes
- ✅ Voir ses propres présences
- ✅ Voir ses informations personnelles
- ❌ Ne peut PAS modifier quoi que ce soit

---

## 🚀 PROCHAINES ÉTAPES

1. **Créez les 3 dossiers** sur votre Bureau
2. **Exécutez le fichier SQL** dans Supabase
3. **Copiez les fichiers CSS** dans chaque dossier
4. **Je vais créer les fichiers JavaScript** pour chaque application dans les prochaines étapes

---

## ⚠️ NOTES IMPORTANTES

- ✅ Toutes les applications partagent la même base de données
- ✅ Les RLS garantissent l'isolation des données
- ✅ Chaque application vérifie le rôle lors de la connexion
- ✅ Les professeurs peuvent aussi utiliser le site web admin s'ils le souhaitent
- ✅ Les parents et élèves ne peuvent PAS utiliser le site web admin

---

## 📞 SUPPORT

Si vous avez des questions ou des problèmes :
1. Vérifiez que les RLS sont bien configurées dans Supabase
2. Vérifiez que le rôle du membre correspond à l'application
3. Vérifiez les assignations (classes/matières/élèves) dans la table `members`

---

**Prochaine étape :** Je vais créer les fichiers JavaScript complets pour chaque application.

