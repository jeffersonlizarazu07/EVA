import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import "../../assets/css/tabla.css";
import { useNavigate } from "react-router-dom";
import { useTranslations } from "../hooks/useTranslations"; 
import React from "react";
import {
  Table,
  Menu,
  MenuItem,
  Tooltip,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  IconButton,
  Paper,
  Box,
  Grid,
  InputAdornment,
} from "@mui/material";
import {
  TurnLeft,
  Add,
  Edit,
  PowerSettingsNew,
  MoreVert,
  Search,
  HelpOutline,
  Link as LinkIcon,
  Email as EmailIcon,
  FileCopy as FileCopyIcon,
} from "@mui/icons-material";
import TablePagination from "@mui/material/TablePagination";

const TableSurvey = ({
  header,
  data,
  onCreate,
  onRemove,
  onUpdate,
  onView,
  modalId,
  modalId2,
  onActive,
  onDuplicate,
  onCheck,
  onCopyLink,
  onBulkEmail,
}) => {
  const nav = useNavigate();
  const { userInfo } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [userClients, setUserClients] = useState([]);
  const { userId, accessToken, languageUser } = useContext(UserContext);
  const { t } = useTranslations();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedItem, setSelectedItem] = React.useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0); // Reset page to 0 cuando cambia rows per page
  };

  const handleMenuOpen = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleMenuAction = (action, item) => {
    handleMenuClose();
    action(item);
  };

  useEffect(() => {
    getUserClients(userId);
    filteredData;
  });

  const getUserClients = async (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    };

    try {
      const response = await axios.get(
        `http://localhost:3000/api/users_client/${id}`,
        config
      );
      setUserClients(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset page to 1 on new search
  };

  const capitalize = (text) => {
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const filteredData = data.filter((item) =>
    //userClients.some(client => client.id  ==  item.idClient) &&
    Object.values(item).some(
      (val) =>
        typeof val == "string" &&
        val.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const headerTranslations = {
    Title: t("survey.titulo"),
    Start_date: t("survey.fecha_inicio"),
    End_date: t("survey.fecha_fin"),
    state: t("survey.estado"),
  };
  return (
    <Box className="table-container">
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{ height: "40px" }}
          >
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
              onClick={() => nav("/satisfaction")}
            >
              {" "}
              <TurnLeft />
            </Button>
            <TextField
              size="small"
              className="inp-search"
              placeholder={t("survey.buscar")}
              value={searchTerm}
              onChange={handleSearch}
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
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            {userInfo?.type !== 4 && (
              <Button
                variant="h5"
                size="small"
                sx={{
                  borderRadius: "18px",
                  border: "1px solid #b62a8b",
                  color: "#b62a8b",
                  borderColor: "#b62a8b",
                  "&:hover": {
                    borderColor: "#b62a8b",
                    backgroundColor: "#b62a8b",
                    color: "white",
                  },
                }}
                onClick={() => onCreate()}
              >
                <Add sx={{ fontSize: "18px" }} />
                {t("survey.encuestas")}
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Tabla */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ maxHeight: 450, overflowY: "auto" }}
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
                  {headerTranslations[item] || capitalize(item)}
                </TableCell>
              ))}
              <TableCell
                sx={{
                  fontSize: "1rem",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                {t("survey.acciones")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRecords.map((item, idx) => (
              <TableRow key={idx}>
                {header.map((col, i) => (
                  <TableCell key={i} align="center">
                    {col == "state"
                      ? item.state == 1
                        ? `${t("clientTable.Active")}`
                        : `${t("clientTable.Inactive")}`
                      : item[col.toLowerCase()] || item[col]}
                  </TableCell>
                ))}

                <TableCell align="center">
                  {item.state == 1 ? (
                    <Box>
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, item)}
                        sx={{
                          color: " #b62a8b",
                          "&:hover": { backgroundColor: "#e9ecef" },
                        }}
                      >
                        <MoreVert />
                      </IconButton>

                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl) && selectedItem === item}
                        onClose={handleMenuClose}
                      >
                        {userInfo?.type !== 4 && (
                          <MenuItem
                            onClick={() => handleMenuAction(onCheck, item)}
                            sx={{
                              display: "flex",
                              gap: 1,
                              color: " #b62a8b",
                              "&:hover": { backgroundColor: "#f8f9fa" },
                            }}
                          >
                            <HelpOutline sx={{ fontSize: 18 }} />
                            {t("survey.ver_preguntas")}
                          </MenuItem>
                        )}

                        <MenuItem
                          onClick={() => handleMenuAction(onCopyLink, item)}
                          sx={{
                            color: " #b62a8b",
                            display: "flex",
                            gap: 1,
                            "&:hover": { backgroundColor: "#f8f9fa" },
                          }}
                        >
                          <LinkIcon sx={{ fontSize: 18 }} />
                          {t("survey.copiar_enlace")}
                        </MenuItem>

                        {userInfo?.type !== 4 && (
                          <MenuItem
                            onClick={() => handleMenuAction(onUpdate, item)}
                            sx={{
                              color: " #b62a8b",
                              display: "flex",
                              gap: 1,
                              "&:hover": { backgroundColor: "#f8f9fa" },
                            }}
                          >
                            <Edit sx={{ fontSize: 18 }} />
                            {t("survey.editar")}
                          </MenuItem>
                        )}

                        <MenuItem
                          onClick={() => handleMenuAction(onBulkEmail, item)}
                          sx={{
                            color: " #b62a8b",
                            display: "flex",
                            gap: 1,
                            "&:hover": { backgroundColor: "#f8f9fa" },
                          }}
                        >
                          <EmailIcon sx={{ fontSize: 18 }} />
                          {t("survey.envio_masivo")}
                        </MenuItem>

                        {userInfo?.type !== 4 && (
                          <MenuItem
                            onClick={() => handleMenuAction(onDuplicate, item)}
                            sx={{
                              color: " #b62a8b",
                              display: "flex",
                              gap: 1,
                              "&:hover": { backgroundColor: "#f8f9fa" },
                            }}
                          >
                            <FileCopyIcon sx={{ fontSize: 18 }} />
                            {t("survey.duplicar")}
                          </MenuItem>
                        )}

                        {userInfo?.type !== 4 && (
                          <MenuItem
                            onClick={() => handleMenuAction(onRemove, item)}
                            sx={{
                              color: " #b62a8b",
                              display: "flex",
                              gap: 1,
                              "&:hover": { backgroundColor: "#f8f9fa" },
                            }}
                          >
                            <PowerSettingsNew sx={{ fontSize: 18 }} />
                            {t("survey.deshabilitar")}
                          </MenuItem>
                        )}
                      </Menu>
                    </Box>
                  ) : (
                    <Box
                      sx={{ display: "flex", gap: 1, justifyContent: "center" }}
                    >
                      <Tooltip title={t("survey.activar")} placement="bottom">
                        <IconButton onClick={() => onActive(item)} size="small">
                          <PowerSettingsNew />
                        </IconButton>
                      </Tooltip>

                      <Tooltip
                        title={t("survey.ver_detalle")}
                        placement="bottom"
                      >
                        <IconButton onClick={() => onView(item)} size="small">
                          <Search />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          mt: 2,
          alignItems: "center",
        }}
      >
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={t("clientTable.fila_pagina")}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} ${t("clientTable.de")} ${
              count !== -1 ? count : `more than ${to}`
            }`
          }
          sx={{
            // Estilos personalizados para alinear verticalmente
            display: "flex",
            alignItems: "center",
            ".MuiTablePagination-toolbar": {
              alignItems: "center", // Alinea todos los hijos verticalmente
            },
            ".MuiTablePagination-selectLabel": {
              display: "flex",
              alignItems: "center",
              marginBottom: 0,
            },
            ".MuiTablePagination-displayedRows": {
              display: "flex",
              alignItems: "center",
              marginBottom: 0,
            },
            ".MuiInputBase-root": {
              backgroundColor: "#b62a8b",
              color: "white",
              borderRadius: "4px",
            },
          }}
        />
      </Box>
    </Box>
  );
};
export default TableSurvey;
