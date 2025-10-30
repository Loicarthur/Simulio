from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from app.db.database import get_db
from app.db.models import Simulation, User, Client
from app.core.security import get_current_user
from app.services.simulator import calculer_simulation

router = APIRouter(prefix="/simulations", tags=["simulations"])

class SimulationInput(BaseModel):
    prix_bien: float
    travaux: float = 0
    frais_agence: float = 0
    duree_pret: int
    apport: float = 0
    frais_notaire: float
    taux_interet: float
    taux_assurance: float
    revalorisation_bien: float = 0
    date_acquisition: str  # Format: "MM/YYYY"
    client_id: Optional[int] = None

class SimulationResponse(BaseModel):
    id: int
    mensualite: float
    interets_totaux: float
    assurance_totale: float
    frais_notaire: float
    garantie_bancaire: float
    frais_agence: float
    total_financer: float
    salaire_minimum: float
    prix_bien: float
    travaux: float
    duree_pret: int
    apport: float
    taux_interet: float
    taux_assurance: float
    revalorisation_bien: float
    date_acquisition: str
    client_id: Optional[int]
    client_name: Optional[str]
    created_at: str
    amortissement_data: List[Dict[str, Any]]
    financement_data: Dict[str, Any]
    credit_data: Dict[str, Any]
    revente_data: Dict[str, Any]

    class Config:
        from_attributes = True

@router.post("/calculate")
def calculate_simulation(
    input_data: SimulationInput,
    current_user: User = Depends(get_current_user)
):
    """Calculer une simulation sans la sauvegarder"""
    try:
        # Extraire le mois et l'année
        mois, annee = input_data.date_acquisition.split("/")

        # Calculer la simulation
        result = calculer_simulation(
            N=input_data.duree_pret,
            C2=input_data.prix_bien,
            T=input_data.taux_interet,
            ASSU=input_data.taux_assurance,
            apport=input_data.apport,
            mois=mois,
            annee=annee,
            frais_agence=input_data.frais_agence,
            frais_notaire=input_data.frais_notaire,
            TRAVAUX=input_data.travaux,
            revalorisation_bien=input_data.revalorisation_bien
        )

        return result

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error calculating simulation: {str(e)}"
        )

