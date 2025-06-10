import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios"; // ✅ Asegúrate de tenerlo importado

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(() => Cookies.get("userId") || "");
  const [userType, setUserType] = useState(() => Cookies.get("userType") || "");
  const [accessToken, setAccessToken] = useState(
    () => Cookies.get("accessToken") || ""
  );
  const [clients, setClients] = useState(() => Cookies.get("clients") || "");
  const [languageUser, setLanguageUser] = useState(
    () => localStorage.getItem("languageUser") || "es"
  );
  const [userInfo, setUserInfo] = useState(null);

  // Guardar cookies y limpiar al cerrar
  useEffect(() => {
    const tabCount = sessionStorage.getItem("tabCount");
    sessionStorage.setItem("tabCount", tabCount ? parseInt(tabCount) + 1 : 1);

    if (userId) Cookies.set("userId", userId, { expires: 1 / 24, path: "/" });
    if (userType)
      Cookies.set("userType", userType, { expires: 1 / 24, path: "/" });
    if (accessToken)
      Cookies.set("accessToken", accessToken, { expires: 1 / 24, path: "/" });
    if (clients)
      Cookies.set("clients", clients, { expires: 1 / 24, path: "/" });
    if (languageUser) localStorage.setItem("languageUser", languageUser);

    const handleBeforeUnload = () => {
      const count = parseInt(sessionStorage.getItem("tabCount") || "1");
      const newCount = count - 1;
      sessionStorage.setItem("tabCount", newCount);

      if (newCount <= 0) {
        Cookies.remove("userId");
        Cookies.remove("userType");
        Cookies.remove("accessToken");
        Cookies.remove("clients");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [userId, userType, accessToken, clients, languageUser]);

  // Carga los datos completos del usuario
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/users/${userId}`,
            {
              withCredentials: true,
            }
          );
          setUserInfo(response.data.data); // Asignar al contexto
          console.log("Usuario logueado:", response.data.data);
        } catch (err) {
          console.error("Error al cargar el usuario logueado", err);
          setUserInfo(null);
        }
      }
    };

    fetchUserInfo();
  }, [userId]);

  return (
    <UserContext.Provider
      value={{
        userId,
        setUserId,
        userType,
        setUserType,
        accessToken,
        setAccessToken,
        languageUser,
        setLanguageUser,
        clients,
        setClients,
        userInfo,
        setUserInfo,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
