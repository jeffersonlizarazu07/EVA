// src/context/AuthContext.jsx
import { createContext, useContext, useReducer, useEffect, useState, useCallback } from 'react';
import { MsalProvider, useMsal } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { getMsalConfig, getUserInfo, loginRequest } from '../config/authConfig.jsx';
import { authService } from '../services/authService.jsx';
import { tokenService } from '../services/tokenService.jsx';
import { setupAxiosInterceptors } from '../utils/axiosConfig.js';

// Estados posibles de autenticación
const AUTH_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  ERROR: 'error'
};

// Acciones del reducer
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  LOGOUT: 'LOGOUT',
  RESTORE_SESSION: 'RESTORE_SESSION',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer para manejo de estado de autenticación
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        status: AUTH_STATES.LOADING,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        status: AUTH_STATES.AUTHENTICATED,
        user: action.payload.user,
        userType: action.payload.userType,
        userId: action.payload.userId,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_ERROR:
      return {
        status: AUTH_STATES.ERROR,
        user: null,
        userType: null,
        userId: null,
        error: action.payload
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        status: AUTH_STATES.IDLE,
        user: null,
        userType: null,
        userId: null,
        error: null
      };

    case AUTH_ACTIONS.RESTORE_SESSION:
      return {
        status: AUTH_STATES.AUTHENTICATED,
        user: action.payload.user,
        userType: action.payload.userType,
        userId: action.payload.userId,
        error: null
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
}

// Estado inicial
const initialState = {
  status: AUTH_STATES.IDLE,
  user: null,
  userType: null,
  userId: null,
  error: null
};

const AuthContext = createContext(null);

const AuthContextProvider = ({ children }) => {
  const { instance, accounts, inProgress } = useMsal();
  const [state, dispatch] = useReducer(authReducer, initialState);

  // CONVERTIR logout en useCallback para que no cambie en cada render
  const logout = useCallback(async () => {
    try {
      console.log('[AuthContext] Iniciando logout...');
      tokenService.clearAll();
      await instance.logoutPopup();
    } catch (error) {
      console.error('[AuthContext] Error en logout:', error);
      tokenService.clearAll(); // Asegurar limpieza incluso con errores
    } finally {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  }, [instance]);

  // Configurar interceptores solo UNA VEZ al montar
  useEffect(() => {
    setupAxiosInterceptors(logout);
  }, [logout]); // Ahora logout es estable

  // Restaurar sesión al inicializar
  useEffect(() => {
    if (accounts.length > 0 && tokenService.hasValidSession()) {
      const userData = tokenService.getUserData();
      
      if (userData) {
        dispatch({
          type: AUTH_ACTIONS.RESTORE_SESSION,
          payload: {
            user: { ...accounts[0], backendData: userData },
            userType: userData.rl || userData.role,
            userId: userData.cdt || userData.user?.id_user
          }
        });
      }
    }
  }, [accounts]);

  const login = async () => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING });
    
    try {
      console.log('[AuthContext] Iniciando login...');
      const response = await instance.loginPopup(loginRequest);
      
      if (response?.account) {
        console.log('[AuthContext] Login MSAL exitoso');
        const userInfo = getUserInfo(response.account);
        
        const backendResponse = await authService(
          userInfo.username,
          userInfo.issuer,
          userInfo.tenant
        );
        
        if (backendResponse.status && backendResponse.access_token) {
          console.log('[AuthContext] Backend autorizó al usuario');
          
          // Guardar usando el servicio centralizado
          tokenService.setToken(backendResponse.access_token);
          tokenService.setUserData(backendResponse);
          
          const enrichedUser = {
            ...response.account,
            backendData: backendResponse
          };
          
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: {
              user: enrichedUser,
              userType: backendResponse.rl || backendResponse.role,
              userId: backendResponse.cdt || backendResponse.user?.id_user
            }
          });
          
          return { success: true };
        } else {
          console.log('[AuthContext] Backend rechazó al usuario');
          await instance.logoutPopup();
          
          const error = new Error(backendResponse.message || 'Usuario no autorizado');
          error.response = { 
            status: 403, 
            data: { message: backendResponse.message } 
          };
          throw error;
        }
      }
    } catch (error) {
      console.error('[AuthContext] Error en login:', error);
      
      // Limpiar todo en caso de error
      tokenService.clearAll();
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_ERROR,
        payload: error.message || 'Error durante la autenticación'
      });
      
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const contextValue = {
    // Estado
    isAuthenticated: state.status === AUTH_STATES.AUTHENTICATED,
    loading: state.status === AUTH_STATES.LOADING,
    user: state.user,
    userType: state.userType,
    userId: state.userId,
    error: state.error,
    backendAuthenticated: state.status === AUTH_STATES.AUTHENTICATED,
    
    // Acciones
    login,
    logout,
    clearError,
    
    // MSAL específico
    inProgress
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider = ({ children }) => {
  const [msalInstance, setMsalInstance] = useState(null);
  const [configLoaded, setConfigLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeMsal = async () => {
      try {
        const msalConfig = getMsalConfig();
        const instance = new PublicClientApplication(msalConfig);
        await instance.initialize();
        setMsalInstance(instance);
        setConfigLoaded(true);
      } catch (err) {
        setError(err);
      }
    };
    initializeMsal();
  }, []);

  if (error) return <div style={{ padding: '20px', color: 'red' }}>Error cargando autenticación: {error.message}</div>;
  if (!configLoaded || !msalInstance) return <div style={{ padding: '20px' }}>Cargando...</div>;

  return (
    <MsalProvider instance={msalInstance}>
      <AuthContextProvider>{children}</AuthContextProvider>
    </MsalProvider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};