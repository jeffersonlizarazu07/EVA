import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LogoEVA from "../../assets/img/logo EVA2.0.png";
import contenedor from "../../assets/img/contenedor.png";
import botonIniciarSesion from "../../assets/img/iniciarsesion.png";
import "../../assets/css/login.css";
import { Box, Container, Typography, Button, CircularProgress } from '@mui/material';
import MicrosoftIcon from '@mui/icons-material/Microsoft';

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
     <Box className="App">
      <Box id="login-body" className="bodyLogin" sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, minHeight: '100vh' }}>
        <Box
          className="container-img"
          sx={{ flex: 1, display: { xs: 'block', lg: 'none' }, textAlign: 'center', mb: 2 }}
        >
          <img src={LogoEVA} alt="Logo EVA" style={{ maxWidth: '100%', height: 'auto' }} />
        </Box>

        <Container
          className="login-container"
          sx={{
            flex: 1,
            maxWidth: 'sm',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start', // para centrar las imágenes horizontalmente
            gap: 3,
          }}
        >

          {/* Imagen contenedora */}
          <Box
            sx={{
              position: 'relative',
              width: '40%',
              height: 'auto',
            }}
          >
            <img
              src={contenedor}
              alt="Contenedor"
              style={{ width: '100%', display: 'block' }}
            />

            {/* Botón con imagen dentro del contenedor */}
            <Box
              component="form"
              id="login-form"
              onSubmit={handleMicrosoftLogin}
              sx={{
                position: 'absolute',
                top: '60%', // Ajusta según dónde quieras que esté el botón
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'auto',
                height: 'auto',
                textAlign: 'center',
              }}
            >
              {error && (
                <Typography color="error" align="center" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}

              <Button
                type="submit"
                disabled={loading}
                sx={{
                  p: 0,
                  minWidth: 'auto',
                  minHeight: 'auto',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 1,
                  textTransform: 'none',
                  transition: 'transform 0.3s ease, filter 0.3s ease',
                  cursor: loading ? 'default' : 'pointer',
                  '&:hover': {
                    filter: 'brightness(0.90) saturate(0.90)',   // brillo más intenso y saturación
                    transform: 'scale(1.07)',                   // zoom un poco más grande
                    '& img': {
                      filter: 'brightness(1.3) saturate(1.2)', // imagen más brillante y saturada
                    },
                  },
                  '&:disabled': {
                    cursor: 'not-allowed',
                    filter: 'grayscale(1) opacity(0.6)',
                    transform: 'none',
                    backgroundColor: 'transparent',
                  },
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={24} />
                    <Typography ml={1} color="text.primary">
                      Iniciando sesión...
                    </Typography>
                  </>
                ) : (
                  <img
                    src={botonIniciarSesion}
                    alt="Botón Iniciar Sesión"
                    style={{ width: '300px', cursor: 'pointer' }}
                  />
                )}
              </Button>


            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Login;