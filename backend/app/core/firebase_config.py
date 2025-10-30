import firebase_admin
from firebase_admin import credentials, auth
import os

# Initialiser Firebase Admin SDK
# IMPORTANT: Vous devez télécharger votre fichier de clé de service depuis Firebase Console
# et le placer dans backend/firebase-service-account.json

def initialize_firebase():
    """Initialiser Firebase Admin SDK"""
    try:
        # Chemin vers le fichier de configuration Firebase
        cred_path = os.path.join(os.path.dirname(__file__), '..', '..', 'firebase-service-account.json')

        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
            print("✅ Firebase Admin SDK initialisé avec succès")
        else:
            print("⚠️ Fichier firebase-service-account.json non trouvé")
            print("   L'authentification Firebase ne sera pas disponible")
    except Exception as e:
        print(f"❌ Erreur lors de l'initialisation de Firebase: {e}")

def verify_firebase_token(token: str):
    """
    Vérifier un token Firebase
    Retourne les données de l'utilisateur si le token est valide
    """
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        print(f"Erreur de vérification du token Firebase: {e}")
        return None
