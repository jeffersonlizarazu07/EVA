import Logo from "../../assets/img/logo EVA.webp";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { toggleBlackMode } from "../../assets/js/toggleBlackMode";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { Modal, ModalBody, ModalHeader, Button, ModalFooter } from "reactstrap";
import { useTranslation } from "react-i18next";
import { Toast, smallAlertDelete } from "../../assets/js/alertConfig";
import Avatar from "@mui/material/Avatar";
import { Button as MUIButton } from "@mui/material";
import Cookies from 'js-cookie';
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
import { ThemeContext } from '../../assets/js/ThemeContext';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import LanguageIcon from '@mui/icons-material/Language';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
// Importaciones de Material UI para el layout
import {
  AppBar,
  Toolbar,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  Paper
} from "@mui/material";

// importaciones de temas

import { themeColors } from '../../style/ThemeColors.js'

const HeaderLT1 = () => {
  const { accessToken, userId, languageUser, setLanguageUser } =
    useContext(UserContext);
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [languageAnchorEl, setLanguageAnchorEl] = useState(null);

  useEffect(() => {
    checkinfo();
    i18n.changeLanguage(languageUser);
  }, [languageUser]);

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
  const language = useInput({ defaultValue: languageUser, validate: /^(es|en|it|pt)$/ });

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
      await axios.post('http://localhost:3000/api/logout', {}, {
        withCredentials: true,
      });
      Cookies.remove("userId");
      Cookies.remove("userType");
      Cookies.remove("accessToken");
      Cookies.remove("clients");

      localStorage.removeItem("languageUser");
      nav("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const config = {
    withCredentials: true,
  };

  const { theme, toggleTheme } = useContext(ThemeContext);

  const checkinfo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/users/${userId}`,
        config
      );
      setUserInfo(response.data.data);
      setLanguageUser(response.data.data.language);
    } catch (error) {
      console.error(error);
    }
  };
  const url = "http://localhost:3000/api/users/";

  const getInfo = async () => {
    try {
      const response = await axios.get(`${url}${userId}`, config);
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

      const response = await axios.put(`${url}${userId}`, parameters, config);

      if (response.data.status) {
        Toast.fire({
          icon: "success",
          title: "Perfil actualizado correctamente",
        }), setTimeout(() => {
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
      ...theme.applyStyles("dark", {
        backgroundColor: "#003892",
      }),
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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const location = useLocation();

  const getButtonColor = (path) => {
    return location.pathname === path ? 'rgb(199, 14, 143)' : (theme === 'dark' ? '#fff' : '#000');
  };

  const handleLanguageClick = (event) => {
    setLanguageAnchorEl(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setLanguageAnchorEl(null);
  };

  const handleLanguageChange = async (lang) => {
    language.handleChange(lang);
    i18n.changeLanguage(lang);
    setLanguageUser(lang);
    const parameters = { language: lang };
    try {
      await axios.patch(`http://localhost:3000/api/language/${userId}`, parameters, config);
    } catch (error) {
      console.error("Error al actualizar el idioma:", error);
    }
    handleLanguageClose();
  };


  // Componente personalizado para el separador vertical 
  const VerticalDivider = styled(Box)(({ theme }) => ({
    width: '1px',
    height: '24px',
    //backgroundColor: theme === 'dark' ? themeColors.light.Box.backgroundColor :  themeColors.dark.Box.backgroundColor,
    margin: '0 16px',
  }));



  return (
    <Box sx={{ mt: "100px", px: 3 }}>
      <Box
        sx={{
          position: "fixed",           // ✅ fijo en pantalla
          top: 8,
          left: 0,
          right: 0,
          zIndex: 9999,                // ✅ sobre todo lo demás
          backgroundColor: "#fff",
        }}
      >

        <Paper
          elevation={2}
          sx={{
            mt: 0, // ✅ sin margen superior
            mx: 2,
            mb: 3,
            borderRadius: "25px",
            border: "2px solid rgb(199, 14, 143)",
            backgroundColor: theme === "dark" ? "rgb(33, 37, 41)" : "#fff",
          }}
        >


          <AppBar
            position="static"

            elevation={0}
            sx={{
              backgroundColor: 'transparent',
              borderRadius: '25px',
              color: theme === 'dark' ? '#fff' : '#000',
            }}
          >
            <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
              {/* Lado izquierdo - Logo y menú móvil */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {/* Logo */}
                <Box
                  component="img"
                  src={Logo}
                  alt="Logo"
                  sx={{
                    width: '63px',
                    cursor: 'pointer',
                  }}
                  onClick={() => nav("/admin")}
                />
              </Box>

              {/* Navegación  */}
              <Box sx={{
                display: { xs: 'flex', lg: 'flex' },
                alignItems: 'center',
                flexGrow: 1,
                justifyContent: 'center',
                gap: 15
              }}>
                <MUIButton
                  variant="text"
                  sx={{
                    fontSize: '95%',
                    color: getButtonColor("/admin"),
                    "&:hover": {
                      color: "rgb(199, 14, 143)",
                    },
                    fontWeight: 'bold',
                  }}
                  onClick={() => nav("/admin")}
                  disableRipple
                  startIcon={<HomeIcon sx={{ fontSize: '120% !important' }} />}
                >
                  {t("header.Home")}
                </MUIButton>

                <VerticalDivider theme={theme} />

                <MUIButton
                  variant="text"
                  sx={{
                    fontSize: '95%',
                    color: getButtonColor("/admin_list"),
                    "&:hover": {
                      color: "rgb(199, 14, 143)",
                    },
                    fontWeight: 'bold',
                  }}
                  onClick={() => nav("/admin_list")}
                  disableRipple
                  startIcon={<PersonIcon sx={{ fontSize: '120% !important' }} />}
                >
                  {t("header.Users")}
                </MUIButton>

                <VerticalDivider theme={theme} />

                <MUIButton
                  variant="text"
                  sx={{
                    fontSize: '95%',
                    color: getButtonColor("/client_list"),
                    "&:hover": {
                      color: "rgb(199, 14, 143)",
                    },
                    fontWeight: 'bold',
                  }}
                  onClick={() => nav("/client_list")}
                  disableRipple
                  startIcon={<AssignmentIndIcon sx={{ fontSize: '120% !important' }} />}
                >
                  {t("header.Clients")}
                </MUIButton>
              </Box>

              {/* Lado derecho - Controles */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* Selector de idioma */}
                <Tooltip title="Cambiar idioma" placement="top">
                  <IconButton
                    aria-controls="language-menu"
                    aria-haspopup="true"
                    onClick={handleLanguageClick}
                    disableRipple
                    sx={{
                      color: 'inherit',
                      '&:hover': {
                        background: 'transparent',
                      }
                    }}
                  >
                    <LanguageIcon sx={{
                      fontSize: '2rem',
                      fill: 'url(#gradient-text)',
                    }} />
                    <svg width="0" height="0">
                      <defs>
                        <linearGradient id="gradient-text" x1="0" y1="0" x2="1" y2="1">
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
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
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
                        checked={theme === 'dark'}
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
    </Box>
  );
};

export default HeaderLT1;