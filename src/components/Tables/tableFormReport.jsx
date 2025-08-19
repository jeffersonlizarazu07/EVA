import { useState, useEffect } from "react";
import { useTranslations } from "../hooks/useTranslations"; 
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Paper,
  Box,
  Grid,
  InputAdornment,
  TablePagination,
  TableFooter,
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from "@mui/material";
import {
  Search
} from "@mui/icons-material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


const TableFormReport = ({ header, data, onSelectionChange, footerData, table2, table3 }) => {
  const heders2 = ["Pregunta", "Tipo de error","Respuestas", "Monitoreos", "Porcentaje"];
  const heders4 = ["Tipo de error","Porcentaje"];

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedTable, setSelectedTable] = useState("table1"); // controlar qué tabla mostrar

  useEffect(() => {
    onSelectionChange(selectedRows);
  }, [selectedRows]);

  const handleCheckboxChange = (item) => {
    setSelectedRows((prev) => {
      const alreadySelected = prev.find((i) => i.id_monitoreo === item.id_monitoreo);
      return alreadySelected
        ? prev.filter((i) => i.id_monitoreo !== item.id_monitoreo)
        : [...prev, item];
    });
  };

  const { t } = useTranslations();

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = Array.isArray(data)
    ? data.filter((item) =>
        Object.values(item).some(
          (val) => typeof val === "string" && val.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : [];

  const currentRecords = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const indexOffset = header.findIndex(h => h.key.startsWith("Pregunta"));

  // Estados de paginación para tabla 1
  const [page1, setPage1] = useState(0);
  const [rowsPerPage1, setRowsPerPage1] = useState(5);

  // Estados de paginación para tabla 2
  const [page2, setPage2] = useState(0);
  const [rowsPerPage2, setRowsPerPage2] = useState(5);
   
  // Estados de paginación para tabla 3
  const [page3, setPage3] = useState(0);
  const [rowsPerPage3, setRowsPerPage3] = useState(5);

  // Handlers tabla 1
  const handleChangePage1 = (event, newPage) => {
    setPage1(newPage);
  };
  const handleChangeRowsPerPage1 = (event) => {
    setRowsPerPage1(parseInt(event.target.value, 10));
    setPage1(0);
  };

  // Handlers tabla 2
  const handleChangePage2 = (event, newPage) => {
    setPage2(newPage);
  };
  const handleChangeRowsPerPage2 = (event) => {
    setRowsPerPage2(parseInt(event.target.value, 10));
    setPage2(0);
  };

  // Handlers tabla 3
  const handleChangePage3 = (event, newPage) => {
    setPage3(newPage);
  };
  const handleChangeRowsPerPage3 = (event) => {
    setRowsPerPage3(parseInt(event.target.value, 10));
    setPage3(0);
  };

  return (
    <Box className="table-container">
      {/*SELECT PARA ELEGIR TABLA */}
      <FormControl fullWidth 
        sx={{ 
          mb: 3, 
          borderColor: "#c65297",
          color: "#c65297",
          "& .MuiOutlinedInput-root": {
        
            "&.Mui-focused fieldset": {
              borderColor: "#c65297", // borde al focus
            },
          },
      
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#c65297", // color del label al focus
          }, }}
        >
        <InputLabel>Selecciona una tabla</InputLabel>
        <Select
          value={selectedTable}
          label="Selecciona una tabla"
          onChange={(e) => setSelectedTable(e.target.value)}
        >
          <MenuItem value="table1">Tabla de Monitoreo</MenuItem>
          <MenuItem value="table2">Tabla de Errores por Pregunta</MenuItem>
          <MenuItem value="table3">Tabla de Errores Totales</MenuItem>
        </Select>
      </FormControl>

      {/* --- TABLA 1 --- */}
      {selectedTable === "table1" && (
        <>
          {/* Buscador */}
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <TextField
                  size="small"
                  placeholder={t("userTable.Search")}
                  value={searchTerm}
                  onChange={handleSearch}
                  className="inp-search"
                  variant="outlined"
                  sx={{ width: "100%" }}
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

          {/* Tabla 1 */}
          <TableContainer component={Paper} elevation={0} sx={{ width:"100%", overflowY: "auto" }}>
            <Table size="small">
              <TableHead> 
                <TableRow> 
                  <TableCell 
                    sx={{ 
                      fontSize: "1rem",
                      textAlign: "center",
                      fontWeight: "bold" 
                      }}
                    >
                    {t("clientTable.seleccionar_para_descargar")} 
                  </TableCell> 
                  {header.map((item, i) => ( 
                    <TableCell key={i} align="center" 
                      sx={{ fontWeight: "bold",
                        whiteSpace: "normal",
                        minWidth: item.key === "feedback" ? 250 : 300,
                        maxWidth: item.key === "feedback" ? "none" : 300, wordWrap: "break-word",
                      }}> 
                      {item.label} 
                    </TableCell> ))} 
                </TableRow> 
              </TableHead>
              <TableBody>
                {data
                  .slice(page1 * rowsPerPage1, page1 * rowsPerPage1 + rowsPerPage1) // 👈 paginación en filas
                  .map((row, idx) => {
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
                        {header.map((col, i) => ( // 👈 columnas completas
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
              <TableFooter>
                <TableRow>
                  <TableCell
                    sx={{
                      backgroundColor: "#f5f5f5",
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  />
                  {header.map((col, idx) => (
                    <TableCell
                      key={idx}
                      align="center"
                      sx={{
                        backgroundColor: "#f5f5f5",
                        color: "#c70e8f",
                        fontWeight: "bold",
                      }}
                    >
                      {col.key === "nombre_agente"
                        ? "Datos de Monitoreo"
                        : col.key === "score"
                        ? `Promedio: ${footerData[0]?.promedio}`
                        : col.key === "nombre_form"
                        ? `Monitorizaciones: ${footerData[0]?.preguntas}`
                        : ""}
                    </TableCell>
                  ))}
                </TableRow>
              </TableFooter>
              
            </Table>
            
          </TableContainer>
          <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage1}
                page={page1}
                onPageChange={handleChangePage1}
                onRowsPerPageChange={handleChangeRowsPerPage1}
              />
          
        </>
      )}

      {/* --- TABLA 2 --- */}
      
      {selectedTable === "table2" && (
        <>
        <TableContainer component={Paper} elevation={0}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {heders2.map((item, i) => (
                  <TableCell key={i} align="center" sx={{ fontWeight: "bold" }}>
                    {item}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {table2
              .slice(page2 * rowsPerPage2, page2 * rowsPerPage2 + rowsPerPage2)
              .map((row, idx) => (
                <TableRow key={idx}>
                  {Object.values(row).map((value, i) => (
                    <TableCell key={i} align="center">{value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
       <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={table2.length}
          rowsPerPage={rowsPerPage2}
          page={page2}
          onPageChange={handleChangePage2}
          onRowsPerPageChange={handleChangeRowsPerPage2}
        />
        </>
      )}

      {/* --- TABLA 3 --- */}
      {selectedTable === "table3" && (
        <>
        <TableContainer component={Paper} elevation={0}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {heders4.map((item, i) => (
                  <TableCell key={i} align="center" sx={{ fontWeight: "bold" }}>
                    {item}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {table3
              .slice(page3 * rowsPerPage3, page3 * rowsPerPage3 + rowsPerPage3)
              .map((row, idx) => (
                <TableRow key={idx}>
                  {["tipo_error", "porcentaje"].map((key) => (
                    <TableCell key={key} align="center">{row[key]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={table3.length}
          rowsPerPage={rowsPerPage3}
          page={page3}
          onPageChange={handleChangePage3}
          onRowsPerPageChange={handleChangeRowsPerPage3}
        />
        
        </>
      )}
    </Box>
  );
};

export default TableFormReport;