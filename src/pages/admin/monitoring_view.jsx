import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslations } from "../../components/hooks/useTranslations";
import dayjs from "dayjs";
import HeaderLT1 from "../../components/header/headerLT1";
import TableMonitoringView from "../../components/Tables/tableMonitoringView";
import { getMonitoringByUser } from "../../services/agent_listService";
import { Box } from "@mui/material";

const AgentMonitoringView = () => {
  // Estados
  const { t } = useTranslations();
  const { agentId } = useParams();
  const [getMonitoring, setGetMonitoring] = useState([]); // Trae los minitoreos del agente
  const [filterMonitoring, setFilterMonitoring] = useState([]); // Trae los monitores del agente filtrados por fecha
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  // Tra los datos adicionales de monitorización (Total de monitorizaciones, Promedio de Score)
  const [monitoringStats, setMonitoringStats] = useState({
    total_monitorings: 0,
    average_score: 0,
  });

  const selectedKeys = [
    "id",
    "form_title",
    "client_name",
    "monitoring_date",
    "check_formatted",
    "score",
    "evaluator_name",
    "feedback",
  ];

  const getHeaderLabel = (item) => {
    switch (item) {
      case "id":
        return "Identificador";
      case "form_title":
        return "Formulario";
      case "client_name":
        return "Cliente";
      case "monitoring_date":
        return "Fecha de Monitorización";
      case "check_formatted":
        return "Enviada";
      case "score":
        return "Score";
      case "evaluator_name":
        return "Evaluador";
      case "feedback":
        return "Comentarios";
      default:
        return item;
    }
  };

  const getUserType = (type) => {
    switch (type) {
      case 1:
        return t("userTable.SuperAdmin");
      case 2:
        return t("userTable.Admin");
      case 3:
        return t("userTable.Editor");
      default:
        return t("userTable.Viwer");
    }
  };

  const fetchMonitoring = async () => {
    try {
      const result = await getMonitoringByUser(agentId);
      setGetMonitoring(result.data);
      setFilterMonitoring(result.data);
      setMonitoringStats(result.stats);
    } catch (error) {
      console.error("Error al cargar monitoreos:", error);
    }
  };

  useEffect(() => {
    if (!agentId) return;
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
    // Si existen filtro de fechas envia datos filtrados, de lo contrario envia la data total
    header: selectedKeys,
    data: startDate || endDate ? filterMonitoring : getMonitoring,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    getUserType,
    getHeaderLabel,
    fetchMonitoring,
    viewType: getUserType,
    monitoringStats,
    setMonitoringStats
  };

  return (
    <Box sx={{ overflow: "hidden" }}>
      <Box>
        <HeaderLT1 />
      </Box>

      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
          px: 2,
          mt: 0,
        }}
      >
        <TableMonitoringView {...monitoringViewProps} />
      </Box>
    </Box>
  );
};

export default AgentMonitoringView;
