import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LogoEVA from "../../assets/img/logo EVA2.0.png";
import "../../assets/css/login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user, loading } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token') || localStorage.getItem('jwt_token');
    if (isAuthenticated && token) {
      navigate("/admin"); // <- CAMBIAR /dashboard por /admin
    }
  }, [isAuthenticated, user, navigate]);

  const handleMicrosoftLogin = async (event) => {
    event.preventDefault();
    setError(""); // Limpiar errores previos
    
    try {
      const result = await login();
      
      if (result?.success) {
        console.log('Login exitoso');
      } else if (result?.cancelled) {
        console.log('Login cancelado por el usuario');
      }
    } catch (error) {
      console.error("Error en login:", error);
      
      if (error.message && error.type !== 'user_cancelled') {
        setError(error.message || "Error al iniciar sesión con Microsoft");
      }
    }
  };

  return (
    <div className="App">
      <div id="login-body" className="bodyLogin">
        <div className="col container-img">
          <img src={LogoEVA} className="d-sm-block d-lg-none" alt="Logo EVA" />
        </div>
        <div className="login-container container col-sm-12">
          <h2 className="text-start tittle-session">Iniciar Sesión</h2>
          <form id="login-form" onSubmit={handleMicrosoftLogin}>
            
            {error && <p className="text-danger text-center">{error}</p>}

            <button 
              className="btn access-button" 
              id="bot" 
              type="submit"
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                minHeight: '48px'
              }}
            >
              {loading ? (
                <>
                  <div 
                    className="spinner-border spinner-border-sm" 
                    role="status"
                    style={{ width: '16px', height: '16px' }}
                  />
                  Iniciando sesión...
                </>
              ) : (
                <>
                <div className="d-flex align-items-center gap-2" style={{color: 'white'}}>
                  <i className="fa-brands fa-microsoft" style={{ fontSize: '18px' }}></i>
                  Iniciar sesión con Microsoft
                </div>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;