import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
  withCredentials: true, // Enable credentials for CORS
});

// Request interceptor para agregar auth token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('gic_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle timeout
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - server not responding');
      error.message = 'La solicitud tardó demasiado. Verifica tu conexión.';
    }
    
    // Handle network errors
    if (error.message === 'Network Error') {
      console.error('Network error - cannot connect to server');
      error.message = 'No se puede conectar con el servidor. Verifica tu conexión.';
    }
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      sessionStorage.removeItem('gic_auth_token');
      sessionStorage.removeItem('gic_user_data');
      if (window.location.pathname !== '/coordinador/login') {
        window.location.href = '/coordinador/login?reason=session_expired';
      }
    }
    
    // Handle forbidden errors
    if (error.response?.status === 403) {
      error.message = 'No tienes permisos para realizar esta acción.';
    }
    
    // Handle not found errors
    if (error.response?.status === 404) {
      error.message = 'Recurso no encontrado.';
    }
    
    // Handle server errors
    if (error.response?.status >= 500) {
      error.message = 'Error del servidor. Intenta nuevamente más tarde.';
    }
    
    return Promise.reject(error);
  }
);

export default api;
