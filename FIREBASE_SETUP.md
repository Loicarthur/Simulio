# 🔥 Configuration Firebase pour Simulio

Ce guide vous explique comment configurer Firebase Authentication pour votre application Simulio.

## 📋 Prérequis

- Un compte Google
- Accès à la [Firebase Console](https://console.firebase.google.com/)

---

## 🚀 Étape 1 : Créer un projet Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Cliquez sur **"Ajouter un projet"**
3. Donnez un nom à votre projet (ex: "Simulio")
4. Acceptez les conditions
5. Désactivez Google Analytics (optionnel pour ce projet)
6. Cliquez sur **"Créer le projet"**

---

## 🌐 Étape 2 : Configurer l'application Web

1. Dans la page d'accueil de votre projet Firebase, cliquez sur l'icône **Web** (`</>`)
2. Donnez un nom à votre app (ex: "Simulio Web")
3. Ne cochez **pas** "Configurer Firebase Hosting"
4. Cliquez sur **"Enregistrer l'application"**

5. **Copiez la configuration Firebase** qui apparaît :

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "simulio-xxx.firebaseapp.com",
  projectId: "simulio-xxx",
  storageBucket: "simulio-xxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

---

## 🔐 Étape 3 : Activer l'authentification Email/Password

1. Dans le menu de gauche, cliquez sur **"Authentication"**
2. Cliquez sur **"Get started"** (Commencer)
3. Dans l'onglet **"Sign-in method"** (Méthode de connexion)
4. Cliquez sur **"Email/Password"**
5. **Activez** la première option ("Email/Password")
6. Cliquez sur **"Enregistrer"**

---

## 📱 Étape 4 : Configurer le Frontend

### 4.1 Mettre à jour le fichier de configuration Firebase

Ouvrez le fichier `frontend/src/services/firebase.js` et remplacez la configuration par la vôtre :

```javascript
// frontend/src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",  // ← Remplacez par votre apiKey
  authDomain: "VOTRE_PROJECT_ID.firebaseapp.com",  // ← Remplacez
  projectId: "VOTRE_PROJECT_ID",  // ← Remplacez
  storageBucket: "VOTRE_PROJECT_ID.appspot.com",  // ← Remplacez
  messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",  // ← Remplacez
  appId: "VOTRE_APP_ID"  // ← Remplacez
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
```

### 4.2 Installer les dépendances

```bash
cd frontend
npm install
```

---

## 🖥️ Étape 5 : Configurer le Backend

### 5.1 Télécharger la clé de service Firebase

1. Dans Firebase Console, cliquez sur l'icône **⚙️** (Paramètres) > **Paramètres du projet**
2. Allez dans l'onglet **"Comptes de service"**
3. Cliquez sur **"Générer une nouvelle clé privée"**
4. Un fichier JSON sera téléchargé (ex: `simulio-xxx-firebase-adminsdk-xxx.json`)

### 5.2 Placer la clé dans le projet

1. **Renommez** le fichier téléchargé en `firebase-service-account.json`
2. **Déplacez**-le dans le dossier `backend/` de votre projet

```
Simulio/
├── backend/
│   ├── firebase-service-account.json  ← Placez-le ici
│   ├── app/
│   └── requirements.txt
```

⚠️ **IMPORTANT** : Ce fichier contient des clés secrètes. **Ne le partagez jamais** et **ne le committez pas** sur Git !

### 5.3 Installer les dépendances Python

```bash
cd backend
pip install -r requirements.txt
```

---

## ✅ Étape 6 : Tester l'installation

### 6.1 Démarrer le Backend

```bash
cd backend
source venv/bin/activate  # ou venv\Scripts\activate sur Windows
uvicorn app.main:app --reload --port 8000
```

Vous devriez voir :
```
✅ Firebase Admin SDK initialisé avec succès
```

### 6.2 Démarrer le Frontend

```bash
cd frontend
npm start
```

### 6.3 Créer un compte de test

1. Allez sur `http://localhost:3000`
2. Cliquez sur **"Inscription"**
3. Remplissez le formulaire :
   - Nom : Test User
   - Email : test@example.com
   - Mot de passe : password123
4. Cliquez sur **"S'inscrire"**

Si tout fonctionne, vous serez redirigé vers le simulateur ! 🎉

---

## 🔍 Vérification dans Firebase Console

1. Retournez dans Firebase Console
2. Allez dans **"Authentication"** > **"Users"**
3. Vous devriez voir votre utilisateur de test !

---

## 🛡️ Sécurité

### Règles de sécurité recommandées

1. Dans Firebase Console, allez dans **"Authentication"** > **"Settings"**
2. Dans **"Authorized domains"**, ajoutez vos domaines autorisés :
   - `localhost` (déjà ajouté)
   - Votre domaine de production quand vous déploierez

### Gitignore

Assurez-vous que ces fichiers sont dans votre `.gitignore` :

```
# Firebase
backend/firebase-service-account.json
frontend/.env
frontend/.env.local
```

---

## 🎨 Fonctionnalités Firebase disponibles

Avec cette configuration, vous avez :

✅ **Inscription** avec email/password
✅ **Connexion** sécurisée
✅ **Déconnexion**
✅ **Gestion automatique de session**
✅ **Création automatique d'utilisateur** dans votre base de données
✅ **Protection des routes API** avec tokens Firebase

---

## 🐛 Dépannage

### Erreur : "Firebase Admin SDK not initialized"

- Vérifiez que le fichier `firebase-service-account.json` est bien dans `backend/`
- Vérifiez que le nom du fichier est exact

### Erreur : "Firebase: Error (auth/invalid-api-key)"

- Vérifiez que vous avez bien copié la configuration Firebase dans `frontend/src/services/firebase.js`
- Assurez-vous qu'il n'y a pas d'espaces en trop

### Erreur : "CORS policy"

- Vérifiez que le backend tourne sur le port 8000
- Vérifiez que le frontend tourne sur le port 3000

---

## 📚 Ressources

- [Documentation Firebase](https://firebase.google.com/docs)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)

---

## ✨ C'est tout !

Votre application Simulio est maintenant configurée avec Firebase Authentication ! 🎉

Si vous avez des questions, consultez la documentation Firebase ou créez une issue sur GitHub.
