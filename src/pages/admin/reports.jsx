import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { UserContext } from "../../context/UserContext";
import LineStyleCharts from "../../components/charts/lineStyle";
import HeaderLT1 from "../../components/header/headerLT1";
import HeaderLT2 from "../../components/header/headerLT2";
import dayjs from "dayjs";
import { Box, ButtonGroup, Grid, IconButton, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Cookies from "js-cookie"; 
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Toast } from "../../assets/js/alertConfig";
import { useTranslation } from "react-i18next";



const Reports = () => {
  const {t} = useTranslation();
  const nav = useNavigate();
  const { accessToken, userType, clients } = useContext(UserContext);
  const [allResponses, setAllResponses] = useState([]); // Nueva estructura para contener todas las respuestas en orden
  const [surveys, setSurveys] = useState([]);
  const [surveyId, setSurveyId] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [clientIds, setClientIds] = useState([2, 3]);
  const [loading, setLoading] = useState(false);
  //const [textData, setTextData] = useState([]); // Nuevo estado para datos de texto
  const responseRefs = useRef([]);
  // const chartRefs = useRef([]);
  // const tableRefs = useRef([]);

  useEffect(() => {
    getSurveys();
  }, []);

  const handleChange = (event) => {
    setSurveyId(Number(event.target.value) || "");
  };

  const config = {
    withCredentials: true,
  };

  const getPercentages = async () => {
    if (!surveyId) {
      alert("Please select a Survey ID");
      return;
    }
    
    setLoading(true);
    
    try {
      const formattedStartDate = startDate ? dayjs(startDate).format("YYYY-MM-DD") : "";
      const formattedEndDate = endDate ? dayjs(endDate).format("YYYY-MM-DD") : "";
  
      const response = await axios.get(
        `http://localhost:3000/api/answers/survey/${surveyId}/percentage?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
        config
      );
  
      // Verificar si no hay datos
      if (!response.data.data || Object.keys(response.data.data).length === 0)  {
        console.log("No hay datos o los datos están vacíos.");
        
        if (startDate || endDate) {
          alert("No se encontraron datos para las fechas proporcionadas.");
        } else {
          alert("No se encontraron datos para la encuesta con el ID proporcionado.");
        }
        
        setLoading(false);
        return;
      }

      // Array unificado para todas las respuestas en el orden original
      const allResponsesArray = [];
      
      // Transformar los datos manteniendo el orden original
      Object.entries(response.data.data).forEach(([questionId, questionData]) => {
        // Si es tipo textfield_s, lo añadimos como datos de texto
        if (questionData.type === "textfield_s") {
          allResponsesArray.push({
            id: questionId,
            label: questionData.name,
            data: questionData.data[0],
            labels: questionData.labels,
            type: questionData.type,
            displayType: "text" // Indicador para saber cómo renderizarlo
          });
        } 
        // NUEVO: Para el tipo check_opt, preparamos los datos para mostrarlo en una tabla
        else if (questionData.type === "check_opt") {
          // Preparar los datos para la tabla con respuestas y porcentajes
          const tableData = [];
          
          // Si tenemos datos
          if (questionData.data && questionData.data.length > 0) {
            // Usar solo el primer elemento de data ya que contiene porcentajes
            const firstDataItem = questionData.data[0];
            
            // Convertir el objeto de respuestas a un array para la tabla
            Object.entries(firstDataItem).forEach(([key, value]) => {
              tableData.push({
                respuesta: key, // La respuesta
                porcentaje: value // El porcentaje como string (con el %)
              });
            });
          }
          
          allResponsesArray.push({
            id: questionId,
            label: questionData.name,
            data: tableData,
            type: questionData.type,
            displayType: "check_opt_table" // Nuevo tipo para tablas de check_opt
          });
        } else {
          // Para el resto de tipos, preparamos datos para gráficas
          const chartData = [];
          
          // Si tenemos datos y labels
          if (questionData.data && questionData.data.length > 0) {
            // Usar solo el primer elemento de data ya que contiene porcentajes
            const firstDataItem = questionData.data[0];
            
            // Convertir el objeto de respuestas a un array
            Object.entries(firstDataItem).forEach(([key, value]) => {
              // Usamos el label original en lugar de key cuando sea posible
              const labelIndex = questionData.labels ? questionData.labels.indexOf(key) : -1;
              const displayName = labelIndex >= 0 ? questionData.labels[labelIndex] : key;
              
              chartData.push({
                name: displayName, // El nombre de la opción
                key: key, // La clave original (para tipos como yes_no donde 0=No, 1=Si)
                value: parseFloat(value) // El porcentaje como número
              });
            });
          }
          
          allResponsesArray.push({
            id: questionId,
            label: questionData.name,
            data: chartData,
            type: questionData.type,
            displayType: "chart" // Indicador para saber cómo renderizarlo
          });
        }
      });
      
    console.log("Todos los datos de respuestas en orden:", allResponsesArray);
    setAllResponses(allResponsesArray);
    setLoading(false);
} catch (error) {
  console.error("Error al obtener los datos:", error);
  
  if (error.response && error.response.status === 404) {
     Swal.fire({
            title: 'Sin datos',
            text: 'No se encontraron datos para las fechas proporcionadas.',
            icon: 'info',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#FF66B2',
          });
  }else{
    // Muestra un mensaje de error usando SweetAlert
    Swal.fire({
      title: 'Error',
      text: 'Hubo un error al obtener los datos.',
      icon: 'error',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#FF66B2',
  });
  }  

  setLoading(false);
  return;
}

  };
    

  const getSurveys = async () => {
    try {
      console.log(clients)
      const response = await axios.get(
        `http://localhost:3000/api/clients/surveys?clientIds=${clients}`,
        config
      );
      console.log("Datos de Encuestas:", response.data.data);
      setSurveys(response.data.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handleStartDateChange = (newValue) => {
    setStartDate(newValue);
    if (endDate && newValue && dayjs(endDate).isBefore(dayjs(newValue))) {
      setEndDate(newValue);
    }
  };

  const handleEndDateChange = (newValue) => {
    const today = dayjs().startOf("day");
    const newEndDate = dayjs(newValue);

    if (!startDate) {
      Swal.fire({
        icon: "warning",
        toast: false,
        text: "Por favor selecciona primero la fecha de inicio",
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#b62a8b",
        customClass :{
          actions: 'swal2-actions-center ', 
          title: 'titulo-pequeno',
        },     
    })    
    return;
  }

    if (newValue && newEndDate.isAfter(today)) {
      Swal.fire({
        icon: "warning",
        toast: false,
        text: "La fecha de fin no puede ser mayor a la fecha actual",
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#b62a8b",
        customClass :{
          actions: 'swal2-actions-center ', 
          title: 'titulo-pequeno',
        },     
      })    
      setEndDate(today);
      return;
    }

    if (startDate && newEndDate.isBefore(dayjs(startDate))) {
      Swal.fire({
        icon: "warning",
        toast: false,
        text: "La fecha de fin no puede ser menor a la fecha de inicio",
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#b62a8b",
        customClass :{
          actions: 'swal2-actions-center ', 
          title: 'titulo-pequeno',
        },     
      })    
      setEndDate(dayjs(startDate));
      return;
    }

    setEndDate(newValue);
  };

const exportCharts = async () => {
 
  let downloadToast; // Variable para almacenar la instancia del toast y poder actualizarla

  // Primero, abrimos todos los acordeones para asegurarnos de que el contenido sea visible
  const accordions = document.querySelectorAll('.MuiAccordion-root');
  accordions.forEach(accordion => {
    if (!accordion.classList.contains('Mui-expanded')) {
      const expandButton = accordion.querySelector('.MuiAccordionSummary-root');// Buscar el botón de expansión y hacer clic en él

      if (expandButton) {
        expandButton.click();
      }
    }
  });

  await new Promise(resolve => setTimeout(resolve, 500)); // Esperar un momento para que las animaciones de expansión terminen

  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });  // Creamos el PDF en formato A4
  
  // Obtenemos dimensiones de la página
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 40; // Margen en todos los lados
  
  const contentWidth = pageWidth - (margin * 2);
  const contentHeight = pageHeight - (margin * 2);
  
  const numCols = 2;
  const numRows = 2;
  const cellWidth = contentWidth / numCols;
  const cellHeight = contentHeight / numRows;

  let chartCount = 0; // Contador para saber cuántas gráficas van en la página actual

    downloadToast = Toast.fire({
    icon: "info", // Puedes usar 'info' o 'loading' si tu librería Toast lo soporta
    title: "Preparando gráficas...",
    text: "0%", // Texto inicial con el porcentaje
    position: 'bottom-end', // Posición en la esquina inferior derecha
    showConfirmButton: false, // No mostrar botón de confirmación
    timer: false, // No cerrar automáticamente
  });
 
  // Capturamos cada elemento de respuesta (incluye tanto el título como el contenido)
  for (let index = 0; index < responseRefs.current.length; index++) {
    const ref = responseRefs.current[index];
    if (!ref) continue;
    
    try {
      // Verificar si necesitamos una nueva página antes de procesar la gráfica actual
      if (chartCount > 0 && chartCount % (numCols * numRows) === 0) {
        pdf.addPage();
        chartCount = 0; // Reiniciar contador para la nueva página
      }
      
      // Opciones para mejorar la calidad de la captura pero manteniendo un tamaño razonable
      const options = {
        scale: 1.5, // Reducido a 1 para evitar imágenes demasiado grandes
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false, // Deshabilitar logs para mejorar rendimiento
      };
      
      const canvas = await html2canvas(ref, options);      
      const imgData = canvas.toDataURL("image/jpeg", 1); // Formato JPEG con 100% de calidad      
      const imgProps = pdf.getImageProperties(imgData);
      
      // Calcular la altura proporcionalmente pero limitada al alto de la página menos márgenes
      let imgWidth = cellWidth;
      let imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      
      // Si la altura es mayor que el espacio disponible en la página, ajustamos proporcionalmente
      if (imgHeight > cellHeight) {
        imgHeight = cellHeight;
        imgWidth = (imgProps.width * imgHeight) / imgProps.height;
      }     
     
      // Calculamos la posición de la celda actual
      const col = chartCount % numCols;
      const row = Math.floor(chartCount / numCols) % numRows;

      const xPos = margin + col * cellWidth + (cellWidth - imgWidth) / 2;
      const yPos = margin + row * cellHeight + (cellHeight - imgHeight) / 2;
            
      // Añadir la imagen al PDF
      pdf.addImage(imgData, "JPEG", xPos, yPos, imgWidth, imgHeight);
      chartCount++; // Incrementamos el contador después de añadir la imagen

      // Actualizar el progreso en el Toast
      const progress = Math.round(((index + 1) / responseRefs.current.length) * 100);
      downloadToast.update({
        title: `Generando PDF: ${progress}%`,
        text: "Preparando gráficas..." // Puedes mantener este texto o cambiarlo
      });

      // Mostrar progreso de procesamiento
      if (index % 2 === 0) {
        const progress = Math.round((index / responseRefs.current.length) * 100);
        await loadingSwal.update({
          html: `<i class="fas fa-file-pdf fa-3x mb-3" style="color: #b62a8b;"></i><br>Procesando gráficas... ${progress}%`
        });
      }
    } catch (error) {
      console.error(`Error al capturar el elemento ${index}:`, error);
    }
  }
  try {
    // Actualizar el mensaje final en el Toast antes de guardar
    downloadToast.update({
      icon: "info",
      title: "Descargando PDF...",
      text: "", // Limpiar el texto si lo deseas
      position: 'bottom-end',
    });
    pdf.save("reporte_encuesta.pdf");
    
    // Mensaje de éxito
    Swal.fire({
      title: 'Éxito',
      text: 'El reporte se ha descargado correctamente',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#b62a8b',
    });
    
    // Cerrar los acordeones después de la exportación 
    accordions.forEach(accordion => {
      if (accordion.classList.contains('Mui-expanded')) {
        const expandButton = accordion.querySelector('.MuiAccordionSummary-root');
        if (expandButton) {
          expandButton.click();
        }
      }
    });    
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    Swal.fire({
      title: 'Error',
      text: 'Hubo un problema al generar el PDF',
      icon: 'error',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#b62a8b',
    });
  }
};  

// Renderiza un item de respuesta de texto
const renderTextResponse = (item, index) => {
  return (
    <div 
      className="col-md-6 col-lg-4 p-2"
      key={`text-${index}`}
      ref={(el) => (responseRefs.current[index] = el)}
    >
      <Accordion className="shadowbox5">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel-${item.id}-content`}
          id={`panel-${item.id}-header`}
        >
          <h5 className="m-0" style={{ color: '#b62a8b' }}>{item.label} </h5>
        </AccordionSummary>
          <AccordionDetails>
            <TableContainer 
              component={Paper} 
              sx={{ 
                backgroundColor: 'transparent !important', 
                border: 'solid 1px #ccc !important',
                overflow: 'auto'  
              }}
            >
              <Table 
                aria-label="tabla de respuestas"
                sx={{ backgroundColor: 'transparent !important' }}
              >
                <TableHead>
                  <tr>
                    <th 
                      className=" p-3 text-white font-bold text-center" 
                      style={{ backgroundColor: '#b62a8b', }}
                    >
                      Respuesta
                    </th>
                  </tr>  
                </TableHead>
                <TableBody sx={{ backgroundColor: 'transparent !important' }}>
                  {Object.entries(item.data).map(([key, _], idx) => (
                    <TableRow
                      key={idx}
                      sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 },
                        backgroundColor: 'transparent !important' 
                      }}
                    >
                      <TableCell 
                        component="th" 
                        scope="row"
                        sx={{ backgroundColor: 'transparent !important' }}
                      >
                        {key}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
        </AccordionDetails> 
      </Accordion>  
    </div>
  );
};

// Renderiza un item de respuesta de tipo check_opt en una tabla
const renderCheckOptResponse = (item, index) => {
  return (
    <div 
      className="col-md-6 col-lg-4 p-2"
      key={`check-opt-${index}`}
      ref={(el) => (responseRefs.current[index] = el)}
    >
      <Accordion className="shadowbox5">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel-${item.id}-content`}
          id={`panel-${item.id}-header`}
        >
          <h5 className="m-0" style={{ color: '#b62a8b' }}>{item.label} </h5>
        </AccordionSummary>
          <AccordionDetails>
            <TableContainer 
              component={Paper} 
              sx={{ 
                backgroundColor: 'transparent !important', 
                border: 'solid 1px #ccc !important', 
                overflow: 'auto'  
              }}
            >
              <Table 
                aria-label="tabla de respuestas check_opt"
                sx={{ backgroundColor: 'transparent !important' }}
              >
                <TableHead>
                 <tr>
                  <th 
                    className=" p-3 text-white font-bold text-start" 
                    style={{ backgroundColor: '#b62a8b', }}
                  >
                    Respuesta
                  </th>
                  <th 
                    className="p-3 text-white font-bold text-start" 
                    style={{ backgroundColor: '#b62a8b',}}
                  >
                    Porcentaje
                  </th>
                </tr>
                </TableHead>
                <TableBody sx={{ backgroundColor: 'transparent !important' }}>
                  {item.data.map((row, idx) => (
                    <TableRow
                      key={idx}
                      sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 },
                        backgroundColor: 'transparent !important' 
                      }}
                    >
                      <TableCell 
                        component="th" 
                        scope="row"
                        sx={{ backgroundColor: 'transparent !important' }}
                      >
                        {row.respuesta}
                      </TableCell>
                      <TableCell 
                        sx={{ backgroundColor: 'transparent !important' }}
                      >
                        {row.porcentaje}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
        </AccordionDetails> 
      </Accordion>  
    </div>
  );
};

// Renderiza un item de respuesta de gráfica
const renderChartResponse = (item, index) => {
  return (
    <div
      className="col-md-6 col-lg-4 p-2"
      key={`chart-${index}`}
      ref={(el) => (responseRefs.current[index] = el)}
    >
      <Accordion className="shadowbox5">      
        <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel-${item.id}-content`}
        id={`panel-${item.id}-header`}
        >
          <h5 className="m-0" style={{ color: '#b62a8b' }} >{item.label}</h5>
        </AccordionSummary>  
        <AccordionDetails>
          <LineStyleCharts
            label={item.label}
            dataChart={item.data}
            type={item.type}
            initialType="pie"
          />
        </AccordionDetails>  
      </Accordion> 
    </div>
  );
};

  return (
    <div className="App">
      <div id="body">
        {userType === "1" || userType === "2" ? <HeaderLT1 /> : <HeaderLT2 />}
        <div className="m-0 p-0">
          <div className="row m-0">
            <div className="col-12 px-2 d-flex justify-content-center">
              <div className="w-100 px-3" style={{ maxWidth: "96%" }}>
                <div className="col-md-12 mb-4">
                  <div className="card">
                    <div className="card-body" style={{ borderRadius: "50px" }}>
                      {/* FILTROS */}
                      <div className="input-group d-flex flex-wrap">
                        <button className="btn hola btn-block btn-sm btn-default btn-flat fw-bold acces-tabla" onClick={() => nav("/satisfaction")} >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-90deg-left" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M1.146 4.854a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H12.5A2.5 2.5 0 0 1 15 6.5v8a.5.5 0 0 1-1 0v-8A1.5 1.5 0 0 0 12.5 5H2.707l3.147 3.146a.5.5 0 1 1-.708.708z"/>
                          </svg>
                        </button>
                        <FormControl required sx={{ minWidth: "40%" }}>
                          <InputLabel>{t("reports.encuesta")}</InputLabel>
                          <Select
                            className="me-2"
                            labelId="survey-select-label"
                            id="survey-select"
                            value={surveyId}
                            onChange={(e) => {
                              handleChange(e);
                              console.log(e.target.value);
                            }}
                            input={<OutlinedInput label="Encuesta" />}
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {surveys.map((item, i) => (
                              <MenuItem key={i} value={item.id}>
                                {item.title}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            sx={{ width: "23%" }}
                            className="me-2"
                            label={t("reports.fecha_inicio")}
                            value={startDate}
                            onChange={handleStartDateChange}
                          />
                          <DatePicker
                            sx={{ width: "23%" }}
                            className="me-2"
                            label={t("reports.fecha_fin")}
                            value={endDate}
                            onChange={handleEndDateChange}
                          />
                        </LocalizationProvider>

                        <ButtonGroup variant="text">
                          <IconButton
                            variant="contained"
                            color="secondary"
                            onClick={getPercentages}
                            sx={{ minWidth: "auto" }}
                            disabled={!(surveyId && startDate && endDate)}
                          >
                            <SearchIcon />
                          </IconButton>
                          <IconButton
                            disabled={allResponses.length === 0}
                            variant="contained"
                            color="secondary"
                            onClick={exportCharts}
                            sx={{ minWidth: "auto" }}
                          >
                            <FileDownloadIcon />
                          </IconButton>
                        </ButtonGroup>
                      </div>

                      {/* ALERTA DE LLENADO */}
                      {!loading && allResponses.length === 0 && (
                        <div className="mt-3">
                          <div className="alert alert-info text-center" role="alert">
                            {t("reports.mensaje_reporte")}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* TODAS LAS RESPUESTAS (TABLAS Y GRÁFICAS EN EL ORDEN ORIGINAL) */}
                <div className="row">
                  {allResponses.length > 0 ? (
                    allResponses.map((item, i) => {
                      // Renderizar según el tipo de visualización
                      if (item.displayType === "text") {
                        return renderTextResponse(item, i);
                      } else if (item.displayType === "check_opt_table") {
                        return renderCheckOptResponse(item, i);
                      } else {
                        return renderChartResponse(item, i);
                      }
                    })
                  ) : loading ? (
                    <Grid container spacing={2}>
                      {[...Array(4)].map((_, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                          <Skeleton
                            variant="text"
                            width="100%"
                            sx={{ marginBottom: "8px" }}
                          />
                          <Skeleton
                            animation="wave"
                            variant="circular"
                            width="100%"
                            height={200}
                            sx={{ borderRadius: "10px", marginBottom: "8px" }}
                          />
                          <Box className="d-flex">
                            <Skeleton
                              variant="text"
                              width="50%"
                              sx={{ marginRight: 5 }}
                            />
                            <Skeleton variant="text" width="50%" />
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Reports;