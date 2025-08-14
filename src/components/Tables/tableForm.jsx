import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Grid,
  TableHead,
  TableRow,
  MenuItem as SelectItem,
  Menu,
} from "@mui/material";
import {
  TurnLeft,
  Add,
  Edit,
  PowerSettingsNew,
  CheckCircle,
  MoreVert,
  HelpOutline,
  Search,
} from "@mui/icons-material";
import { MenuItem } from "@mui/material";

import { useState, useEffect } from "react";
import { useTranslations } from "../hooks/useTranslations";
import { useNavigate } from "react-router-dom";
import TablePagination from "@mui/material/TablePagination";

const TableForms = ({
  header,
  data = [],
  onCreate,
  onRemove,
  onUpdate,
  onActive,
  onView,
  resetPageSignal,
}) => {
  const nav = useNavigate();
  const { t } = useTranslations();

  const [searchTerm, setSearchTerm] = useState("");
  const [menuAnchor, setMenuAnchor] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

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
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleMenuOpen = (event, id) => {
    setMenuAnchor({ ...menuAnchor, [id]: event.currentTarget });
  };

  const handleMenuClose = (id) => {
    setMenuAnchor({ ...menuAnchor, [id]: null });
  };

  const filteredHeader = header.filter((h) => h !== "id");

  const filteredData = (Array.isArray(data) ? data : []).filter((item) =>
    Object.values(item).some(
      (val) =>
        typeof val === "string" &&
        val.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const visibleRows = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box className="table-container">
      <Grid container spacing={2} mb={3}>
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
              placeholder={t("formTable.Search")}
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

        {/* Botón crear formulario */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              size="small"
              sx={{
                borderRadius: "18px",
                border: "2px solid #b62a8b",
                color: "#b62a8b",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#b62a8b",
                  color: "white",
                },
              }}
              onClick={onCreate}
            >
              <Add sx={{ fontSize: "18px", mr: 0.5 }} />
              {t("formTable.newForm")}
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Tabla de formularios */}
      <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 450 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {filteredHeader.map((item, i) => (
                <TableCell
                  key={i}
                  align="center"
                  sx={{ fontWeight: "bold", color: "#b62a8b" }}
                >
                  {t(`formTable.${item}`)}
                </TableCell>
              ))}
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", color: "#b62a8b" }}
              >
                {t("formTable.Actions")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((form, idx) => (
              <TableRow key={idx}>
                {filteredHeader.map((key, i) => (
                  <TableCell key={i} align="center">
                    {key === "state"
                      ? form.state === "Activo"
                        ? t("formTable.Active")
                        : t("formTable.Inactive")
                      : key === "average_score"
                      ? Number(form[key]).toFixed(2)
                      : form[key]}
                  </TableCell>
                ))}
                <TableCell align="center">
                  <IconButton onClick={(e) => handleMenuOpen(e, form.id)}>
                    <MoreVert sx={{ color: "#b62a8b" }} />
                  </IconButton>
                  <Menu
                    anchorEl={menuAnchor[form.id]}
                    open={Boolean(menuAnchor[form.id])}
                    onClose={() => handleMenuClose(form.id)}
                  >
                    <MenuItem onClick={() => onView(form)}>
                      <HelpOutline fontSize="small" sx={{ mr: 1 }} />
                      {t("buttons.WatchSections")}
                    </MenuItem>
                    {form.state === "Activo" ? (
                      <>
                        <MenuItem onClick={() => onUpdate(form)}>
                          <Edit fontSize="small" sx={{ mr: 1 }} />
                          {t("buttons.Edit")}
                        </MenuItem>
                        <MenuItem onClick={() => onRemove(form)}>
                          <PowerSettingsNew fontSize="small" sx={{ mr: 1 }} />
                          {t("buttons.Deactivate")}
                        </MenuItem>
                      </>
                    ) : (
                      <MenuItem onClick={() => onActive(form)}>
                        <CheckCircle fontSize="small" sx={{ mr: 1 }} />
                        {t("buttons.Activate")}
                      </MenuItem>
                    )}
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={t("userTable.Show")}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} ${t("userTable.Registered")} ${
              count !== -1 ? count : `más de ${to}`
            }`
          }
          sx={{
            ".MuiTablePagination-toolbar": {
              flexWrap: "wrap",
              justifyContent: "space-between",
            },
            ".MuiInputBase-root": {
              border: "2px solid #b62a8b",
              borderRadius: "6px",
              color: "#b62a8b",
              borderColor: "#b62a8b",
              fontWeight: "bold",
            },
            ".MuiTablePagination-actions .MuiIconButton-root": {
              color: "#b62a8b",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default TableForms;
