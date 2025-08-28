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
  InputLabel,
  Button,
  Divider
} from "@mui/material";
import {
  Search
} from "@mui/icons-material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


const TableFormReport = ({ header, data, onSelectionChange, footerData, table2, table3,table4,table5,totalForms }) => {
  const { t } = useTranslations();

  // encabezados tablas
  const heders2 = [t("clientTable.preguntas"),t("clientTable.tipo_de_error"), t("clientTable.monitoreos"),t("clientTable.respuestas_Erróneas"),  t("clientTable.porcentaje")];
  const heders4 = [t("clientTable.tipo_de_error"),t("clientTable.monitoreos"),t("clientTable.respuestas_Erróneas"), t("clientTable.porcentaje")];
  const heders5 = ["Identificador del empleado","Nombre","Estado","Identificador del monitoreo", "Formulario","Creado","Puntuacón","Evaluador","Feedback creado","Feedback"];
  const heders6 = ["Identificador","Nombre","Recuento","Feedback", "No feedback","Acuse de recibo","Sin acuse de recibo"];

  // Estados para selección de filas
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedTable, setSelectedTable] = useState("table1"); // controlar qué tabla mostrar

  useEffect(() => {
    onSelectionChange(selectedRows);
  }, [selectedRows]);

  // Manejar selección de filas
  const handleCheckboxChange = (item) => {
    setSelectedRows((prev) => {
      const alreadySelected = prev.find((i) => i.id_monitoreo === item.id_monitoreo);
      return alreadySelected
        ? prev.filter((i) => i.id_monitoreo !== item.id_monitoreo)
        : [...prev, item];
    });
  };

 

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

  // Estados de paginación para tabla 4
  const [page4, setPage4] = useState(0);
  const [rowsPerPage4, setRowsPerPage4] = useState(5);

  // Estados de paginación para tabla 5
  const [page5, setPage5] = useState(0);
  const [rowsPerPage5, setRowsPerPage5] = useState(5);

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

  // Handlers tabla 4
  const handleChangePage4 = (event, newPage) => {
    setPage4(newPage);
  };
  const handleChangeRowsPerPage4 = (event) => {
    setRowsPerPage4(parseInt(event.target.value, 10));
    setPage4(0);
  };

  // Handlers tabla 5
  const handleChangePage5 = (event, newPage) => {
    setPage5(newPage);
  };
  const handleChangeRowsPerPage5 = (event) => {
    setRowsPerPage5(parseInt(event.target.value, 10));
    setPage5(0);
  };

  return (
    <Box >

      {/* Botones para elegir tabla */}
      <Box sx={{ display: "flex",  gap: 1, minWidth: "200px", justifyContent:"center", mb:3 }}>
        <Button 
          variant={selectedTable === "table1" ? "contained" : "outlined"} 
          onClick={() => setSelectedTable("table1")}
          sx={{
           
            
            borderColor: "#c65297",
            color: selectedTable === "table1" ? "#fff" : "#c65297",
            backgroundColor: selectedTable === "table1" ? "#c65297" : "transparent",
            "&:hover": {
              borderColor: "#c65297", 
              backgroundColor: selectedTable === "table1" ? "#a13f7e" : "rgba(198,82,151,0.1)",
            }
          }}
        >
          {t("clientTable.tabla_de_monitoreo")}
        </Button>

        <Button 
          variant={selectedTable === "table2" ? "contained" : "outlined"} 
          onClick={() => setSelectedTable("table2")}
          sx={{
            borderColor: "#c65297",
            color: selectedTable === "table2" ? "#fff" : "#c65297",
            backgroundColor: selectedTable === "table2" ? "#c65297" : "transparent",
            "&:hover": {
              borderColor: "#c65297", 
              backgroundColor: selectedTable === "table2" ? "#a13f7e" : "rgba(198,82,151,0.1)",
            }
          }}
        >
          {t("clientTable.tabla_de_errores")}
        </Button>

        <Button 
          variant={selectedTable === "table3" ? "contained" : "outlined"} 
          onClick={() => setSelectedTable("table3")}
          sx={{
            borderColor: "#c65297",
            color: selectedTable === "table3" ? "#fff" : "#c65297",
            backgroundColor: selectedTable === "table3" ? "#c65297" : "transparent",
            "&:hover": {
              borderColor: "#c65297", 
              backgroundColor: selectedTable === "table3" ? "#a13f7e" : "rgba(198,82,151,0.1)",
            }
          }}
        >
          {t("clientTable.tabla_de_errores_Totales")}
        </Button>

        
        <Button 
          variant={selectedTable === "table4" ? "contained" : "outlined"} 
          onClick={() => setSelectedTable("table4")}
          sx={{
            borderColor: "#c65297",
            color: selectedTable === "table4" ? "#fff" : "#c65297",
            backgroundColor: selectedTable === "table4" ? "#c65297" : "transparent",
            "&:hover": {
              borderColor: "#c65297", 
              backgroundColor: selectedTable === "table4" ? "#a13f7e" : "rgba(198,82,151,0.1)",
            }
          }}
        >
          {("Tabla 4-5")}
        </Button>
      </Box>
      
    
      <Box className="table-container" mb={6}>
        

        {/* --- TABLA 1 --- */}
        {selectedTable === "table1" && (
          <>
            {/* Buscador */}
            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} >
                <Box display="flex" alignItems="center" gap={1} 
                  
                >
                  <TextField
                    size="small"
                    placeholder={t("userTable.Search")}
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

            {/* Tabla 1 */}
            <TableContainer component={Paper} elevation={0} sx={{ width: "100%", maxHeight: 450, overflowY: "auto" }}>
              <Table size="small">
                <TableHead> 
                  <TableRow> 
                    <TableCell 
                      sx={{ fontSize: "1rem", textAlign: "center", fontWeight: "bold" }}
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
                  {filteredData
                    .slice(page1 * rowsPerPage1, page1 * rowsPerPage1 + rowsPerPage1) // paginación en filas
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
            <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2, alignItems: "center" }}>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]} // Mantienes tus opciones de filas por página
                component="div"
                count={filteredData.length}
                rowsPerPage={rowsPerPage1}
                page={page1}
                onPageChange={handleChangePage1}
                onRowsPerPageChange={handleChangeRowsPerPage1}
                // Puedes agregar traducciones si tienes, ejemplo:
                // labelRowsPerPage={t("userTable.Show")}
                // labelDisplayedRows={({ from, to, count }) =>
                //   `${from}-${to} ${t("userTable.Registered")} ${count !== -1 ? count : `more than ${to}`}`
                // }
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
          <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2, alignItems: "center" }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={table2.length}
              rowsPerPage={rowsPerPage2}
              page={page2}
              onPageChange={handleChangePage2}
              onRowsPerPageChange={handleChangeRowsPerPage2}
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
                    {["tipo_error","total_preguntas","cantidad_malas", "porcentaje"].map((key) => (
                      <TableCell key={key} align="center">
                        {row[key]} 
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2, alignItems: "center" }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={table3.length}
              rowsPerPage={rowsPerPage3}
              page={page3}
              onPageChange={handleChangePage3}
              onRowsPerPageChange={handleChangeRowsPerPage3}
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

          
          </>
        )}
        {/* --- TABLA 4 --- */}
        {selectedTable === "table4" && (

          <>
          <TableContainer component={Paper} elevation={0}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {heders5.map((item, i) => (
                    <TableCell key={i} align="center" sx={{ fontWeight: "bold" }}>
                      {item}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {table4
                .slice(page4 * rowsPerPage4, page4 * rowsPerPage4 + rowsPerPage4)
                .map((row, idx) => (
                  <TableRow key={idx}>
                    {["id_user_agent","agent_name","state","id","form_title","monitoring_date","score","evaluator_name","check_FORMATted","feedback"].map((key) => (
                      <TableCell key={key} align="center">
                        {row[key]} 
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2, alignItems: "center" }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={table4.length}
              rowsPerPage={rowsPerPage4}
              page={page4}
              onPageChange={handleChangePage4}
              onRowsPerPageChange={handleChangeRowsPerPage4}
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

          
          
          </>
        )}
        <Divider sx={{ my: 2 }} />
        {/* --- TABLA 5 --- */}
        {selectedTable === "table4" && (

          <>
          <TableContainer component={Paper} elevation={0}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {heders6.map((item, i) => (
                    <TableCell key={i} align="center" sx={{ fontWeight: "bold" }}>
                      {item}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {table5
                .slice(page5 * rowsPerPage5, page5 * rowsPerPage5 + rowsPerPage5)
                .map((row, idx) => (
                  <TableRow key={idx}>
                    {["id_form","form_title","recuento","feedback","no_feedback","acuse_de_recibo","sin_acuse_de_recibo"].map((key) => (
                      <TableCell key={key} align="center">
                        {row[key]} 
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  {heders6.map((col, idx) => (
                    <TableCell
                      key={idx}
                      align="center"
                      sx={{
                        backgroundColor: "#f5f5f5",
                        color: "#c70e8f",
                        fontWeight: "bold",
                      }}
                    >
                      {col === "Recuento"
                        ? `${totalForms[0]?.total_recuento || 0}`
                        : col === "Feedback"
                        ? `${totalForms[0]?.total_feedback || 0}`
                        : col === "No feedback"
                        ? `${totalForms[0]?.total_no_feedback || 0}`
                        : col === "Acuse de recibo"
                        ? `${totalForms[0]?.total_acuse_de_recibo || 0}`
                        : col === "Sin acuse de recibo"
                        ? `${totalForms[0]?.total_sin_acuse_de_recibo || 0}`
                        : ""}
                    </TableCell>
                  ))}
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
          <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2, alignItems: "center" }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={table5.length}
              rowsPerPage={rowsPerPage5}
              page={page5}
              onPageChange={handleChangePage5}
              onRowsPerPageChange={handleChangeRowsPerPage5}
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

          
          
          </>
        )}

      </Box>
    </Box>
  );
};

export default TableFormReport;