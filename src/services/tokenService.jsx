// src/services/tokenService.js
class TokenService {
  constructor() {
    this.TOKEN_KEY = 'authToken';
    this.USER_DATA_KEY = 'userData';
  }

  setToken(token) {
    if (!token) {
      console.warn('[TokenService] Intento de guardar token vacío');
      return false;
    }
    
    try {
      localStorage.setItem(this.TOKEN_KEY, token);
      
      // ✅ TAMBIÉN GUARDAR EN COOKIES PARA COMPATIBILIDAD CON CÓDIGO EXISTENTE
      document.cookie = `token=${token}; path=/; SameSite=Lax; secure=${window.location.protocol === 'https:'}`;
      
      console.log('[TokenService] Token guardado en localStorage Y cookies');
      return true;
    } catch (error) {
      console.error('[TokenService] Error guardando token:', error);
      return false;
    }
  }

  getToken() {
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('[TokenService] Error obteniendo token:', error);
      return null;
    }
  }

  setUserData(userData) {
    if (!userData) return false;
    
    try {
      localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
      
      // ✅ TAMBIÉN GUARDAR userId, userType, accessToken EN COOKIES PARA COMPATIBILIDAD
      const userId = userData.cdt || userData.user?.id_user;
      const userType = userData.rl || userData.role;
      const accessToken = userData.access_token;
      
      if (userId) {
        document.cookie = `userId=${userId}; path=/; SameSite=Lax; secure=${window.location.protocol === 'https:'}`;
      }
      if (userType) {
        document.cookie = `userType=${userType}; path=/; SameSite=Lax; secure=${window.location.protocol === 'https:'}`;
      }
      if (accessToken) {
        document.cookie = `accessToken=${accessToken}; path=/; SameSite=Lax; secure=${window.location.protocol === 'https:'}`;
      }
      
      return true;
    } catch (error) {
      console.error('[TokenService] Error guardando userData:', error);
      return false;
    }
  }

  getUserData() {
    try {
      const data = localStorage.getItem(this.USER_DATA_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('[TokenService] Error obteniendo userData:', error);
      return null;
    }
  }

  // FIX CRÍTICO - NO ASUMIR VÁLIDO POR DEFECTO
  isTokenValid(token = null) {
    const tokenToCheck = token || this.getToken();
    if (!tokenToCheck) return false;

    try {
      // Verificar si es un JWT válido
      const parts = tokenToCheck.split('.');
      if (parts.length !== 3) {
        console.warn('[TokenService] Token no es JWT válido');
        return false;
      }

      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      const isValid = payload.exp && payload.exp > currentTime;
      
      if (!isValid) {
        console.warn('[TokenService] Token expirado');
      }
      
      return isValid;
    } catch (error) {
      console.error('[TokenService] Error validando token:', error);
      return false;
    }
  }

  clearAll() {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_DATA_KEY);
      
      // ✅ TAMBIÉN LIMPIAR TODAS LAS COOKIES
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'userId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'userType=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'clients=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      
      // Limpiar tokens antiguos también
      localStorage.removeItem('token');
      localStorage.removeItem('jwt_token');
      
      console.log('[TokenService] Tokens limpiados exitosamente (localStorage Y cookies)');
    } catch (error) {
      console.error('[TokenService] Error limpiando tokens:', error);
    }
  }

  hasValidSession() {
    const token = this.getToken();
    const userData = this.getUserData();
    
    return token && userData && this.isTokenValid(token);
  }
}

export const tokenService = new TokenService();