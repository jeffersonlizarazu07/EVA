import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
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

const AgentMonitoringView = () => {
  // Estados
  const { agentId } = useParams();
  const [getMonitoring, setGetMonitoring] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
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

  useEffect(() => {
    i18n.changeLanguage(languageUser);
    console.log("Obteniendo datos de monitoreos...", getMonitoring);
  }, [languageUser, i18n]);

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
    data: startDate || endDate ? filteredMonitoring : getMonitoring, // Si existen filtro de fechas envia datos filtrados, de lo contrario envia la data total
    header: selectedKeys,
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
                  {/* Input: Filtro de fechas */}
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
                </Box>
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
