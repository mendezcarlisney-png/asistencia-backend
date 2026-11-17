import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // URL donde corre tu backend de NestJS
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para agregar el token JWT a cada petición si el usuario ha iniciado sesión
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;