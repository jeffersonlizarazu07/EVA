import { useState, useEffect, useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useAuth } from "../context/AuthContext"; // <- NUEVO IMPORT
import Swal from "sweetalert2";
import { Toast } from "../assets/js/alertConfig";

const ProtectedRoute = ({ redirectPath = '/', allowedUserTypes = [] }) => {
  const { isAuthenticated, loading, userType } = useAuth(); // <- USAR MSAL EN LUGAR DE COOKIES
  const { setAccessToken } = useContext(UserContext);
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [rolAuthorized, setRolAuthorized] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Esperar que MSAL se inicialice
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isInitializing && !loading) {
      if (isAuthenticated) {
        setIsAuthorized(true);
        if (allowedUserTypes.includes(parseInt(userType))) {
          setRolAuthorized(true);
        } else {
          setRolAuthorized(false);
        }
      } else {
        setIsAuthorized(false);
        setRolAuthorized(false);
      }
    }
  }, [isAuthenticated, userType, allowedUserTypes, isInitializing, loading]);

  // Mientras se inicializa o está cargando, mostrar loading
  if (isInitializing || loading || isAuthorized === null) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        Cargando...
      </div>
    );
  }

  // Si no está autorizado o no tiene el rol adecuado
  if (!isAuthorized || !rolAuthorized) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />; 
};

export default ProtectedRoute;