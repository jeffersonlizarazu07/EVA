import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import "../../assets/css/experiencia.css";
import {
  toggleGridMode,
  toggleListMode,
} from "../../assets/js/toggleListGridMode";
import HeaderLT1 from "../header/headerLT1";
import HeaderLT2 from "../header/headerLT2";
import { useTranslations } from "../hooks/useTranslations";
import { getSurveys } from "../../services/surveyRequest";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  List,
  ListItem,
  Link,

    Box,
    MenuItem,
    Button,
    Typography,
    Card,
    CardContent,
    Grid,
} from "@mui/material";

const Satisfaction = () => {
  const navigate = useNavigate();
  const { t } = useTranslations();
  const { userType, languageUser, clients, userId } = useContext(UserContext);
  const { accessToken } = useContext(UserContext);
  const urlSurveys = `http://localhost:3000/api/clients/surveys?clientIds=${clients}`;
  const [surveys, setSurveys] = useState("");
  const [topSurveys, setTopSurveys] = useState([]);
  const [topForm, setTopForm] = useState([]);
   const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    const fetchTopSurveys = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/top-surveys/${userId}`,
          config
        );
        setTopSurveys(response.data.data);
      } catch (error) {
        console.error("Error fetching top surveys:", error);
      }
    };
    fetchTopSurveys();
  }, []);

  useEffect(() => {
    scoreXSurvey();
    cSurveys();
  }, []);

  useEffect(() => {
    const interval = setInterval(cSurveys, 30000); // Cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  const config = {
    withCredentials: true,
  };

  const cSurveys = function () {
    getSurveys(urlSurveys, config)
      .then(setSurveys)
      .catch((error) => {
        console.error("Error fetching survey questions", error);
      });
  };

  // traer data con puntages
  const scoreXSurvey = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/answers/survey/score",
        config
      );
      const data = {};

      if (response.data && response.data.length > 0) {
        response.data.forEach((i) => {
          const key = `${i.title}`;
          if (!data[key]) {
            data[key] = {
              link: i.link,
              formulario: i.title,
              puntaje: i.final_score,
            };
          }
        });
        const TopForm = Object.values(data)
          .sort((a, b) => b.puntaje - a.puntaje)
          .slice(0, 5);
        setTopForm(TopForm);
        return TopForm;
      }
      return [];
    } catch (error) {}
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses empiezan desde 0
    const year = String(date.getFullYear()); // Últimos dos dígitos del año
    return `${day}-${month}-${year}`;
  };
  const currentDate = new Date();

  return (
    <Box sx={{ position: "relative" }}>
      <Box sx={{ position: "relative", zIndex: 1 }}>
        {userType == "1" || userType == 1 ? <HeaderLT1 /> : <HeaderLT2 />}
        <section>
          <Grid
            container
            sx={{
              mt: { xs: 5, sm: 6, md: 7, lg: 8 },  // margen arriba reducido (antes 10,12,14,16)
              ml: { xs: 0, sm: 0, md: 1, lg: 4 },  // margen izquierda reducido (antes 2,8)
              px: { xs: 0.25, sm: 1, md: 1, lg: 4 }, // padding horizontal reducido (antes 0.5,2,8)
              justifyContent: "center",
            }}
          >
            <Grid container spacing={2}>
              {/* <!-- OPCION  MODO GRID  --> */}
              {viewMode === "grid" && (
              <Grid
                item
                xs={12}
                md={9}
                lg={9}
                className="cards-group "
                id="grid-mode"
                sx={{ padding: 2 }}
              >
                <Grid spacing={1} m={3}>
                  <Grid container spacing={2}>
                    {/* Encabezado con título a la izquierda y fecha a la derecha */}
                    <Grid item xs={12}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ width: "100%" }}
                      >
                        {/* Título */}
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            fontSize: {
                              xs: "1.5rem",
                              md: "1.8rem",
                              lg: "2rem",
                            },
                          }}
                          className="tituloCardGroup"
                        >
                          {t("satisfactionSite.Survey_system")}
                        </Typography>
                        {/* Fecha */}
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="flex-end"
                        >
                          <Typography
                            className="date fechaCardGroup"
                            variant="h5"
                            sx={{
                              mt: { xs: 0, md: 0, lg: 1 }, // Ajusta según tu necesidad
                            }}
                          >
                            {formatDate(currentDate)}
                          </Typography>

                          {/* Botones debajo de la fecha */}
                          <Box mt={1}>
                            <Button
                              className={`btn btn-option-view${
                                viewMode === "list" ? " active" : ""
                              }`}
                              onClick={() => setViewMode("list")}
                              sx={{ color: "#000" }}
                            >
                              <i className="fa-solid fa-list" />
                            </Button>
                            <Button
                              className={`btn btn-option-view${
                                viewMode === "grid" ? " active" : ""
                              }`}
                              onClick={() => setViewMode("grid")}
                              sx={{ color: "#000" }}
                            >
                              <i className="fa-solid fa-border-all" />
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} sx={{ flexWrap: "nowrap" }}>
                    {/* Encuestas de satisfacción */}
                    <Grid item sx={{ textAlign: "center", whiteSpace: "nowrap", flexShrink: 0 }}>
                      <Typography variant="h6" sx={{ color: "#666", display: "inline" }}>
                        {t("satisfactionSite.Total_Surveys")}:{" "}
                        <Box
                          component="span"
                          sx={{ color: "#b62a8b", fontWeight: "bold", fontSize: "1.5rem" }}
                        >
                          {surveys || 0}
                        </Box>
                      </Typography>
                    </Grid>
                  </Grid>

                </Grid>

                <Grid
                  container
                  spacing={2}
                  sx={{
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    p: 2,
                  }}
                >
                  {/* Card 4 */}
                  <Grid item xs lg>
                    <Card className="card card4">
                      <CardContent
                        sx={{ display: "grid" }}
                        className="card-body "
                      >
                        <Grid container spacing={2}>
                          <Grid
                            item
                            xs={12}
                            md={12}
                            lg={12}
                            className="card-title"
                          >
                            <span>{t("satisfactionSite.FinalUserSurveys")}</span>
                          </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={12} lg={12}>
                            <Typography className="card-text" variant="h4">
                              {t("satisfactionSite.Surveys")}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          spacing={2}
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "flex-start",
                            mb: 2,
                            mt: 3
                          }}
                        >
                          <Grid item xs className="card-second-text">
                            <span>{t("satisfaction.gestionar_encuestas")}</span>
                          </Grid>
                        </Grid>
                        <Grid container spacing={2} className="button-container">
                          <Grid item xs={12} md={12} lg={12}>
                            <Button
                              className="card-btn check"
                              sx={{
                                color: "#ffffff",
                                border: "1px solid #ffffff",
                                borderRadius: "15px",
                              }}
                              onClick={() => navigate("/survey_list")}
                            >
                              {t("satisfactionSite.visualizar_encuestas")}
                            </Button>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                  {/* Card 5 */}
                  <Grid item xs lg>
                    <Card className="card card5">
                      <CardContent
                        sx={{ display: "grid" }}
                        className="card-body"
                      >
                        <Grid container spacing={2}>
                          <Grid
                            item
                            xs={12}
                            md={12}
                            lg={12}
                            className="card-title"
                          >
                            <span>
                              {t("satisfactionSite.GenerateGraphsAndSurveyReport")}
                            </span>
                          </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={12} lg={12}>
                            <Typography className="card-text" variant="h4">
                              {t("satisfactionSite.SurveyReport")}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          spacing={2}
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "flex-start",
                            mb: 2,
                          }}
                        >
                          <Grid item xs className="card-second-text">
                            <span>{t("satisfactionSite.Generate_report")}</span>
                          </Grid>
                        </Grid>
                        <Grid container spacing={2} className="button-container">
                          <Grid item xs={12} md={12} lg={12}>
                            <Button
                              className="card-btn check"
                              sx={{
                                color: "#ffffff",
                                border: "1px solid #ffffff",
                                borderRadius: "15px",
                              }}
                              onClick={() => navigate("/reports")}
                            >
                              {t("satisfactionSite.GenerateGraphs")}
                            </Button>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
              )}


              {/* OPCION MODO LISTA */}
              {viewMode === "list" && (
                <Grid
                  item
                  xs={12}
                  md={9}
                  lg={9}
                  className="cards-group"
                  id="list-mode"
                  sx={{ padding: 2 }}
                >
                  <Grid spacing={2} m={3}>
                    <Grid container spacing={2}>
                      {/* Encabezado con título a la izquierda y fecha + botones a la derecha */}
                      <Grid item xs={12}>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{ width: "100%" }}
                        >
                          {/* Título */}
                          <Typography
                            sx={{
                              fontWeight: "bold",
                              fontSize: {
                                xs: "1.5rem",
                                md: "1.8rem",
                                lg: "2rem",
                              },
                            }}
                            className="tituloCardGroup"
                          >
                            {t("satisfactionSite.Survey_system")}
                          </Typography>

                          {/* Fecha + botones */}
                          <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="flex-end"
                          >
                            <Typography
                              className="date fechaCardGroup"
                              variant="h5"
                              sx={{
                                mt: { xs: 0, md: 0, lg: 1 },
                              }}
                            >
                              {formatDate(currentDate)}
                            </Typography>

                            {/* Botones debajo de la fecha */}
                            <Box mt={1}>
                              <Button
                                className={`btn btn-option-view${viewMode === "list" ? " active" : ""}`}
                                onClick={() => setViewMode("list")}
                                sx={{ color: "#000" }}
                              >
                                <i className="fa-solid fa-list" />
                              </Button>
                              <Button
                                className={`btn btn-option-view${viewMode === "grid" ? " active" : ""}`}
                                onClick={() => setViewMode("grid")}
                                sx={{ color: "#000" }}
                              >
                                <i className="fa-solid fa-border-all" />
                              </Button>
                            </Box>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Contenido */}
                    <Grid container spacing={2} sx={{ flexWrap: "nowrap" }}>
                      <Grid item sx={{ textAlign: "center", whiteSpace: "nowrap", flexShrink: 0 }}>
                        <Typography variant="h6" sx={{ color: "#666", display: "inline" }}>
                          {t("satisfactionSite.Total_Surveys")}:{" "}
                          <Box
                            component="span"
                            sx={{ color: "#b62a8b", fontWeight: "bold", fontSize: "1.5rem" }}
                          >
                            {surveys || 0}
                          </Box>
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    spacing={2}
                    className="list"
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      p: 2,
                    }}
                  >
                    <Grid item xs={12}>
                      <List sx={{ padding: 0, margin: 0, mb:18 }}>
                        {/* List Item 1 */}
                        <ListItem sx={{ padding: 3, mb: 5 }} className="list-item item-4">
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              width: "100%",
                              flexWrap: "wrap",
                            }}
                          >
                            <Box sx={{ flex: 1 }}>
                              <Typography sx={{ color: "white", fontWeight: "bold" }} variant="h6">
                                {t("satisfactionSite.FinalUserSurveys")}
                              </Typography>
                            </Box>

                            <Box sx={{ display: { xs: "none", lg: "block" }, color: "white", mx: 2 }}>
                              {t("satisfaction.gestionar_encuestas")}
                            </Box>

                            <Box>
                              <Button
                                className="card-btn"
                                sx={{ color: "#ffffff", border: "1px solid #ffffff", borderRadius: "15px" }}
                                onClick={() => navigate("/survey_list")}
                              >
                                {t("satisfactionSite.visualizar_encuestas")}
                              </Button>
                            </Box>
                          </Box>
                        </ListItem>

                        {/* List Item 2 */}
                        <ListItem sx={{ padding: 3, mb: 5 }} className="list-item item-5">
                           <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "100%",
                                flexWrap: "wrap",
                              }}
                            >
                              <Box sx={{ flex: 1 }}>
                                <Typography sx={{ color: "white", fontWeight: "bold" }} variant="h6">
                                  {t("satisfactionSite.GenerateGraphsAndSurveyReport")}
                                </Typography>
                              </Box>

                              <Box sx={{ display: { xs: "none", lg: "block" }, color: "white", mx: 2 }}>
                                {t("satisfactionSite.Generate_report")}
                              </Box>

                              <Box>
                                <Button
                                  className="card-btn"
                                  sx={{ color: "#ffffff", border: "1px solid #ffffff", borderRadius: "15px" }}
                                  onClick={() => navigate("/reports")}
                                >
                                  {t("satisfactionSite.Generate_report")}
                                </Button>
                              </Box>
                            </Box>
                        </ListItem>

                      </List>
                    </Grid>
                  </Grid>
                </Grid>
              )}




              {/* <!-- OPCION MODO LISTA  --> */}
              <Grid item xs={12} md={3} lg={3} sx={{ height: "100%" }}>
                <Box
                  sx={{
                    pr: { xs: 1, md: 1 },
                    pl: { xs: 2, md: 4 },
                    display: "flex",
                    flexDirection: "column",
                    gap: { xs: 2, md: 2 },
                    height: "100%",
                  }}
                >

                  <Card
                    className="outstanding-card2 extern"
                    sx={{ mb: 2, overflowX: "hidden", height: "100%", display: "flex", flexDirection: "column" }}
                  >
                    <CardContent
                      className="card-body div-title"
                      sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}
                    >
                      <Typography
                        variant="h7"
                        sx={{
                          textAlign: "left",
                          fontWeight: "bold",
                          marginRight: 3
                        }}
                      >
                        {t("satisfactionSite.encuestas_frecuentes")}
                      </Typography>

                      <Grid spacing={2} sx={{ flex: 1, overflowY: "auto", mt:2 }}>
                        <Box sx={{ width: "100%" }}>
                          {topSurveys.length > 0 ? (
                            topSurveys.map((survey, index) => (
                              <Box
                                key={survey.survey_id || `survey-${index}`}
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  mt: 1,
                                  fontSize: 13,
                                  paddingY: 0.5,
                                  border: "1px solid #c4c4c4",
                                  borderRadius: "10px",
                                  p: 1,
                                }}
                              >
                                <Link
                                  href={survey.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    textDecoration: "none",
                                    color: "inherit",
                                    flexGrow: 1,
                                  }}
                                >
                                  <Typography component="strong" sx={{ fontSize: "90%" }}>
                                    {survey.title}
                                  </Typography>
                                </Link>
                              </Box>
                            ))
                          ) : (
                            <MenuItem disabled sx={{ justifyContent: "center" }}>
                              Aún no hay encuestas contestadas
                            </MenuItem>
                          )}
                        </Box>
                      </Grid>

                      <Grid container>
                        <Typography sx={{ textAlign: "left", fontSize: "120%", mt: 2 }}>
                          {t(
                            "satisfactionSite.Rate_the_quality_of_customer_service_being_provided_by_the_agent"
                          )}
                        </Typography>
                      </Grid>
                    </CardContent>
                  </Card>
                </Box>
              </Grid>



            </Grid>
          </Grid>
        </section>
      </Box>
    </Box>
  );
};

export default Satisfaction;
