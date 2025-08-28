import Logo from "../../assets/img/logo EVA.webp";
import { apiClient } from "../../utils/axiosConfig";
import { useContext, useState, useEffect } from "react";
import { toggleBlackMode } from "../../assets/js/toggleBlackMode";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { Toast } from "../../assets/js/alertConfig";
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
  Paper,
} from "@mui/material";

const HeaderLT1 = () => {
  const { userId, languageUser, setLanguageUser, userType } =
    useContext(UserContext);

  const { logout: authLogout } = useAuth();
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    checkinfo();
    i18n.changeLanguage(languageUser);
  }, [languageUser]);

  const [userInfo, setUserInfo] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    email: "",
    password: "",
    language: "",
  });

  const nav = useNavigate();

  const logout = async () => {
    try {
      await authLogout();
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
      localStorage.clear();
      sessionStorage.clear();
      nav("/");
    } catch (error) {
      console.error("[HeaderLT1] Error al cerrar sesión:", error);
      localStorage.clear();
      sessionStorage.clear();
      Cookies.remove("userId");
      Cookies.remove("userType");
      Cookies.remove("accessToken");
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
            <Toolbar sx={{ justifyContent: "space-between" }}>
              {/* Izquierda - Logo */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {userType != 4 && (
                  <IconButton
                    onClick={() => setIsDrawerOpen(true)}
                    sx={{ display: { xs: "inline-flex", md: "none" } }}
                    disableRipple
                  >
                    <MenuIcon sx={{ color: theme === "dark" ? "#fff" : "#000" }} />
                  </IconButton>
                )}
                <Box
                  component="img"
                  src={Logo}
                  alt="Logo"
                  sx={{ width: { xs: "48px", sm: "56px", md: "63px" }, cursor: "pointer" }}
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
                  sx={{ color: getButtonColor("/admin"), fontWeight: "bold" }}
                  onClick={() => nav("/admin")}
                  disableRipple
                  startIcon={<HomeIcon />}
                >
                  {t("header.Home")}
                </MUIButton>

                {userType != 4 && (
                  <>
                    <MUIButton
                      variant="text"
                      sx={{ color: getButtonColor("/admin_list"), fontWeight: "bold" }}
                      onClick={() => nav("/admin_list")}
                      disableRipple
                      startIcon={<PersonIcon />}
                    >
                      {t("header.Users")}
                    </MUIButton>
                    <MUIButton
                      variant="text"
                      sx={{ color: getButtonColor("/client_list"), fontWeight: "bold" }}
                      onClick={() => nav("/client_list")}
                      disableRipple
                      startIcon={<AssignmentIndIcon />}
                    >
                      {t("header.Clients")}
                    </MUIButton>
                  </>
                )}
              </Box>

              {/* Derecha */}
              <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, md: 2 } }}>
                <Tooltip title="Cambiar idioma">
                  <IconButton onClick={handleLanguageClick} disableRipple>
                    <LanguageIcon />
                  </IconButton>
                </Tooltip>
                <Menu
                  id="language-menu"
                  anchorEl={languageAnchorEl}
                  open={Boolean(languageAnchorEl)}
                  onClose={handleLanguageClose}
                >
                  <MenuItem onClick={() => handleLanguageChange("es")}>Español</MenuItem>
                  <MenuItem onClick={() => handleLanguageChange("en")}>Inglés</MenuItem>
                  <MenuItem onClick={() => handleLanguageChange("it")}>Italiano</MenuItem>
                  <MenuItem onClick={() => handleLanguageChange("pt")}>Portugués</MenuItem>
                </Menu>

                <Tooltip title="Cambiar modo">
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

                <Avatar
                  {...stringAvatar(`${userInfo.firstname} ${userInfo.lastname}`)}
                  onClick={handleClick}
                />
                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                  <MenuItem onClick={logout}>
                    <LogoutIcon fontSize="small" /> {t("headerlt.Logout")}
                  </MenuItem>
                </Menu>
              </Box>
            </Toolbar>
          </AppBar>
        </Paper>
      </Box>
      <Box sx={{ height: { xs: 80, md: 96 } }} />
    </>
  );
};

export default HeaderLT1;
