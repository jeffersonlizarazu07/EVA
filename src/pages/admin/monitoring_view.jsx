import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import HeaderLT1 from "../../components/header/headerLT1";
import TableMonitoringView from "../../components/Tables/tableMonitoringView";
import { getMonitoringByUser } from "../../services/agent_listService";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  OutlinedInput,
  ButtonGroup,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { useParams } from "react-router-dom";

const AgentMonitoringView = () => {
  // Estados
  const { agentId } = useParams();
  const [getMonitoring, setGetMonitoring] = useState([]);
  const [idClienteFiltro, setIdClienteFiltro] = useState("");
  const [clientsObjeto, setClientsObjeto] = useState([]);
  const [formId, setFormId] = useState("");
  const [forms, setForms] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [open, setOpen] = useState(false); 
  const [selectedRow, setSelectedRow] = useState(null);
  // Manejo de cambio de fechas
  const handleStartDateChange = (date) => setStartDate(date);
  const handleEndDateChange = (date) => setEndDate(date);

  const selectedKeys = [
    "id",
    "form_title",
    "client_name",
    "monitoring_date",
    "monitoring_dateWithHour",
    "Score",
    "evaluator_name",
    "feedback",
  ];
  const { languageUser } = useContext(UserContext);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(languageUser);
  }, [languageUser, i18n]);

  // Formateo de fecha
  const formattedDate = () =>
    startDate || endDate
      ? dayjs(startDate || endDate).format("YYYY-MM-DD")
      : "";

  useEffect(() => {
    if (!agentId) {
      console.warn("agentId aún no está disponible");
      return;
    }

    const fetchMonitoring = async () => {
      try {
        // Formateo de fechas para enviar al backend
        const formattedStart = startDate
          ? dayjs(startDate).format("YYYY-MM-DD")
          : null;
        const formattedEnd = endDate
          ? dayjs(endDate).format("YYYY-MM-DD")
          : null;

        const monitoringData = await getMonitoringByUser(agentId, {
          startDate: formattedStart,
          endDate: formattedEnd,
        });
        setGetMonitoring(monitoringData);
      } catch (error) {
        console.error("Error al cargar los monitoreos", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
      }
    };

    if (agentId) {
      fetchMonitoring();
    }
  }, [startDate, endDate, agentId]);

  // Manejar cambio de formulario
  const handleChange = (e) => {
    setFormId(e.target.value);
  };

  useEffect(() => {
    console.log("Clientes aqui!!!!:", clientsObjeto);
    console.log("Formularios aqui!!!:", forms);
    i18n.changeLanguage(languageUser);
    console.log("Obteniendo datos de monitoreos...", getMonitoring);
  }, [languageUser, i18n]);

  const monitoringViewProps = {
    getMonitoring,
    header: selectedKeys,
  };

  const handleOpenModal = (row) => {
    setSelectedRow(row); // guarda la fila seleccionada
    setOpen(true);       // abre el modal
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedRow(null);
  };


  return (
    <Box className="App" sx={{ overflow: "hidden" }}>
      <Box id="body">
        <HeaderLT1 />
      </Box>
      <Box sx={{ m: 0, p: 0 }}>
        <Box
          sx={{
            width: "100%",
            px: 3,
            maxWidth: "96%",
          }}
        >
          <Grid item xs={12} sx={{ mb: 4 }}>
            <Card>
              <CardContent sx={{ borderRadius: "50px" }}>
                <Box
                  display="flex"
                  flexWrap="wrap"
                  alignItems="center"
                  justifyContent="center"
                  gap={2}
                  sx={{ mb: 2 }}
                >
                  {/* Boton de regresar */}
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => nav("/quality")}
                    sx={{
                      py: 2,
                      minWidth: "2%",
                      fontWeight: "bold",
                      color: "#b62a8b",
                      borderColor: "#b62a8b",
                      borderTopLeftRadius: "20px",
                      borderBottomLeftRadius: "20px",
                      "&:hover": {
                        borderColor: "#b62a8b",
                        backgroundColor: "rgba(156, 39, 176, 0.04)",
                      },
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1.146 4.854a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H12.5A2.5 2.5 0 0 1 15 6.5v8a.5.5 0 0 1-1 0v-8A1.5 1.5 0 0 0 12.5 5H2.707l3.147 3.146a.5.5 0 1 1-.708.708z"
                      />
                    </svg>
                  </Button>

                  {/* clientes*/}
                  <FormControl
                    required
                    sx={{ minWidth: "20%" }}
                    className="readOnlyField"
                  >
                    <InputLabel id="demo-simple-select-label">
                      {t("survey.selecciona_cliente")}
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={idClienteFiltro}
                      label={t("survey.selecciona_cliente")}
                      onChange={(e) => {
                        setIdClienteFiltro(e.target.value);
                        console.log("ID Cliente seleccionado:", e.target.value);
                      }}
                    >
                      <MenuItem value={""}>None</MenuItem>
                      {clientsObjeto.length > 0 ? (
                        clientsObjeto.map((i) => (
                          <MenuItem value={i.idClient} key={i.idClient}>
                            {i.clientName}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>Cargando Clientes ...</MenuItem>
                      )}
                    </Select>
                  </FormControl>

                  {/* vista formularios */}
                  <FormControl
                    required
                    sx={{ minWidth: "20%" }}
                    className="readOnlyField"
                  >
                    <InputLabel>{t("reports.encuesta")}</InputLabel>
                    <Select
                      labelId="survey-select-label"
                      id="survey-select"
                      value={formId}
                      onChange={(e) => {
                        handleChange(e);
                        console.log(e.target.value);
                      }}
                      input={<OutlinedInput label="Encuesta" />}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {forms
                        .filter((item) => item.idClient === idClienteFiltro)
                        .map((item, i) => (
                          <MenuItem key={i} value={item.id}>
                            {item.title}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                  {/* vista fechas */}
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      className="readOnlyField"
                      label={t("reports.fecha_inicio")}
                      value={startDate}
                      onChange={handleStartDateChange}
                      format="DD/MM/YYYY"
                      sx={{ width: "22%" }}
                    />
                    <DatePicker
                      className="readOnlyField"
                      label={t("reports.fecha_fin")}
                      value={endDate}
                      onChange={handleEndDateChange}
                      format="DD/MM/YYYY"
                      sx={{ width: "22%" }}
                    />
                  </LocalizationProvider>
                  {/*
                              <FormControl required sx={{ minWidth: "10%" }} className="readOnlyField">
                            <TextField
                                id="outlined-basic"
                                label="Evaluador"
                                variant="outlined"
                                value={userName? userName : ""}
                                InputProps={{ readOnly: true }}
                            />
                            </FormControl>
                            */}

                  {/* vista del agente
                              <FormControl required sx={{ minWidth: "10%" }} className="readOnlyField">
                              <InputLabel id="demo-simple-select-label">Agentes</InputLabel>
                                  <Select
                                      labelId="demo-simple-select-label"
                                      id="demo-simple-select"
                                      value={numeroMonitoreos}
                                      label="Agentes"
                                      onChange={handleAgeChange}
                                  >   
                                      <MenuItem value={''}>None</MenuItem>
                                      {agenteExport.length > 0 ? (
                                          agenteExport.map((i, index) => (
                                              <MenuItem value={i} key={index}>
                                                  {i}
                                              </MenuItem>
                                          ))
                                      ) : (
                                          <MenuItem disabled>Cargando Agentes ...</MenuItem>
                                      )}
                                      
                                      
                                  </Select>
                            </FormControl>
                            */}
                </Box>
                {/* mensaje de arvertenca en campos

                          {!loading && allResponses.length === 0 && (
                            <Box mt={3}>
                              <Alert severity="info" sx={{ textAlign: "center" }}>
                                {t("reports.mensaje_reporte")}
                              </Alert>
                            </Box>
                          )}
                          
                          */}
              </CardContent>
            </Card>
          </Grid>
        </Box>
      </Box>

      <Box
        sx={{
          alignItems: "stretch",
          flexWrap: "nowrap",
          padding: 0,
          display: "flex",
        }}
      >
        <Box className="container" mt={0}>
          <TableMonitoringView {...monitoringViewProps} />
        </Box>
      </Box>
    </Box>
  );
};

export default AgentMonitoringView;
