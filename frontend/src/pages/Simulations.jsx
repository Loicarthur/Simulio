import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/authContext';
import { simulationsAPI } from '../services/api';

export default function Simulations() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [simulations, setSimulations] = useState([]);
  const [selectedSimulation, setSelectedSimulation] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadSimulations();
  }, []);

  const loadSimulations = async () => {
    try {
      const response = await simulationsAPI.getAll();
      setSimulations(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des simulations:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette simulation ?')) {
      try {
        await simulationsAPI.delete(id);
        loadSimulations();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de la simulation');
      }
    }
  };

  const viewDetails = (simulation) => {
    setSelectedSimulation(simulation);
    setShowModal(true);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('fr-FR').format(Math.round(num));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-700">Simulio</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Bonjour, {user?.name}</span>
            <button
              onClick={() => navigate('/simulator')}
              className="btn-secondary"
            >
              Simulateur
            </button>
            <button
              onClick={() => navigate('/clients')}
              className="btn-secondary"
            >
              Mes Clients
            </button>
            <button onClick={logout} className="btn-secondary">
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Mes Simulations</h2>
          <button
            onClick={() => navigate('/simulator')}
            className="btn-primary"
          >
            + Nouvelle simulation
          </button>
        </div>

        {/* Liste des simulations */}
        <div className="space-y-4">
          {simulations.map((simulation) => (
            <div key={simulation.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div>
                  <p className="text-sm text-gray-500">Date de création</p>
                  <p className="font-semibold text-gray-800">{formatDate(simulation.created_at)}</p>
                  {simulation.client_name && (
                    <p className="text-sm text-primary-600 mt-1">Client: {simulation.client_name}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Prix du bien</p>
                  <p className="font-semibold text-gray-800">{formatNumber(simulation.prix_bien)} €</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mensualité</p>
                  <p className="font-bold text-primary-700 text-xl">{formatNumber(simulation.mensualite)} €</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => viewDetails(simulation)}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg transition"
                  >
                    Détails
                  </button>
                  <button
                    onClick={() => handleDelete(simulation.id)}
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {simulations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucune simulation pour le moment</p>
            <p className="text-gray-400 mt-2">Cliquez sur "Nouvelle simulation" pour commencer</p>
          </div>
        )}
      </main>

      {/* Modal détails */}
      {showModal && selectedSimulation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full my-8">
            <h3 className="text-2xl font-bold mb-6">Détails de la simulation</h3>

            {selectedSimulation.client_name && (
              <div className="mb-6 p-4 bg-primary-50 rounded-lg">
                <p className="text-primary-800 font-semibold">Client: {selectedSimulation.client_name}</p>
              </div>
            )}

            {/* Résultat principal */}
            <div className="bg-gray-100 rounded-lg p-6 mb-6 text-center">
              <p className="text-gray-600 text-lg mb-2">Mensualité</p>
              <p className="text-4xl font-bold text-primary-700">
                {formatNumber(selectedSimulation.mensualite)} €
              </p>
            </div>

            {/* Paramètres */}
            <div className="mb-6">
              <h4 className="font-semibold text-lg mb-3">Paramètres du prêt</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Prix du bien</p>
                  <p className="font-semibold">{formatNumber(selectedSimulation.prix_bien)} €</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Travaux</p>
                  <p className="font-semibold">{formatNumber(selectedSimulation.travaux)} €</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Apport</p>
                  <p className="font-semibold">{formatNumber(selectedSimulation.apport)} €</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Durée</p>
                  <p className="font-semibold">{selectedSimulation.duree_pret} ans</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Taux d'intérêt</p>
                  <p className="font-semibold">{selectedSimulation.taux_interet} %</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Taux d'assurance</p>
                  <p className="font-semibold">{selectedSimulation.taux_assurance} %</p>
                </div>
              </div>
            </div>

            {/* Frais */}
            <div className="mb-6">
              <h4 className="font-semibold text-lg mb-3">Frais et total</h4>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Frais de notaire</span>
                  <span className="font-semibold">{formatNumber(selectedSimulation.frais_notaire)} €</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Garantie bancaire</span>
                  <span className="font-semibold">{formatNumber(selectedSimulation.garantie_bancaire)} €</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Frais d'agence</span>
                  <span className="font-semibold">{formatNumber(selectedSimulation.frais_agence)} €</span>
                </div>
                <div className="flex justify-between py-2 border-b font-bold">
                  <span className="text-gray-800">Total à financer</span>
                  <span className="text-primary-700">{formatNumber(selectedSimulation.total_financer)} €</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Revenu minimum mensuel</span>
                  <span className="font-semibold">{formatNumber(selectedSimulation.salaire_minimum)} €</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowModal(false);
                setSelectedSimulation(null);
              }}
              className="w-full btn-secondary"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
