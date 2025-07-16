import React from "react";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { useTranslation } from "react-i18next";
import {
  Box,
  Grid,
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
  InputAdornment,
} from "@mui/material";
import { TurnLeft, Search, Today } from "@mui/icons-material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import TablePagination from "@mui/material/TablePagination";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const MonitoringView = ({ getMonitoring, resetPageSignal, header }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  //Formateo de fecha
  const currentDate = new Date().toISOString().split("T")[0];

  // Estados para manejar filtrado de fechas
  const [startDate, setStartDate] = useState(currentDate);
  const [endDate, setEndDate] = useState(currentDate);
  const [filteredMonitorings, setFilteredMonitorings] = useState([]); // Guarda el filtro de los monitoreos según rango de fechas
  const [tableData, setTableData] = useState([]); // Datos que realmente se ven

  const nav = useNavigate();
  const { languageUser } = useContext(UserContext);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (resetPageSignal) {
      setPage(0);
    }
  }, [resetPageSignal]);

  // Filtro en campos específicos: form_title, client_name, monitoring_date
  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    const filtered = getMonitoring.filter((item) => {
      const search = value.toLowerCase();
      const matchesFormTitle = item.form_title?.toLowerCase().includes(search);
      const matchesClientName = item.client_name
        ?.toLowerCase()
        .includes(search);
      const matchesDate = item.monitoring_date?.toLowerCase().includes(search);
      return matchesFormTitle || matchesClientName || matchesDate;
    });

    setTableData(filtered);
    setPage(0);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // const tableData = (
  //   Array.isArray(getMonitoring) ? getMonitoring : []
  // ).filter((item) => {
  //   const search = searchTerm.toLowerCase();

  //   const matchesFormTitle = item.form_title?.toLowerCase().includes(search);
  //   const matchesClientName = item.client_name?.toLowerCase().includes(search);
  //   const matchesDate = item.monitoring_date?.toLowerCase().includes(search);

  //   return matchesFormTitle || matchesClientName || matchesDate;
  // });

  const visibleRows = tableData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Inicializa la tabla con todos los monitoreos
  useEffect(() => {
    if (getMonitoring) {
      setTableData(getMonitoring);
    }
  }, [getMonitoring]);

  // Función para aplicar filtros por fecha de monitorización
  const filterMonitoringsForDate = () => {
    const filtered = getMonitoring.filter((monitoreo) => {
      const itemDate = new Date(monitoreo.monitoring_date);
      return (
        (!startDate || itemDate >= new Date(startDate)) &&
        (!endDate || itemDate <= new Date(endDate))
      );
    });
    setTableData(filtered);
  };

  return (
    <Box
      className="table-container"
      margin={4}
      sx={{
        overflowY: "scroll", // fuerza la reserva del espacio
        height: "100vh", // asegura el alto completo de la pantalla
      }}
    >
      {/* Header */}
      <Grid container spacing={2} mb={3}>
        {/* Botón de retroceso y buscador */}
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <Box display="flex" alignItems="center" gap={1}>
            <Button
              variant="outlined"
              size="small"
              sx={{
                minWidth: 0,
                width: 30,
                height: 30,
                padding: 0,
                borderRadius: "50%",
                color: "#b62a8b",
                borderColor: "#b62a8b",
                "&:hover": {
                  borderColor: "#b62a8b",
                  backgroundColor: "#b62a8b",
                  color: "white",
                },
              }}
              onClick={() => nav("/admin")}
            >
              <TurnLeft />
            </Button>

            <TextField
              size="small"
              placeholder="Buscar"
              value={searchTerm}
              onChange={handleSearch}
              variant="outlined"
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "4vh",
                  borderRadius: "6px",
                  color: "#b62a8b",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#b62a8b",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#b62a8b",
                  },
                  "& input": {
                    color: "#b62a8b",
                    fontWeight: "bold",
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "#b62a8b" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Grid>
      </Grid>

      {/*Filtro de monitorizaciones: Fecha inicial - Fecha final */}
      <Accordion sx={{ width: "30%", mb: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "#b62a8b" }} />}
          aria-controls="filter-content"
          id="filter-header"
          sx={{
            backgroundColor: "#e6e3e1ff",
            color: "black",
            height: "50px",
            "& .MuiAccordionSummary-content": {
              justifyContent: "space-between",
            },
          }}
        >
          <Typography sx={{ paddingLeft: "8px", fontWeight: "bold" }}>
            Employee Monitor Search
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Typography fontWeight="bold" sx={{ mb: 1 }}>
            Fecha de inicio
          </Typography>
          <TextField
            type="date"
            value={startDate || ""}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
              mb: 2,
              width: "100%",
              "& .MuiInputBase-root": { height: "45px" },
              "& input": { height: "45px", padding: "0 8px" },
            }}
          />

          <Typography fontWeight="bold" sx={{ mb: 1 }}>
            Fecha de finalización
          </Typography>
          <TextField
            type="date"
            value={endDate || ""}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
              mb: 2,
              width: "100%",
              "& .MuiInputBase-root": { height: "45px" },
              "& input": { height: "45px", padding: "0 8px" },
            }}
          />

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              sx={{
                mt: 2,
                width: "30%",
                backgroundColor: "#b62a8b",
                "&:hover": { backgroundColor: "#9b2376" },
              }}
              onClick={filterMonitoringsForDate}
              disabled={!startDate || !endDate}
            >
              Filtrar
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Mapeo de nombre del agente */}
      {getMonitoring.map((monitoreo) => (
        <Box key={monitoreo.id} sx={{ marginLeft: "4px" }}>
          <h3>{monitoreo.agent_name}</h3>
        </Box>
      ))}

      {/* Tabla */}
      <TableContainer
        component={Paper}
        elevation={2}
        sx={{
          borderRadius: "10px",
          boxShadow: "none",
          border: "1px solid #f8bbd0",
          maxHeight: 450,
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#fce4ec",
                "& .MuiTableCell-root": {
                  padding: "12px 8px 8px 12px",
                  lineHeight: 1,
                  fontWeight: "bold",
                },
              }}
            >
              <TableCell align="center">Identificador</TableCell>
              <TableCell align="center">Formulario</TableCell>
              <TableCell align="center">Cliente</TableCell>
              <TableCell align="center">Fecha de monitorización</TableCell>
              <TableCell align="center">Enviada</TableCell>
              <TableCell align="center">Score</TableCell>
              <TableCell align="center">Evaluador</TableCell>
              <TableCell align="center">Feedback</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {visibleRows.map((monitoreo) => (
              <TableRow key={monitoreo.id} hover>
                <TableCell align="center">
                  <Typography
                    onClick={() => {}}
                    sx={{
                      cursor: "pointer",
                      color: "#b62a8b",
                      textDecoration: "none",
                      "&:hover": {
                        color: "primary.main",
                      },
                    }}
                  >
                    {monitoreo.id}
                  </Typography>{" "}
                </TableCell>
                <TableCell align="center">{monitoreo.form_title}</TableCell>
                <TableCell align="center">{monitoreo.client_name}</TableCell>
                <TableCell align="center">
                  {monitoreo.monitoring_date}
                </TableCell>
                <TableCell align="center">
                  {monitoreo.monitoring_dateWithHour}
                </TableCell>
                <TableCell align="center">{monitoreo.score}</TableCell>
                <TableCell align="center">{monitoreo.evaluator_name}</TableCell>
                <TableCell align="center">{monitoreo.feedback}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {/*Selector y texto */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            paddingLeft: "10px",
          }}
        >
          <Typography>{t("userTable.Show")}</Typography>
          <Select
            size="small"
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            sx={{
              border: "2px solid #b62a8b",
              borderRadius: "6px",
              color: "#b62a8b",
              fontWeight: "bold",
              fontSize: "15px",
              width: "67px",
              height: "37px",
            }}
          >
            {[10, 25, 50].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Índice de páginas */}
        <Box sx={{ textAlign: "center", flex: 1 }}>
          <Typography>
            {`${page * rowsPerPage + 1}-${Math.min(
              (page + 1) * rowsPerPage,
              tableData.length
            )} ${t("userTable.Registered")} ${tableData.length}`}
          </Typography>
        </Box>

        {/* Botones de navegación */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={() => handleChangePage(null, page - 1)}
            disabled={page === 0}
            sx={{ color: "#b62a8b" }}
          >
            <KeyboardArrowLeft />
          </IconButton>
          <IconButton
            onClick={() => handleChangePage(null, page + 1)}
            disabled={page >= Math.ceil(tableData.length / rowsPerPage) - 1}
            sx={{ color: "#e9e8e9ff" }}
          >
            <KeyboardArrowRight />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default MonitoringView;
