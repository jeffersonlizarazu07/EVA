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
        }),setTimeout(() => {
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
        // WebkitBackgroundClip: "text",
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

  const location = useLocation();  // Hook para obtener la URL actual
  
  // Función para determinar el color del botón basado en la URL
  const getButtonColor = (path) => {
    return location.pathname === path ? 'rgb(199, 14, 143)' : '#000';
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
      await axios.put(`${url}${userId}`, parameters, config);
    } catch (error) {
      console.error("Error al actualizar el idioma:", error);
    }
    handleLanguageClose();
  };

  return (
    
    <header className="sticky-top">
      <nav className="navbar navbar-expand-lg m-2 mb-3" id="nav-Claro">
        <div className="container-fluid">
          <div className="row w-100">
            <div className="col-1 col-sm-6 col-md-1 col-lg-1 d-flex justify-content-center align-items-center">
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
              <a className="" href="/admin">
                <img id="logo" src={Logo} alt="" />
              </a>
            </div>
            <div className="col-10 col-md-10 col-lg-10 d-flex align-items-center m-0 p-0 justify-content-around">
              <MUIButton
                variant="text"
                sx={{
                  color: getButtonColor("/admin"),  // Establecer color dinámicamente
                  "&:hover": {
                    color: "rgb(199, 14, 143)",
                  },
                }}
                className="fw-bold h-100 m-0 p-0"
                onClick={() => nav("/admin")}
                disableRipple
              >
                <HomeIcon className="me-1" />
                {t("header.Home")}
              </MUIButton>
              <div className="vr"></div>
              <MUIButton
                variant="text"
                sx={{
                  color: getButtonColor("/admin_list"),  // Establecer color dinámicamente
                  "&:hover": {
                    color: "rgb(199, 14, 143)",
                  },
                }}
                className="fw-bold h-100 m-0 p-0"
                onClick={() => nav("/admin_list")}
                disableRipple
              >
                <PersonIcon className="me-1" />
                {t("header.Users")}
              </MUIButton>
              <div className="vr"></div>
              <MUIButton
                variant="text"
                sx={{
                  color: getButtonColor("/client_list"),  // Establecer color dinámicamente
                  "&:hover": {
                    color: "rgb(199, 14, 143)",
                  },
                }}
                className="fw-bold h-100 m-0 p-0"
                onClick={() => nav("/client_list")}
                disableRipple
              >
                <AssignmentIndIcon className="me-1" />
                {t("header.Clients")}
              </MUIButton>
            </div>
            <div className="col-1 col-sm-6 col-md-1 col-lg-1 d-flex align-items-center justify-content-end">

            {/*selector de idioma */}
            <Tooltip  placement="top">
              <MUIButton 
                aria-controls="language-menu"
                aria-haspopup="true"
                onClick={handleLanguageClick}
                disableRipple 
                sx={{
                  mr: 2,
                  minWidth: 'auto',
                  color: 'inherit',
                  '&:hover': {
                    background: 'transparent',
                  }
                }}
              >
              <LanguageIcon sx={{
                fontSize: '2rem',
                fill: 'url(#gradient-text)',
                }}
              />
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="gradient-text" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="37%" stopColor="rgba(199,14,143,1)" />
                    <stop offset="69%" stopColor="rgba(95,9,121,1)" />
                  </linearGradient>
                </defs>
            </svg> 
            </MUIButton>
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

              <Tooltip title="Cambiar a modo oscuro" placement="top">
                <FormControlLabel
                  control={<MaterialUISwitch
                    checked={theme === 'dark'}
                    onChange={toggleTheme}
                  />
                  }
                  label=""
                />
              </Tooltip>
              {/* [//?Poner modo oscuro] */}
              {/* <div className="vr fw-bold m-1 border border-black border-1" /> */}
              {/* <i id="iconoDegradado" className="fa-solid fa-circle m-2"></i> */}
              <span className="ps-2 align-items-center">
                <Avatar
                  {...stringAvatar(
                    `${userInfo.firstname} ${userInfo.lastname}`
                  )}
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                />
              </span>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                {/* <MenuItem
                  data-bs-toggle="modal"
                  data-bs-target="#userModalInfo2"
                  onClick={() => {
                    openModal(), handleClose();
                  }}
                >
                  Gestionar cuenta
                </MenuItem> */}
                <MenuItem
                  onClick={() => {
                    handleClose(), logout();
                  }}
                >
                  Cerrar sesión
                </MenuItem>
              </Menu>
            </div>
            <div
              className="col-1 col-md-1 col-lg-1 d-lg-none collapse navbar-collapse"
              id="navbarNav"
              style={{ border: "none" }}
            >
              <div id="div_ul" className="d-lg-none mt-3">
                <ul className="p-2 ul-colapse">
                  <li className="nav-item">
                    <a className="nav-link tooltip-container" href="/index">
                      <i id="iconoDegradado" className="fa-solid fa-house"></i>
                    </a>
                  </li>
                  <br />
                  <li className="nav-item">
                    <a className="nav-link tooltip-container" href="admin_list">
                      <i id="iconoDegradado" className="fa-solid fa-user"></i>
                    </a>
                  </li>
                  <br />
                  <li className="nav-item">
                    <a
                      className="nav-link tooltip-container"
                      href="client_list"
                    >
                      <i
                        id="iconoDegradado"
                        className="fa-solid fa-id-card-clip"
                      ></i>
                    </a>
                  </li>
                  <br />
                  <a
                    className="dropdown-toggle nav-link link-dark"
                    id="dropdownMenuButton"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i id="iconoDegradado" className="fa-solid fa-gear"></i>
                  </a>
                  <li className="nav-item dropdown">
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton"
                    >
                      {/* <li>
                        <button
                          className="dropdown-item"
                          data-bs-toggle="modal"
                          data-bs-target="#userModalInfo2"
                          onClick={() => openModal()}
                        >
                          {t("headerlt.Manage_account")}
                        </button>
                      </li> */}
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => logout()}
                        >
                          {t("headerlt.Logout")}
                        </button>
                      </li>
                      {/* [//! Cerrar sesión] */}
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
      {/* <ManageUser data={fakeData}/> */}
      {/* <Modal isOpen={modal} toggle={openModal} centered>
        <ModalHeader toggle={closeModal}>
          {t("headerlt.Manage_account")}
        </ModalHeader>
        <ModalBody>
          <div id="msg"></div>

          <div className="form-group m-2">
            <label htmlFor="firstname" className="form-label">
              {t("headerlt.First_name")}
            </label>
            <input
              type="text"
              name="firstname"
              id="firstname"
              className="form-control"
              placeholder=" "
              value={firstName.input}
              onChange={(e) => firstName.handleChange(e.target.value)}
              required
            />
          </div>

          <div className="form-group m-2">
            <label htmlFor="middlename" className="form-label">
              {t("headerlt.Middle_name")}
            </label>
            <input
              type="text"
              name="middlename"
              id="middlename"
              className="form-control"
              placeholder=" "
              value={middleName.input}
              onChange={(e) => middleName.handleChange(e.target.value)}
            />
          </div>

          <div className="form-group m-2">
            <label htmlFor="lastname" className="form-label">
              {t("headerlt.Last_name")}
            </label>
            <input
              type="text"
              name="lastname"
              id="lastname"
              className="form-control"
              placeholder=" "
              value={lastName.input}
              onChange={(e) => lastName.handleChange(e.target.value)}
              required
            />
          </div>

          <div className="form-group m-2">
            <label htmlFor="email" className="form-label">
              {t("headerlt.Email")}
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="form-control"
              placeholder=" "
              value={email.input}
              onChange={(e) => email.handleChange(e.target.value)}
              required
              autoComplete="off"
            />
          </div>

          <div className="form-group m-2">
            <label htmlFor="password" className="form-label">
              {t("headerlt.Password")}
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="form-control"
              placeholder=" "
              onChange={(e) => password.handleChange(e.target.value)}
            />
            <small>
              <i>
                {t(
                  "headerlt.Leave_this_blank_if_you_dont_want_to_change_the_password"
                )}
              </i>
            </small>
          </div>

          <div className="form-group m-2">
            <label htmlFor="cpass" className="form-label">
              {t("headerlt.Confirm_Password")}
            </label>
            <input
              type="password"
              name="cpass"
              id="cpass"
              className="form-control"
              placeholder=" "
              value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setConfirmError("");
                }}
            />
             {confirmError && (
    <div className="text-danger mt-1" style={{ fontSize: "14px" }}>
      {confirmError}
    </div>
  )}
            <small id="pass_match" data-status=""></small>
          </div>

          <p className="lang m-2" key="titulo26">
            {t("headerlt.Language")}
          </p>
          {/* IDIOMAAAAAAA 
          <div
            className="btn-group flex-wrap m-2"
            role="group"
            aria-label="Basic radio toggle button group"
          >
            <input
              type="radio"
              className="btn-check translate"
              id="es"
              value="es"
              name="language"
              autoComplete="off"
              checked={language.input === "es"}
              onChange={async (e) => {
                language.handleChange(e.target.value);
                i18n.changeLanguage(e.target.value);
                setLanguageUser(e.target.value);
                const parameters = {
                  language: e.target.value,     
                };
            
                try {
                  await axios.put(`${url}${userId}`, parameters, config);
        
                } catch (error) {
                  console.error("Error al actualizar el idioma:", error);
                }
              }}
             
            />
            <label
              className="btn btn-outline-dark lang"
              htmlFor="es"
              key="titulo27"
            >
              {t("headerlt.Spanish")}
            </label>

            <input
              type="radio"
              className="btn-check translate"
              id="en"
              value="en"
              name="language"
              autoComplete="off"
              checked={language.input === "en"}
              onChange={async (e) => {
                language.handleChange(e.target.value);
                i18n.changeLanguage(e.target.value);
                setLanguageUser(e.target.value);
                const parameters = {
                  language: e.target.value,     
                };
            
                try {
                  await axios.put(`${url}${userId}`, parameters, config);
        
                } catch (error) {
                  console.error("Error al actualizar el idioma:", error);
                }
              }}
             
            />
            <label
              className="btn btn-outline-dark lang"
              htmlFor="en"
              key="titulo28"
            >
              {t("headerlt.English")}
            </label>

            <input
              type="radio"
              className="btn-check translate"
              id="it"
              value="it"
              name="language"
              autoComplete="off"
              checked={language.input === "it"}
              onChange={async (e) => {
                language.handleChange(e.target.value);
                i18n.changeLanguage(e.target.value);
                setLanguageUser(e.target.value);
                const parameters = {
                  language: e.target.value,     
                };
            
                try {
                  await axios.put(`${url}${userId}`, parameters, config);
        
                } catch (error) {
                  console.error("Error al actualizar el idioma:", error);
                }
              }}
             
            />
            <label
              className="btn btn-outline-dark lang"
              htmlFor="it"
              key="titulo29"
            >
              {t("headerlt.Italian")}
            </label>

            <input
              type="radio"
              className="btn-check translate"
              id="pt"
              value="pt"
              name="language"
              autoComplete="off"
              checked={language.input === "pt"}
              onChange={async (e) => {
                language.handleChange(e.target.value);
                i18n.changeLanguage(e.target.value);
                setLanguageUser(e.target.value);
                const parameters = {
                  language: e.target.value,     
                };
            
                try {
                  await axios.put(`${url}${userId}`, parameters, config);
        
                } catch (error) {
                  console.error("Error al actualizar el idioma:", error);
                }
              }}
             
            />
            <label
              className="btn btn-outline-dark lang"
              htmlFor="pt"
              key="titulo30"
            >
              {t("headerlt.Portuguese")}
            </label>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={closeModal}>
            {t("headerlt.Close")}
          </Button>
          <Button color="primary" onClick={updateInfo}>
            {t("headerlt.Save_changes")}
          </Button>
        </ModalFooter>
      </Modal> */}
    </header>
  );
};

export default HeaderLT1;
