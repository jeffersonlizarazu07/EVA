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
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Divider,
  Stack,
  Link,
} from "@mui/material";
import { TurnLeft } from "@mui/icons-material";
import ViewListIcon from "@mui/icons-material/ViewList";
import AppsIcon from "@mui/icons-material/Apps";

const Satisfaction = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { userType, languageUser, clients, userId } = useContext(UserContext);
  const { accessToken } = useContext(UserContext);
  const urlSurveys = `http://localhost:3000/api/clients/surveys?clientIds=${clients}`;
  const [surveys, setSurveys] = useState("");
  const [topSurveys, setTopSurveys] = useState([]);
  const [topForm, setTopForm]= useState([]);

  useEffect(() => {
    const fetchTopSurveys = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/top-surveys/${userId}`
        );
        setTopSurveys(response.data.data);
        console.log("Top Surveys:", response.data.data);        
      } catch (error) {
        console.error("Error fetching top surveys:", error);
      }
    };

    fetchTopSurveys();
  }, []);

  useEffect(() => {
    scoreXSurvey();
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

  // traer data con puntages
  const scoreXSurvey = async ()=>{
    try {
      const response = await axios.get('http://localhost:3000/api/answers/survey/score',config)
      console.log("Puntajes por encuesta:", response.data);
      const data = {};
      
      if (response.data && response.data.length > 0) {
        response.data.forEach((i) => {
          const key = `${i.title}`;
          if(!data[key]){
            data[key]={
              link:i.link,
              formulario:i.title,
              puntaje:i.final_score,
            }
          }
          
        })
        const TopForm = Object.values(data)
            .sort((a,b)=> b.puntaje - a.puntaje)
            .slice(0, 5)

        setTopForm(TopForm);
        console.log("Top 5:", TopForm);

        return TopForm;
      }
      
      return [];
    } catch (error) {
      
    }
  }

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses empiezan desde 0
    const year = String(date.getFullYear()); // Últimos dos dígitos del año
    return `${day}-${month}-${year}`;
  };
  const currentDate = new Date();

  return (
    <Box className="App" sx={{ overflow: "hidden" }}>
      <Box id="body">
        {userType === "1" ? <HeaderLT1 /> : <HeaderLT2 />}
        <Box>
          <Container maxWidth="xl" sx={{ ml: 4 }}>
            <Grid container sx={{ mt: 5 }}>
              {/* <!-- OPCION  MODO GRID  --> */}
              <Box
                className="cards-group text-center"
                id="grid-mode"
                style={{ display: "block" }}
                sx={{ width: "66.666667%" }}
              >
                <Box sx={{ textAlign: "left" }}>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      minWidth: 0,
                      width: 30,
                      height: 30,
                      marginTop: "10px",
                      marginLeft: "10px",
                      borderRadius: "50%",
                      color: "#b62a8b",
                      borderColor: "#b62a8b",
                      "&:hover": {
                        borderColor: "#b62a8b",
                        backgroundColor: "#b62a8b",
                        color: "white",
                      },
                    }}
                    onClick={() => navigate("/editor")}
                  >
                    <TurnLeft />
                  </Button>
                </Box>
                <Grid margin={3}>
                  <Typography
                    variant="h4"
                    sx={{ textAlign: "left", fontWeight: "bold", mb: 1 }}
                  >
                    {t("satisfactionSite.Survey_system")}
                  </Typography>
                  <Grid
                    container
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Grid item>
                      <Typography variant="h6">{surveys}</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h5">
                        {formatDate(currentDate)}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    justifyContent="space-between"
                    sx={{ mb: 0, display: { lg: "flex" } }}
                  >
                    <Grid item>
                      <Typography variant="h6" className="cardElement">
                        {t("satisfactionSite.Total_Surveys")}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Box sx={{ display: "flex" }}>
                        <Button
                          className="btn btn-option-view"
                          onClick={toggleListMode}
                          sx={{
                            width: 40,
                            height: 40,
                            minWidth: 0,
                            padding: 0,
                            borderRadius: "8px",
                            color: "#000000",
                          }}
                        >
                          <i className="fa-solid fa-list" id="lista"></i>
                        </Button>
                        <Button
                          className="btn btn-option-view"
                          sx={{
                            width: 40,
                            height: 40,
                            minWidth: 0,
                            padding: 0,
                            borderRadius: "8px",
                            color: "#000000",
                          }}
                        >
                          <i className="fa-solid fa-border-all" id="grid"></i>
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid container sx={{ textAlign: "center" }}>
                  <Grid item lg={5} mr={4} ml={7} mb={3}>
                    <Card className="card card4">
                      <CardContent sx={{ display: "grid" }}>
                        <Grid container>
                          <Grid item xs={12} mt={2}>
                            <Typography>
                              {t("satisfactionSite.FinalUserSurveys")}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid container>
                          <Grid item xs={12} mt={8}>
                            <Typography variant="h5" className="card-text">
                              {t("satisfactionSite.Surveys")}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          mt={6}
                          sx={{
                            alignItems: "flex-start",
                            justifyContent: "center",
                          }}
                        >
                          <Grid item className="card-second-text">
                            <Typography>
                              {t("satisfaction.gestionar_encuestas")}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid container justifyContent="center" mt={8}>
                          <Grid item>
                            <Link href="/survey_list" underline="none">
                              <Button
                                sx={{
                                  color: "#fff",
                                  height: 30, // más delgado
                                  minWidth: 250, // texto blanco
                                  border: "1px solid #fff", // borde blanco
                                  alignItems: "center",
                                  justifyContent: "center",
                                  display: "flex",
                                  textAlign: "center",
                                  fontSize: 12,
                                }}
                              >
                                {t("satisfactionSite.visualizar_encuestas")}
                              </Button>
                            </Link>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item lg={5}>
                    <Card className="card card5">
                      <CardContent sx={{ display: "grid" }}>
                        <Grid container>
                          <Grid item xs={12} mt={2}>
                            <Typography>
                              {t(
                                "satisfactionSite.GenerateGraphsAndSurveyReport"
                              )}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid container>
                          <Grid item xs={12} mt={8}>
                            <Typography
                              variant="h5"
                              className="card-text w-100 m-0 p-0"
                              sx={{ width: "100%", margin: 0, padding: 0 }}
                            >
                              {t("satisfactionSite.SurveyReport")}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          mt={6}
                          sx={{
                            alignItems: "flex-start",
                            justifyContent: "center",
                          }}
                        >
                          <Grid item className="card-second-text">
                            <Typography>
                              {t("satisfactionSite.Generate_report")}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid container justifyContent="center" mt={8}>
                          <Grid item>
                            <Link href="./reports" underline="none">
                              <Button
                                sx={{
                                  color: "#fff",
                                  height: 30, // más delgado
                                  minWidth: 250, // texto blanco
                                  border: "1px solid #fff", // borde blanco
                                  alignItems: "center",
                                  justifyContent: "center",
                                  display: "flex",
                                  textAlign: "center",
                                  fontSize: 12,
                                }}
                              >
                                {t("satisfactionSite.GenerateGraphs")}
                              </Button>
                            </Link>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
              {/* <!-- OPCION  MODO GRID  --> */}

              {/* <!-- OPCION MODO LISTA --> */}
              <Box
                className="cards-group text-center"
                id="list-mode"
                style={{ display: "none" }}
                sx={{ width: "66.666667%" }} // equivalente a col-lg-8
              >
                <Grid margin={3}>
                  <Typography
                    variant="h4"
                    sx={{ textAlign: "left", fontWeight: "bold", mb: 1 }}
                  >
                    {t("satisfactionSite.Survey_system")}
                  </Typography>
                  <Grid
                    container
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Grid item>
                      <Typography variant="h6">{surveys}</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h5">
                        {formatDate(currentDate)}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    justifyContent="space-between"
                    sx={{ mb: 0, display: { lg: "flex" } }}
                  >
                    <Grid item>
                      <Typography variant="h6" className="cardElement">
                        {t("satisfactionSite.Total_Surveys")}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Box sx={{ display: "flex" }}>
                        <Button
                          className="btn btn-option-view active"
                          sx={{
                            width: 40,
                            height: 40,
                            minWidth: 0, // evita que MUI le dé un ancho mínimo por defecto
                            padding: 0,
                            borderRadius: "8px", // o '50%' si lo quieres circular
                            color: "#000000",
                            mr: 1,
                          }}
                        >
                          <i className="fa-solid fa-list" id="lista"></i>
                        </Button>
                        <Button
                          className="btn btn-option-view"
                          sx={{
                            width: 40,
                            height: 40,
                            minWidth: 0, // evita que MUI le dé un ancho mínimo por defecto
                            padding: 0,
                            borderRadius: "8px", // o '50%' si lo quieres circular
                            color: "#000000",
                          }}
                          onClick={toggleGridMode}
                        >
                          <i className="fa-solid fa-border-all" id="grid"></i>
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
                {/* contenido */}
                <Grid container>
                  <Grid item xs={11} md={12}>
                    <List sx={{ width: "96%", gap: 8 }}>
                      <ListItem
                        className="list-item item-4 listCards"
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box sx={{ width: { xs: "50%", lg: "41.666667%" } }}>
                          <Typography
                            variant="h6"
                            sx={{ color: "white", fontWeight: "bold" }}
                          >
                            {t("satisfactionSite.FinalUserSurveys")}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: "16.666667%",
                            marginLeft: 3,
                            display: { xs: "none", lg: "block" },
                          }}
                        >
                          <Typography
                            sx={{ color: "white", textAlign: "left" }}
                          >
                            {t("satisfaction.gestionar_encuestas")}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: "25%",
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <Button
                            sx={{
                              color: "#fff",
                              height: 30, // más delgado
                              minWidth: 180, // texto blanco
                              border: "1px solid #fff", // borde blanco
                              alignItems: "center",
                              justifyContent: "center",
                              display: "flex",
                              textAlign: "center",
                              fontSize: 12,
                            }}
                            onClick={() => navigate("/survey_list")}
                          >
                            {t("satisfactionSite.visualizar_encuestas")}
                          </Button>
                        </Box>
                        <Box
                          sx={{
                            width: "8.333333%",
                            display: { xs: "none", lg: "block" },
                          }}
                        ></Box>
                      </ListItem>

                      <ListItem
                        className="list-item item-5 listCards"
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box sx={{ width: { xs: "50%", lg: "41.666667%" } }}>
                          <Typography
                            variant="h6"
                            sx={{ color: "white", fontWeight: "bold" }}
                          >
                            {t(
                              "satisfactionSite.GenerateGraphsAndSurveyReport"
                            )}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: "16.666667%",
                            marginLeft: 3,
                            display: { xs: "none", lg: "block" },
                          }}
                        >
                          <Typography
                            sx={{ color: "white", textAlign: "left" }}
                          >
                            {t("satisfactionSite.Generate_report")}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: "25%",
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <Button
                            sx={{
                              color: "#fff",
                              height: 30, // más delgado
                              minWidth: 180, // texto blanco
                              border: "1px solid #fff", // borde blanco
                              alignItems: "center",
                              justifyContent: "center",
                              display: "flex",
                              textAlign: "center",
                              fontSize: 12,
                            }}
                            onClick={() => navigate("/reports")}
                          >
                            {t("satisfactionSite.Generate_report")}
                          </Button>
                        </Box>
                        <Box
                          sx={{
                            width: "8.333333%",
                            display: { xs: "none", lg: "block" },
                          }}
                        ></Box>
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              </Box>

              {/* <!-- OPCION MODO LISTA  --> */}
              <Grid item xs={12} lg={4} sm={12}>
                <Card className="outstanding-card2 extern">
                  <CardContent className="div-title">
                    <Typography variant="h6" mt={3}>
                      {t("satisfactionSite.encuestas_frecuentes")}
                    </Typography>

                    <Box sx={{ padding: 4 }}>
                      {topSurveys.length === 0 ? (
                        <Typography
                          sx={{
                            textAlign: "center",
                            fontSize: "100%",
                            padding: "30%",
                          }}
                        >
                          Aún no hay encuestas contestadas
                        </Typography>
                      ) : (
                        <List
                          sx={{
                            listStyle: "none",
                            padding: 0,
                            display: "flex",
                            margin: 0,
                            justifyContent: "center",
                            flexDirection: "column",
                            gap: 2,
                          }}
                        >
                          {topSurveys.map((survey, index) => (
                            <ListItem
                              key={survey.survey_id || `survey-${index}`}
                              sx={{
                                display: "inline-block",
                                textAlign: "center",
                                padding: 0,
                              }}
                            >
                              <Link
                                href={i.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                  textDecoration: "none",
                                  color: "inherit",
                                }}
                              >
                                <Typography
                                  component="strong"
                                  sx={{ fontSize: "90%" }}
                                >
                                  {survey.title}{" "}
                                  {/* : {survey.encuestas_enviadas} */}
                                </Typography>

                              </Link>
                            </ListItem>
                          ))}
                        </List>
                      )}
                    </Box>

                    <Grid container>
                      <Typography sx={{ textAlign: "left", fontSize: "120%" }}>
                        {t(
                          "satisfactionSite.Rate_the_quality_of_customer_service_being_provided_by_the_agent"
                        )}
                      </Typography>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default Satisfaction;
