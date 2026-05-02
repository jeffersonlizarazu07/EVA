// src/context/UserContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";
import { apiClient } from "../utils/axiosConfig";
import { tokenService } from "../services/tokenService";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [languageUser, setLanguageUser] = useState(
    () => localStorage.getItem("languageUser") || "es"
  );
  const [userInfo, setUserInfo] = useState(null);
  const [clients, setClients] = useState([]); // Array de IDs de clientes permitidos

  // Derivar valores del AuthContext
  const userId = user?.backendData?.cdt || user?.backendData?.user?.id_user || "";
  const userType = user?.backendData?.rl || user?.backendData?.role || "";

  // Cargar datos completos del usuario
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!userId || !isAuthenticated) {
        setUserInfo(null);
        setClients([]);
        return;
      }

      // PEQUEÑO DELAY para asegurar que el token esté guardado y los interceptores configurados
      await new Promise(resolve => setTimeout(resolve, 100));

      try {
        const response = await apiClient.get(`/users/${userId}`);
        setUserInfo(response.data.data);
      } catch (err) {
        console.error("Error al cargar el usuario logueado", err);
        setUserInfo(null);
        // El interceptor ya maneja el 401, no necesitamos hacer nada más aquí
      }

      // Cargar clientes asignados al usuario (como array de IDs)
      try {
        const resClients = await apiClient.get(`/users/${userId}/clients`);
        const ids = Array.isArray(resClients.data?.data)
          ? resClients.data.data.map((c) => c.idClient ?? c.id ?? c)
          : [];
        setClients(ids);
      } catch (err) {
        console.warn("No fue posible cargar los clientes del usuario", err);
        setClients([]);
      }
    };

    fetchUserInfo();
  }, [userId, isAuthenticated]);

  // Guardar idioma
  useEffect(() => {
    localStorage.setItem("languageUser", languageUser);
  }, [languageUser]);

  return (
    <UserContext.Provider
      value={{
        // Estados derivados (read-only)
        userId: userId.toString(),
        userType,
        
        // Estados locales
        languageUser,
        setLanguageUser,
        userInfo,
        setUserInfo,
        // Compatibilidad con código existente
        accessToken: tokenService.getToken(),
        clients,
        setClients,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser debe usarse dentro de UserProvider');
  return context;
};