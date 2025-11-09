import axios from 'axios';

// 🚨 IMPORTANTE: Ajustar la URL base de tu Django API
const API_BASE_URL = 'http://localhost:8000/api/'; 

const apiService = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para añadir el token JWT a cada petición
apiService.interceptors.request.use(config => {
    // ⚠️ Asegúrate de que el token se guarda en localStorage después del login
    const token = localStorage.getItem('accessToken'); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default apiService;