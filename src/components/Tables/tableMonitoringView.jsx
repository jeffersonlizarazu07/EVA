import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslations } from "../hooks/useTranslations";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
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
  Typography,
  InputAdornment,
  FormControl,
  InputLabel,
} from "@mui/material";
import { TurnLeft, Search, Today, MarginOutlined } from "@mui/icons-material";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import ModalMonitoringView from "../../components/Modals/modalMonitoring_view";

const TableMonitoringView = ({
  data,
  resetPageSignal,
  header,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  getUserType,
  getHeaderLabel,
  fetchMonitoring,
  viewType,
  monitoringStats,
  setMonitoringStats
}) => {
  const nav = useNavigate();
  const location = useLocation();
  // Traducción
  const { t } = useTranslations();
  
  // Verificar si estamos en la vista de agente (monitoring_view)
  const isAgentView = location.pathname.includes('/monitoring_view/');
  // Paginación
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  // Filtro de clientes
  // Filtra por los formularios de clientes existentes en las monitorizaciones
  const clients = [...new Set(data.map((item) => item.client_name))];
  const [selectedClient, setSelectedClient] = useState(""); // Cliente seleccionado en el filtro
  //Modal
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    if (resetPageSignal) {
      setPage(0);
    }
  }, [resetPageSignal]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(+event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const filteredData = Array.isArray(data)
    ? data.filter((item) => {
        const matchesSearch = Object.values(item).some(
          (val) =>
            typeof val === "string" &&
            val.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const matchesClient =
          !selectedClient || selectedClient === "none"
            ? true
            : item.client_name?.toLowerCase() === selectedClient.toLowerCase();

        return matchesSearch && matchesClient;
      })
    : [];

  // Recalcular métricas cada vez que cambie filteredData
  useEffect(() => {
    const total = filteredData.length;
    const avg =
      total > 0
        ? (
            filteredData.reduce((sum, item) => sum + (item.score ?? 0), 0) /
            total
          ).toFixed(2)
        : 0;

    setMonitoringStats({
      total_monitorings: total,
      average_score: avg,
    });
  }, [filteredData]); // Actualiza las formulas dependiendo del filtrado

  const currentRecords = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Manejo del modal
  const openModal = (rowData) => {
    setSelectedRow(rowData);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  // Función para actualizar feedback desde el modal del id de monitorización seleccionado en la tabla
  const updateSelectedRow = (id, newFeedback) => {
    setSelectedRow((prev) => {
      if (prev?.id !== id) return prev;
      return { ...prev, feedback: newFeedback };
    });
  };

  const ModalMonitoringViewProps = {
    open,
    closeModal,
    data: selectedRow,
    t,
    fetchMonitoring,
    viewType,
    updateSelectedRow,
  };

  console.log("Esta es la data que envía la tabla", data);

  return (
    <Box className="table-container">
      {/* Buscador */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={6} md={6} lg={12}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            flexWrap="wrap"
            gap={2}
          >
            {/* Izquierda: botón y búsqueda */}
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              sx={{ marginLeft: "12px" }}
            >
              {/* Solo mostrar el botón de devolver si NO estamos en la vista de agente */}
              {!isAgentView && (
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    minWidth: 30,
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
                  onClick={() => nav("/agent_list")}
                >
                  <TurnLeft />
                </Button>
              )}

              <TextField
                size="small"
                placeholder={t("userTable.Search")}
                value={searchTerm}
                onChange={handleSearch}
                className="inp-search"
                variant="outlined"
                sx={{
                  width: "250px",
                  "& .MuiOutlinedInput-root": {
                    height: "4vh",
                    "&.Mui-focused fieldset": {
                      borderColor: "transparent",
                    },
                    "&.Mui-focused": {
                      boxShadow: "none",
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "#888" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            {/*Filtro evaluador */}
            <FormControl
              sx={{
                width: "14rem",
                "& .MuiInputBase-root": {
                  height: "40px",
                },
                "& .MuiSelect-select": {
                  padding: "8px 14px",
                  display: "flex",
                  alignItems: "center",
                },
                // Borde fucsia en todos los estados
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#b62a8b",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#b62a8b",
                },
                "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#b62a8b !important",
                },
                // Label fucsia en focus
                "& .Mui-focused": {
                  color: "#b62a8b !important",
                },
                // Fondo y texto fucsia en el item seleccionado
                "& .MuiMenuItem-root.Mui-selected": {
                  backgroundColor: "rgba(182, 42, 139, 0.1) !important",
                  color: "#b62a8b",
                },
                "& .MuiMenuItem-root.Mui-selected:hover": {
                  backgroundColor: "rgba(182, 42, 139, 0.2) !important",
                },
              }}
              size="small"
            >
              <InputLabel sx={{ color: "#b62a8b" }}>
                Seleccione un evaluador
              </InputLabel>
              <Select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
              >
                <MenuItem sx={{ height: "30px" }}></MenuItem>
                {clients.map((client, index) => (
                  <MenuItem key={index} value={client || "None"}>
                    {client}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* DATEPICKERS */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box
                display="flex"
                alignItems="center"
                gap={2}
                sx={{ marginRight: "12px" }}
              >
                <DatePicker
                  className="readOnlyField"
                  label={t("reports.fecha_inicio")}
                  format="DD/MM/YYYY"
                  value={startDate}
                  onChange={setStartDate}
                  sx={{ width: "20rem" }}
                  slotProps={{
                    textField: {
                      size: "small",
                      sx: {
                        "& .MuiInputBase-root": {
                          height: "40px",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#b62a8b",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#b62a8b",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#b62a8b",
                        },
                      },
                    },
                  }}
                />
                <DatePicker
                  className="readOnlyField"
                  label={t("reports.fecha_fin")}
                  format="DD/MM/YYYY"
                  value={endDate}
                  onChange={setEndDate}
                  sx={{ width: "20rem" }}
                  slotProps={{
                    textField: {
                      size: "small",
                      sx: {
                        "& .MuiInputBase-root": {
                          height: "40px",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#b62a8b",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#b62a8b",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#b62a8b",
                        },
                      },
                    },
                  }}
                />
              </Box>
            </LocalizationProvider>
          </Box>
        </Grid>
      </Grid>

      {/* Traer el nombre del agente al que pertenecen las monitorizaciones */}
      {data.length > 0 && (
        <Box sx={{ mb: 1 }}>
          <Typography
            variant="body1"
            textAlign="center"
            sx={{
              fontWeight: "bold",
              fontSize: "20px",
              paddingTop: "6px",
              paddingBottom: "6px",
              color: "#b62a8b",
            }}
          >
            {data[0].agent_name}
          </Typography>
        </Box>
      )}

      {/* Tabla */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ maxHeight: 450, overflowY: "auto", marginBottom: "3rem" }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              {header.map((item, i) => (
                <TableCell
                  key={i}
                  sx={{
                    fontSize: "1rem",
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#b62a8b",
                  }}
                >
                  {getHeaderLabel(item)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {currentRecords.map((item, idx) => (
              <TableRow key={idx}>
                {header.map((key, i) => (
                  <TableCell key={i} align="center">
                    {key === "state" ? (
                      item.state === 1 ? (
                        t("userTable.Active")
                      ) : (
                        t("userTable.Inactive")
                      )
                    ) : key === "type" ? (
                      getUserType(item.type)
                    ) : key === "id" ? (
                      <Button
                        variant="text"
                        onClick={() => openModal(item)}
                        sx={{ color: "#b62a8b" }}
                      >
                        {item[key]}
                      </Button>
                    ) : (
                      item[key]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            <TableRow>
              {header.map((key, i) => (
                <TableCell key={i} align="center">
                  {key === "id" ? (
                    <>
                      <Box sx={{ fontWeight: "bold", color: "#b62a8b" }}>
                        Total
                      </Box>
                      <Typography sx={{ fontWeight: "bold" }}>
                        {monitoringStats.total_monitorings}
                      </Typography>
                    </>
                  ) : key === "score" ? (
                    <>
                      <Box sx={{ fontWeight: "bold", color: "#b62a8b" }}>
                        Promedio
                      </Box>
                      <Typography sx={{ fontWeight: "bold" }}>
                        {monitoringStats.average_score}
                      </Typography>
                    </>
                  ) : null}
                </TableCell>
              ))}
            </TableRow>
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
              currentRecords.length
            )} ${t("userTable.Registered")} ${currentRecords.length}`}
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
            disabled={
              page >= Math.ceil(currentRecords.length / rowsPerPage) - 1
            }
            sx={{ color: "#e9e8e9ff" }}
          >
            <KeyboardArrowRight />
          </IconButton>
        </Box>
      </Box>
      <Box>
        {open && data && data.length > 0 && (
          <ModalMonitoringView {...ModalMonitoringViewProps} />
        )}
      </Box>
    </Box>
  );
};

export default TableMonitoringView;
