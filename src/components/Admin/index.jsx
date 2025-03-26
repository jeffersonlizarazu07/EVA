import React from "react";
import { useTranslation } from "react-i18next";
import "../../assets/css/index.css";
import SidebarLT1 from "../aside/sidebarLT1";
import HeaderLT1 from "../header/headerLT1";
import i18n from "../../assets/js/i18n.jsx";
import { useEffect,useContext,useState} from "react";
import { UserContext } from "../../context/UserContext";
const Index = () => {
  const { t,i18n } = useTranslation();
  const {userType,languageUser} = useContext(UserContext)
  useEffect(() => {
    i18n.changeLanguage(languageUser)
  }, []);

 
  return (

    <div >
      <HeaderLT1/>
      <div id="body">
        
        <section>
          <div className="col-12">
            <div className="container mt-5 home">
              <div id="row_card" className="row">
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 p-2 d-flex justify-content-center align-content-center">
                  <a style={{ textDecoration: "none" }} href="/quality">
                    <div
                      id="card1"
                      className="card text-white text-center pb-2"
                    >
                      <div className="card-body index">
                        <i
                          id="iconoCard"
                          className="fa-solid fa-circle-user"
                          style={{ fontSize: "100px" }}
                        ></i>
                        <br />
                        <h3>{t("quality.title")}</h3>
                        <p>{t("quality.description")}</p>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 p-2 d-flex justify-content-center align-content-center h-100">
                  <a style={{ textDecoration: "none" }} href="./satisfaction">
                    <div
                      id="card2"
                      className=" d-flex card text-white text-center pb-2 align-items-center"
                    >
                      <div className="card-body index">
                        <i
                          id="iconoCard"
                          className="fa-solid fa-chart-column"
                          style={{ fontSize: "100px" }}
                        ></i>
                        <br />
                        <h3>{t("satisfaction.title")}</h3>
                        <p>{t("satisfaction.description")}</p>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          {/* <SidebarLT1 /> */}
        </section>
      </div>
    </div>
  );
};

export default Index;
