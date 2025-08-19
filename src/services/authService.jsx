// src/services/authService.jsx
import { tokenService } from './tokenService';

export async function authService(username, issuer, tenant) {
  try {
    const apiUrl = import.meta.env.VITE_API_URL_BE;
    
    const response = await fetch(`${apiUrl}/msal-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        user: username,
        er: issuer,
        ta: tenant,
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error de autenticación');
    }
    
    return data;
  } catch (error) {
    console.error("Error en authService:", error);
    throw error;
  }
}