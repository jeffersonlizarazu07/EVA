import { useEffect, useContext, useState } from "react";
import "../../assets/css/calidad.css";
import HeaderLT1 from "../header/headerLT1";
import HeaderLT2 from "../header/headerLT2";
import { useTranslations } from "../hooks/useTranslations";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getAdmins, getMonitoring } from "../../services/agent_listService";
import {
  Box,
  MenuItem,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

const Quality = () => {
  const navigate = useNavigate();
  const { userType, clients } = useContext(UserContext);
  const { t } = useTranslations();
  const [conteoDeAgentes, setConteoDeAgentes] = useState("0");
  const [conteoDeFormulario, setConteoDeFormulario] = useState("0");
  const [plantillaMonitor, setPlantillaMonitor] = useState([]);
  const [topMonitor, setTopMonitor] = useState([]);
  const [topAgentes, setTopAgentes] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // "grid" o "list"

  // Configuración para hacer peticiones que incluyan credenciales (cookies)
  const config = {
    withCredentials: true,
  };

  useEffect(() => {
    loadAdmins();
    listMonitoring();
  }, []);

  useEffect(() => {
    if (plantillaMonitor.length > 0) {
      getForms();
    }
  }, [plantillaMonitor]);

  useEffect(() => {
    const calcularTopMonitor = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/forms",
          config
        );
        setConteoDeFormulario(response.data.data.length);

        const tituloAgrupado = {};

        response.data.data.forEach((form) => {
          const plantilla = plantillaMonitor.filter(
            (p) => p.nombre_form === form.title
          );
          tituloAgrupado[form.title] = {
            idClient: form.idClient,
            title: form.title,
            id: form.id,
            preguntas: plantilla.length > 0 ? plantilla[0].preguntas : 0,
            respuestas: plantilla.length > 0 ? plantilla[0].respuestas : 0,
            agente: plantilla.map((p) => ({
              agentes: p.agentes || "N/A",
              score: parseFloat(p.score) || 0,
              idClient: form.idClient,
            })),
          };
        });

        const preview = Object.values(tituloAgrupado);

        const top5 = [...preview]
          .filter((i) => i.respuestas >= 0 && clients.includes(i.idClient))
          .sort((a, b) => b.respuestas - a.respuestas)
          .slice(0, 5);

        const soloAgentes = Object.values(tituloAgrupado)
          .flatMap((i) => i.agente)
          .filter((x) => clients.includes(x.idClient)) // accede a cada grupo de agentes
          .flatMap((e) =>
            e.agentes.map((a) => ({
              clients_id: e.idClient,

              agentes: a.nombre_agente,
              score: a.score,
            }))
          ); // accede al array de agentes dentro de cada grupo

        const top3 = [...soloAgentes]
          .sort((a, b) => a.score - b.score)
          .slice(0, 3);

        setTopAgentes(top3);
        setTopMonitor(top5);
      } catch (error) {
        console.error("Error al obtener formularios:", error);
      }
    };

    if (plantillaMonitor.length > 0) {
      calcularTopMonitor();
    }
  }, [plantillaMonitor]);

  // Formatear la fecha al formato dd-mm-yy
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses empiezan desde 0
    const year = String(date.getFullYear()); // Últimos dos dígitos del año
    return `${day}-${month}-${year}`;
  };
  const currentDate = new Date();

  // traer agentes
  const loadAdmins = async () => {
    try {
      const data = await getAdmins(clients);
      if (!data && data.length === 0) {
        setConteoDeAgentes(0);
      } else {
        const conteo = data.length;
        setConteoDeAgentes(conteo);
      }
    } catch (error) {
      console.error("Error al cargar los administradores:", error);
    }
  };

  // traer nombres de formularios
  const getForms = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/forms",
        config
      );
      setConteoDeFormulario(response.data.data.length);
      //
    } catch (error) {
      console.error("Error al obtener formularios:", error);
    }
  };

  // Traer los datos de monitoreo
  const listMonitoring = async () => {
    try {
      const data = await getMonitoring();
      agruparMonitoring(data);
    } catch (error) {
      console.error("Error al obtener los datos de monitoreo:", error);
    }
  };

  // Agrupar los datos de monitoreo por nombre de formulario e id de monitoreo
  const agruparMonitoring = (data) => {
    const agrupado = {};
    data.forEach((i) => {
      const key = `${i.nombre_form}|${i.id_monitoreo}`;
      if (!agrupado[key]) {
        agrupado[key] = {
          nombre_form: i.nombre_form,
          nombre_agente: i.nombre_agente,
          score: i.score,
          preguntas: [],
        };
      }
      agrupado[key].preguntas.push({
        texto: i.question_name,
        respuesta: i.answer,
      });
    });

    const agrupadoArray = Object.values(agrupado);

    // Generar plantillaMonitor aquí directamente basado en agrupadoArray
    const agrupadoListar = {};
    agrupadoArray.forEach((i) => {
      const key = `${i.nombre_form}`;
      if (!agrupadoListar[key]) {
        agrupadoListar[key] = {
          nombre_form: i.nombre_form,
          preguntas: i.preguntas.length,
          respuestas: agrupadoArray.filter(
            (x) => x.nombre_form === i.nombre_form
          ).length,
          agentes: [],
        };
      }
      agrupadoListar[key].agentes.push({
        nombre_agente: i.nombre_agente,
        score: i.score,
      });
    });

    const plantilla = Object.values(agrupadoListar);
    setPlantillaMonitor(plantilla);
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Box sx={{ position: "relative", zIndex: 1 }}>
        {userType == "1" ||
        (userType == 1 && userType == "2") ||
        userType == 2 ? (
          <HeaderLT1 />
        ) : (
          <HeaderLT2 />
        )}
        <section>
          <Grid
            container
            sx={{
              mt: { xs: 10, sm: 12, md: 14, lg: 16 },
              ml: { xs: 0, sm: 0, md: 2, lg: 8 },
              px: { xs: 0.5, sm: 2, md: 2, lg: 8 },
              justifyContent: "center",
            }}
          >
            <Grid container spacing={2}>
              {/* OPCION MODO GRID */}
              {viewMode === "grid" && (
                <Grid
                  item
                  xs={12}
                  md={8}
                  lg={8}
                  className="cards-group "
                  id="grid-mode"
                >
                  {/* Botón de regresar removido */}
                  <Grid spacing={2} m={3}>
                    <Grid container spacing={2} sx={{ display: "flex" }}>
                      <Grid item xs={8} sx={{ p: 0 }}>
                        <Typography
                          sx={{
                            textAlign: "left",
                            p: 0,
                            fontWeight: "bold",
                            m: 0,
                            width: "100%",
                            fontSize: {
                              xs: "1.5rem",
                              md: "1.8rem",
                              lg: "2rem",
                            },
                          }}
                          className="tituloCardGroup"
                        >
                          {t("qualitySite.Quality_system")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          sx={{
                            mt: { xs: 2, md: 2, lg: 4 },
                            flexShrink: 1,
                            textAlign: "right",
                          }}
                          className=" date fechaCardGroup"
                          variant="h5"
                        >
                          {formatDate(currentDate)}
                        </Typography>
                      </Grid>
                      {/* Botones de cambio de vista */}
                      <Grid
                        item
                        xs={12}
                        sx={{
                          mb: 2,
                          textAlign: "right",
                        }}
                      >
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
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ display: "flex" }}>
                      <Grid item xs={2} md={2} sx={{ textAlign: "center" }}>
                        <Typography className="cardElement" variant="h4">
                          {conteoDeAgentes}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={3}
                        md={3}
                        lg={3}
                        sx={{ textAlign: "center" }}
                      >
                        <Typography className="cardElement" variant="h4">
                          {conteoDeFormulario}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container>
                      <Grid
                        item
                        xs={2}
                        md={2}
                        lg={2}
                        sx={{ textAlign: "center" }}
                      >
                        <Typography className="cardElement" variant="h6">
                          {t("qualitySite.Agents")}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={8}
                        md={8}
                        lg={4}
                        sx={{ textAlign: "center", ml: 3 }}
                      >
                        <Typography className="cardElement" variant="h6">
                          {t("qualitySite.Monitoring_forms")}
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
                    {/* Card 1 */}
                    {userType === "4" ? (
                      <Grid item xs={12} md={12} lg={4}>
                        <Card className="card card1">
                          <CardContent
                            sx={{ display: "grid" }}
                            className="card-body "
                          >
                            <Grid>
                              <Grid
                                item
                                xs={12}
                                md={12}
                                lg={12}
                                className="card-title"
                              >
                                <span>{t("qualitySite.Company_agents")}</span>
                              </Grid>
                            </Grid>
                            <Grid>
                              <Grid item xs={12} md={12} lg={12}>
                                <Typography className="card-text" variant="h4">
                                  {t("qualitySite.Agents")}
                                </Typography>
                              </Grid>
                            </Grid>
                            <Grid
                              sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "flex-start",
                                mb: 2,
                              }}
                            >
                              <Grid item xs={true} className="card-second-text">
                                <span>{t("qualitySite.Company_agents")}</span>
                              </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={12} lg={12}>
                                <a href="./agent_list">
                                  <Button
                                    sx={{
                                      color: "#ffffff",
                                      border: "1px solid #ffffff",
                                      borderRadius: "15px",
                                    }}
                                    id="card-btn-1"
                                  >
                                    {t("qualitySite.Agents_list")}
                                  </Button>
                                </a>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    ) : userType === "3" ? (
                      ""
                    ) : (
                      <Grid item xs>
                        <Card className="card card1">
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
                                className=" card-title"
                              >
                                <span>{t("qualitySite.Company_agents")}</span>
                              </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={12} lg={12}>
                                <Typography className="card-text" variant="h4">
                                  {t("qualitySite.Agents")}
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
                                <span>{t("qualitySite.Company_agents")}</span>
                              </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={12} lg={12}>
                                <a href="./agent_list">
                                  <Button
                                    sx={{
                                      color: "#ffffff",
                                      border: "1px solid #ffffff",
                                      borderRadius: "15px",
                                    }}
                                    id="card-btn-1"
                                  >
                                    {t("qualitySite.Agents_list")}
                                  </Button>
                                </a>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    )}
                    {/* Card 2 */}
                    {userType !== "4" && (
                      <Grid item xs lg>
                        <Card className="card card2">
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
                                  {t(
                                    "qualitySite.Monitoring_forms_to_the_agent"
                                  )}
                                </span>
                              </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={12} lg={12}>
                                <Typography className="card-text" variant="h4">
                                  {t("qualitySite.Monitoring_forms")}
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
                                <span>
                                  {t("qualitySite.Create_and_or_edit_form")}
                                </span>
                              </Grid>
                            </Grid>
                            <Grid
                              container
                              spacing={2}
                              className="button-container"
                            >
                              <Grid item xs={12} md={12} lg={12}>
                                <Button
                                  className="card-btn check"
                                  sx={{
                                    color: "#ffffff",
                                    border: "1px solid #ffffff",
                                    borderRadius: "15px",
                                  }}
                                  onClick={() => navigate("/forms")}
                                >
                                  {t("qualitySite.Create_form")}
                                </Button>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    )}
                    {/* Card 3 */}
                    {userType !== "4" && (
                      <Grid item xs lg>
                        <Card className="card card3">
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
                                <span>
                                  {t(
                                    "qualitySite.Monitoring_forms_report_to_the_agent"
                                  )}
                                </span>
                              </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={12} lg={12}>
                                <Typography className="card-text" variant="h4">
                                  {t("qualitySite.Form_report")}
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
                                <span>{t("qualitySite.Generate_report")}</span>
                              </Grid>
                            </Grid>
                            <Grid
                              container
                              spacing={2}
                              className="button-container"
                            >
                              <Grid item xs={12} md={12} lg={12}>
                                <Button
                                  className="card-btn check"
                                  sx={{
                                    color: "#ffffff",
                                    border: "1px solid #ffffff",
                                    borderRadius: "15px",
                                  }}
                                  onClick={() => navigate("/forms_report")}
                                >
                                  {t("qualitySite.View_reports")}
                                </Button>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              )}

              {/* OPCION MODO LISTA */}
              {viewMode === "list" && (
                <Grid
                  item
                  xs={12}
                  md={10}
                  lg={8}
                  className="cards-group"
                  id="list-mode"
                >
                  <Grid container spacing={2} className="row ">
                    <Grid sx={{ display: "flex" }}>
                      <Grid item xs={8} md={8} lg={8}>
                        <Typography
                          sx={{
                            textAlign: "left",
                            p: 2,
                            fontWeight: "bold",
                            m: 2,
                            width: "100%",
                            fontSize: "2rem",
                          }}
                          className="tituloCardGroup"
                        >
                          {t("qualitySite.Quality_system")}
                        </Typography>
                      </Grid>
                      <Grid item xs={4} md={4} lg={4}>
                        <Typography
                          sx={{
                            mt: { xs: 2, sm: 4, md: 6, lg: 10 },
                            mr: { xs: 0, sm: 1, md: 2, lg: 2 },
                            textAlign: "right",
                          }}
                          className=" date fechaCardGroup"
                          variant="h5"
                        >
                          {formatDate(currentDate)}
                        </Typography>
                        {/* Botones de cambio de vista */}
                        <Grid
                          item
                          xs={12}
                          md={12}
                          lg={12}
                          sx={{
                            textAlign: "right",
                            mb: 2,
                          }}
                        >
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
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid container sx={{ display: "flex" }}>
                      <Grid
                        item
                        xs={3}
                        md={3}
                        lg={2}
                        sx={{ textAlign: "center" }}
                      >
                        <Typography className="cardElement" variant="h4">
                          {conteoDeAgentes}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={3}
                        md={3}
                        lg={2}
                        sx={{ textAlign: "center" }}
                      >
                        <Typography className="cardElement" variant="h4">
                          {conteoDeFormulario}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid
                        item
                        xs={2}
                        md={2}
                        lg={2}
                        sx={{ textAlign: "center", ml: 3 }}
                      >
                        <Typography className="cardElement" variant="h6">
                          {t("qualitySite.Agents")}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={8}
                        md={8}
                        lg={4}
                        sx={{ textAlign: "center", mr: 3 }}
                      >
                        <Typography className="cardElement" variant="h6">
                          {t("qualitySite.Monitoring_forms")}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  {userType == "4" ? (
                    <Grid container spacing={2} className=" list">
                      <Grid item xs={12} md={12} lg={12}>
                        <ul
                          style={{ listStyle: "none", padding: 0, margin: 0 }}
                        >
                          {/* Opción 1 */}
                          <li style={{ marginBottom: "10px" }}>
                            <Box
                              className="list-item item-1"
                              sx={{
                                marginTop: "6.25rem",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Grid item xs={6} md={6} lg={4}>
                                <Typography
                                  sx={{
                                    color: "white",
                                    fontWeight: "bold",
                                  }}
                                  variant="h6"
                                >
                                  {t("qualitySite.Company_agents")}
                                </Typography>
                              </Grid>
                              <Grid
                                item
                                xs={1}
                                md={1}
                                lg={2}
                                sx={{
                                  ml: 5,
                                  display: {
                                    xs: "none",
                                    lg: "block",
                                  },
                                }}
                              >
                                <span className="text-white">
                                  {t("qualitySite.Agents")}
                                </span>
                              </Grid>
                              <Grid item xs md lg={3}>
                                <Button
                                  className="card-btn"
                                  sx={{
                                    color: "#ffffff",
                                    border: "1px solid #ffffff",
                                    borderRadius: "15px",
                                  }}
                                  onClick={() => navigate("/agent_list")}
                                >
                                  {t("qualitySite.Agents_list")}
                                </Button>
                              </Grid>
                            </Box>
                          </li>
                        </ul>
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid
                      container
                      spacing={2}
                      className=" list"
                      sx={{ p: 5, m: 0 }}
                    >
                      <Grid item xs={12} md={12} lg={12}>
                        <ul
                          style={{ listStyle: "none", padding: 0, margin: 0 }}
                        >
                          {/* Opción 1 */}
                          {userType !== "3" && (
                            <li style={{ marginBottom: "10px" }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                                className="list-item item-1 "
                              >
                                <Grid item xs={6} md={6} lg={4}>
                                  <Typography
                                    sx={{
                                      color: "white",
                                      fontWeight: "bold",
                                    }}
                                    variant="h6"
                                  >
                                    {t("qualitySite.Company_agents")}
                                  </Typography>
                                </Grid>
                                <Grid
                                  item
                                  xs={1}
                                  md={1}
                                  lg={2}
                                  sx={{
                                    ml: 5,
                                    display: {
                                      xs: "none",
                                      lg: "block",
                                    },
                                  }}
                                >
                                  <span className="text-white">
                                    {t("qualitySite.Agents")}
                                  </span>
                                </Grid>
                                <Grid item xs md lg={3}>
                                  <Button
                                    className="card-btn"
                                    sx={{
                                      color: "#ffffff",
                                      border: "1px solid #ffffff",
                                      borderRadius: "15px",
                                    }}
                                    onClick={() => navigate("/agent_list")}
                                  >
                                    {t("qualitySite.Agents_list")}
                                  </Button>
                                </Grid>
                              </Box>
                            </li>
                          )}
                          {/* Opción 2 */}
                          {userType !== "4" && (
                            <li style={{ marginBottom: "10px" }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                                className="list-item item-2 "
                              >
                                <Grid item xs md lg={5}>
                                  <Typography
                                    sx={{
                                      color: "white",
                                      fontWeight: "bold",
                                    }}
                                    variant="h6"
                                  >
                                    {t(
                                      "qualitySite.Monitoring_forms_to_the_agent"
                                    )}
                                  </Typography>
                                </Grid>
                                <Grid
                                  item
                                  xs={1}
                                  md={1}
                                  lg={2}
                                  sx={{
                                    ml: 3,
                                    display: {
                                      xs: "none",
                                      lg: "block",
                                    },
                                  }}
                                >
                                  <span className="text-white d-none d-lg-block">
                                    {t("qualitySite.Create_and_or_edit_form")}
                                  </span>
                                </Grid>
                                <Grid
                                  item
                                  xs={7}
                                  md={7}
                                  lg={4}
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                  id="content-new-form"
                                >
                                  <Button
                                    className="card-btn"
                                    sx={{
                                      color: "#ffffff",
                                      border: "1px solid #ffffff",
                                      borderRadius: "15px",
                                    }}
                                    onClick={() => navigate("/forms")}
                                  >
                                    {t("qualitySite.Create_form")}
                                  </Button>
                                </Grid>
                              </Box>
                            </li>
                          )}
                          {/* Opción 3 */}
                          {userType !== "4" && (
                            <li style={{ marginBottom: "10px" }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                                className="list-item item-3 "
                              >
                                <Grid item xs={6} md={6} lg={5}>
                                  <Typography
                                    sx={{
                                      color: "white",
                                      fontWeight: "bold",
                                    }}
                                    variant="h6"
                                  >
                                    {t(
                                      "qualitySite.Monitoring_forms_report_to_the_agent"
                                    )}
                                  </Typography>
                                </Grid>
                                <Grid
                                  item
                                  xs
                                  md
                                  lg={3}
                                  sx={{
                                    ml: 3,
                                    display: {
                                      xs: "none",
                                      lg: "block",
                                    },
                                  }}
                                >
                                  <span className="text-white text-start">
                                    {t("qualitySite.Generate_report")}
                                  </span>
                                </Grid>
                                <Grid
                                  item
                                  xs
                                  md
                                  lg={3}
                                  sx={{ justifyContent: "center" }}
                                >
                                  <Button
                                    className="card-btn"
                                    sx={{
                                      color: "#ffffff",
                                      border: "1px solid #ffffff",
                                      borderRadius: "15px",
                                    }}
                                    onClick={() => navigate("/forms_report")}
                                  >
                                    {t("qualitySite.View_reports")}
                                  </Button>
                                </Grid>
                              </Box>
                            </li>
                          )}
                        </ul>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              )}

              {/* Cards laterales */}

              <Grid item xs={12} md={4} lg={4}>
                <Box
                  sx={{
                    mt: { xs: 3, md: 0 },
                    display: "flex",
                    flexDirection: "column",
                    gap: { xs: 2, md: 3 },
                  }}
                >
                  {/* Card de formularios */}

                  <Card
                    className="outstanding-card extern"
                    sx={{ mb: 2, overflowX: "hidden" }}
                  >
                    <CardContent className="card-body div-title">
                      <Typography variant="h5">
                        {t("qualitySite.Monitoring_forms")}
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={12} lg={12}>
                          <span className="text-start fw-bold me-3">
                            {t("qualitySite.Quality_form_ABC_bank")}
                          </span>
                          <i className="fa-regular fa-clipboard"></i>
                        </Grid>
                      </Grid>
                      <Grid spacing={2}>
                        <Box sx={{ width: "100%" }}>
                          {topMonitor.length > 0 ? (
                            topMonitor.map((i, idx) => (
                              <Box
                                key={idx}
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
                                <span>{i.title}</span>
                                <Box
                                  sx={{
                                    border: "1px solid #c4c4c4",
                                    borderRadius: "999px",
                                    paddingX: 2,
                                    paddingY: 0.5,
                                    fontWeight: "bold",
                                    fontSize: 12,
                                    minWidth: "32px",
                                    textAlign: "center",
                                  }}
                                >
                                  <span>{i.respuestas}</span>
                                </Box>
                              </Box>
                            ))
                          ) : (
                            <MenuItem disabled>No hay Formularios</MenuItem>
                          )}
                        </Box>
                      </Grid>
                    </CardContent>
                  </Card>

                  {/* Card de agentes críticos */}

                  <Card className="outstanding-card77 extern">
                    <CardContent className="card-body div-title">
                      <Box
                        sx={{
                          border: "1px solid #c4c4c4",
                          borderRadius: "10px",
                          p: 1,
                          mt: 2,
                        }}
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={12} lg={12}>
                            <span className="text-start fw-bold me-3">
                              {"Agentes Criticos"}
                            </span>
                            <TrendingDownIcon />
                          </Grid>
                        </Grid>
                        <Grid spacing={2}>
                          <Box sx={{ width: "100%" }}>
                            {topAgentes.length > 0 ? (
                              topAgentes.map((i, idx) => (
                                <Box
                                  key={idx}
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    mt: 1,
                                    fontSize: 13,
                                    paddingY: 0.5,
                                    borderTop: "1px dashed #c4c4c4",
                                    p: 1,
                                  }}
                                >
                                  <Box>{i.agentes}</Box>
                                  <Box
                                    sx={{
                                      border: "1px solid #c4c4c4",
                                      borderRadius: "999px",
                                      paddingX: 2,
                                      paddingY: 0.5,
                                      fontWeight: "bold",
                                      fontSize: 12,
                                      minWidth: "32px",
                                      textAlign: "center",
                                    }}
                                  >
                                    <span>{i.score}</span>
                                  </Box>
                                </Box>
                              ))
                            ) : (
                              <MenuItem disabled>
                                No hay agentes críticos
                              </MenuItem>
                            )}
                          </Box>
                        </Grid>
                      </Box>
                      <Grid container spacing={2}>
                        <Typography sx={{ textAlign: "center", mt: 2 }}>
                          {t(
                            "qualitySite.Rate_the_quality_of_customer_service_being_provided_by_the_agent"
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

export default Quality;