@router.post("/", response_model=SimulationResponse)
def create_simulation(
    input_data: SimulationInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Créer et sauvegarder une simulation"""
    try:
        # Vérifier si le client existe (si spécifié)
        client_name = None
        if input_data.client_id:
            client = db.query(Client).filter(
                Client.id == input_data.client_id,
                Client.user_id == current_user.id
            ).first()
            if not client:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Client not found"
                )
            client_name = client.name

        # Extraire le mois et l'année
        mois, annee = input_data.date_acquisition.split("/")

        # Calculer la simulation
        result = calculer_simulation(
            N=input_data.duree_pret,
            C2=input_data.prix_bien,
            T=input_data.taux_interet,
            ASSU=input_data.taux_assurance,
            apport=input_data.apport,
            mois=mois,
            annee=annee,
            frais_agence=input_data.frais_agence,
            frais_notaire=input_data.frais_notaire,
            TRAVAUX=input_data.travaux,
            revalorisation_bien=input_data.revalorisation_bien
        )

        # Sauvegarder la simulation
        new_simulation = Simulation(
            user_id=current_user.id,
            client_id=input_data.client_id,
            prix_bien=input_data.prix_bien,
            travaux=input_data.travaux,
            frais_agence=input_data.frais_agence,
            duree_pret=input_data.duree_pret,
            apport=input_data.apport,
            frais_notaire=input_data.frais_notaire,
            taux_interet=input_data.taux_interet,
            taux_assurance=input_data.taux_assurance,
            revalorisation_bien=input_data.revalorisation_bien,
            date_acquisition=input_data.date_acquisition,
            mensualite=result["mensualite"],
            interets_totaux=result["interets_totaux"],
            assurance_totale=result["assurance_totale"],
            frais_notaire_calcule=result["frais_notaire"],
            garantie_bancaire=result["garantie_bancaire"],
            frais_agence_calcule=result["frais_agence"],
            total_financer=result["total_financer"],
            salaire_minimum=result["salaire_minimum"],
            amortissement_data=result["amortissement_data"],
            financement_data=result["financement_data"],
            credit_data=result["credit_data"],
            revente_data=result["revente_data"]
        )

        db.add(new_simulation)
        db.commit()
        db.refresh(new_simulation)

        return SimulationResponse(
            id=new_simulation.id,
            mensualite=new_simulation.mensualite,
            interets_totaux=new_simulation.interets_totaux,
            assurance_totale=new_simulation.assurance_totale,
            frais_notaire=new_simulation.frais_notaire_calcule,
            garantie_bancaire=new_simulation.garantie_bancaire,
            frais_agence=new_simulation.frais_agence_calcule,
            total_financer=new_simulation.total_financer,
            salaire_minimum=new_simulation.salaire_minimum,
            prix_bien=new_simulation.prix_bien,
            travaux=new_simulation.travaux,
            duree_pret=new_simulation.duree_pret,
            apport=new_simulation.apport,
            taux_interet=new_simulation.taux_interet,
            taux_assurance=new_simulation.taux_assurance,
            revalorisation_bien=new_simulation.revalorisation_bien,
            date_acquisition=new_simulation.date_acquisition,
            client_id=new_simulation.client_id,
            client_name=client_name,
            created_at=new_simulation.created_at.isoformat(),
            amortissement_data=new_simulation.amortissement_data,
            financement_data=new_simulation.financement_data,
            credit_data=new_simulation.credit_data,
            revente_data=new_simulation.revente_data
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error creating simulation: {str(e)}"
        )

@router.get("/", response_model=List[SimulationResponse])
def get_simulations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    client_id: Optional[int] = None
):
    """Récupérer toutes les simulations de l'utilisateur connecté"""
    query = db.query(Simulation).filter(Simulation.user_id == current_user.id)

    if client_id:
        query = query.filter(Simulation.client_id == client_id)

    simulations = query.order_by(Simulation.created_at.desc()).all()

    result = []
    for sim in simulations:
        client_name = None
        if sim.client_id:
            client = db.query(Client).filter(Client.id == sim.client_id).first()
            if client:
                client_name = client.name

        result.append(SimulationResponse(
            id=sim.id,
            mensualite=sim.mensualite,
            interets_totaux=sim.interets_totaux,
            assurance_totale=sim.assurance_totale,
            frais_notaire=sim.frais_notaire_calcule,
            garantie_bancaire=sim.garantie_bancaire,
            frais_agence=sim.frais_agence_calcule,
            total_financer=sim.total_financer,
            salaire_minimum=sim.salaire_minimum,
            prix_bien=sim.prix_bien,
            travaux=sim.travaux,
            duree_pret=sim.duree_pret,
            apport=sim.apport,
            taux_interet=sim.taux_interet,
            taux_assurance=sim.taux_assurance,
            revalorisation_bien=sim.revalorisation_bien,
            date_acquisition=sim.date_acquisition,
            client_id=sim.client_id,
            client_name=client_name,
            created_at=sim.created_at.isoformat(),
            amortissement_data=sim.amortissement_data,
            financement_data=sim.financement_data,
            credit_data=sim.credit_data,
            revente_data=sim.revente_data
        ))

    return result

@router.get("/{simulation_id}", response_model=SimulationResponse)
def get_simulation(
    simulation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupérer une simulation spécifique"""
    simulation = db.query(Simulation).filter(
        Simulation.id == simulation_id,
        Simulation.user_id == current_user.id
    ).first()

    if not simulation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Simulation not found"
        )

    client_name = None
    if simulation.client_id:
        client = db.query(Client).filter(Client.id == simulation.client_id).first()
        if client:
            client_name = client.name

    return SimulationResponse(
        id=simulation.id,
        mensualite=simulation.mensualite,
        interets_totaux=simulation.interets_totaux,
        assurance_totale=simulation.assurance_totale,
        frais_notaire=simulation.frais_notaire_calcule,
        garantie_bancaire=simulation.garantie_bancaire,
        frais_agence=simulation.frais_agence_calcule,
        total_financer=simulation.total_financer,
        salaire_minimum=simulation.salaire_minimum,
        prix_bien=simulation.prix_bien,
        travaux=simulation.travaux,
        duree_pret=simulation.duree_pret,
        apport=simulation.apport,
        taux_interet=simulation.taux_interet,
        taux_assurance=simulation.taux_assurance,
        revalorisation_bien=simulation.revalorisation_bien,
        date_acquisition=simulation.date_acquisition,
        client_id=simulation.client_id,
        client_name=client_name,
        created_at=simulation.created_at.isoformat(),
        amortissement_data=simulation.amortissement_data,
        financement_data=simulation.financement_data,
        credit_data=simulation.credit_data,
        revente_data=simulation.revente_data
    )

@router.delete("/{simulation_id}")
def delete_simulation(
    simulation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Supprimer une simulation"""
    simulation = db.query(Simulation).filter(
        Simulation.id == simulation_id,
        Simulation.user_id == current_user.id
    ).first()

    if not simulation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Simulation not found"
        )

    db.delete(simulation)
    db.commit()

    return {"message": "Simulation deleted successfully"}
