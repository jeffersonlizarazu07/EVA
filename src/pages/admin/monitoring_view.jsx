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
    "score",
    "evaluator_name",
    "feedback",
  ];
  const { languageUser } = useContext(UserContext);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(languageUser);
  }, [languageUser, i18n]);

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

  const openModal = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  // Filtra monitorización por rango de fecha
  const filteredMonitoring = getMonitoring.filter((item) => {
    // Validación formato válido de fecha para dayjs
    const monitoringDate = dayjs(item.monitoring_date);

    if (!monitoringDate.isValid()) {
      console.warn("Fecha inválida encontrada:", item.monitoring_date);
      return false;
    }

    const isAfterStart = startDate
      ? monitoringDate.isSame(dayjs(startDate), "day") ||
        monitoringDate.isAfter(dayjs(startDate), "day")
      : true;

    const isBeforeEnd = endDate
      ? monitoringDate.isSame(dayjs(endDate), "day") ||
        monitoringDate.isBefore(dayjs(endDate), "day")
      : true;

    return isAfterStart && isBeforeEnd;
  });

  const monitoringViewProps = {
    getMonitoring:
      filteredMonitoring.length > 0 || startDate || endDate
        ? filteredMonitoring
        : getMonitoring,
    header: selectedKeys,
    openModal,
    closeModal,
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
                  {/* clientes*/}
                  {/* <FormControl
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
                  </FormControl> */}

                  {/* vista formularios */}
                  {/* <FormControl
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
                  </FormControl> */}
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

                  {/* <FormControl required sx={{ minWidth: "10%" }} className="readOnlyField">
                            <TextField
                                id="outlined-basic"
                                label="Evaluador"
                                variant="outlined"
                                value={userName? userName : ""}
                                InputProps={{ readOnly: true }}
                            />
                            </FormControl> */}

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
