import "../../assets/css/index.css";
import SidebarLT2 from "../../components/aside/sidebarLT2";
import HeaderLT2 from "../../components/header/headerLT2";
import { UserContext } from "../../context/UserContext";
import { useEffect,useContext } from "react";

const IndexEditor = () => {
  const { t,i18n } = useTranslation();
  const {languageUser} = useContext(UserContext)
  useEffect(() => {
    i18n.changeLanguage(languageUser)
  }, []);

  return (
    <div className="App">
     <div id="body">
     
      <HeaderLT2/>
        <section>
          <div className="col-12">
          <div className="container mt-5 home">
            <div id="row_card" className="row d-flex justify-content-center">
             
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
          <SidebarLT2 /> 
        </section>
   
      </div>
 
    </div>
   
  );
};

export default IndexEditor;
