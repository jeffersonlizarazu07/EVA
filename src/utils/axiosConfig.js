// src/utils/axiosConfig.js
import axios from 'axios';
import { tokenService } from '../services/tokenService';

let isRedirecting = false;

// Crear instancia específica
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL_BE
});

export const setupAxiosInterceptors = (logoutCallback = null) => {
  // Limpiar interceptores existentes
  apiClient.interceptors.request.clear();
  apiClient.interceptors.response.clear();

  // Request interceptor
  apiClient.interceptors.request.use(
    (config) => {
      const token = tokenService.getToken();
      if (token && tokenService.isTokenValid(token)) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn(`[AxiosConfig] Token inválido o inexistente para: ${config.url}`);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 && !isRedirecting) {
        console.warn(`[AxiosConfig] 401 detectado en: ${error.config?.url}`);
        
        const publicRoutes = ['/login', '/survey', '/gratitude', '/auth/inactive'];
        const currentPath = window.location.pathname;
        const isPublicRoute = publicRoutes.some(route => currentPath.startsWith(route));
        
        if (!isPublicRoute) {
          isRedirecting = true;
          tokenService.clearAll();
          
          if (logoutCallback) {
            console.log('[AxiosConfig] Ejecutando logout callback...');
            logoutCallback();
          } else {
            console.log('[AxiosConfig] Redirigiendo a login...');
            window.location.href = '/login';
          }
          
          // Reset flag después de un tiempo
          setTimeout(() => {
            isRedirecting = false;
          }, 1000);
        }
      }
      
      return Promise.reject(error);
    }
  );
};

// Configuración inicial (mantener por compatibilidad con código existente)
setupAxiosInterceptors();