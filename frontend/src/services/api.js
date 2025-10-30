import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Créer une instance axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
};

// Clients API
export const clientsAPI = {
  getAll: () => api.get('/clients'),
  getById: (id) => api.get(`/clients/${id}`),
  create: (data) => api.post('/clients', data),
  update: (id, data) => api.put(`/clients/${id}`, data),
  delete: (id) => api.delete(`/clients/${id}`),
};

// Simulations API
export const simulationsAPI = {
  calculate: (data) => api.post('/simulations/calculate', data),
  create: (data) => api.post('/simulations', data),
  getAll: (clientId = null) => api.get('/simulations', { params: { client_id: clientId } }),
  getById: (id) => api.get(`/simulations/${id}`),
  delete: (id) => api.delete(`/simulations/${id}`),
};

export default api;
