from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    clients = relationship("Client", back_populates="user")
    simulations = relationship("Simulation", back_populates="user")

class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    email = Column(String(255))
    phone = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="clients")
    simulations = relationship("Simulation", back_populates="client")

class Simulation(Base):
    __tablename__ = "simulations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=True)

    # Paramètres d'entrée
    prix_bien = Column(Float, nullable=False)
    travaux = Column(Float, default=0)
    frais_agence = Column(Float, default=0)
    duree_pret = Column(Integer, nullable=False)
    apport = Column(Float, default=0)
    frais_notaire = Column(Float, nullable=False)
    taux_interet = Column(Float, nullable=False)
    taux_assurance = Column(Float, nullable=False)
    revalorisation_bien = Column(Float, default=0)
    date_acquisition = Column(String(50), nullable=False)

    # Résultats
    mensualite = Column(Float)
    interets_totaux = Column(Float)
    assurance_totale = Column(Float)
    frais_notaire_calcule = Column(Float)
    garantie_bancaire = Column(Float)
    frais_agence_calcule = Column(Float)
    total_financer = Column(Float)
    salaire_minimum = Column(Float)

    # Données détaillées (stockées en JSON)
    amortissement_data = Column(JSON)
    financement_data = Column(JSON)
    credit_data = Column(JSON)
    revente_data = Column(JSON)

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="simulations")
    client = relationship("Client", back_populates="simulations")
