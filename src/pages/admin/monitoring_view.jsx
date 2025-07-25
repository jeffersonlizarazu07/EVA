import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
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
  const [getMonitoring, setGetMonitoring] = useState([]); // Trae los minitoreos del agente
  const [filterMonitoring, setFilterMonitoring] = useState([]); // Trae los monitores del agente filtrados por fecha
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
    if (!agentId) return;

    const fetchMonitoring = async () => {
      try {
        const monitoringData = await getMonitoringByUser(agentId);

        // Guarda la lista original en cache
        setGetMonitoring(monitoringData);

        // Guarda monitorizaciones filtradas por fecha
        setFilterMonitoring(monitoringData);
      } catch (error) {
        console.error("Error al cargar monitoreos:", error);
      }
    };

    fetchMonitoring();
  }, [agentId]);

  // Filtrado en memoria según fechas
  useEffect(() => {
    if (startDate && endDate) {
      const filtered = getMonitoring.filter((item) => {
        const monitoringDate = dayjs(item.monitoring_date, "DD/MM/YYYY");

        // Formatear fecha
        const start = dayjs(startDate);
        const end = dayjs(endDate);

        console.log("monitoring_date:", item.monitoring_date);
        console.log(
          "parsed:",
          dayjs(item.monitoring_date, "DD/MM/YYYY").isValid()
        );

        const isAfterStart =
          monitoringDate.isSame(start, "day") ||
          monitoringDate.isAfter(start, "day");

        const isBeforeEnd =
          monitoringDate.isSame(end, "day") ||
          monitoringDate.isBefore(end, "day");

        return isAfterStart && isBeforeEnd;
      });

      setFilterMonitoring(filtered);
    } else {
      // Si los inputs de fechas están vacías, vuelve a la lista original cacheada
      setFilterMonitoring(getMonitoring);
    }
  }, [startDate, endDate, getMonitoring]);

  const monitoringViewProps = {
    data: startDate || endDate ? filterMonitoring : getMonitoring, // Si existen filtro de fechas envia datos filtrados, de lo contrario envia la data total
    header: selectedKeys,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
  };

  return (
    <Box className="App" sx={{ overflow: "hidden" }}>
      <Box id="body">
        <HeaderLT1 />
      </Box>

      <Box className="container" mt={0}>
        <TableMonitoringView {...monitoringViewProps} />
      </Box>
    </Box>
  );
};

export default AgentMonitoringView;
