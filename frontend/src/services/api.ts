import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    
    if (status === 401) {
      console.warn('Sesión expirada o credenciales inválidas. Redirigiendo al login...');
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      if (window.location.pathname !== '/login' && !window.location.pathname.includes('/auth')) {
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
