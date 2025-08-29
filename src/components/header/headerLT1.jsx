import Logo from "../../assets/img/logo EVA.webp";
import { apiClient } from "../../utils/axiosConfig";
import { useContext, useState, useEffect } from "react";
import { toggleBlackMode } from "../../assets/js/toggleBlackMode";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { useAuth } from "../../context/AuthContext";
import { Toast, smallAlertDelete } from "../../assets/js/alertConfig";
import Avatar from "@mui/material/Avatar";
import { Button as MUIButton } from "@mui/material";
import Cookies from "js-cookie";
import { styled } from "@mui/material/styles";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import useInput from "../../components/hooks/useInput";
import "../../assets/css/header_aside.css";
import Swal from "sweetalert2";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { ThemeContext } from "../../assets/js/ThemeContext";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import LanguageIcon from "@mui/icons-material/Language";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  Paper,
  CircularProgress,
} from "@mui/material";
// importaciones de temas
import { themeColors } from "../../style/ThemeColors.js";
import { useTranslations } from "../hooks/useTranslations.jsx";

const HeaderLT1 = () => {
  const {
    accessToken,
    userId,
    languageUser,
    setLanguageUser,
    userType,
  } = useContext(UserContext);
  const { logout: authLogout } = useAuth();
  const { t } = useTranslations();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkinfo();
    t;
  },[]);

  const [userLanguage, setUserLanguaje] = useState({ language: "" });
  const [userInfo, setUserInfo] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    email: "",
    password: "",
    language: "",
  });
  const [modal, setModal] = useState(false);

  const openModal = () => {
    getInfo();
    setModal(true);
  };
  const closeModal = () => {
    setModal(false);
  };
  const lastName = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });
  const firstName = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });
  const middleName = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });
  const email = useInput({
    defaultValue: "",
    validate: /^[^\s@]+@[^\s@]+\.[^\s@]*$/,
  });
  const language = useInput({
    defaultValue: languageUser,
    validate: /^(es|en|it|pt)$/,
  });

  const password = useInput({
    defaultValue: "",
    validate:
      /^(?=.[A-Z])(?=.[a-z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%?&]{8,15}$/,
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const nav = useNavigate();
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const logout = async () => {
    try {
      console.log("[HeaderLT1] Iniciando logout...");

      // Usar el logout del AuthContext que maneja MSAL y tokenService
      await authLogout();

      // Limpieza adicional de cookies específicas
      Cookies.remove("userId");
      Cookies.remove("userType");
      Cookies.remove("accessToken");
      Cookies.remove("clients");
      Cookies.remove("token");
      Cookies.remove("refreshToken");
      Cookies.remove("sessionId");
      Cookies.remove("authToken");
      Cookies.remove("userToken");
      Cookies.remove("loginToken");

      // Limpiamos todas las cookies del dominio como respaldo
      const allCookies = document.cookie.split(";");
      allCookies.forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name =
          eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        if (name) {
          Cookies.remove(name);
        }
      });

      // Limpieza adicional de localStorage
      localStorage.clear();
      sessionStorage.clear();

      console.log("[HeaderLT1] Logout completado, redirigiendo...");

      // Redirigimos al usuario a la página de login
      nav("/");
    } catch (error) {
      console.error("[HeaderLT1] Error al cerrar sesión:", error);

      // Limpieza de emergencia en caso de error
      localStorage.clear();
      sessionStorage.clear();
      Cookies.remove("userId");
      Cookies.remove("userType");
      Cookies.remove("accessToken");

      // Redirigir al usuario de todas formas
      nav("/");
    }
  };

  const config = { withCredentials: true };

  const themeContext = useContext(ThemeContext);
  const { theme, toggleTheme } =
    themeContext || { theme: "light", toggleTheme: () => {} };

  const checkinfo = async () => {
    try {
      const response = await apiClient.get(`/users/${userId}`, config);
      setUserInfo(response.data.data);
      setLanguageUser(response.data.data.language);
    } catch (error) {
      console.error(error);
    }
  };
  const url = "/users/";

  const getInfo = async () => {
    try {
      const response = await apiClient.get(`${url}${userId}`, config);
      setUserInfo(response.data.data);
      console.log(hours, ":", minutes, ":", seconds);
      firstName.handleChange(userInfo.firstname || "");
      middleName.handleChange(userInfo.middlename || "");
      lastName.handleChange(userInfo.lastname || "");
      email.handleChange(userInfo.email || "");
      language.handleChange(userInfo.language || "es");
      password.handleChange("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserLanguaje((prevUserInfo) => ({
      ...prevUserInfo,
      [name]: value,
    }));
  };

  const updateInfo = async (event) => {
    event.preventDefault();
    let parameters;

    if (password.input.trim() !== "") {
      if (password.input !== confirmPassword) {
        setConfirmError("");
        Swal.fire({
          icon: "error",
          title: "Contraseñas no coinciden",
          text: "La contraseña y su confirmación deben ser iguales.",
        });
        return;
      }
    }

    try {
      parameters = {
        firstname: firstName.input,
        middlename: middleName.input,
        lastname: lastName.input,
        email: email.input,
        language: userLanguage.language,
        last_visit_date: "",
      };

      if (password.input.trim() !== "") {
        parameters["password"] = password.input;
      }

      const response = await apiClient.put(
        `${url}${userId}`,
        parameters,
        config
      );

      if (response.data.status) {
        Toast.fire({
          icon: "success",
          title: "Perfil actualizado correctamente",
        }),
          setTimeout(() => {
            window.location.reload();
          }, 1000);
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: "Ocurrió un problema al guardar los cambios.",
      });
    }
  };

  function stringAvatar(name) {
    return {
      sx: {
        background:
          "linear-gradient(129deg, rgba(199, 14, 143, 1) 37%, rgba(95, 9, 121, 1) 69%)",
        WebkitTextFillColor: "white",
        fontSize: "20px",
        cursor: "pointer",
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  }

  // 🔥 Switch ORIGINAL con íconos sol/luna restaurado
  const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    "& .MuiSwitch-switchBase": {
      margin: 1,
      padding: 0,
      transform: "translateX(6px)",
      "&.Mui-checked": {
        color: "#fff",
        transform: "translateX(22px)",
        "& .MuiSwitch-thumb:before": {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
            "#fff"
          )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
        },
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor: "#eee",
          ...theme.applyStyles("dark", {
            backgroundColor: "#8796A5",
          }),
        },
      },
    },
    "& .MuiSwitch-thumb": {
      background:
        "linear-gradient(129deg, rgba(199, 14, 143, 1) 37%, rgba(95, 9, 121, 1) 69%)",
      width: 32,
      height: 32,
      "&::before": {
        content: "''",
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
    },
    "& .MuiSwitch-track": {
      opacity: 1,
      backgroundColor: "#aab4be",
      borderRadius: 20 / 2,
      ...theme.applyStyles("dark", {
        backgroundColor: "#8796A5",
      }),
    },
  }));

  const location = useLocation();
  const getButtonColor = (path) => {
    return location.pathname === path
      ? "rgb(199, 14, 143)"
      : theme === "dark"
      ? "#fff"
      : "#000";
  };

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLanguageClick = (event) => setLanguageAnchorEl(event.currentTarget);
  const handleLanguageClose = () => setLanguageAnchorEl(null);

  const handleLanguageChange = async (lang) => {
    i18n.changeLanguage(lang);
    setLanguageUser(lang);
    try {
      await apiClient.patch(`/language/${userId}`, { language: lang }, config);
    } catch (error) {
      console.error("Error al actualizar el idioma:", error);
    }
    handleLanguageClose();
  };

  // Componente personalizado para el separador vertical
  const VerticalDivider = styled(Box)(({ theme }) => ({
    width: "1px",
    height: "24px",
    margin: "0 16px",
  }));

  // Implementación de loading con spinner
  const handleRedirect = () => {
    setLoading(true);
    setTimeout(() => {
      nav("/satisfaction");
    }, 300);
  };

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          // 🔧 Gris más oscuro en modo oscuro
          backgroundColor: theme === "dark" ? "rgba(39, 38, 38, 0.04)" : "#fff",
          backdropFilter: theme === "dark" ? "saturate(180%) blur(8px)" : "none",
          backgroundImage: "none",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            backgroundColor: "transparent",
            px: { xs: 1, md: 2 },
            py: { xs: 1, md: 1 },
            width: "100%",
            mx: 0,
          }}
        >
          <AppBar
            position="static"
            elevation={0}
            sx={{
              borderRadius: "25px",
              border: "2px solid rgb(199, 14, 143)",
              backgroundColor:
                theme === "dark" ? "rgba(255, 255, 255, 0.04)" : "#fff",
              backdropFilter: theme === "dark" ? "saturate(180%) blur(8px)" : "none",
              backgroundImage: "none",
            }}
          >
            <Toolbar
              sx={{ justifyContent: "space-between", px: { xs: 1.5, md: 2 } }}
            >
              {/* Lado izquierdo - Logo y menú móvil */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {/* Botón menú (solo móvil) - CONDICIONAL PARA AGENTES */}
                {userType != 4 &&
                  userType != "4" && ( // ✅ Solo mostrar menú hamburguesa si NO es agente
                    <IconButton
                      onClick={() => setIsDrawerOpen(true)}
                      sx={{
                        display: { xs: "inline-flex", md: "none" },
                        mr: 0.5,
                      }}
                      aria-label="abrir menú"
                      disableRipple
                    >
                      <MenuIcon
                        sx={{ color: theme === "dark" ? "#fff" : "#000" }}
                      />
                    </IconButton>
                  )}
                {/* Logo */}
                <Box
                  component="img"
                  src={Logo}
                  alt="Logo"
                  sx={{
                    width: { xs: "48px", sm: "56px", md: "63px" },
                    cursor: "pointer",
                  }}
                  onClick={() => nav("/admin")}
                />
              </Box>

              {/* Centro */}
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  flexGrow: 1,
                  justifyContent: "center",
                  gap: { md: 6, lg: 10 },
                }}
              >
                <MUIButton
                  variant="text"
                  sx={{
                    fontSize: { md: "90%", lg: "95%" },
                    color: getButtonColor("/admin"),
                    "&:hover": {
                      color: "rgb(199, 14, 143)",
                    },
                    fontWeight: "bold",
                  }}
                  onClick={() => nav("/admin")}
                  disableRipple
                  startIcon={
                    <HomeIcon
                      sx={{
                        fontSize: {
                          md: "115% !important",
                          lg: "120% !important",
                        },
                      }}
                    />
                  }
                >
                  {t("header.Home")}
                </MUIButton>

                {/* ✅ Solo mostrar "Mi Perfil" si ES agente */}
                {(userType == 4 || userType == "4") && (
                  <>
                    <VerticalDivider theme={theme} />

                    <MUIButton
                      variant="text"
                      sx={{
                        fontSize: { md: "90%", lg: "95%" },
                        color: getButtonColor("/mi-perfil"),
                        "&:hover": {
                          color: "rgb(199, 14, 143)",
                        },
                        fontWeight: "bold",
                      }}
                      onClick={() => nav("/mi-perfil")}
                      disableRipple
                      startIcon={
                        <AccountCircleIcon
                          sx={{
                            fontSize: {
                              md: "115% !important",
                              lg: "120% !important",
                            },
                          }}
                        />
                      }
                    >
                      Mi Perfil
                    </MUIButton>
                  </>
                )}

                {/* ✅ Solo mostrar botones adicionales si NO es agente */}
                {userType != 4 && userType != "4" && (
                  <>
                    <VerticalDivider theme={theme} />

                    <MUIButton
                      variant="text"
                      sx={{
                        fontSize: { md: "90%", lg: "95%" },
                        color: getButtonColor("/admin_list"),
                        "&:hover": {
                          color: "rgb(199, 14, 143)",
                        },
                        fontWeight: "bold",
                      }}
                      onClick={() => nav("/admin_list")}
                      disableRipple
                      startIcon={
                        <PersonIcon
                          sx={{
                            fontSize: {
                              md: "115% !important",
                              lg: "120% !important",
                            },
                          }}
                        />
                      }
                    >
                      {t("header.Users")}
                    </MUIButton>

                    <VerticalDivider theme={theme} />

                    <MUIButton
                      variant="text"
                      sx={{
                        fontSize: { md: "90%", lg: "95%" },
                        color: getButtonColor("/client_list"),
                        "&:hover": {
                          color: "rgb(199, 14, 143)",
                        },
                        fontWeight: "bold",
                      }}
                      onClick={() => nav("/client_list")}
                      disableRipple
                      startIcon={
                        <AssignmentIndIcon
                          sx={{
                            fontSize: {
                              md: "115% !important",
                              lg: "120% !important",
                            },
                          }}
                        />
                      }
                    >
                      {t("header.Clients")}
                    </MUIButton>
                  </>
                )}
              </Box>

              {/* Lado derecho - Controles */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 1, md: 2 },
                }}
              >
                {/* Selector de idioma */}
                <Tooltip title="Cambiar idioma" placement="top">
                  <IconButton
                    aria-controls="language-menu"
                    aria-haspopup="true"
                    onClick={handleLanguageClick}
                    disableRipple
                    sx={{
                      color: "inherit",
                      "&:hover": {
                        background: "transparent",
                      },
                    }}
                  >
                    <LanguageIcon
                      sx={{
                        fontSize: { xs: "1.6rem", md: "2rem" },
                        fill: "url(#gradient-text)",
                      }}
                    />
                    <svg width="0" height="0">
                      <defs>
                        <linearGradient
                          id="gradient-text"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="1"
                        >
                          <stop offset="37%" stopColor="rgba(199,14,143,1)" />
                          <stop offset="69%" stopColor="rgba(95,9,121,1)" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </IconButton>
                </Tooltip>

                {/* Menú de idiomas */}
                <Menu
                  id="language-menu"
                  anchorEl={languageAnchorEl}
                  open={Boolean(languageAnchorEl)}
                  onClose={handleLanguageClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 150,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      borderRadius: "8px",
                    },
                  }}
                >
                  <MenuItem onClick={() => handleLanguageChange("es")}>
                    <span className="flag-icon flag-icon-es me-2"></span>
                    Español
                  </MenuItem>
                  <MenuItem onClick={() => handleLanguageChange("en")}>
                    <span className="flag-icon flag-icon-us me-2"></span>
                    Inglés
                  </MenuItem>
                  <MenuItem onClick={() => handleLanguageChange("it")}>
                    <span className="flag-icon flag-icon-it me-2"></span>
                    Italiano
                  </MenuItem>
                  <MenuItem onClick={() => handleLanguageChange("pt")}>
                    <span className="flag-icon flag-icon-pt me-2"></span>
                    Portugués
                  </MenuItem>
                </Menu>

                {/* Switch de modo oscuro */}
                <Tooltip title="Cambiar a modo oscuro" placement="top">
                  <FormControlLabel
                    control={
                      <MaterialUISwitch
                        checked={theme === "dark"}
                        onChange={toggleTheme}
                      />
                    }
                    label=""
                  />
                </Tooltip>

                {/* Avatar del usuario */}
                <Avatar
                  {...stringAvatar(
                    `${userInfo.firstname} ${userInfo.lastname}`
                  )}
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                />

                {/* Menú del avatar */}
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      logout();
                    }}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "error.main",
                      "&:hover": {
                        backgroundColor: "error.light",
                        color: "error.contrastText",
                      },
                    }}
                  >
                    <LogoutIcon sx={{ fontSize: "1.2rem" }} />
                    {t("headerlt.Logout")}
                  </MenuItem>
                </Menu>
              </Box>
            </Toolbar>
          </AppBar>

          {/* ✅ Drawer de navegación para móviles - CONDICIONAL PARA AGENTES */}
          {userType != 4 && userType != "4" && (
            <Drawer
              anchor="left"
              open={isDrawerOpen}
              onClose={() => setIsDrawerOpen(false)}
              ModalProps={{ keepMounted: true }}
              PaperProps={{ sx: { width: 260 } }}
            >
              <Box role="presentation" sx={{ mt: 1 }}>
                <List>
                  <ListItem
                    button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      nav("/admin");
                    }}
                  >
                    <ListItemIcon>
                      <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary={t("header.Home")} />
                  </ListItem>
                  {/* ✅ Solo mostrar "Mi Perfil" en el drawer si ES agente */}
                  {(userType == 4 || userType == "4") && (
                    <ListItem
                      button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        nav("/mi-perfil");
                      }}
                    >
                      <ListItemIcon>
                        <AccountCircleIcon />
                      </ListItemIcon>
                      <ListItemText primary="Mi Perfil" />
                    </ListItem>
                  )}
                  {/*/ Mostrar solo para editor - visusalizador */}
                  <>
                    {(userType == 3 || userType == "3") && (
                      <ListItem
                        button
                        onClick={handleRedirect}
                        disabled={loading}
                      >
                        <ListItemIcon>
                          {loading ? (
                            <CircularProgress size={24} /> // spinner dentro del icono
                          ) : (
                            <AccountCircleIcon />
                          )}
                        </ListItemIcon>
                        <ListItemText primary="Satisfaction" />
                      </ListItem>
                    )}
                  </>
                  <ListItem
                    button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      nav("/admin_list");
                    }}
                  >
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText primary={t("header.Users")} />
                  </ListItem>
                  <ListItem
                    button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      nav("/client_list");
                    }}
                  >
                    <ListItemIcon>
                      <AssignmentIndIcon />
                    </ListItemIcon>
                    <ListItemText primary={t("header.Clients")} />
                  </ListItem>
                </List>
                <Divider />
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={t("headerlt.Settings") || "Ajustes"}
                    />
                  </ListItem>
                </List>
              </Box>
            </Drawer>
          )}
        </Paper>
      </Box>
      <Box sx={{ height: { xs: 80, md: 96 } }} />
    </>
  );
};

export default HeaderLT1;
