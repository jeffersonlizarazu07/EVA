import { useEffect, useContext, useState } from "react";
import "../../assets/css/calidad.css";
import HeaderLT1 from "../header/headerLT1";
import HeaderLT2 from "../header/headerLT2";
import { useTranslation } from "react-i18next";
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
  IconButton,
} from "@mui/material";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

const Quality = () => {
  const navigate = useNavigate();
  const { userType, languageUser, clients } = useContext(UserContext);
  const { t, i18n } = useTranslation();
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
    i18n.changeLanguage(languageUser);
  }, [languageUser]);

  useEffect(() => {
    const calcularTopMonitor = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/forms",
          config
        );
        console.log("Response de formularios:", response.data.data);
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
        console.log("Preview:", preview);

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

        console.log("Top 3 Agentes:", top3);
        setTopAgentes(top3);
        setTopMonitor(top5);
        console.log("Clientes:", clients);
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
      console.log("Datos de monitoreo:", data);
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
    console.log("Agrupado Array:", agrupadoArray);

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
    console.log("Plantilla Monitor:", plantilla);
    setPlantillaMonitor(plantilla);
  };

  return (
    <Box className="App">
      <Box id="body">
        {userType === "1" || userType === "2" ? <HeaderLT1 /> : <HeaderLT2 />}
        <section>
          <Box className="container cards-EVA">
            <Box className="row">
              {/* OPCION MODO GRID */}
              {viewMode === "grid" && (
                <Box
                  className="cards-group text-center col-lg-8"
                  id="grid-mode"
                >
                  <Box className="row m-3">
                    <Box className="row d-flex">
                      <Box className="col-8">
                        <Typography
                          className="text-start p-2 fw-bolder m-2 w-100 tituloCardGroup"
                          variant="h5"
                        >
                          {t("qualitySite.Quality_system")}
                        </Typography>
                      </Box>
                      <Box className="col-4">
                        <Typography
                          className="mt-4 flex-shrink-1 text-end date fechaCardGroup"
                          variant="h5"
                        >
                          {formatDate(currentDate)}
                        </Typography>
                      </Box>
                      {/* Botones de cambio de vista */}
                      <Box className="col-12 text-end mb-2">
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
                    <Box className="row d-flex">
                      <Box className="col-2 text-center">
                        <Typography className="cardElement" variant="h4">
                          {conteoDeAgentes}
                        </Typography>
                      </Box>
                      <Box className="col-3 col-lg-2 text-end">
                        <Typography className="cardElement" variant="h4">
                          {conteoDeFormulario}
                        </Typography>
                      </Box>
                    </Box>
                    <Box className="row">
                      <Box className="col-2 text-center">
                        <Typography className="cardElement" variant="h6">
                          {t("qualitySite.Agents")}
                        </Typography>
                      </Box>
                      <Box className="col-8 ms-3 col-lg-4 text-center">
                        <Typography className="cardElement" variant="h6">
                          {t("qualitySite.Monitoring_forms")}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box className="row text-center justify-content-center">
                    {/* Card 1 */}
                    {userType === "4" ? (
                      <Box className="col-md-6 col-lg-4">
                        <Card className="card card1">
                          <CardContent className="card-body d-grid">
                            <Box className="row">
                              <Box className="col-12 card-title">
                                <span>{t("qualitySite.Company_agents")}</span>
                              </Box>
                            </Box>
                            <Box className="row">
                              <Box className="col-12">
                                <Typography className="card-text" variant="h4">
                                  {t("qualitySite.Agents")}
                                </Typography>
                              </Box>
                            </Box>
                            <Box className="row d-flex align-items-start justify-content-start mb-2">
                              <Box className="col card-second-text">
                                <span>{t("qualitySite.Company_agents")}</span>
                              </Box>
                            </Box>
                            <Box className="row">
                              <Box className="col-12">
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
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Box>
                    ) : (
                      <Box className="col-lg">
                        <Card className="card card1">
                          <CardContent className="card-body d-grid">
                            <Box className="row">
                              <Box className="col-12 card-title">
                                <span>{t("qualitySite.Company_agents")}</span>
                              </Box>
                            </Box>
                            <Box className="row">
                              <Box className="col-12">
                                <Typography className="card-text" variant="h4">
                                  {t("qualitySite.Agents")}
                                </Typography>
                              </Box>
                            </Box>
                            <Box className="row d-flex align-items-start justify-content-start mb-2">
                              <Box className="col card-second-text">
                                <span>{t("qualitySite.Company_agents")}</span>
                              </Box>
                            </Box>
                            <Box className="row">
                              <Box className="col-12">
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
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Box>
                    )}
                    {/* Card 2 */}
                    {userType !== "4" && (
                      <Box className="col-lg">
                        <Card className="card card2">
                          <CardContent className="card-body d-grid">
                            <Box className="row">
                              <Box className="col-12 card-title">
                                <span>
                                  {t(
                                    "qualitySite.Monitoring_forms_to_the_agent"
                                  )}
                                </span>
                              </Box>
                            </Box>
                            <Box className="row">
                              <Box className="col-12">
                                <Typography className="card-text" variant="h4">
                                  {t("qualitySite.Monitoring_forms")}
                                </Typography>
                              </Box>
                            </Box>
                            <Box className="row d-flex align-items-start justify-content-start mb-2">
                              <Box className="col card-second-text">
                                <span>
                                  {t("qualitySite.Create_and_or_edit_form")}
                                </span>
                              </Box>
                            </Box>
                            <Box className="row button-container">
                              <Box className="col-12">
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
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Box>
                    )}
                    {/* Card 3 */}
                    {userType !== "4" && (
                      <Box className="col-lg">
                        <Card className="card card3">
                          <CardContent className="card-body d-grid">
                            <Box className="row">
                              <Box className="col-12 card-title">
                                <span>
                                  {t(
                                    "qualitySite.Monitoring_forms_report_to_the_agent"
                                  )}
                                </span>
                              </Box>
                            </Box>
                            <Box className="row">
                              <Box className="col-12">
                                <Typography className="card-text" variant="h4">
                                  {t("qualitySite.Form_report")}
                                </Typography>
                              </Box>
                            </Box>
                            <Box className="row d-flex align-items-start justify-content-start mb-2">
                              <Box className="col card-second-text">
                                <span>{t("qualitySite.Generate_report")}</span>
                              </Box>
                            </Box>
                            <Box className="row button-container">
                              <Box className="col-12">
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
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Box>
                    )}
                  </Box>
                </Box>
              )}

              {/* OPCION MODO LISTA */}
              {viewMode === "list" && (
                <Box className="col-lg-8 cards-group" id="list-mode">
                  <Box className="row m-3">
                    <Box className="row d-flex">
                      <Box className="col-8">
                        <Typography
                          className="text-start p-2 fw-bolder m-2 w-100 tituloCardGroup"
                          variant="h5"
                        >
                          {t("qualitySite.Quality_system")}
                        </Typography>
                      </Box>
                      <Box className="col-4">
                        <Typography
                          className="mt-4 flex-shrink-1 text-end date fechaCardGroup"
                          variant="h5"
                        >
                          {formatDate(currentDate)}
                        </Typography>
                        {/* Botones de cambio de vista */}
                        <Box className="col-12 text-end mb-2">
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
                    <Box className="row d-flex">
                      <Box className="col-2 text-center">
                        <Typography className="cardElement" variant="h4">
                          {conteoDeAgentes}
                        </Typography>
                      </Box>
                      <Box className="col-3 col-lg-2 text-end">
                        <Typography className="cardElement" variant="h4">
                          {conteoDeFormulario}
                        </Typography>
                      </Box>
                    </Box>
                    <Box className="row">
                      <Box className="col-2 text-center">
                        <Typography className="cardElement" variant="h6">
                          {t("qualitySite.Agents")}
                        </Typography>
                      </Box>
                      <Box className="col-8 ms-3 col-lg-4 text-center">
                        <Typography className="cardElement" variant="h6">
                          {t("qualitySite.Monitoring_forms")}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  {userType == "4" ? (
                    <Box className="row list">
                      <Box className="col-12">
                        <ul
                          style={{ listStyle: "none", padding: 0, margin: 0 }}
                        >
                          {/* Opción 1 */}
                          <li style={{ marginBottom: "10px" }}>
                            <Box
                              className="list-item item-1 d-flex justify-content-between align-items-center"
                              sx={{ marginTop: "6.25rem" }}
                            >
                              <Box className="col-6 col-lg-4">
                                <Typography
                                  className="text-white fw-bolder"
                                  variant="h6"
                                >
                                  {t("qualitySite.Company_agents")}
                                </Typography>
                              </Box>
                              <Box className="col-lg-2 ms-5 col-1 d-none d-lg-block">
                                <span className="text-white">
                                  {t("qualitySite.Agents")}
                                </span>
                              </Box>
                              <Box className="col col-lg-3">
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
                              </Box>
                            </Box>
                          </li>
                        </ul>
                      </Box>
                    </Box>
                  ) : (
                    <Box className="row list">
                      <Box className="col-12">
                        <ul
                          style={{ listStyle: "none", padding: 0, margin: 0 }}
                        >
                          {/* Opción 1 */}
                          <li style={{ marginBottom: "10px" }}>
                            <Box className="list-item item-1 d-flex justify-content-between align-items-center">
                              <Box className="col-6 col-lg-4">
                                <Typography
                                  className="text-white fw-bolder"
                                  variant="h6"
                                >
                                  {t("qualitySite.Company_agents")}
                                </Typography>
                              </Box>
                              <Box className="col-lg-2 ms-5 col-1 d-none d-lg-block">
                                <span className="text-white">
                                  {t("qualitySite.Agents")}
                                </span>
                              </Box>
                              <Box className="col col-lg-3">
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
                              </Box>
                            </Box>
                          </li>
                          {/* Opción 2 */}
                          {userType !== "4" && (
                            <li style={{ marginBottom: "10px" }}>
                              <Box className="list-item item-2 d-flex justify-content-between align-items-center">
                                <Box className="col col-lg-5">
                                  <Typography
                                    className="text-white fw-bolder"
                                    variant="h6"
                                  >
                                    {t(
                                      "qualitySite.Monitoring_forms_to_the_agent"
                                    )}
                                  </Typography>
                                </Box>
                                <Box className="col-lg-2 ms-3 col-1 d-none d-lg-block">
                                  <span className="text-white d-none d-lg-block">
                                    {t("qualitySite.Create_and_or_edit_form")}
                                  </span>
                                </Box>
                                <Box
                                  className="col-lg-4 col-7 d-flex justify-content-center"
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
                                </Box>
                              </Box>
                            </li>
                          )}
                          {/* Opción 3 */}
                          {userType !== "4" && (
                            <li style={{ marginBottom: "10px" }}>
                              <Box className="list-item item-3 d-flex justify-content-between align-items-center">
                                <Box className="col-6 col-lg-5">
                                  <Typography
                                    className="text-white fw-bolder"
                                    variant="h6"
                                  >
                                    {t(
                                      "qualitySite.Monitoring_forms_report_to_the_agent"
                                    )}
                                  </Typography>
                                </Box>
                                <Box className="col-lg-3 ms-3 d-none d-lg-block">
                                  <span className="text-white text-start">
                                    {t("qualitySite.Generate_report")}
                                  </span>
                                </Box>
                                <Box className="col-lg-3 justify-content-center col">
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
                                </Box>
                              </Box>
                            </li>
                          )}
                        </ul>
                      </Box>
                    </Box>
                  )}
                </Box>
              )}

              {/* Cards laterales */}

              <Box className="col-12 col-lg-4 col-sm-12">
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  {/* Card de formularios */}
                  <Box className="col-12 col-lg-4 col-sm-12">
                    <Card className="outstanding-card extern">
                      <CardContent className="card-body div-title">
                        <Typography variant="h5">
                          {t("qualitySite.Monitoring_forms")}
                        </Typography>
                        <Box className="row">
                          <Box className="col-12">
                            <span className="text-start fw-bold me-3">
                              {t("qualitySite.Quality_form_ABC_bank")}
                            </span>
                            <i className="fa-regular fa-clipboard"></i>
                          </Box>
                        </Box>
                        <Box className="row">
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
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                  {/* Card de agentes críticos */}
                  <Box className="col-12 col-lg-4 col-sm-12 mt-3 ">
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
                          <Box className="row">
                            <Box className="col-12">
                              <span className="text-start fw-bold me-3">
                                {"Agentes Criticos"}
                              </span>
                              <TrendingDownIcon />
                            </Box>
                          </Box>
                          <Box className="row">
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
                          </Box>
                        </Box>
                        <Box className="row">
                          <Typography className="text-start">
                            {t(
                              "qualitySite.Rate_the_quality_of_customer_service_being_provided_by_the_agent"
                            )}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </section>
      </Box>
    </Box>
  );
};

export default Quality;
