import { useState, useEffect, useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { Toast } from "../assets/js/alertConfig";

const ProtectedRoute = ({ redirectPath = '/', allowedUserTypes = [] }) => {
  // Lee el accessToken directamente desde las cookies     
  const accessToken = Cookies.get('accessToken');
if (!accessToken) {
  console.log('El token está undefined');
} else {
  console.log('Token recibido:', accessToken);
}


  const userType = Cookies.get('userType'); 
  const { setAccessToken } = useContext(UserContext);
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [rolAuthorized, setRolAuthorized] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      Swal.fire({
        title: 'Cargando...',
        didOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
      });

      try {
       const check = await axios.get('http://localhost:8000/api/check-token', {
      withCredentials: true
      });

        if (check.data.status) {
          try {
            const renew = await axios.post(
              'http://localhost:8000/api/extend-token', {}, 
              { headers: { 'Authorization': `Bearer ${accessToken}` } ,withCredentials: true }
            );

            if (!renew.data.status) {
              setIsAuthorized(false);
              Swal.close();
              Toast.fire({
                icon: "danger",
                title: `Tu sesión ha expirado`,
              });
            } else {
              setIsAuthorized(true);
              setAccessToken(renew.data.token); 
              if (allowedUserTypes.includes(parseInt(userType))) {
                setRolAuthorized(true);
              } else {
                setRolAuthorized(false);
              }
            }
            Swal.close();
          } catch (error) {
            console.error(error);
          }
        }
      } catch (error) {
        setIsAuthorized(false);
        Swal.close();
        Swal.fire({
          title: 'Tu sesión ha finalizado',
          allowOutsideClick: true,
        });
      }
    };

    if (accessToken) {
      getToken();
    } else {
      setIsAuthorized(false); 
    }
  }, [accessToken, userType, allowedUserTypes, setAccessToken]);

  // Mientras se verifica la autorización, no mostrar nada
  if (isAuthorized === null) {
    return null;
  }

  // Si no está autorizado o no tiene el rol adecuado, redirige al login o a la ruta especificada
  if (!isAuthorized || !rolAuthorized) {
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('languageUser');
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />; 
};

export default ProtectedRoute;
