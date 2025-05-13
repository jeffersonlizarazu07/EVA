import { useEffect,useContext,useState } from "react";
import "../../assets/css/calidad.css";
import { toggleGridMode,toggleListMode} from "../../assets/js/toggleListGridMode";
import SidebarLT1 from "../aside/sidebarLT1";
import HeaderLT1 from "../header/headerLT1";
import SidebarLT2 from "../aside/sidebarLT2";
import HeaderLT2 from "../header/headerLT2";
import Agent_Monitoring from "../../pages/admin/agent_monitoring";
import i18n from "../../assets/js/i18n";
import { useTranslation } from "react-i18next";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const Quality = () => {
  const {userType,languageUser} = useContext(UserContext)
  const [isInitialized, setIsInitialized] = useState(false);
  const { t,i18n } = useTranslation();
  const navigate = useNavigate();


  
  useEffect(() => {
    i18n.changeLanguage(languageUser)
  }, []);

 

    const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses empiezan desde 0
    const year = String(date.getFullYear()); // Últimos dos dígitos del año
    return `${day}-${month}-${year}`;
  };
  const currentDate = new Date();

  return (
    <div className="App">
      <div id="body" >
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
                      <h3 className="text-start p-2 fw-bolder m-2 w-100 tituloCardGroup">
                        {t("qualitySite.Quality_system")}
                      </h3>
                    </div>
                    <div className="col-4">
                      <h3 className="mt-4 flex-shrink-1 text-end date fechaCardGroup">
                        {formatDate(currentDate)}
                      </h3>
                    </div>
                  </div>
                  <div className="row d-flex">
                    <div className="col-2 text-center">
                      <h4 className="cardElement">0</h4>
                    </div>
                    <div className="col-3 col-lg-2 text-end">
                      <h4 className="cardElement">1</h4>
                    </div>
                    <div className="col-7 col-lg-8 text-end d-none d-lg-block">
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
                    <div className=" col-2 text-center">
                      <h6 className="cardElement">
                        {" "}
                        {t("qualitySite.Agents")}
                      </h6>
                    </div>
                    <div className="col-8 ms-3 col-lg-4 text-center text-center">
                      <h6 className="cardElement">
                        {t("qualitySite.Monitoring_forms")}
                      </h6>
                    </div>
                  </div>
                </div>
                <div className="row text-center">
                  <div className="col-lg">
                    <div className="card card1">
                      <div className="card-body d-grid">
                        <div className="row">
                          <div className="col-12 card-title">
                            <span className="">
                              {t("qualitySite.Company_agents")}
                            </span>
                          </div>
                          {/* <div className="col-2">
                            <div className="dropdown">
                              <button className="dropbtn">
                                <i className="fa-solid fa-ellipsis-vertical"></i>
                              </button>
                              <div className="dropdown-content">
                                <a href="#">Link 1</a>
                                <a href="#">Link 2</a>
                                <a href="#">Link 3</a>
                              </div>
                            </div>
                          </div> */}
                        </div>
                        <div className="row ">
                          <div className="col-12">
                            <h3 className="card-text">
                              Agentes
                            </h3>
                          </div>
                        </div>
                        <div className="row d-flex align-items-start justify-content-start mb-2">
                          <div className="col card-second-text  ">
                            <span className="">
                              {t("qualitySite.Company_agents")}
                            </span>
                          </div>
                        </div>
                        <div className="row ">
                          <div className="col-12 ">
                            <a href="./agent_list">
                              <button className="card-btn" id="card-btn-1">
                                {t("qualitySite.Agents_list")}
                              </button>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg  ">
                    <div className="card card2">
                      <div className="card-body d-grid">
                        <div className="row">
                          <div className="col-12 card-title">
                            <span className="">
                              {t("qualitySite.Monitoring_forms_to_the_agent")}
                            </span>
                          </div>
                          {/* <div className="col-2">
                            <div className="dropdown">
                              <button className="dropbtn">
                                <i className="fa-solid fa-ellipsis-vertical"></i>
                              </button>
                              <div className="dropdown-content">
                                <a href="#">Link 1</a>
                                <a href="#">Link 2</a>
                                <a href="#">Link 3</a>
                              </div>
                            </div>
                          </div> */}
                        </div>
                        <div className="row">
                          <div className="col-12">
                            <h3 className="card-text">
                              {t("qualitySite.Monitoring_forms")}
                            </h3>
                          </div>
                        </div>
                        <div className="row d-flex align-items-start justify-content-start mb-2">
                          <div className="col card-second-text  ">
                            <span className="">
                              {t("qualitySite.Create_and_or_edit_form")}
                            </span>
                          </div>
                        </div>
                        <div className="row button-container">
                          <div className="col-12">
                            <button className="card-btn check" onClick={() => navigate("/forms")}>
                              {t("qualitySite.Create_form")}
                            </button>
                          </div>
                          {/* <div className="col-2">
                            <button className="btn-plus">
                              <i className="fa-solid fa-plus"></i>
                            </button>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg  ">
                    <div className="card card3">
                      <div className="card-body d-grid">
                        <div className="row">
                          <div className="col-12 card-title">
                            <span className="">
                              {t(
                                "qualitySite.Monitoring_forms_report_to_the_agent"
                              )}
                            </span>
                          </div>
                          {/* <div className="col-2">
                            <div className="dropdown">
                              <button className="dropbtn">
                                <i className="fa-solid fa-ellipsis-vertical"></i>
                              </button>
                              <div className="dropdown-content">
                                <a href="#">Link 1</a>
                                <a href="#">Link 2</a>
                                <a href="#">Link 3</a>
                              </div>
                            </div>
                          </div> */}
                        </div>
                        <div className="row">
                          <div className="col-12">
                            <h3 className="card-text">
                              {" "}
                              {t("qualitySite.Form_report")}{" "}
                            </h3>
                          </div>
                        </div>
                        <div className="row d-flex align-items-start justify-content-start mb-2">
                          <div className="col card-second-text  ">
                            <span className="">
                              {t("qualitySite.Generate_report")}{" "}
                            </span>
                          </div>
                        </div>
                        <div className="row button-container">
                          <div className="col-12 ">
                            <button className="card-btn check">
                              {t("qualitySite.View_reports")}
                            </button>
                          </div>
                          {/* <div className="col-2">
                            <button className="btn-plus">
                              <i className="fa-solid fa-plus"></i>
                            </button>
                          </div> */}
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
                      <h3 className="text-start p-2 fw-bolder m-2 w-100 tituloCardGroup">
                        {t("qualitySite.Quality_system")}
                      </h3>
                    </div>
                    <div className="col-4">
                      <h3 className="mt-4 flex-shrink-1 text-end date fechaCardGroup">
                        {formatDate(currentDate)}
                      </h3>
                    </div>
                  </div>
                  <div className="row d-flex">
                    <div className="col-2 text-center">
                      <h4 className="cardElement">0</h4>
                    </div>
                    <div className="col-3 col-lg-2 text-end">
                      <h4 className="cardElement">1</h4>
                    </div>
                    <div className="col-7 col-lg-8 text-end d-none d-lg-block">
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
                    <div className="col-2 text-center">
                      <h6 className="cardElement">{t("qualitySite.Agents")}</h6>
                    </div>
                    <div className="col-8 ms-3 col-lg-4 text-center text-center">
                      <h6 className="cardElement">
                        {t("qualitySite.Monitoring_forms")}
                      </h6>
                    </div>
                  </div>
                </div>
                <div className="row  list">
                  <div className="col-12">
                    <li>
                      <ul className="list-item item-1 d-flex justify-content-between">
                        <div className="col-6 col-lg-4">
                          <h5 className="text-white fw-bolder">
                            {t("qualitySite.Company_agents")}
                          </h5>
                        </div>
                        <div className="col-lg-2 ms-5 col-1 d-none d-lg-block">
                          <span className="text-white">
                            {t("qualitySite.Agents")}
                          </span>
                        </div>
                        <div className="col col-lg-3">
                          <a href="./agent_list">
                            <button className="card-btn">
                              {t("qualitySite.Agents_list")}
                            </button>
                          </a>
                        </div>
                        {/* <div className="d-none d-lg-block col-lg-1">
                          <div className="dropdown">
                            <button className="dropbtn">
                              <i className="fa-solid fa-ellipsis-vertical"></i>
                            </button>
                            <div className="dropdown-content">
                              <a href="#">Link 1</a>
                              <a href="#">Link 2</a>
                              <a href="#">Link 3</a>
                            </div>
                          </div>
                        </div> */}
                      </ul>
                      <ul className="list-item item-2 d-flex justify-content-between">
                        <div className="col col-lg-5">
                          <h5 className="text-white fw-bolder">
                            {t("qualitySite.Monitoring_forms_to_the_agent")}
                          </h5>
                        </div>
                        <div className="col-lg-2 ms-3 col-1 d-none d-lg-block">
                          <span className="text-white d-none d-lg-block">
                            {t("qualitySite.Create_and_or_edit_form")}
                          </span>
                        </div>
                        <div
                          className="col-lg-4 col-7 d-flex justify-content-center"
                          id="content-new-form"
                        >
                          <button className="card-btn ">
                            {t("qualitySite.Create_form")}
                          </button>
                          {/* <button className="btn-plus ms-2">
                            <i className="fa-solid fa-plus"></i>
                          </button> */}
                        </div>
                        {/* <div className="col-lg-1 d-none d-lg-block">
                          <div className="dropdown">
                            <button className="dropbtn">
                              <i className="fa-solid fa-ellipsis-vertical"></i>
                            </button>
                            <div className="dropdown-content">
                              <a href="#">Link 1</a>
                              <a href="#">Link 2</a>
                              <a href="#">Link 3</a>
                            </div>
                          </div>
                        </div> */}
                      </ul>
                      <ul className="list-item item-2 d-flex justify-content-between">
                        <div className="col-6 col-lg-5">
                          <h5 className="text-white fw-bolder">
                            {t(
                              "qualitySite.Monitoring_forms_report_to_the_agent"
                            )}
                          </h5>
                        </div>
                        <div className="col-lg-3 ms-3 d-none d-lg-block">
                          <span className="text-white text-start">
                            {t("qualitySite.Generate_report")}
                          </span>
                        </div>
                        <div className="col-lg-3  justify-content-center  col ">
                          <button className="card-btn ">
                            {t("qualitySite.View_reports")}
                          </button>

                          {/* <button className="btn-plus ms-2">
                            <i className="fa-solid fa-plus"></i>
                          </button> */}
                        </div>
                        {/* <div className="col-1 d-none d-lg-block">
                          <div className="dropdown">
                            <button className="dropbtn">
                              <i className="fa-solid fa-ellipsis-vertical"></i>
                            </button>
                            <div className="dropdown-content">
                              <a href="#">Link 1</a>
                              <a href="#">Link 2</a>
                              <a href="#">Link 3</a>
                            </div>
                          </div>
                        </div> */}
                      </ul>
                    </li>
                  </div>
                </div>
              </div>
              {/* <!-- OPCION MODO LISTA  --> */}

              <div className="col-12 col-lg-4 col-sm-12">
                <div className="card outstanding-card extern">
                  <div className="card-body div-title">
                    <h5 className="">{t("qualitySite.Monitoring_forms")}</h5>
                    <div className="row">
                      <div className="col-12">
                        <span className=" text-start fw-bold me-3">
                          {t("qualitySite.Quality_form_ABC_bank")}
                        </span>
                        <i className=" fa-regular fa-clipboard"></i>
                      </div>
                    </div>
                    <div className="row">
                      <p className="text-start ">
                        {t(
                          "qualitySite.Rate_the_quality_of_customer_service_being_provided_by_the_agent"
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

export default Quality;
