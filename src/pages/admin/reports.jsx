import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { UserContext } from "../../context/UserContext";
import LineStyleCharts from "../../components/charts/lineStyle";
import HeaderLT1 from "../../components/header/headerLT1";
import HeaderLT2 from "../../components/header/headerLT2";
import dayjs from "dayjs";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Toast } from "../../assets/js/alertConfig";
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Grid,
  Card,
  CardContent,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputLabel,
  OutlinedInput,
  MenuItem,
  FormControl,
  Select,
  Typography,
  Alert,
  List,
  ListItem,
  ListItemText,
  
  
  
  Fade,
} from "@mui/material";
import { keyframes } from "@emotion/react";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useTranslations } from "../../components/hooks/useTranslations";

const Reports = () => {
  const { t } = useTranslations();
  const nav = useNavigate();
  const { accessToken, userInfo, clients } = useContext(UserContext);
  const [allResponses, setAllResponses] = useState([]); // Nueva estructura para contener todas las respuestas en orden
  const [surveys, setSurveys] = useState([]);
  const [surveyId, setSurveyId] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [clientIds, setClientIds] = useState([2, 3]);
  const [loading, setLoading] = useState(false);
  const responseRefs = useRef([]);
  const [answersStats, setAnswersStats] = useState([]);

  useEffect(() => {
    if (clients && clients.length > 0) {
      getSurveys();
    }
  }, [clients]);

  const handleChange = (event) => {
    setSurveyId(Number(event.target.value) || "");
  };

  const config = {
    withCredentials: true,
  };
  // animacion alerta
    const shake = keyframes`
                  0% { transform: translateX(0); }
                  20% { transform: translateX(-6px); }
                  40% { transform: translateX(6px); }
                  60% { transform: translateX(-4px); }
                  80% { transform: translateX(4px); }
                  100% { transform: translateX(0); }
                `;

  const getPercentages = async () => {
    if (!surveyId) {
      alert("Please select a Survey ID");
      return;
    }

    setLoading(true);

    try {
      const formattedStartDate = startDate
        ? dayjs(startDate).format("YYYY-MM-DD")
        : "";
      const formattedEndDate = endDate
        ? dayjs(endDate).format("YYYY-MM-DD")
        : "";

      const response = await axios.get(
        `http://localhost:3000/api/answers/survey/${surveyId}/percentage?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
        config
      );
      console.log("xxx", response.data.data);
      // Verificar si no hay datos
      if (!response.data.data || Object.keys(response.data.data).length === 0) {
        console.log("No hay datos o los datos están vacíos.");

        if (startDate || endDate) {
          alert("No se encontraron datos para las fechas proporcionadas.");
        } else {
          alert(
            "No se encontraron datos para la encuesta con el ID proporcionado."
          );
        }

        setLoading(false);
        return;
      }

      // Array unificado para todas las respuestas en el orden original
      const allResponsesArray = [];

      // Transformar los datos manteniendo el orden original
      Object.entries(response.data.data).forEach(
        ([questionId, questionData]) => {
          // Si es tipo textfield_s, lo añadimos como datos de texto
          if (questionData.type === "textfield_s") {
            allResponsesArray.push({
              id: questionId,
              label: questionData.name,
              data: questionData.data[0],
              labels: questionData.labels,
              type: questionData.type,
              displayType: "text", // Indicador para saber cómo renderizarlo
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
                  porcentaje: value, // El porcentaje como string (con el %)
                });
              });
            }

            allResponsesArray.push({
              id: questionId,
              label: questionData.name,
              data: tableData,
              type: questionData.type,
              displayType: "check_opt_table", // Nuevo tipo para tablas de check_opt
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
                const labelIndex = questionData.labels
                  ? questionData.labels.indexOf(key)
                  : -1;
                const displayName =
                  labelIndex >= 0 ? questionData.labels[labelIndex] : key;

                chartData.push({
                  name: displayName, // El nombre de la opción
                  key: key, // La clave original (para tipos como yes_no donde 0=No, 1=Si)
                  value: parseFloat(value), // El porcentaje como número
                });
              });
            }

            allResponsesArray.push({
              id: questionId,
              label: questionData.name,
              data: chartData,
              type: questionData.type,
              displayType: "chart", // Indicador para saber cómo renderizarlo
            });
          }
        }
      );

      console.log("Todos los datos de respuestas en orden:", allResponsesArray);
      setAllResponses(allResponsesArray);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener los datos:", error);

      if (error.response && error.response.status === 404) {
        Swal.fire({
          title: t("reports.sin_datos"),
          text: t("reports.texto_sin_datos"),
          icon: "info",
          confirmButtonText: t("buttons.aceptar"),
          confirmButtonColor: "#FF66B2",
        });
      } else {
        // Muestra un mensaje de error usando SweetAlert
        Swal.fire({
          title: t("alerts.error"),
          text: t("alerts.error_obtener_datos"),
          icon: "error",
          confirmButtonText: t("buttons.aceptar"),
          confirmButtonColor: "#FF66B2",
        });
      }

      setLoading(false);
      return;
    }
  };

  // const getSurveys = async () => {
  //   try {
  //     console.log(clients);
  //     const response = await axios.get(
  //       `http://localhost:3000/api/clients/surveys?clientIds=${clients}`,
  //       config
  //     );
  //     console.log("Datos de Encuestas aqui:", response.data.data);
  //     setSurveys(response.data.data);
  //   } catch (error) {
  //     console.error("Error fetching data", error);
  //   }
  // };

  const getSurveys = async () => {
    try {
      console.log("LOS CLIENTES:", clients);

      // Validar que clients tenga al menos un elemento válido
      if (!clients || (Array.isArray(clients) && clients.length === 0)) {
        console.warn("No hay clientes para consultar encuestas");
        setSurveys([]); // O manejar como prefieras cuando no hay datos
        return; // Salimos sin hacer la petición
      }

      // Convertir clients a string con IDs separados por comas
      const clientIds = Array.isArray(clients) ? clients.join(",") : clients;

      // Construir URL con encodeURIComponent
      const url = `http://localhost:3000/api/clients/surveys?clientIds=${encodeURIComponent(
        clientIds
      )}`;

      const response = await axios.get(url, config);
      console.log("Datos de Encuestas aqui:", response.data.data);
      setSurveys(response.data.data);
    } catch (error) {
      console.error("Error fetching data", error);
      setSurveys([]); // Opcional: limpiar encuestas en caso de error
    }
  };

  // llamada al backend
  const getAnswersByRanges = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/answers/ranges",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      console.log("Data global recibida:", response.data.data);
      setAnswersStats(response.data.data);
    } catch (error) {
      console.error("Error obteniendo rangos", error);
    }
  };

  // Diccionario para manejo de tipos de preguntas en header de la tabla
  const typeLabels = {
    range_onetofive: "CSAT",
    range_zerototen: "NPS - Net Promoter Score",
    yes_no: "FCR",
    range_difficulty: "CES",
  };

  // cada vez que cambia el filtro y hay preguntas visibles, llamamos al backend
  useEffect(() => {
    console.log("allResponses:", allResponses);

    if (allResponses.length > 0) {
      const ids = allResponses
        .filter((q) =>
          [
            "range_onetofive",
            "range_zerototen",
            "yes_no",
            "range_difficulty",
          ].includes(q.type)
        )
        .map((q) => q.id);

      console.log("IDs encontrados (solo para debug):", ids);
      console.log(
        "Preguntas filtradas:",
        allResponses.filter((q) =>
          [
            "range_onetofive",
            "range_zerototen",
            "yes_no",
            "range_difficulty",
          ].includes(q.type)
        )
      );

      getAnswersByRanges();
    }
  }, [allResponses]);

  useEffect(() => {
    console.log("answersStats actualizado:", answersStats);
  }, [answersStats]);

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
        text: t("alerts.fecha_incio_Seleccione"),
        confirmButtonText: t("buttons.aceptar"),
        confirmButtonColor: "#b62a8b",
        customClass: {
          actions: "swal2-actions-center ",
          title: "titulo-pequeno",
        },
      });
      return;
    }

    if (newValue && newEndDate.isAfter(today)) {
      Swal.fire({
        icon: "warning",
        toast: false,
        text: t("alerts.fecha_fin_mayor"),
        confirmButtonText: t("buttons.aceptar"),
        confirmButtonColor: "#b62a8b",
        customClass: {
          actions: "swal2-actions-center ",
          title: "titulo-pequeno",
        },
      });
      setEndDate(today);
      return;
    }

    if (startDate && newEndDate.isBefore(dayjs(startDate))) {
      Swal.fire({
        icon: "warning",
        toast: false,
        text: t("alerts.fecha_fin_menor"),
        confirmButtonText: t("buttons.aceptar"),
        confirmButtonColor: "#b62a8b",
        customClass: {
          actions: "swal2-actions-center ",
          title: "titulo-pequeno",
        },
      });
      setEndDate(dayjs(startDate));
      return;
    }

    setEndDate(newValue);
  };

  const exportCharts = async () => {
    let downloadToast; // Variable para almacenar la instancia del toast y poder actualizarla

    // Primero, abrimos todos los acordeones para asegurarnos de que el contenido sea visible
    const accordions = document.querySelectorAll(".MuiAccordion-root");
    accordions.forEach((accordion) => {
      if (!accordion.classList.contains("Mui-expanded")) {
        const expandButton = accordion.querySelector(
          ".MuiAccordionSummary-root"
        ); // Buscar el botón de expansión y hacer clic en él

        if (expandButton) {
          expandButton.click();
        }
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 500)); // Esperar un momento para que las animaciones de expansión terminen

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    }); // Creamos el PDF en formato A4

    // Obtenemos dimensiones de la página
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 40; // Margen en todos los lados

    const contentWidth = pageWidth - margin * 2;
    const contentHeight = pageHeight - margin * 2;

    const numCols = 2;
    const numRows = 2;
    const cellWidth = contentWidth / numCols;
    const cellHeight = contentHeight / numRows;

    let chartCount = 0; // Contador para saber cuántas gráficas van en la página actual

    downloadToast = Toast.fire({
      icon: "info", // Puedes usar 'info' o 'loading' si tu librería Toast lo soporta
      title: t("reports.preparando_graficas"), // Título del Toast
      text: "0%", // Texto inicial con el porcentaje
      position: "bottom-end", // Posición en la esquina inferior derecha
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
          backgroundColor: "#ffffff",
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
        const progress = Math.round(
          ((index + 1) / responseRefs.current.length) * 100
        );
        downloadToast.update({
          title: `Generando PDF: ${progress}%`,
          text: "Preparando gráficas...", // Puedes mantener este texto o cambiarlo
        });

        // Mostrar progreso de procesamiento
        if (index % 2 === 0) {
          const progress = Math.round(
            (index / responseRefs.current.length) * 100
          );
          await loadingSwal.update({
            html: `<i class="fas fa-file-pdf fa-3x mb-3" style="color: #b62a8b;"></i><br>Procesando gráficas... ${progress}%`,
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
        position: "bottom-end",
      });
      pdf.save("reporte_encuesta.pdf");

      // Mensaje de éxito
      Swal.fire({
        title: t("alerts.exito"),
        text: t("reports.descargar_reporte"),
        icon: "success",
        confirmButtonText: t("buttons.aceptar"),
        confirmButtonColor: "#b62a8b",
      });

      // Cerrar los acordeones después de la exportación
      accordions.forEach((accordion) => {
        if (accordion.classList.contains("Mui-expanded")) {
          const expandButton = accordion.querySelector(
            ".MuiAccordionSummary-root"
          );
          if (expandButton) {
            expandButton.click();
          }
        }
      });
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      Swal.fire({
        title: t("alerts.error"),
        text: t("alerts.problema_descargar_pdf"),
        icon: "error",
        confirmButtonText: t("buttons.aceptar"),
        confirmButtonColor: "#b62a8b",
      });
    }
  };

  // Renderiza un item de respuesta de texto
  const renderTextResponse = (item, index) => {
    return (
      <Box
        key={`text-${index}`}
        ref={(el) => (responseRefs.current[index] = el)}
        sx={{
          p: 2,
          width: { md: "50%", lg: "33.33%" }, // para col-md-6 col-lg-4
          boxSizing: "border-box",
        }}
      >
        <Accordion className="shadowbox5">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel-${item.id}-content`}
            id={`panel-${item.id}-header`}
          >
            <Typography variant="h6" sx={{ m: 0, color: "#b62a8b" }}>
              {item.label}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer
              component={Paper}
              sx={{
                backgroundColor: "transparent !important",
                border: "1px solid #ccc !important",
                overflow: "auto",
              }}
            >
              <Table
                aria-label="tabla de respuestas"
                sx={{ backgroundColor: "transparent !important" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      align="center"
                      sx={{
                        backgroundColor: "#b62a8b",
                        color: "white",
                        fontWeight: "bold",
                        p: 3,
                      }}
                    >
                      {t("reports.respuestas")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody sx={{ backgroundColor: "transparent !important" }}>
                  {Object.entries(item.data).map(([key], idx) => (
                    <TableRow
                      key={idx}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        backgroundColor: "transparent !important",
                      }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ backgroundColor: "transparent !important" }}
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
      </Box>
    );
  };

  // Renderiza un item de respuesta de tipo check_opt en una tabla
  const renderCheckOptResponse = (item, index) => {
    return (
      <Box
        key={`check-opt-${index}`}
        ref={(el) => (responseRefs.current[index] = el)}
        sx={{
          p: 2,
          flexBasis: { xs: "100%", md: "50%", lg: "33.3333%" }, // para col-md-6 col-lg-4
          boxSizing: "border-box",
        }}
      >
        <Accordion className="shadowbox5">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel-${item.id}-content`}
            id={`panel-${item.id}-header`}
          >
            <Typography variant="h6" sx={{ color: "#b62a8b", m: 0 }}>
              {item.label}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer
              component={Paper}
              sx={{
                backgroundColor: "transparent !important",
                border: "solid 1px #ccc !important",
                overflow: "auto",
              }}
            >
              <Table
                aria-label="tabla de respuestas check_opt"
                sx={{ backgroundColor: "transparent !important" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        backgroundColor: "#b62a8b",
                        color: "white",
                        fontWeight: "bold",
                        textAlign: "start",
                        p: 3,
                      }}
                    >
                      {t("reports.respuestas")}
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: "#b62a8b",
                        color: "white",
                        fontWeight: "bold",
                        textAlign: "start",
                        p: 3,
                      }}
                    >
                      {t("reports.porcentaje")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody sx={{ backgroundColor: "transparent !important" }}>
                  {item.data.map((row, idx) => (
                    <TableRow
                      key={idx}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        backgroundColor: "transparent !important",
                      }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ backgroundColor: "transparent !important" }}
                      >
                        {row.respuesta}
                      </TableCell>
                      <TableCell
                        sx={{ backgroundColor: "transparent !important" }}
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
      </Box>
    );
  };

  // Renderiza un item de respuesta de gráfica
  const renderChartResponse = (item, index) => {
    const stats = answersStats.find((s) => s.question_type === item.type);

    return (
      <Box
        key={`chart-${index}`}
        ref={(el) => (responseRefs.current[index] = el)}
        sx={{
          p: 2,
          width: { xs: "100%", md: "50%", lg: "33.33%" },
        }}
      >
        <Accordion className="shadowbox5">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel-${item.id}-content`}
            id={`panel-${item.id}-header`}
          >
            <Typography variant="h6" sx={{ color: "#b62a8b", m: 0 }}>
              {item.label}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {/* Gráfica */}
            <LineStyleCharts
              label={item.label}
              dataChart={item.data}
              type={item.type}
              initialType="pie"
            />

            {/* Tabla condicional */}
            {[
              "range_onetofive",
              "range_zerototen",
              "yes_no",
              "range_difficulty",
            ].includes(item.type) && (
              <Table
                size="small"
                sx={{
                  tableLayout: "fixed",
                  mt: 2,
                  border: "1px solid #ccc",
                  width: "100%",
                  tableLayout: "fixed",
                  fontSize: "0.85rem",
                }}
              >
                <TableHead>
                  {/* Encabezado principal */}
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell
                      colSpan={3}
                      align="center"
                      sx={{
                        color: "#b62a8b",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {typeLabels[item.type]}
                    </TableCell>
                  </TableRow>

                  {/* Sub-heads por columna */}
                  <TableRow>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: "bold", width: "200px" }}
                    >
                      Indicador
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: "bold", width: "100px" }}
                    >
                      Cantidad
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: "bold", padding: 0 }}
                    >
                      Participación %
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats ? (
                    <>
                      {/* Tipo: range_onetofive */}
                      {item.type === "range_onetofive" && (
                        <>
                          <TableRow>
                            <TableCell align="center">Top Box</TableCell>
                            <TableCell align="center">
                              {stats.exact_5 || 0}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold", minWidth: "250px" }}
                            >
                              {stats.csat_exact_5}%
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell align="center">Top Two Box</TableCell>
                            <TableCell align="center">
                              {stats.rango_4_5 || 0}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              {stats.csat_rango_4_5}%
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell align="center">Bottom Box</TableCell>
                            <TableCell align="center">
                              {stats.exact_1 || 0}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              {stats.csat_exact_1}%
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell align="center">Bottom Two Box</TableCell>
                            <TableCell align="center">
                              {stats.rango_1_2 || 0}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              {stats.csat_rango_1_2}%
                            </TableCell>
                          </TableRow>
                        </>
                      )}

                      {/* Tipo: range_zerototen */}
                      {item.type === "range_zerototen" && (
                        <>
                          <TableRow>
                            <TableCell align="center">Promotores</TableCell>
                            <TableCell align="center">
                              {stats.rango_9_10 || 0}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              {stats.nps_rango_9_10}%
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell align="center">Neutros</TableCell>
                            <TableCell align="center">
                              {stats.rango_7_8 || 0}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              {stats.nps_rango_7_8}%
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell align="center">Detractores</TableCell>
                            <TableCell align="center">
                              {stats.rango_0_6 || 0}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              {stats.nps_rango_0_6}%
                            </TableCell>
                          </TableRow>
                        </>
                      )}

                      {/* Tipo: yes_no */}
                      {item.type === "yes_no" && (
                        <>
                          <TableRow>
                            <TableCell align="center">Sí</TableCell>
                            <TableCell align="center">
                              {stats.total_si || 0}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              {stats.fcr_si}%
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell align="center">No</TableCell>
                            <TableCell align="center">
                              {stats.total_no || 0}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              {stats.fcr_no}%
                            </TableCell>
                          </TableRow>
                        </>
                      )}

                      {/* Tipo: range_difficulty */}
                      {item.type === "range_difficulty" && (
                        <>
                          <TableRow>
                            <TableCell align="center">Muy difícil</TableCell>
                            <TableCell align="center">
                              {stats.muy_dificil || 0}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              {stats.ces_muy_dificil}%
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell align="center">Difícil</TableCell>
                            <TableCell align="center">
                              {stats.dificil || 0}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              {stats.ces_dificil}%
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell align="center">
                              Ni fácil/ni difícil
                            </TableCell>
                            <TableCell align="center">
                              {stats.ni_facil || 0}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              {stats.ces_ni_facil}%
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell align="center">Fácil</TableCell>
                            <TableCell align="center">
                              {stats.facil || 0}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              {stats.ces_facil}%
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell align="center">Muy fácil</TableCell>
                            <TableCell align="center">
                              {stats.muy_facil || 0}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              {stats.ces_muy_facil}%
                            </TableCell>
                          </TableRow>
                        </>
                      )}

                      {/* Total */}
                      <TableRow>
                        <TableCell
                          align="center"
                          sx={{ fontWeight: "bold", color: "#b62a8b" }}
                        >
                          Total
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ fontWeight: "bold", color: "#b62a8b" }}
                        >
                          {item.type === "range_onetofive"
                            ? stats.csat_total_buckets
                            : stats.total_responses || 0}
                        </TableCell>
                        <TableCell />
                      </TableRow>
                    </>
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        sx={{ py: 0.5, color: "text.secondary" }}
                      >
                        No hay datos para esta pregunta.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </AccordionDetails>
        </Accordion>
      </Box>
    );
  };

  return (
    <Box className="App" sx={{ overflow: "hidden" }}>
      <Box id="body">
        {userInfo?.type === 3 || userInfo?.type === 2 ? (
          <HeaderLT2 />
        ) : (
          <HeaderLT1 />
        )}

        <Box sx={{ m: 0, p: 0, display: "flex", justifyContent: "center", alignItems: "center"}}>
          <Grid container spacing={0} sx={{ m: 0 }}>
            <Grid
              item
              xs={12}
              sx={{
                px: 2,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  px: 3,
                  maxWidth: "96%",
                }}
              >
                <Grid item xs={12} sx={{ mb: 4 }}>
                  <Card>
                    <CardContent sx={{ borderRadius: "50px" }}>
                      <Box
                        display="flex"
                        flexWrap="wrap"
                        alignItems="center"
                        justifyContent="center"
                        gap={2}
                        sx={{ mb: 2 }}
                      >
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => nav("/satisfaction")}
                          sx={{
                            py: 2,
                            minWidth: "2%",
                            fontWeight: "bold",
                            color: "#b62a8b",
                            borderColor: "#b62a8b",
                            borderTopLeftRadius: "20px",
                            borderBottomLeftRadius: "20px",
                            "&:hover": {
                              borderColor: "#b62a8b",
                              backgroundColor: "rgba(156, 39, 176, 0.04)",
                            },
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fillRule="evenodd"
                              d="M1.146 4.854a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H12.5A2.5 2.5 0 0 1 15 6.5v8a.5.5 0 0 1-1 0v-8A1.5 1.5 0 0 0 12.5 5H2.707l3.147 3.146a.5.5 0 1 1-.708.708z"
                            />
                          </svg>
                        </Button>

                        <FormControl
                          required
                          sx={{ minWidth: "40%" }}
                          className="readOnlyField"
                        >
                          <InputLabel>{t("reports.encuesta")}</InputLabel>
                          <Select
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
                            className="readOnlyField"
                            label={t("reports.fecha_inicio")}
                            value={startDate}
                            onChange={handleStartDateChange}
                            sx={{ width: "22%" }}
                          />
                          <DatePicker
                            className="readOnlyField"
                            label={t("reports.fecha_fin")}
                            value={endDate}
                            onChange={handleEndDateChange}
                            sx={{ width: "22%" }}
                          />
                        </LocalizationProvider>

                        <ButtonGroup>
                          <IconButton
                            color="secondary"
                            onClick={getPercentages}
                            disabled={!(surveyId && startDate && endDate)}
                          >
                            <SearchIcon />
                          </IconButton>
                          <IconButton
                            color="secondary"
                            onClick={exportCharts}
                            disabled={allResponses.length === 0}
                          >
                            <FileDownloadIcon />
                          </IconButton>
                        </ButtonGroup>
                      </Box>
                      
                      {/* 
                      {!loading && allResponses.length === 0 && (
                        <Box mt={3}>
                          <Alert severity="info" sx={{ textAlign: "center" }}>
                            {t("reports.mensaje_reporte")}
                          </Alert>
                        </Box>
                      )}*/}
                    </CardContent>
                  </Card>
                </Grid>

                <Box className="row">
                  {allResponses.length > 0 ? (
                    allResponses.map((item, i) => {
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
                            <Skeleton variant="text" width="50%" />
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  ) : null}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
      {allResponses.length === 0 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  m: 10,
                  mt: 2,
                  borderRadius: "12px",
      
                  border: "1px dashed #b0bec5",
                  minHeight: "150px",
                  position: "relative",
                }}
              >
                {allResponses.length === 0 && (
                  <Fade in={true} timeout={500}>
                    <Box
                      sx={{
                        animation: `${shake} 0.5s`,
                        minWidth: "60%",
                      }}
                    >
                      <Alert
                        icon={<InfoOutlinedIcon fontSize="large" />}
                        severity="info"
                        color="#c70e8f"
                        sx={{
                          textAlign: "center",
                          fontSize: "1.5rem",
                          backgroundColor: "transparent",
                          border: "1px solid #c70e8f",
                          color: "#c70e8f",
                          borderRadius: "8px",
                        }}
                      >
                        {("Llena los datos de la consulta para generar las Graficas.")}
                      </Alert>
                    </Box>
                  </Fade>
                )}
              </Box>
            )}
    </Box>
  );
};
export default Reports;
