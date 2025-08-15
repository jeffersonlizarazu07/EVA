import { useState, useEffect, useContext } from "react";
import HeaderLT1 from "../../components/header/headerLT1";
import HeaderLT2 from "../../components/header/headerLT2";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../utils/axiosConfig";
import { useTranslations } from "../../components/hooks/useTranslations";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Avatar,
  Divider,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  Language as LanguageIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

const MiPerfil = () => {
  const { userType, userId, userInfo } = useContext(UserContext);
  const { t } = useTranslations();
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    if (userId) {
      getClients();
    }
  }, [userId]);

  const getClients = async () => {
    try {
      const response = await apiClient.get(`/users_client/${userId}`, {
        withCredentials: true,
      });
      setClients(response.data.data || []);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  const getInitials = (firstName, lastName) => {
    const first = firstName ? firstName.charAt(0).toUpperCase() : "";
    const last = lastName ? lastName.charAt(0).toUpperCase() : "";
    return first + last;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Sin actualizar";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getLanguageName = (code) => {
    const languages = {
      'es': 'Español',
      'en': 'Inglés',
      'it': 'Italiano',
      'pt': 'Portugués'
    };
    return languages[code] || code;
  };

  return (
    <Box className="App" sx={{ overflow: "hidden" }}>
      <Box id="body">
        {userType == "1" || userType == 1 ? <HeaderLT1 /> : <HeaderLT2 />}
        
        <Box m={0} sx={{ alignItems: "stretch", flexWrap: "nowrap", padding: 0, display: "flex", mt: 3 }}>
          <Box className="container" mt={0} sx={{ maxWidth: "97%" }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
              {/* Header del perfil */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    background: "linear-gradient(129deg, rgba(199, 14, 143, 1) 37%, rgba(95, 9, 121, 1) 69%)",
                    fontSize: "2rem",
                    mr: 2,
                  }}
                >
                  {getInitials(userInfo?.firstname || "", userInfo?.lastname || "")}
                </Avatar>
                <Box>
                  <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", color: "#b62a8b" }}>
                    Información detallada del perfil de agente
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Información del perfil en dos columnas */}
              <Grid container spacing={3}>
                {/* Columna izquierda */}
                <Grid item xs={12} md={6}>
                  <Card elevation={2} sx={{ height: "100%", border: "1px solid #b62a8b", borderRadius: 2 }}>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <PersonIcon sx={{ color: "#b62a8b" }} />
                            <Typography variant="body2" color="text.secondary">
                              Nombre
                            </Typography>
                          </Box>
                          <Typography variant="body1" sx={{ fontWeight: "bold", pl: 3 }}>
                            {userInfo?.firstname} {userInfo?.lastname}
                          </Typography>
                        </Grid>

                        <Grid item xs={12}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <CheckCircleIcon sx={{ color: "#4caf50" }} />
                            <Typography variant="body2" color="text.secondary">
                              Estado
                            </Typography>
                          </Box>
                          <Typography variant="body1" sx={{ fontWeight: "bold", color: "#4caf50", pl: 3 }}>
                            Activo
                          </Typography>
                        </Grid>

                        <Grid item xs={12}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <CalendarIcon sx={{ color: "#b62a8b" }} />
                            <Typography variant="body2" color="text.secondary">
                              Fecha de registro
                            </Typography>
                          </Box>
                          <Typography variant="body1" sx={{ fontWeight: "bold", pl: 3 }}>
                            {formatDate(userInfo?.created_at)}
                          </Typography>
                        </Grid>

                        <Grid item xs={12}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <LanguageIcon sx={{ color: "#b62a8b" }} />
                            <Typography variant="body2" color="text.secondary">
                              Lenguaje
                            </Typography>
                          </Box>
                          <Typography variant="body1" sx={{ fontWeight: "bold", pl: 3 }}>
                            {getLanguageName(userInfo?.language)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Columna derecha */}
                <Grid item xs={12} md={6}>
                  <Card elevation={2} sx={{ height: "100%", border: "1px solid #b62a8b", borderRadius: 2 }}>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <EmailIcon sx={{ color: "#b62a8b" }} />
                            <Typography variant="body2" color="text.secondary">
                              Correo electrónico
                            </Typography>
                          </Box>
                          <Typography variant="body1" sx={{ fontWeight: "bold", pl: 3 }}>
                            {userInfo?.email}
                          </Typography>
                        </Grid>

                        <Grid item xs={12}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <BusinessIcon sx={{ color: "#b62a8b" }} />
                            <Typography variant="body2" color="text.secondary">
                              Rol
                            </Typography>
                          </Box>
                          <Typography variant="body1" sx={{ fontWeight: "bold", pl: 3 }}>
                            {userType === "4" || userType === 4 ? "Agente" : "Administrador"}
                          </Typography>
                        </Grid>

                        <Grid item xs={12}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <CalendarIcon sx={{ color: "#b62a8b" }} />
                            <Typography variant="body2" color="text.secondary">
                              Última visita
                            </Typography>
                          </Box>
                          <Typography variant="body1" sx={{ fontWeight: "bold", pl: 3 }}>
                            {formatDate(userInfo?.last_visit_date)}
                          </Typography>
                        </Grid>

                        <Grid item xs={12}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <BusinessIcon sx={{ color: "#b62a8b" }} />
                            <Typography variant="body2" color="text.secondary">
                              Clientes
                            </Typography>
                          </Box>
                          <Box sx={{ pl: 3 }}>
                            {clients.length > 0 ? (
                              clients.map((client, index) => (
                                <Chip
                                  key={index}
                                  label={client.clientName}
                                  sx={{
                                    mr: 1,
                                    mb: 1,
                                    backgroundColor: "#b62a8b",
                                    color: "white",
                                    "&:hover": {
                                      backgroundColor: "#581244",
                                    },
                                  }}
                                />
                              ))
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                Sin clientes asignados
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MiPerfil;
