import { 
    Box, 
    Button,
    ButtonGroup,
    IconButton,
    Grid,
    Card,
    CardContent,
    InputLabel,
    OutlinedInput,
    MenuItem,
    FormControl,
    Select,
    Alert ,
    Paper,
    
    Typography,
    
    Stack,
    Divider,
    Tooltip,
    Fade,
    
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { keyframes } from "@emotion/react";

import axios from "axios";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";

/* Traer encabezados  */
import HeaderLT1 from "../../components/header/headerLT1";
import HeaderLT2 from "../../components/header/headerLT2";

/* Traer traduccion  */
import { useEffect, useContext,useState } from "react";
import { useTranslation } from "react-i18next";
import { UserContext } from "../../context/UserContext";

/* formulario*/ 
import TableFormReport from "../../components/Tables/tableFormReport";
import {
  
  getMonitoring,
  getClientsAndForms,
  getResponseMult
} from "../../services/agent_listService";



/* transformar a exel  */
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Key } from "@mui/icons-material";

const FormReport= () => {
    //importacion del exel seleccionado 
    const [seleccionados, setSeleccionados] = useState([]);

    const nav = useNavigate();
    // estados para el lenguaje 
    const { t, i18n } = useTranslation();
    const { languageUser, clients  } = useContext(UserContext);
    
    // estados para la ficha del filtro 
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    
    
    //  formulario 
    const [fullMonitoring, setFullMonitoring] = useState([]); 
    // estado para respuestas multiples 
    const [responseMulti, setResponseMulti]= useState([]);
     // clientes corregidos
    const [clientsAndFroms, setClientsAndForms] = useState([]);
    const [formsInfo, setFormsInfo] = useState([]);

    // filtros para formulario 
    const [idClienteFiltro, setIdClienteFiltro]= useState("");
    const [filtroSeleccionado, setFiltroSeleccionado] = useState('');
    const [reportesFiltrados, setReportesFiltrados]= useState([]);

    // formato para exel
    const [formatExel, setFormatExel]= useState([]);

    

    
    // Manejar cambio de fechas
    const handleStartDateChange = (date) => setStartDate(date);
    const handleEndDateChange = (date) => setEndDate(date);

    // Configuración para axios 
    const config = {
        withCredentials: true,
    };
    

    // Crear un Set para almacenar preguntas únicas
    // y evitar duplicados en los headers de la tabla
    const preguntaSet = new Map();

    fullMonitoring.forEach(monitoreo => {
      monitoreo.preguntas.forEach(p => {
        if (!preguntaSet.has(p.texto)) {
          preguntaSet.set(p.texto, p);
        }
      });
    });

    

    // Ahora construimos los headers únicos y ordenados
    const preguntaHeaders = Array.from(preguntaSet.keys()).map((texto, index) => ({
      key: `Pregunta ${index + 1}`,
      label: texto
    }));

    // los heders de la tabla
    const selectedKeys = [
      
      
      { key: "nombre_agente", label: t("clientTable.agente") },
      { key: "nombre_monitor", label: t("clientTable.evaluador") },
      { key: "fecha_monitoreo", label:  t("clientTable.fecha_monitoreo") },
      { key: "score", label: t("clientTable.score")},
      { key: "nombre_form", label:  t("clientTable.Formulario") },
      ...preguntaHeaders,
      
      { key: "feedback", label:   t("clientTable.feedback")},
    ];
   
    
   // cambio de lenguaje y clientes en el filtro 
    useEffect(() => {
      i18n.changeLanguage(languageUser);
      getClientsAndFormsFuncion();
      
    }, [languageUser, i18n]);
    
    // para inicializar la informacion de la tabla y clientes en el filtro 
    useEffect(() => {
      
      getResponseMultFuncion();
      getClientsAndFormsFuncion();
      if (!reportesFiltrados || reportesFiltrados.length === 0) {
        dataMonitoring();
        

      }
      
    }, []);

    // cambio de informacion en la tabla por filtros
    useEffect(() => {
      if (reportesFiltrados.length > 0) {
        dataMonitoring();
      }
     
    }, [reportesFiltrados]);

    

    // logica para hacer comparacion con answer 
    const getRespuestaTransformada = (pregunta) => {
      // Se extrae la respuesta original y el id de la pregunta
      const respuestaOriginal = pregunta.respuesta;
      const idPregunta = pregunta.id_questions;

      // Se busca en la lista de respuestas múltiples la que corresponde a esta pregunta
      const respuestaMulti = responseMulti.find(r => r.question_id === idPregunta);

      // Si no hay configuración de respuesta múltiple o no hay respuesta, se retorna tal cual
      if (!respuestaMulti || !respuestaOriginal) return respuestaOriginal;

      // Si la respuesta es un texto vacío o null, se retorna tal cual
      if (respuestaOriginal === "" || respuestaOriginal === null) {
        return respuestaOriginal;
      }

      // Si la respuesta es "0", se interpreta como "No seleccionó"
      //if (respuestaOriginal === "0") return "No seleccionó";
      
      // Separamos los índices seleccionados si vienen separados por coma 
      const indicesSeleccionados = respuestaOriginal.split(",");

      // Obtenemos las opciones posibles separadas por coma, si existen
      const opciones = respuestaMulti.select_option?.split(",") || [];

      // Mapeamos los índices a sus respectivas opciones de texto
      const opcionesSeleccionadas = indicesSeleccionados.map((indice) => {
        const idx = parseInt(indice.trim(), 10); // Convertimos el índice a número
        // si es un string que de ese string
        if (isNaN(idx)) {
          return respuestaOriginal;
        }
        // Retornamos la opción correspondiente si existe, si no, un texto genérico
        return opciones[idx] ? opciones[idx].trim() : `Opción ${idx}`;
      });

      // Retornamos todas las opciones seleccionadas unidas por " | "
      return opcionesSeleccionadas.join(" | ");
    };

    // obtener respuestas multiple 
    const getResponseMultFuncion = async ()=>{
      try {
        const response = await getResponseMult();
        setResponseMulti(response);
      } catch (error) {
        console.error("Error obtener respuestas multiple :", error);
      }

    }

    // obtener clientes y formularios
    const getClientsAndFormsFuncion = async () => {
      try {
        const response = await getClientsAndForms();

        // obtener sin repetidosclientes
        const uniqueClients = [
          ...new Map(
            response.map(i => [i.idClient, { client: i.client, idClient: i.idClient }])
          ).values()
        ];

        // obtener informacion de los formularios 
        const infoForms = response.map(i=> ({
          id: i.id,
          idClient: i.idClient,
          title: i.title,
          creation_date:i.creation_date? i.creation_date.split("T")[0] : null,
          updated_date:i.updated_date ? i.updated_date.split("T")[0]: null

        }));
        setFormsInfo(infoForms);
        setClientsAndForms(uniqueClients);
        
      } catch (error) {
        console.error("Error al obtener clientes y formularios:", error);
        
      }
    };
   
    // Agrupar los las preguntas y respuestas para hacerlo reactiva en a tabla MUI
    const agruparPorMonitoreo = (data) => {
      const agrupado = {};

      data.forEach((item) => {
        const key = `${item.nombre_agente}|${item.nombre_monitor}|${item.nombre_form}|${item.fecha_monitoreo}|${item.score}|${item.feedback}|${item.id_monitoreo}`;

        if (!agrupado[key]) {
          agrupado[key] = {
            id_monitoreo: item.id_monitoreo,
            nombre_agente: item.nombre_agente,
            nombre_monitor: item.nombre_monitor,
            nombre_form: item.nombre_form,
            fecha_monitoreo: item.fecha_monitoreo.split("T")[0],
            score: item.score,
            feedback: item.feedback,
            preguntas: []  
          };
        }

        agrupado[key].preguntas.push({
          texto: item.question_name,
          //respuesta: item.answer,
          
          respuesta: getRespuestaTransformada({
            respuesta: item.answer,
            id_questions : item.id
          }),
          id_questions : item.id
        });
      });

      setFormatExel(agrupado);
      return Object.values(agrupado);
    };

    // tarer reportes filtrados

    const getFilterReports = async ()=>{

      try {
        // formateo de fecha sin horas
        const formattedStartDate = startDate ? dayjs(startDate).format("YYYY-MM-DD") : "";
        const formattedEndDate = endDate ? dayjs(endDate).format("YYYY-MM-DD") : "";
        
        const filtro = await axios.get(
          `http://localhost:3000/api/answersform/filter/${filtroSeleccionado}/${formattedStartDate}/${formattedEndDate}`,
            config
        )
        
        if (!filtro.data|| filtro.data.length === 0) {
          Swal.fire({
            title: t("reports.sin_datos"),
            text: t("reports.texto_sin_datos"),
            icon: 'info',
            confirmButtonText: t("buttons.aceptar"),
            confirmButtonColor: '#FF66B2',
          })
        }
        setReportesFiltrados(filtro.data);
        
        
      } catch (error) {
        console.log('Error al consumir la api', error);
        
      }
    }

    // descargar lo filtrado en exel 

    const exportExel = () => {
      // filtro entre exportacion total y seleccionados
      const dataCargada = seleccionados.length  ? seleccionados : formatExel;
      
      if (!dataCargada || dataCargada.length === 0 || Object.keys(dataCargada).length === 0) {
        Swal.fire({
            title: t("reports.sin_datos"),
            text: t("reports.texto_sin_datos"),
            icon: 'info',
            confirmButtonText: t("buttons.aceptar"),
            confirmButtonColor: '#FF66B2',
          })
        
        console.warn("No hay datos para exportar");
        return;
      }

      // para todos con formatExel
      
      const data = Object.values(dataCargada).map((item) => {
         // Se convierten las preguntas (que son un array de objetos) en un solo objeto plano
          // donde cada clave es el texto de la pregunta y el valor es la respuesta
          const preguntasPlanas = item.preguntas?.reduce((acc, p, i) => {
            acc[` ${p.texto}`] = p.respuesta;
            return acc;
          }, {});

          // Se devuelve un objeto que representa una fila del Excel,
          // incluyendo campos generales + preguntas planas + feedback
          return {
            Agente: item.nombre_agente,
            Evaluador: item.nombre_monitor,
            Fecha_de_Monitoreo: item.fecha_monitoreo,
            Score: item.score,
            Formulario: item.nombre_form,
            ...preguntasPlanas,     // Se agregan dinámicamente todas las preguntas y respuestas
            Feedback: item.feedback,
          };
      });
      

      // Se convierte el array de objetos en una hoja de cálculo de Excel
      const worksheet = XLSX.utils.json_to_sheet(data);

      // Se crea un nuevo libro de Excel
      const workbook = XLSX.utils.book_new();

      // Se agrega la hoja al libro con el nombre "Reportes"
      XLSX.utils.book_append_sheet(workbook, worksheet, "Reportes");

      // Se genera el archivo Excel en un formato binario (array buffer)
      const exelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      // Se crea un objeto Blob con el contenido del archivo Excel
      const blob = new Blob([exelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      });

      // Se dispara la descarga del archivo Excel en el navegador con nombre "reportes_filtrados.xlsx"
      saveAs(blob, "reportes_filtrados.xlsx");
    };


    // obtener todos los monitoreos desde el backend
    const dataMonitoring = async () => {
      try {
        const data = reportesFiltrados;
        /*
        const data =  reportesFiltrados && reportesFiltrados.length>0 
          ? reportesFiltrados
          : await getMonitoring();
        ;*/
        
        const data2 =  await getMonitoring();
        const datosAgrupados = agruparPorMonitoreo(data);
        console.log("datos sin nada", data2);
        setFullMonitoring(datosAgrupados);
        //console.log("monitoreo", datosAgrupados)
      } catch (error) {
        console.error("error al obtener los monitoreos:", error);
      }
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
    

    return(
        <Box className="App" sx={{ overflow: "hidden" }}>
            <Box id="body">
                 <HeaderLT1 />
            </Box>
            <Box sx={{m:0, p:0, display: "flex", justifyContent:"center", alignItems:"center"}} >
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
                            {/* Boton de regresar */}
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => nav("/quality")}
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

                            {/* clientes*/}
                            <FormControl required sx={{ minWidth: "20%" }} className="readOnlyField">
                              <InputLabel id="demo-simple-select-label">{t("survey.selecciona_cliente")}</InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={idClienteFiltro}
                                label={t("survey.selecciona_cliente")}
                                onChange={(e)=>{
                                  setIdClienteFiltro(e.target.value);
                                  
                                }}
                              >
                                <MenuItem value={''}>None</MenuItem>
                                {clientsAndFroms.length > 0 ? (
                                  clientsAndFroms.map((i) => (
                                    <MenuItem value={i.idClient} key={i.idClient}>
                                      {i.client}
                                      
                                    </MenuItem>
                                  ))
                                ) : (
                                  <MenuItem disabled>Cargando Clientes ...</MenuItem>
                                )}
                              </Select>
                            </FormControl>

                            {/* vista formularios */}
                            <FormControl required sx={{ minWidth: "20%" }} className="readOnlyField">
                              <InputLabel>{t("survey.form")}</InputLabel>
                              <Select
                                labelId="survey-select-label"
                                id="survey-select"
                                value={filtroSeleccionado}
                                onChange={(e) => {
                                  
                                  const response = parseInt(e.target.value);
                                  const infoCapturado = formsInfo.find(i=> i.id === response)
                                  setFiltroSeleccionado(Number(infoCapturado.id));
                                  
                                }}
                                input={<OutlinedInput label="Formulario" />}
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                {formsInfo
                                .filter(item => item.idClient=== idClienteFiltro )
                                .map((item, i) =>  (
                                  <MenuItem key={i} value={item.id}>
                                    {item.title}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            {/* vista fechas */}
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
                                onClick={getFilterReports}
                                disabled={!(filtroSeleccionado && startDate && endDate)}
                              >
                                <SearchIcon />
                              </IconButton>
                              <IconButton
                                color="secondary"
                                onClick={exportExel}
                                disabled={!(filtroSeleccionado && startDate && endDate)}
                              >
                                <FileDownloadIcon />
                              </IconButton>
                            </ButtonGroup>
                          </Box>
                          
                          
                        </CardContent>
                      </Card>
                    </Grid>
                </Box>
            </Box>

            <Box sx={{ alignItems: "stretch", flexWrap: "nowrap", padding: 0, display : "flex" }}>
                      
                      <Box className="container" mt={0}>
                          {fullMonitoring.length > 0 && (
                            <TableFormReport
                              header={selectedKeys}
                              data={fullMonitoring}
                              onSelectionChange={(rows) => setSeleccionados(rows)} 
                              
                            />
                          )}
                      </Box>
              </Box>

              
              {reportesFiltrados.length === 0 && (
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
                {reportesFiltrados.length === 0 && (
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
                         color= "#c70e8f"
                        sx={{
                          textAlign: "center",
                          fontSize: "1.5rem",
                          backgroundColor: "transparent",
                          border: "1px solid #c70e8f",
                          color: "#c70e8f",
                          borderRadius: "8px",
                        }}
                      >
                        {t("reports.mensaje_reporte_formulario")}
                      </Alert>
                    </Box>
                  </Fade>
                )}
              </Box>
              )

              }
              

               
              
            
        </Box>
        
        
    );
}
export default FormReport;