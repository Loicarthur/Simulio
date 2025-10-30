from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import auth, clients, simulations
from app.db.database import init_db

app = FastAPI(
    title="Simulio API",
    description="API de simulation immobilière",
    version="1.0.0"
)

# Configuration CORS pour permettre les requêtes depuis le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclure les routes
app.include_router(auth.router, prefix="/api")
app.include_router(clients.router, prefix="/api")
app.include_router(simulations.router, prefix="/api")

@app.on_event("startup")
def on_startup():
    """Initialiser la base de données au démarrage"""
    init_db()

@app.get("/")
def root():
    return {"message": "Bienvenue sur l'API Simulio"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
