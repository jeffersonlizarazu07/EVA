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
  List,
  ListItem
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
              {/* OPCION MODO GRID */}
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
                  <Grid spacing={2} m={3}>
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
                            {t("qualitySite.Quality_system")}
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
                      {/* Agentes */}
                      <Grid item sx={{ textAlign: "center", whiteSpace: "nowrap", flexShrink: 0, mr: 4 }}>
                        <Typography variant="h6" sx={{ color: "#666", display: "inline" }}>
                          {t("qualitySite.Agents")}:{" "}
                          <Box
                            component="span"
                            sx={{ color: "#b62a8b", fontWeight: "bold", fontSize: "1.5rem" }}
                          >
                            {conteoDeAgentes || 0}
                          </Box>
                        </Typography>
                      </Grid>

                      {/* Formularios de monitoreo */}
                      <Grid item sx={{ textAlign: "center", whiteSpace: "nowrap", flexShrink: 0 }}>
                        <Typography variant="h6" sx={{ color: "#666", display: "inline" }}>
                          {t("qualitySite.Monitoring_forms")}:{" "}
                          <Box
                            component="span"
                            sx={{ color: "#b62a8b", fontWeight: "bold", fontSize: "1.5rem" }}
                          >
                            {conteoDeFormulario || 0}
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
                    {/* Card 1 */}
                    <Grid item xs lg>
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
                              className="card-title"
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
                              mt: 3
                            }}
                          >
                            <Grid item xs className="card-second-text">
                              <span>{t("qualitySite.Generate_monitoring")}</span>
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
                                onClick={() => navigate("/agent_list")}
                              >
                                {t("qualitySite.Agents_list")}
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                    {/* Card 2 */}
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
                                {t("qualitySite.Monitoring_forms_to_the_agent")}
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
                              <span>{t("qualitySite.Create_and_or_edit_form")}</span>
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
                                onClick={() => navigate("/forms")}
                              >
                                {t("qualitySite.Create_form")}
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                    {/* Card 3 */}
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
                            {t("qualitySite.Quality_system")}
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

                    <Grid container spacing={2} sx={{ flexWrap: "nowrap" }}>
                      {/* Agentes */}
                      <Grid item sx={{ textAlign: "center", whiteSpace: "nowrap", flexShrink: 0, mr: 4 }}>
                        <Typography variant="h6" sx={{ color: "#666", display: "inline" }}>
                          {t("qualitySite.Agents")}:{" "}
                          <Box
                            component="span"
                            sx={{ color: "#b62a8b", fontWeight: "bold", fontSize: "1.5rem" }}
                          >
                            {conteoDeAgentes || 0}
                          </Box>
                        </Typography>
                      </Grid>

                      {/* Formularios de monitoreo */}
                      <Grid item sx={{ textAlign: "center", whiteSpace: "nowrap", flexShrink: 0 }}>
                        <Typography variant="h6" sx={{ color: "#666", display: "inline" }}>
                          {t("qualitySite.Monitoring_forms")}:{" "}
                          <Box
                            component="span"
                            sx={{ color: "#b62a8b", fontWeight: "bold", fontSize: "1.5rem" }}
                          >
                            {conteoDeFormulario || 0}
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
                        <List sx={{ padding: 0, margin: 0 }}>
                          {/* Opción 1 */}
                          <ListItem sx={{ padding: 3, mb: 5 }} className="list-item item-1">
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
                                  {t("qualitySite.Company_agents")}
                                </Typography>
                              </Box>

                              <Box sx={{ display: { xs: "none", lg: "block" }, color: "white", mx: 2 }}>
                                {t("qualitySite.Generate_monitoring")}
                              </Box>

                              <Box>
                                <Button
                                  className="card-btn"
                                  sx={{ color: "#ffffff", border: "1px solid #ffffff", borderRadius: "15px" }}
                                  onClick={() => navigate("/agent_list")}
                                >
                                  {t("qualitySite.Agents_list")}
                                </Button>
                              </Box>
                            </Box>
                          </ListItem>

                          {/* Opción 2 */}
                          <ListItem sx={{ padding: 3, mb: 5 }} className="list-item item-2">
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
                                  {t("qualitySite.Monitoring_forms_to_the_agent")}
                                </Typography>
                              </Box>

                              <Box sx={{ display: { xs: "none", lg: "block" }, color: "white", mx: 2 }}>
                                {t("qualitySite.Create_and_or_edit_form")}
                              </Box>

                              <Box>
                                <Button
                                  className="card-btn"
                                  sx={{ color: "#ffffff", border: "1px solid #ffffff", borderRadius: "15px" }}
                                  onClick={() => navigate("/forms")}
                                >
                                  {t("qualitySite.Create_form")}
                                </Button>
                              </Box>
                            </Box>
                          </ListItem>

                          {/* Opción 3 */}
                          <ListItem sx={{ padding: 3 }} className="list-item item-3">
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
                                  {t("qualitySite.Monitoring_forms_report_to_the_agent")}
                                </Typography>
                              </Box>

                              <Box sx={{ display: { xs: "none", lg: "block" }, color: "white", mx: 2 }}>
                                {t("qualitySite.Generate_report")}
                              </Box>

                              <Box>
                                <Button
                                  className="card-btn"
                                  sx={{ color: "#ffffff", border: "1px solid #ffffff", borderRadius: "15px" }}
                                  onClick={() => navigate("/forms_report")}
                                >
                                  {t("qualitySite.View_reports")}
                                </Button>
                              </Box>
                            </Box>
                          </ListItem>
                        </List>
                      </Grid>
                    </Grid>

                </Grid>
              )}

              {/* Cards laterales */}
              <Grid item xs={12} md={3} lg={3}>
                <Box
                  sx={{
                    pr: { xs: 4, md: 15 },
                    display: "flex",
                    flexDirection: "column",
                    gap: { xs: 2, md: 3 },
                  }}
                >
                  {/* Card de formularios */}
                  <Card className="outstanding-card77 extern"
                    sx={{ mb: 2, overflowX: "hidden" }}
                  >
                    <CardContent className="card-body div-title">
                      <Typography
                        variant="h7"
                        sx={{
                          textAlign: "left",
                          fontWeight: "bold",
                          marginRight: 3
                        }}
                      >
                        {t("qualitySite.Monitoring_forms")}
                      </Typography>
                      <Grid spacing={2}>
                        <Box sx={{ width: "100%", mt:2 }}>
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
                  <Card className="outstanding-card extern">
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
