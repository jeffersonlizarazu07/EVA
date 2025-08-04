import Logo from "../../assets/img/logo EVA.webp";
import "../../assets/css/header_aside.css";
import { toggleBlackMode } from "../../assets/js/toggleBlackMode";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Collapse,
  Tooltip,
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness2Icon from "@mui/icons-material/Brightness2";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import CircleIcon from "@mui/icons-material/Circle";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import { useTranslation } from "react-i18next";
import useInput from "../../components/hooks/useInput";
const HeaderLT2 = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  // const [userInfo, SetUserInfo] = useState([]);
  const [blackMode, setBlackMode] = useState(false);
  const { userInfo, accessToken, userId, setLanguageUser, languageUser } =
    useContext(UserContext);
  const { t, i18n } = useTranslation();
  const nav = useNavigate();
  useEffect(() => {
    checkinfo();
  }, []);

  useEffect(() => {
    if (languageUser) {
      i18n.changeLanguage(languageUser);
    }
  }, [languageUser]);

  const language = useInput({
    defaultValue: languageUser,
    validate: /^(es|en|it|pt)$/,
  });

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/logout",
        {},
        {
          withCredentials: true,
        }
      );
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

  const checkinfo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/users/${userId}`,
        config
      );
      // SetUserInfo(response.data);
      setLanguageUser(response.data.language);
    } catch (error) {
      console.error(error);
    }
  };

  const blackModeActive = () => {
    const newMode = !blackMode;
    setBlackMode(newMode);
    const theme = newMode ? "oscuro" : "claro";
    toggleBlackMode(theme);
    localStorage.setItem("blackMode", theme);
  };

  useEffect(() => {
    const storedMode = localStorage.getItem("blackMode");
    if (storedMode === "oscuro") {
      setBlackMode(true);
      toggleBlackMode("oscuro");
    }
  }, []);

  const handleMenuToggle = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageClose = () => {
    setLanguageAnchorEl(null);
  };

  const handleLanguageClick = (event) => {
    setLanguageAnchorEl(event.currentTarget);
  };

  const handleLanguageChange = async (lang) => {
    language.handleChange(lang);
    i18n.changeLanguage(lang);
    setLanguageUser(lang);
    const parameters = { language: lang };
    try {
      await axios.patch(
        `http://localhost:3000/api/language/${userId}`,
        parameters,
        config
      );
    } catch (error) {
      console.error("Error al actualizar el idioma:", error);
    }
    handleLanguageClose();
  };

  return (
    <header className="sticky-top">
      <nav className="navbar navbar-expand-lg m-2 mb-3" id="nav-Claro">
        <Box className="container-fluid">
          <Box className="row w-100">
            <Box className="col-4 col-md-6 col-lg-6 d-flex text-center align-items-center">
              <button
                className="d-lg-none d-block bg-transparent"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <i id="icono" className="fa-solid fa-bars"></i>
              </button>
              <a className="" href="./index">
                <img id="logo" src={Logo} alt="" />
              </a>
            </Box>
            <Box className="col-8 col-md-6 col-lg-6 d-flex align-items-center justify-content-end">
              <i
                id="icono"
                className="fa-regular fa-moon me-2 luna"
                onClick={toggleBlackMode}
              ></i>
              {/* [//? Modo oscuro] */}
              <Box className="vr fw-bold ms-2 me-2"></Box>
              <i id="iconoDegradado" className="fa-solid fa-circle me-2"></i>
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
              <span className="ps-2 align-items-center">
                <p id="nombreUsuario" className="fw-bold m-0"></p>
                {`${userInfo.firstname} ${userInfo.middlename} ${userInfo.lastname}`}
              </span>
            </Box>
            <Box
              className="col-1 col-md-1 col-lg-1 d-lg-none collapse  navbar-collapse"
              id="navbarNav"
              style={{ border: "none" }}
            >
              <Box id="div_ul" className="d-lg-none mt-3">
                <ul className="p-2 mt-4">
                  <li className="nav-item">
                    <a className="nav-link tooltip-container" href="/index">
                      <i id="iconoDegradado" className="fa-solid fa-house"></i>
                    </a>
                  </li>
                  <br />
                  <li className="nav-item dropdown">
                    <a
                      className="dropdown-toggle nav-link link-dark"
                      id="dropdownMenuButton"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i id="iconoDegradado" className="fa-solid fa-gear"></i>
                    </a>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton"
                    >
                      <li>
                        <button
                          className=" btn btn-primary dropdown-item"
                          data-bs-toggle="modal"
                          data-bs-target="#modalManageUser"
                        >
                          {t("headerlt.Manage_account")}
                        </button>
                      </li>
                      <li>
                        <button
                          className=" btn btn-primary dropdown-item"
                          onClick={() => logout()}
                        >
                          {t("headerlt.Logout")}
                        </button>
                      </li>
                    </ul>
                  </li>
                </ul>
              </Box>
            </Box>
          </Box>
        </Box>
      </nav>
    </header>
  );
};

export default HeaderLT2;
