import { useState, useEffect } from 'react';
import { useAuth } from '../services/authContext';
import { useNavigate } from 'react-router-dom';
import { simulationsAPI, clientsAPI } from '../services/api';

export default function Simulator() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    prix_bien: 200000,
    travaux: 0,
    frais_agence: 3,
    duree_pret: 25,
    apport: 0,
    frais_notaire: 7.5,
    taux_interet: 3.5,
    taux_assurance: 0.32,
    revalorisation_bien: 1,
    date_acquisition: getCurrentDate(),
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  function getCurrentDate() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${month}/${year}`;
  }

  const loadClients = async () => {
    try {
      const response = await clientsAPI.getAll();
      setClients(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des clients:', error);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateSimulation = async () => {
    setLoading(true);
    try {
      const response = await simulationsAPI.calculate(formData);
      setResult(response.data);
    } catch (error) {
      console.error('Erreur lors du calcul:', error);
      alert('Erreur lors du calcul de la simulation');
    } finally {
      setLoading(false);
    }
  };

  const saveSimulation = async () => {
    if (!result) {
      alert('Veuillez d\'abord calculer une simulation');
      return;
    }

    try {
      const dataToSave = {
        ...formData,
        client_id: selectedClient
      };

      await simulationsAPI.create(dataToSave);
      setShowSaveMessage(true);
      setTimeout(() => setShowSaveMessage(false), 3000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde de la simulation');
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('fr-FR').format(Math.round(num));
  };

  useEffect(() => {
    calculateSimulation();
  }, [formData]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-700">Simulio</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Bonjour, {user?.name}</span>
            <button
              onClick={() => navigate('/clients')}
              className="btn-secondary"
            >
              Mes Clients
            </button>
            <button
              onClick={() => navigate('/simulations')}
              className="btn-secondary"
            >
              Mes Simulations
            </button>
            <button onClick={logout} className="btn-secondary">
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire */}
          <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Achat en résidence principale dans l'ancien
            </h2>

            {/* Prix du bien */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix du bien
              </label>
              <input
                type="range"
                min="50000"
                max="1000000"
                step="1000"
                value={formData.prix_bien}
                onChange={(e) => handleInputChange('prix_bien', parseFloat(e.target.value))}
                className="w-full mb-2"
              />
              <div className="flex items-center">
                <input
                  type="number"
                  value={formData.prix_bien}
                  onChange={(e) => handleInputChange('prix_bien', parseFloat(e.target.value))}
                  className="input-style flex-1"
                />
                <span className="ml-2 text-gray-600">€</span>
              </div>
            </div>

            {/* Travaux */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Travaux
              </label>
              <input
                type="range"
                min="0"
                max="100000"
                step="1000"
                value={formData.travaux}
                onChange={(e) => handleInputChange('travaux', parseFloat(e.target.value))}
                className="w-full mb-2"
              />
              <div className="flex items-center">
                <input
                  type="number"
                  value={formData.travaux}
                  onChange={(e) => handleInputChange('travaux', parseFloat(e.target.value))}
                  className="input-style flex-1"
                />
                <span className="ml-2 text-gray-600">€</span>
              </div>
            </div>

            {/* Frais d'agence */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frais d'agence
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  step="0.1"
                  value={formData.frais_agence}
                  onChange={(e) => handleInputChange('frais_agence', parseFloat(e.target.value))}
                  className="input-style flex-1"
                />
                <span className="text-gray-600">%</span>
              </div>
            </div>

            {/* Durée du prêt */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durée de votre prêt
              </label>
              <input
                type="range"
                min="5"
                max="30"
                step="1"
                value={formData.duree_pret}
                onChange={(e) => handleInputChange('duree_pret', parseInt(e.target.value))}
                className="w-full mb-2"
              />
              <div className="flex items-center">
                <input
                  type="number"
                  value={formData.duree_pret}
                  onChange={(e) => handleInputChange('duree_pret', parseInt(e.target.value))}
                  className="input-style flex-1"
                />
                <span className="ml-2 text-gray-600">ans</span>
              </div>
            </div>

            {/* Apport */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apport
              </label>
              <input
                type="range"
                min="0"
                max={formData.prix_bien}
                step="1000"
                value={formData.apport}
                onChange={(e) => handleInputChange('apport', parseFloat(e.target.value))}
                className="w-full mb-2"
              />
              <div className="flex items-center">
                <input
                  type="number"
                  value={formData.apport}
                  onChange={(e) => handleInputChange('apport', parseFloat(e.target.value))}
                  className="input-style flex-1"
                />
                <span className="ml-2 text-gray-600">€</span>
              </div>
            </div>

            {/* Frais de notaire */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frais de notaire
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  step="0.1"
                  value={formData.frais_notaire}
                  onChange={(e) => handleInputChange('frais_notaire', parseFloat(e.target.value))}
                  className="input-style flex-1"
                />
                <span className="text-gray-600">%</span>
              </div>
            </div>

            {/* Taux d'intérêt */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taux d'intérêt
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  step="0.01"
                  value={formData.taux_interet}
                  onChange={(e) => handleInputChange('taux_interet', parseFloat(e.target.value))}
                  className="input-style flex-1"
                />
                <span className="text-gray-600">%</span>
              </div>
            </div>

            {/* Taux d'assurance */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taux d'assurance
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  step="0.01"
                  value={formData.taux_assurance}
                  onChange={(e) => handleInputChange('taux_assurance', parseFloat(e.target.value))}
                  className="input-style flex-1"
                />
                <span className="text-gray-600">%</span>
              </div>
            </div>

            {/* Revalorisation du bien */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Revalorisation du bien par an
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  step="0.1"
                  value={formData.revalorisation_bien}
                  onChange={(e) => handleInputChange('revalorisation_bien', parseFloat(e.target.value))}
                  className="input-style flex-1"
                />
                <span className="text-gray-600">%</span>
              </div>
            </div>

            {/* Date d'acquisition */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date d'acquisition
              </label>
              <input
                type="month"
                value={formData.date_acquisition.split('/').reverse().join('-')}
                onChange={(e) => {
                  const [year, month] = e.target.value.split('-');
                  handleInputChange('date_acquisition', `${month}/${year}`);
                }}
                className="input-style"
              />
            </div>
          </div>

          {/* Résultats */}
          <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Résultat de simulation
            </h2>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700"></div>
              </div>
            ) : result ? (
              <>
                {/* Mensualité */}
                <div className="bg-gray-100 rounded-lg p-6 mb-6 text-center">
                  <p className="text-gray-600 text-lg mb-2">Votre mensualité sera de</p>
                  <p className="text-4xl font-bold text-primary-700">
                    {formatNumber(result.mensualite)} €
                  </p>
                </div>

                {/* Détails */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Prix du bien</span>
                    <span className="font-semibold">{formatNumber(formData.prix_bien)} €</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Frais de Notaire</span>
                    <span className="font-semibold">{formatNumber(result.frais_notaire)} €</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Garantie Bancaire</span>
                    <span className="font-semibold">{formatNumber(result.garantie_bancaire)} €</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Travaux</span>
                    <span className="font-semibold">{formatNumber(formData.travaux)} €</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Frais d'agence</span>
                    <span className="font-semibold">{formatNumber(result.frais_agence)} €</span>
                  </div>
                  <div className="flex justify-between py-2 border-b font-bold">
                    <span className="text-gray-800">Total à financer</span>
                    <span className="text-primary-700">{formatNumber(result.total_financer)} €</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Revenu acquéreur minimum mensuel</span>
                    <span className="font-semibold">{formatNumber(result.salaire_minimum)} €</span>
                  </div>
                </div>

                {/* Sélection du client (BONUS) */}
                {clients.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Attribuer à un client (optionnel)
                    </label>
                    <select
                      value={selectedClient || ''}
                      onChange={(e) => setSelectedClient(e.target.value ? parseInt(e.target.value) : null)}
                      className="input-style"
                    >
                      <option value="">Aucun client</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Bouton Enregistrer */}
                <button
                  onClick={saveSimulation}
                  className="w-full btn-primary"
                >
                  ENREGISTRER LA SIMULATION
                </button>

                {showSaveMessage && (
                  <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center">
                    Simulation enregistrée avec succès !
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Chargement des résultats...
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
