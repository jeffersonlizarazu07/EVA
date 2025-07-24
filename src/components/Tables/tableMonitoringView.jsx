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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ModalMonitoringView from "../../components/Modals/modalMonitoring_view";

const TableMonitoringView = ({ data, resetPageSignal, header }) => {
  const nav = useNavigate();
  // Traducción
  const { languageUser } = useContext(UserContext);
  const { t, i18n } = useTranslation();
  // Paginación
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  //Modal
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    i18n.changeLanguage(languageUser);
  }, [languageUser, i18n]);

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
    ? data.filter((item) =>
        Object.values(item).some(
          (val) =>
            typeof val === "string" &&
            val.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : [];

  const currentRecords = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getHeaderLabel = (item) => {
    switch (item) {
      case "id":
        return "Identificador";
      case "form_title":
        return "Formulario";
      case "client_name":
        return "Cliente";
      case "monitoring_date":
        return "Fecha";
      case "monitoring_dateWithHour":
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

  // Manejo del modal
  const openModal = (rowData) => {
    setSelectedRow(rowData);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const ModalMonitoringViewProps = {
    open,
    closeModal,
    data: selectedRow,
  };

  console.log("Esta es la data que envía la tabla", data);

  return (
    <Box className="table-container">
      {/* Buscador */}
      <Grid container spacing={2} mb={2}>
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
              onClick={() => nav("/agent_list")}
            >
              <TurnLeft />
            </Button>
            <TextField
              size="small"
              placeholder={t("userTable.Search")}
              value={searchTerm}
              onChange={handleSearch}
              className="inp-search"
              variant="outlined"
              sx={{
                width: "100%",
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
        </Grid>
      </Grid>

      {/* Traer el nombre del agente al que pertenecen las monitorizaciones */}
      {data.length > 0 && (
        <Box sx={{ mb: 1 }}>
          <Typography
            variant="body1"
            textAlign="center"
            sx={{ fontWeight: "bold", fontSize: "20px", paddingTop: "6px", paddingBottom: "6px"}}
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
                        color="primary"
                        onClick={() => openModal(item)}
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
