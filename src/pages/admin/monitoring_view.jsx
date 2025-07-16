import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import HeaderLT1 from "../../components/header/headerLT1";
import MonitoringView from "../../components/Tables/tableMonitoringView";
import { getMonitoringByUser } from "../../services/agent_listService";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
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
  const { agentId } = useParams();
  const [getMonitoring, setGetMonitoring] = useState([]);
  // const agentId = userInfo?.id;

  useEffect(() => {
    if (!agentId) {
      console.warn("agentId aún no está disponible");
      return;
    }

    const fetchMonitoring = async () => {
      try {
        const monitoringData = await getMonitoringByUser(agentId);
        console.log("Data de monitorización:", monitoringData);
        setGetMonitoring(monitoringData);
      } catch (error) {
        console.error("Error al cargar los monitoreos", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
      }
    };

    fetchMonitoring();
  }, [agentId]);

  // const inicializate = () => {
  //   loadMonitoring();
  // }, [];

  const monitoringViewProps = {
    getMonitoring,
  };

  return (
    <Box>
      <HeaderLT1 />
      {/* <MonitoringView /> */}
      <MonitoringView {...monitoringViewProps} />
      <Box></Box>
    </Box>
  );
};
export default AgentMonitoringView;
