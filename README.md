# Simulio - Simulateur Immobilier 🔥

Application web complète de simulation de prêt immobilier avec **Firebase Authentication**, gestion des clients et des simulations.

## 📋 Table des matières

- [Technologies utilisées](#technologies-utilisées)
- [Fonctionnalités](#fonctionnalités)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration Firebase](#configuration-firebase)
- [Utilisation](#utilisation)
- [Architecture](#architecture)
- [Fonctionnalités BONUS](#fonctionnalités-bonus)

## 🛠️ Technologies utilisées

### Backend
- **Python 3.9+**
- **FastAPI** - Framework web moderne et rapide
- **SQLAlchemy** - ORM pour la gestion de la base de données
- **MySQL** - Base de données relationnelle
- **Firebase Admin SDK** - Vérification des tokens Firebase
- **Pandas & NumPy** - Calculs de simulation

### Frontend
- **React.js** - Bibliothèque JavaScript pour l'interface utilisateur
- **Create React App** - Configuration React standard
- **Firebase Authentication** - Authentification sécurisée
- **Tailwind CSS** - Framework CSS utilitaire
- **Axios** - Client HTTP pour les appels API
- **React Router** - Navigation côté client

## ✨ Fonctionnalités

### Fonctionnalités principales

1. **🔐 Authentification Firebase**
   - Inscription avec email et mot de passe
   - Connexion sécurisée
   - Gestion automatique de session
   - Protection des routes

2. **📊 Simulation immobilière**
   - Calcul de mensualité de prêt
   - Paramètres personnalisables (prix, travaux, taux, etc.)
   - Résultats détaillés en temps réel
   - Tableau d'amortissement
   - Projection de revente

3. **💾 Sauvegarde des simulations**
   - Enregistrement des simulations effectuées
   - Historique complet
   - Consultation des détails

### 🎁 Fonctionnalités BONUS (implémentées)

4. **👥 Gestion des clients**
   - Création de clients
   - Modification des informations
   - Suppression de clients
   - Liste de tous les clients

5. **🔗 Attribution des simulations aux clients**
   - Association d'une simulation à un client
   - Filtrage des simulations par client
   - Visualisation du client associé

6. **📱 Design responsive**
   - Interface adaptée pour desktop, tablette et mobile

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Python 3.9 ou supérieur**
- **Node.js 18 ou supérieur**
- **MySQL 8.0 ou supérieur**
- **npm**
- **Un compte Firebase** (gratuit)

## 🚀 Installation

### 1. Cloner le repository

\`\`\`bash
git clone <votre-repository-url>
cd Simulio
\`\`\`

### 2. Configuration de la base de données

#### Créer la base de données MySQL

\`\`\`bash
mysql -u root -p
\`\`\`

\`\`\`sql
CREATE DATABASE simulio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;
\`\`\`

#### Importer le script SQL

\`\`\`bash
mysql -u root -p simulio < dump.sql
\`\`\`

### 3. Installation du Backend

\`\`\`bash
cd backend

# Créer un environnement virtuel
python -m venv venv

# Activer l'environnement virtuel
# Sur Windows :
venv\Scripts\activate
# Sur macOS/Linux :
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Créer le fichier .env
cp .env.example .env
\`\`\`

#### Configuration du fichier \`.env\`

Ouvrez le fichier \`backend/.env\` et configurez vos paramètres :

\`\`\`env
DATABASE_URL=mysql+pymysql://root:votre_mot_de_passe@localhost:3306/simulio
SECRET_KEY=votre-cle-secrete-tres-longue-et-aleatoire
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
\`\`\`

### 4. Installation du Frontend

\`\`\`bash
cd frontend

# Installer les dépendances
npm install
\`\`\`

---

## 🔥 Configuration Firebase

### ⚠️ IMPORTANT : Cette étape est obligatoire

L'application utilise **Firebase Authentication** pour gérer les utilisateurs.

**👉 Suivez le guide complet de configuration :** [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

### Résumé rapide :

1. Créez un projet Firebase sur [console.firebase.google.com](https://console.firebase.google.com/)
2. Activez l'authentification Email/Password
3. Copiez la configuration dans \`frontend/src/services/firebase.js\`
4. Téléchargez la clé de service et placez-la dans \`backend/firebase-service-account.json\`

📖 **Guide détaillé avec captures d'écran :** [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

---

## 🎯 Utilisation

### Démarrer le Backend

\`\`\`bash
cd backend

# Activer l'environnement virtuel si ce n'est pas déjà fait
source venv/bin/activate  # macOS/Linux
# ou
venv\Scripts\activate  # Windows

# Lancer le serveur
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
\`\`\`

Le backend sera accessible sur : \`http://localhost:8000\`

Documentation API interactive : \`http://localhost:8000/docs\`

### Démarrer le Frontend

Dans un nouveau terminal :

\`\`\`bash
cd frontend

# Lancer le serveur de développement
npm start
\`\`\`

Le frontend sera accessible sur : \`http://localhost:3000\`

## 📱 Utilisation de l'application

1. **Inscription / Connexion**
   - Créez un compte avec Firebase Authentication
   - Vos données sont sécurisées

2. **Créer des clients (BONUS)**
   - Allez dans "Mes Clients"
   - Ajoutez les informations de vos clients

3. **Effectuer une simulation**
   - Allez dans "Simulateur"
   - Ajustez les paramètres avec les sliders ou les inputs
   - Les résultats se mettent à jour automatiquement
   - Optionnel : Sélectionnez un client à associer
   - Cliquez sur "ENREGISTRER LA SIMULATION"

4. **Consulter l'historique**
   - Allez dans "Mes Simulations"
   - Consultez toutes vos simulations enregistrées
   - Visualisez les détails

## 🏗️ Architecture

\`\`\`
Simulio/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/
│   │   │       ├── auth.py
│   │   │       ├── clients.py
│   │   │       └── simulations.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── security.py
│   │   │   └── firebase_config.py     # 🔥 Config Firebase
│   │   ├── db/
│   │   │   ├── database.py
│   │   │   └── models.py
│   │   ├── services/
│   │   │   └── simulator.py
│   │   └── main.py
│   ├── firebase-service-account.json  # 🔥 Clé Firebase (à créer)
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Simulator.js
│   │   │   ├── Clients.js
│   │   │   └── Simulations.js
│   │   ├── services/
│   │   │   ├── firebase.js           # 🔥 Config Firebase
│   │   │   ├── api.js
│   │   │   └── authContext.js        # 🔥 Gestion auth Firebase
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── .env.example
├── dump.sql
├── FIREBASE_SETUP.md                  # 🔥 Guide Firebase
└── README.md
\`\`\`

## 📊 Fonctionnalités BONUS

✅ **Toutes les fonctionnalités bonus ont été implémentées :**

1. **Gestion des clients**
   - CRUD complet (Create, Read, Update, Delete)
   - Interface intuitive avec modales
   - Validation des données

2. **Attribution des simulations aux clients**
   - Sélection du client lors de la sauvegarde
   - Affichage du client dans l'historique
   - Filtrage des simulations par client

3. **Design responsive**
   - Mobile first approach
   - Breakpoints pour tablettes et desktop
   - Interface fluide sur tous les appareils

## 🔒 Sécurité

- **Firebase Authentication** pour une sécurité maximale
- Tokens Firebase vérifiés côté backend
- Création automatique d'utilisateur dans la base de données
- Protection CORS configurée
- Routes API protégées

## 🐛 Dépannage

### Erreur de connexion Firebase

Consultez le guide : [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

### Erreur de connexion à la base de données

Vérifiez que :
- MySQL est bien démarré
- Les identifiants dans \`.env\` sont corrects
- La base de données \`simulio\` existe

### Le frontend ne se connecte pas au backend

Vérifiez que :
- Le backend tourne sur le port 8000
- Le frontend tourne sur le port 3000
- Firebase est bien configuré

## 📝 Notes

- Cette application utilise **Firebase Authentication** pour la gestion des utilisateurs
- Le backend vérifie les tokens Firebase et crée automatiquement les utilisateurs
- Le design s'inspire de l'interface fournie dans \`image_test/image.jpeg\`
- La fonction de calcul provient du fichier \`image_test/test.py\`

## 👨‍💻 Auteur

Projet développé pour le test technique Simulio avec intégration Firebase

---

**Merci d'avoir consulté ce projet !** 🚀🔥
