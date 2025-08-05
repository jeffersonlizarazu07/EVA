import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { useTranslation } from "react-i18next";
import {
  Table,
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
  TablePagination,
} from "@mui/material";
import {
  TurnLeft,
  Search
} from "@mui/icons-material";
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


const TableFormReport = ({ header, data, onSelectionChange }) => {
 
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    onSelectionChange(selectedRows);
  }, [selectedRows]);

  const handleCheckboxChange = (item) => {
    setSelectedRows((prev) => {
      const alreadySelected = prev.find((i) => i.id_monitoreo === item.id_monitoreo);
      if (alreadySelected) {
        return prev.filter((i) => i.id_monitoreo !== item.id_monitoreo);
      } else {
        return [...prev, item];
      }
    });
  };

  const { languageUser } = useContext(UserContext);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(languageUser);
  }, [languageUser, i18n]);

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

    

  const indexOffset = header.findIndex(h => h.key.startsWith("Pregunta"));
  
  
  return (
    <Box className="table-container">
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <Box display="flex" alignItems="center" gap={1}>
            
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

      <TableContainer component={Paper} elevation={0} sx={{ width:"100%", overflowY: "auto" }}>
  <Table size="small">
    <TableHead>
      <TableRow>
        <TableCell sx={{ fontSize: "1rem", textAlign: "center", fontWeight: "bold" }}>
          {t("clientTable.seleccionar_para_descargar")}
        </TableCell>
        {header.map((item, i) => (
          <TableCell key={i} align="center" sx={{
            fontWeight: "bold",
            whiteSpace: "normal",
            minWidth: item.key === "feedback" ? 250 : 300,
            maxWidth: item.key === "feedback" ? "none" : 300,
            wordWrap: "break-word",
          }}>
            {item.label}
          </TableCell>
        ))}
        
      </TableRow>
    </TableHead>
    <TableBody>
      {currentRecords.map((row, idx) => {
        const selected = selectedRows.some(r => r.id_monitoreo === row.id_monitoreo);
        return (
          <TableRow key={idx}>
            <TableCell align="center">
              <IconButton
                onClick={() => handleCheckboxChange(row)}
                sx={{
                  color: selected ? "#b62a8b" : "#ccc",
                  "&:hover": { color: "#b62a8b" },
                }}
              >
                {selected ? <CheckCircleIcon /> : <CheckCircleOutlineIcon />}
              </IconButton>
            </TableCell>
            {header.map((col, i) => (
              <TableCell key={i} align="center">
                {col.key.startsWith("Pregunta")
                  ? row.preguntas?.[i - indexOffset]?.respuesta || ""
                  : row[col.key]}
              </TableCell>
            ))}
            
          </TableRow>
        );
      })}
    </TableBody>
  </Table>
</TableContainer>


<Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2, alignItems: "center" }}>
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
      `${from}-${to} ${t("userTable.Registered")} ${count !== -1 ? count : `more than ${to}`}`
    }
    sx={{
      display: "flex",
      alignItems: "center",
      ".MuiTablePagination-toolbar": {
        alignItems: "center",
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

export default TableFormReport;
