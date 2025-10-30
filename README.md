# Simulio - Simulateur Immobilier

Application web complète de simulation de prêt immobilier avec gestion des clients et des simulations.

## 📋 Table des matières

- [Technologies utilisées](#technologies-utilisées)
- [Fonctionnalités](#fonctionnalités)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Architecture](#architecture)
- [Fonctionnalités BONUS](#fonctionnalités-bonus)
- [API Documentation](#api-documentation)

## 🛠️ Technologies utilisées

### Backend
- **Python 3.9+**
- **FastAPI** - Framework web moderne et rapide
- **SQLAlchemy** - ORM pour la gestion de la base de données
- **MySQL** - Base de données relationnelle
- **JWT** - Authentification par token
- **Pandas & NumPy** - Calculs de simulation
- **Bcrypt** - Hachage des mots de passe

### Frontend
- **React.js** - Bibliothèque JavaScript pour l'interface utilisateur
- **Vite** - Build tool rapide
- **Tailwind CSS** - Framework CSS utilitaire
- **Axios** - Client HTTP pour les appels API
- **React Router** - Navigation côté client

## ✨ Fonctionnalités

### Fonctionnalités principales

1. **Authentification utilisateur**
   - Inscription avec email et mot de passe
   - Connexion sécurisée avec JWT
   - Protection des routes (seuls les utilisateurs authentifiés peuvent accéder aux simulations)

2. **Simulation immobilière**
   - Calcul de mensualité de prêt
   - Paramètres personnalisables :
     - Prix du bien
     - Travaux
     - Frais d'agence
     - Durée du prêt
     - Apport personnel
     - Frais de notaire
     - Taux d'intérêt
     - Taux d'assurance
     - Revalorisation du bien
     - Date d'acquisition
   - Résultats détaillés :
     - Mensualité
     - Total à financer
     - Garantie bancaire
     - Revenu minimum requis
     - Tableau d'amortissement
     - Projection de revente

3. **Sauvegarde des simulations**
   - Enregistrement des simulations effectuées
   - Historique complet
   - Consultation des détails

### 🎁 Fonctionnalités BONUS (implémentées)

4. **Gestion des clients**
   - Création de clients
   - Modification des informations
   - Suppression de clients
   - Liste de tous les clients

5. **Attribution des simulations aux clients**
   - Association d'une simulation à un client
   - Filtrage des simulations par client
   - Visualisation du client associé

6. **Design responsive**
   - Interface adaptée pour desktop
   - Interface adaptée pour tablette
   - Interface adaptée pour mobile

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Python 3.9 ou supérieur**
- **Node.js 18 ou supérieur**
- **MySQL 8.0 ou supérieur**
- **npm** ou **yarn**

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone <votre-repository-url>
cd Simulio
```

### 2. Configuration de la base de données

#### Créer la base de données MySQL

```bash
mysql -u root -p
```

```sql
CREATE DATABASE simulio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;
```

#### Importer le script SQL

```bash
mysql -u root -p simulio < dump.sql
```

> Note: Le script `dump.sql` crée les tables et insère un utilisateur de test :
> - Email: `test@simulio.com`
> - Mot de passe: `password`

### 3. Installation du Backend

```bash
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
```

#### Configuration du fichier `.env`

Ouvrez le fichier `backend/.env` et configurez vos paramètres :

```env
DATABASE_URL=mysql+pymysql://root:votre_mot_de_passe@localhost:3306/simulio
SECRET_KEY=votre-cle-secrete-tres-longue-et-aleatoire
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

> ⚠️ **Important** : Changez la `SECRET_KEY` pour quelque chose de sécurisé en production !

### 4. Installation du Frontend

```bash
cd frontend

# Installer les dépendances
npm install
```

## 🎯 Utilisation

### Démarrer le Backend

```bash
cd backend

# Activer l'environnement virtuel si ce n'est pas déjà fait
source venv/bin/activate  # macOS/Linux
# ou
venv\Scripts\activate  # Windows

# Lancer le serveur
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Le backend sera accessible sur : `http://localhost:8000`

Documentation API interactive : `http://localhost:8000/docs`

### Démarrer le Frontend

Dans un nouveau terminal :

```bash
cd frontend

# Lancer le serveur de développement
npm run dev
```

Le frontend sera accessible sur : `http://localhost:3000`

## 📱 Utilisation de l'application

1. **Inscription / Connexion**
   - Créez un compte ou utilisez le compte de test
   - Email: `test@simulio.com`
   - Mot de passe: `password`

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
   - Filtrez par client
   - Visualisez les détails

## 🏗️ Architecture

```
Simulio/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/
│   │   │       ├── auth.py          # Routes d'authentification
│   │   │       ├── clients.py       # Routes de gestion des clients
│   │   │       └── simulations.py   # Routes de simulation
│   │   ├── core/
│   │   │   ├── config.py           # Configuration de l'app
│   │   │   └── security.py         # Gestion JWT et hachage
│   │   ├── db/
│   │   │   ├── database.py         # Configuration SQLAlchemy
│   │   │   └── models.py           # Modèles de données
│   │   ├── services/
│   │   │   └── simulator.py       # Fonction de calcul de simulation
│   │   └── main.py                 # Point d'entrée FastAPI
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx           # Page de connexion
│   │   │   ├── Simulator.jsx       # Page du simulateur
│   │   │   ├── Clients.jsx         # Gestion des clients
│   │   │   └── Simulations.jsx     # Historique des simulations
│   │   ├── services/
│   │   │   ├── api.js              # Configuration Axios
│   │   │   └── authContext.jsx     # Contexte d'authentification
│   │   ├── App.jsx                 # Composant principal
│   │   ├── main.jsx                # Point d'entrée React
│   │   └── index.css               # Styles globaux
│   ├── package.json
│   └── vite.config.js
├── dump.sql                        # Script SQL d'import
└── README.md                       # Ce fichier
```

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

## 📚 API Documentation

### Endpoints d'authentification

#### POST `/api/auth/register`
Inscription d'un nouvel utilisateur

```json
{
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "password": "motdepasse"
}
```

#### POST `/api/auth/login`
Connexion d'un utilisateur

```json
{
  "email": "jean@example.com",
  "password": "motdepasse"
}
```

### Endpoints clients (authentification requise)

#### GET `/api/clients/`
Récupérer tous les clients de l'utilisateur

#### POST `/api/clients/`
Créer un nouveau client

```json
{
  "name": "Marie Martin",
  "email": "marie@example.com",
  "phone": "0612345678"
}
```

#### PUT `/api/clients/{client_id}`
Modifier un client

#### DELETE `/api/clients/{client_id}`
Supprimer un client

### Endpoints simulations (authentification requise)

#### POST `/api/simulations/calculate`
Calculer une simulation sans la sauvegarder

```json
{
  "prix_bien": 200000,
  "travaux": 10000,
  "frais_agence": 3,
  "duree_pret": 25,
  "apport": 50000,
  "frais_notaire": 7.5,
  "taux_interet": 3.5,
  "taux_assurance": 0.32,
  "revalorisation_bien": 1,
  "date_acquisition": "07/2025"
}
```

#### POST `/api/simulations/`
Créer et sauvegarder une simulation

#### GET `/api/simulations/`
Récupérer toutes les simulations

#### GET `/api/simulations/{simulation_id}`
Récupérer une simulation spécifique

#### DELETE `/api/simulations/{simulation_id}`
Supprimer une simulation

## 🔒 Sécurité

- Mots de passe hachés avec bcrypt
- Authentification JWT avec expiration
- Protection CORS configurée
- Validation des données côté serveur
- Routes protégées par authentification

## 🐛 Dépannage

### Erreur de connexion à la base de données

Vérifiez que :
- MySQL est bien démarré
- Les identifiants dans `.env` sont corrects
- La base de données `simulio` existe

### Le frontend ne se connecte pas au backend

Vérifiez que :
- Le backend tourne sur le port 8000
- Le frontend tourne sur le port 3000
- Les CORS sont bien configurés

### Erreur lors de l'installation des dépendances Python

Assurez-vous d'avoir Python 3.9+ :
```bash
python --version
```

## 📝 Notes

- Cette application a été développée dans le cadre d'un test technique
- Le design s'inspire de l'interface fournie dans `image_test/image.jpeg`
- La fonction de calcul provient du fichier `image_test/test.py`
- L'application est prête pour la production après quelques ajustements de sécurité

## 👨‍💻 Auteur

Projet développé pour le test technique Simulio

---

**Merci d'avoir consulté ce projet !** 🚀
