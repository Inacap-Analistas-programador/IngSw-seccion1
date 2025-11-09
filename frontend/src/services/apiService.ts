import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const apiService = axios.create({
  baseURL: 'http://localhost:8000/api', // 🚨 Ajusta esto a la URL de tu backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token de autenticación a cada solicitud
apiService.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const token = authStore.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiService;
