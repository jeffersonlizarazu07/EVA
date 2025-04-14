import Logo from "../../assets/img/logo EVA.webp";
import "../../assets/css/header_aside.css"
import { toggleBlackMode } from "../../assets/js/toggleBlackMode";
import { useNavigate } from "react-router-dom";
import { useState,useContext,useEffect} from "react";
import { UserContext } from "../../context/UserContext";
import axios from 'axios'
import { useTranslation } from "react-i18next";
const HeaderLT2 = () => {
  useEffect(()=>{
    checkinfo()
    i18n.changeLanguage(languageUser)
  },[])
  const [userInfo,SetUserInfo]=useState([])
  const { accessToken,userId,setLanguageUser,languageUser} = useContext(UserContext);
  const { t,i18n } = useTranslation();
  const nav = useNavigate();
  const logout=()=>{
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    localStorage.removeItem('accessToken');
    nav("/")
  }


  
  const config = {
    withCredentials: true,
  };
 
  const checkinfo= async() =>{
    try{
    const response=await axios.get (`http://localhost:3000/api/users/${userId}`,config)
    SetUserInfo(response.data)
    setLanguageUser(response.data.language)
  } catch(error){
    console.error(error)
  }
  }

  return (
    <header className="sticky-top">
      <nav className="navbar navbar-expand-lg m-2 mb-3" id="nav-Claro">
        <div className="container-fluid">
          <div className="row w-100">
            <div className="col-4 col-md-6 col-lg-6 d-flex text-center align-items-center">
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
            </div>
            <div className="col-8 col-md-6 col-lg-6 d-flex align-items-center justify-content-end">
              <i
                id="icono"
                className="fa-regular fa-moon me-2 luna"
                onClick={toggleBlackMode}
              ></i>
              {/* [//? Modo oscuro] */}
              <div className="vr fw-bold ms-2 me-2"></div>
              <i id="iconoDegradado" className="fa-solid fa-circle me-2"></i>
              <span className="ps-2 align-items-center">
                <p id="nombreUsuario" className="fw-bold m-0"></p>
                {`${userInfo.firstname} ${userInfo.middlename} ${userInfo.lastname}`}
              </span>
            </div>
            <div
              className="col-1 col-md-1 col-lg-1 d-lg-none collapse  navbar-collapse"
              id="navbarNav"
              style={{ border: "none" }}
            >
              <div id="div_ul" className="d-lg-none mt-3">
                <ul className="p-2 mt-4">
                  <li className="nav-item">
                    <a
                      className="nav-link tooltip-container"
                      href="/index"
                    >
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
                          onClick={()=>logout()}
                        >
                           {t("headerlt.Logout")}
                        </button>
                         
                      </li>
                 
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeaderLT2;
