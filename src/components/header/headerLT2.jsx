import Logo from "../../assets/img/logo EVA.webp";
import { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { useTranslation } from "react-i18next";
import Avatar from "@mui/material/Avatar";
import { Button as MUIButton } from "@mui/material";
import Cookies from "js-cookie";
import { styled } from "@mui/material/styles";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import "../../assets/css/header_aside.css";
import Swal from "sweetalert2";
import HomeIcon from "@mui/icons-material/Home";
import { ThemeContext } from "../../assets/js/ThemeContext";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import LanguageIcon from "@mui/icons-material/Language";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Paper,
} from "@mui/material";

const HeaderLT2 = () => {
  const { accessToken, userId, languageUser, setLanguageUser, userType } =
    useContext(UserContext);
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
  const [userInfo, setUserInfo] = useState({
    firstname: "",
    lastname: "",
  });

  const nav = useNavigate();

  useEffect(() => {
    checkinfo();
    i18n.changeLanguage(languageUser);
  }, [languageUser]);

  const logout = async () => {
    try {
      // Obtener el token del localStorage o cookies
      const token = localStorage.getItem('authToken') || Cookies.get('token');
      
      const response = await fetch("http://localhost:3000/api/logout", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: "include",
      });
      
      // Limpiar datos locales independientemente de la respuesta del servidor
      Cookies.remove("userId");
      Cookies.remove("userType");
      Cookies.remove("accessToken");
      Cookies.remove("clients");
      Cookies.remove("token");
      localStorage.removeItem("languageUser");
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      
      nav("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // Limpiar datos locales incluso si hay error
      Cookies.remove("userId");
      Cookies.remove("userType");
      Cookies.remove("accessToken");
      Cookies.remove("clients");
      Cookies.remove("token");
      localStorage.removeItem("languageUser");
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      nav("/");
    }
  };

  const themeContext = useContext(ThemeContext);
  const { theme, toggleTheme } = themeContext || { theme: 'light', toggleTheme: () => {} };

  const checkinfo = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
        credentials: "include",
      });
      const data = await response.json();
      setUserInfo(data.data);
      setLanguageUser(data.data.language);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLanguageChange = async (lang) => {
    i18n.changeLanguage(lang);
    setLanguageUser(lang);
    const parameters = { language: lang };
    try {
      await fetch(`http://localhost:3000/api/language/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(parameters),
      });
    } catch (error) {
      console.error("Error al actualizar el idioma:", error);
    }
    handleLanguageClose();
  };

  function stringAvatar(name) {
    const names = name.split(" ");
    const initials = names.length >= 2 ? `${names[0][0]}${names[1][0]}` : names[0][0];
    return {
      sx: {
        background: "linear-gradient(129deg, rgba(199, 14, 143, 1) 37%, rgba(95, 9, 121, 1) 69%)",
        WebkitTextFillColor: "white",
        fontSize: "20px",
        cursor: "pointer",
      },
      children: initials,
    };
  }

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
        },
      },
    },
    "& .MuiSwitch-thumb": {
      background: "linear-gradient(129deg, rgba(199, 14, 143, 1) 37%, rgba(95, 9, 121, 1) 69%)",
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
    },
  }));

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const location = useLocation();

  const getButtonColor = (path) => {
    return location.pathname === path
      ? "rgb(199, 14, 143)"
      : theme === "dark"
      ? "#fff"
      : "#000";
  };

  const handleLanguageClick = (event) => {
    setLanguageAnchorEl(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setLanguageAnchorEl(null);
  };

  return (
    <>
      <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1100, width: '100%', backgroundColor: theme === 'dark' ? 'rgb(33, 37, 41)' : '#fff' }}>
        <Paper
          elevation={2}
          sx={{
            margin: 2,
            marginBottom: 3,
            borderRadius: "25px",
            border: "2px solid rgb(199, 14, 143)",
            backgroundColor: theme === "dark" ? "rgb(33, 37, 41)" : "white",
          }}
        >
          <AppBar
            position="static"
            elevation={0}
            sx={{
              backgroundColor: "transparent",
              borderRadius: "25px",
              color: theme === "dark" ? "#fff" : "#000",
            }}
          >
            <Toolbar sx={{ justifyContent: "space-between", px: 2 }}>
              {/* Lado izquierdo - Logo */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  component="img"
                  src={Logo}
                  alt="Logo"
                  sx={{
                    width: "63px",
                    cursor: "pointer",
                  }}
                  onClick={() => nav("/admin")}
                />
              </Box>

              {/* ✅ SOLO MOSTRAR "INICIO" PARA TODOS - HEADER SIMPLE */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexGrow: 1,
                  justifyContent: "center",
                  gap: 15,
                }}
              >
                <MUIButton
                  variant="text"
                  sx={{
                    fontSize: "95%",
                    color: getButtonColor("/admin"),
                    "&:hover": {
                      color: "rgb(199, 14, 143)",
                    },
                    fontWeight: "bold",
                  }}
                  onClick={() => nav("/admin")}
                  disableRipple
                  startIcon={<HomeIcon sx={{ fontSize: "120% !important" }} />}
                >
                  {t("header.Home")}
                </MUIButton>
              </Box>

              {/* Lado derecho - Controles */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                        fontSize: "2rem",
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
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
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
                  {...stringAvatar(`${userInfo.firstname} ${userInfo.lastname}`)}
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
                  >
                    {t("headerlt.Logout")}
                  </MenuItem>
                </Menu>
              </Box>
            </Toolbar>
          </AppBar>
        </Paper>
      </Box>
      {/* Espaciador para evitar que el contenido quede debajo del header fijo */}
      <Box sx={{ height: 96 }} />
    </>
  );
};

export default HeaderLT2;