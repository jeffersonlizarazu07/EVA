import { useState, useEffect, useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import Swal from "sweetalert2";
import { Toast } from "../assets/js/alertConfig";
const ProtectedRoute = ({ redirectPath = '/',allowedUserTypes = []}) => {
  const { accessToken,userType,setAccessToken} = useContext(UserContext);
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [rolAuthorized,setRolAuthorized]=useState(null)
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
        const check = await axios.post(
          'http://localhost:8000/api/check-token', {}, {
            headers: {
              "Authorization": `Bearer ${accessToken}`,
            }
          }
        );
        if (check.data.status) {
          try {
            const renew = await axios.post(
              'http://localhost:8000/api/extend-token',
              {},
              {
                headers: {
                  "Authorization": `Bearer ${accessToken}`,
                },
              }
            );
            if (!renew.data.status) {
              setIsAuthorized(false);
              Swal.close();
              Toast.fire({
                icon: "danger",
                title: `Tu sesion ha expirado`,
              });
            } else {
              setIsAuthorized(true);
              setAccessToken(renew.data.token); 
              if (allowedUserTypes.includes(parseInt(userType))) {
                setRolAuthorized(true);
              } else {
                setRolAuthorized(false); // aquí va por defecto false
              }
            }
            Swal.close();
          } catch (error) {
            console.error(error);
          }
        }
      } catch (error) {
        setIsAuthorized(false); // aquí va por defecto false
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
      setIsAuthorized(false); // aquí va por defecto false
    }
  }, [userType, allowedUserTypes]);

  if (isAuthorized === null) {
    return null;
  }

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
