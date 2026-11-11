// src/services/api.ts
import axios, { InternalAxiosRequestConfig } from 'axios';

// Creamos una instancia de axios apuntando al puerto de tu backend NestJS (3000)
const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: tipamos el config usando InternalAxiosRequestConfig para evitar el error de TS
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;