import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import "../../assets/css/experiencia.css";
import {
  toggleGridMode,
  toggleListMode,
} from "../../assets/js/toggleListGridMode";
import SidebarLT1 from "../aside/sidebarLT1";
import HeaderLT1 from "../header/headerLT1";
import SidebarLT2 from "../aside/sidebarLT2";
import HeaderLT2 from "../header/headerLT2";
import { useTranslation } from "react-i18next";
import { getSurveys } from "../../services/surveyRequest";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Satisfaction = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { userType, languageUser, clients, userId} = useContext(UserContext);
  const { accessToken } = useContext(UserContext);
  const urlSurveys = `http://localhost:3000/api/clients/surveys?clientIds=${clients}`;
  const [surveys, setSurveys] = useState("");
  const [topSurveys, setTopSurveys] = useState([]);


  useEffect(() => {
    const fetchTopSurveys = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/top-surveys/${userId}`);
        setTopSurveys(response.data.data);
        
      } catch (error) {
       
        console.error("Error fetching top surveys:", error);
      }
    };

    fetchTopSurveys();
  }, []);

  useEffect(() => {
    cSurveys();
    i18n.changeLanguage(languageUser);
  }, []);

  useEffect(() => {
    const interval = setInterval(cSurveys, 30000); // Cada 30 segundos
    return () => clearInterval(interval);
  }, []);
  
  // document
  //   .getElementById("grid-button-mode")
  //   .addEventListener("click", toggleGridMode);
  // document
  //   .getElementById("list-button-mode")
  //   .addEventListener("click", toggleListMode);

  // return () => {
  //   document
  //     .getElementById("grid-button-mode")
  //     .removeEventListener("click", toggleGridMode);
  //   document
  //     .getElementById("list-button-mode")
  //     .removeEventListener("click", toggleListMode);
  // };
  const config = {
    withCredentials: true,
  };

  const cSurveys = function () {
    console.log("--urlSurveys", urlSurveys);
    console.log("--clientes", clients);
    console.log("--userId", userId);
    getSurveys(urlSurveys, config)
      .then(setSurveys)
      .catch((error) => {
        console.error("Error fetching survey questions", error);
      });
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses empiezan desde 0
    const year = String(date.getFullYear()); // Últimos dos dígitos del año
    return `${day}-${month}-${year}`;
  };
  const currentDate = new Date();

  return (
    <div className="App">
      <div id="body">
        {userType === "1" || userType === "2" ? <HeaderLT1 /> : <HeaderLT2 />}

        <section>
          {/* {userType === "1" || userType === "2" ? (
            <SidebarLT1 />
          ) : (
            <SidebarLT2 />
          )} */}

          <div className="container cards-EVA">
            <div className="row">
              {/* <!-- OPCION  MODO GRID  --> */}
              <div
                className="cards-group text-center col-lg-8"
                id="grid-mode"
                style={{ display: "block" }}
              >
                <div className="row m-3">
                  <div className="row d-flex ">
                    <div className="col-8">
                      <h2 className="text-start w-100 fw-bolder tituloCardGroup">
                        {t("satisfactionSite.Survey_system")}
                      </h2>
                    </div>
                    <div className="col-4">
                      <h3 className="mt-4 flex-shrink-1 text-end date fechaCardGroup">
                        {formatDate(currentDate)}
                      </h3>
                    </div>
                  </div>
                  <div className="row d-flex">
                    <div className="col-4 col-lg-4 text-start">
                      <h4 className="cardElement">{surveys}</h4>
                    </div>
                    <div className="col-8 col-lg-8 text-end d-none d-lg-block">
                      <button
                        className="btn btn-option-view"
                        id="list-button-mode"
                        onClick={toggleListMode}
                      >
                        <i className="fa-solid fa-list" id="lista"></i>
                      </button>
                      <button className="btn btn-option-view active">
                        <i className="fa-solid fa-border-all" id="grid"></i>
                      </button>
                    </div>
                  </div>

                  <div className=" row ">
                    <div className=" col-lg-4 col-8 text-start">
                      <h6 className="cardElement">
                        {" "}
                        {t("satisfactionSite.Total_Surveys")}
                      </h6>
                    </div>
                  </div>
                </div>
                <div className="row  text-center">
                  <div className="col-lg">
                    <div className="card card4">
                      <div className="card-body d-grid">
                        <div className="row">
                          <div className="col-12 card-title">
                            <span className="">
                              {" "}
                              {t("satisfactionSite.FinalUserSurveys")}
                            </span>
                          </div>                          
                        </div>
                        <div className="row">
                          <div className="col-12">
                            <h3 className="card-text">
                              {t("satisfactionSite.Surveys")}
                            </h3>
                          </div>
                        </div>
                        <div className="row d-flex align-items-start justify-content-start mb-2">
                          <div className="col card-second-text  ">
                            <span className="">
                              Gestionar encuestas
                            </span>
                          </div>
                        </div>
                        <div className="row button-container">
                          <div className="col">
                            <a href="/survey_list">
                              <button className="card-btn check">
                                Visualizar encuestas
                              </button>
                            </a>
                          </div>                          
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg  ">
                    <div className="card card5">
                      <div className="card-body d-grid">
                        <div className="row">
                          <div className="col-12 card-title">
                            <span className="">
                              {t(
                                "satisfactionSite.GenerateGraphsAndSurveyReport"
                              )}
                            </span>
                          </div>
                          
                        </div>
                        <div className="row">
                          <div className="col-12">
                            <h3 className="card-text w-100 m-0 p-0">
                              {t("satisfactionSite.SurveyReport")}
                            </h3>
                          </div>
                        </div>
                        <div className="row d-flex align-items-start justify-content-start mb-2">
                          <div className="col card-second-text">
                            <span className="">
                              {t("satisfactionSite.Generate_report")}
                            </span>
                          </div>
                        </div>
                        <div className="row button-container">
                          <div className="col-12">
                            <a href="./reports">
                              <button className="card-btn check">
                                {t("satisfactionSite.GenerateGraphs")}
                              </button>
                            </a>
                          </div>                          
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <!-- OPCION  MODO GRID  --> */}

              {/* <!-- OPCION MODO LISTA --> */}
              <div
                className="col-lg-8 cards-group"
                id="list-mode"
                style={{ display: "none" }}
              >
                <div className="row m-3">
                  <div className="row d-flex">
                    <div className="col-8">
                      <h2 className="text-start  fw-bolder w-100 tituloCardGroup">
                        {t("satisfactionSite.Survey_system")}
                      </h2>
                    </div>
                    <div className="col-4">
                      <h3 className="mt-4 flex-shrink-1 text-end date fechaCardGroup">
                        {formatDate(currentDate)}
                      </h3>
                    </div>
                  </div>
                  <div className="row d-flex">
                    <div className="col-12 col-lg-4 text-start">
                      <h4 className="cardElement">{surveys}</h4>
                    </div>
                    <div className="col-8 col-lg-8 text-end d-none d-lg-block">
                      <button
                        className="btn btn-option-view active"
                        id="list-button-mode2"
                      >
                        <i className="fa-solid fa-list" id="lista"></i>
                      </button>
                      <button
                        className="btn btn-option-view"
                        id="grid-button-mode"
                        onClick={toggleGridMode}
                      >
                        <i className="fa-solid fa-border-all" id="grid"></i>
                      </button>
                    </div>
                  </div>

                  <div className="row ">
                    <div className="col-12 col-lg-4 text-start">
                      <h6 className="cardElement">
                        {" "}
                        {t("satisfactionSite.Total_Surveys")}
                      </h6>
                    </div>
                  </div>
                </div>
                <div className="row  list">
                  <div className="col-12">
                    <li>
                      <ul className="list-item item-4 d-flex justify-content-between">
                        <div className="col-6 col-lg-5">
                          <h5 className="text-white fw-bolder">
                            {t("satisfactionSite.FinalUserSurveys")}
                          </h5>
                        </div>
                        <div className="col-lg-2 ms-3 d-none d-lg-block">
                          <span className="text-white text-start">
                            Gestionar encuestas
                          </span>
                        </div>
                        <div className="col-lg-3  justify-content-center  col ">
                          <button className="card-btn " onClick={() => navigate("/survey_list")}>
                            {" "}
                            visualizar encuestas
                          </button>                          
                        </div>
                        <div className="col-1 d-none d-lg-block">
                         
                        </div>
                      </ul>
                      <ul className="list-item item-5 d-flex justify-content-between">
                        <div className="col-6 col-lg-5">
                          <h5 className="text-white fw-bolder">
                            {t(
                              "satisfactionSite.GenerateGraphsAndSurveyReport"
                            )}
                          </h5>
                        </div>
                        <div className="col-lg-2 ms-3 d-none d-lg-block">
                          <span className="text-white text-start">
                            {t("satisfactionSite.Generate_report")}
                          </span>
                        </div>
                        <div className="col-lg-3  justify-content-center  col ">
                          <button className="card-btn" onClick={() => navigate("/reports")}>
                            {" "}
                            {t("satisfactionSite.Generate_report")}
                          </button>                          
                        </div>
                        <div className="col-1 d-none d-lg-block">                          
                        </div>
                      </ul>                      
                    </li>
                  </div>
                </div>
              </div>
              {/* <!-- OPCION MODO LISTA  --> */}
              <div className="col-12 col-lg-4 col-sm-12">
                <div className="card outstanding-card2 extern">
                  <div className="card-body div-title">
                    <h5 className=""> Ecuestas frecuentes</h5>
                    <div className="row">
                      {/* <div className="col-12">
                        <span className=" text-start fw-bold">
                          Titulo encuesta mas demandada{" "}
                          <i className=" fa-regular fa-clipboard"></i>
                        </span>
                      </div> */}
                    </div>
                    <div className="p-3">
                      
                      {topSurveys.length === 0 ? (
                        <p className="text-center" style={{ fontSize: '100%', padding: '30%'}}>
                          Aún no hay encuestas contestadas
                        </p>
                      ) :( 
                        <ul style={{listStyle: 'none', padding: 0, display: 'flex', margin: 0, justifyContent: 'center' }}>
                          {topSurveys.map((survey, index) => (
                            <li key={survey.survey_id || `survey-${index}`} className="text-start"
                            style={{
                              fontSize: '80%', // Tamaño de letra
                              margin: '0.5rem 1.3rem', // Espaciado vertical y horizontal
                              display: 'inline-block', // Para que haya separación horizontal si los quieres en una línea
                              textAlign: 'center', // Centrar el texto
                            }}>
                              <a
                                href={survey.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: 'none', color: 'inherit' }}
                              >
                                <strong>{survey.title}</strong>
                              </a>{' '}
                              {/* : {survey.encuestas_enviadas} */}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    
                    <div className="row">
                      <p className="text-start g-3">
                        {t(
                          "satisfactionSite.Rate_the_quality_of_customer_service_being_provided_by_the_agent"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Satisfaction;
