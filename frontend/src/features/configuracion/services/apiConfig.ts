import axios from 'axios';
import { useAuthStore } from '../../auth/store/authStore'

// 1. Instanciamos axios con la URL base de tu backend
const api = axios.create({
  baseURL: 'http://localhost:5209',
});

// 2. Configuramos el Interceptor
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Token expirado o inválido. Redirigiendo al login...");
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;