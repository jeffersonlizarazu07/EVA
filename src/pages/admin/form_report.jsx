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
    TextField
} from "@mui/material";
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
  getAdmins,
  getClients,
  getUserClients,
  getAgentById,
  getFormsByClient,
  getBlocksForIdForm,
  saveMonitoring,
  getMonitoring,
} from "../../services/agent_listService";

/* cliente */
import useInput from "../../components/hooks/useInput";


const FormReport= () => {
    
    const { t, i18n } = useTranslation();
    const { languageUser, clients  } = useContext(UserContext);
    const [surveyId, setSurveyId] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [surveys, setSurveys] = useState([]); // Debes cargar las encuestas desde tu API
    const [allResponses, setAllResponses] = useState([]);

    const [userName, setUserName]= useState("");
    const [numeroMonitoreos, setnumeroMonitoreos] = useState(""); 

    // Estado para almacenar la información del usuario logueado
    const [userInfo, setUserInfo] = useState(null);
    const userId = useContext(UserContext).userId; // Obtener el userId del contexto
    const userType = useContext(UserContext).userType; // Obtener el userType del contexto
    const accessToken = useContext(UserContext).accessToken; // Obtener el accessToken del contexto
    const clientsContext = useContext(UserContext).clients; // Obtener los clientes del contexto

    //  formulario 
    const [admins, setAdmins] = useState([]); // Guarda todos los administradores
    const [fullMonitoring, setFullMonitoring] = useState([]); // Guarda todos los monitoreos
    const selectedKeys = ["id", "data", "score", "feedback", "check", "id_user_agent", "id_user_monitor","id_form"];
    
    // clientes
    const idClient = useInput({ defaultValue: "", validate: /^[1-4]+$/ });
    const [clientsObjeto, setClientsObjeto] = useState([]);

    // agentes
    {/*
      const type = useInput({ defaultValue: "", validate: /^[1-4]+$/ });
      const [agenteExport, setAgenteExport] = useState([]);
    */}

    // filtros para formulario hook
    const [idClienteFiltro, setIdClienteFiltro]= useState("");
    
     
    
    

    const nav = useNavigate();

    const handleAgeChange = (event) => {
        setnumeroMonitoreos(event.target.value);
    };

    // Manejar cambio de encuesta
    const handleChange = (e) => {
    setSurveyId(e.target.value);
    };

    // Manejar cambio de fechas
    const handleStartDateChange = (date) => setStartDate(date);
    const handleEndDateChange = (date) => setEndDate(date);

    // Exportar charts (debes implementar esta función)
    const exportCharts = () => {
    // Implementa la lógica de exportación aquí
    Swal.fire("Exportar", "Funcionalidad de exportación no implementada.", "info");
    };

    // Configuración para axios 
    const config = {
        withCredentials: true,
    };
    // Estado para almacenar los agentes 
    {/*
      useEffect(() => {
        const agentes = admins
          .filter((admin) => admin.type === 4)
          .map((admin) => admin.firstname);

        setAgenteExport(agentes);
        console.log("Agentes export report:", agentes);
      }, [admins]);
       */}
    

    useEffect(() => {
        console.log("******",clients);
        if (userId && accessToken) {
          getClients(userId);
          dataMonitoring();
          
        }
    }, [userId, accessToken]);

    useEffect(() => {
      
      
      console.log("Clientes aqui!!!!:", clientsObjeto);
      console.log("Encuestas aqui!!!:", surveys);
      i18n.changeLanguage(languageUser);
      loadAdmins();
      traerUsuarioLogueado();
      getSurveys();
      console.log("Obteniendo datos de monitoreos...", fullMonitoring);
    }, [languageUser, i18n]);


    // filtro de formularios por cliente
    const getFormsByClientId = async (idclienteActual) => {
      
    };
   
    // traer clientes
    const getClients = async (id) => {
        const token = accessToken || Cookies.get("accessToken");
      
        if (!token) {
          console.warn("⚠️ Token no disponible aún.");
          return;
        }
      
        try {
          const authConfig = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          };
          console.log("-------------------ID del usuario:", id);
          const response = await axios.get(`http://localhost:3000/api/users_client/${id}`, authConfig);
      
          console.log("Respuesta de la API:", response.data);
      
          if (response.data && response.data.data) {
            // Si la respuesta tiene los datos en `data`, se actualiza el estado
            setClientsObjeto(response.data.data);
          } else {
            console.warn("No se encontraron clientes en la respuesta.");
          }
        } catch (error) {
          console.error("❌ Error al obtener clientes:", error);
          if (error.response) {
            console.error("Detalles del error:", error.response.data);
          }
        }
      };
    // Guarda una nueva monitorización en el sistema
      const handleSaveMonitoring = async (score, feedback, check, agentId) => {
        const payload = {
          monitoring_date: new Date().toISOString().slice(0, 10),
          score, // Puntuación total de la monitorización
          feedback, // Comentarios u observaciones
          check, // Checklist o validación binaria
          id_user: agentId, // ID del agente evaluado
          id_form: selectedFormId, // ID del formulario aplicado
        };
    
        try {
          const result = await saveMonitoring(payload); // Enviar datos al backend
          return result;
        } catch (error) {
          console.error("Error al guardar la monitorización:", error);
          throw error;
        }
      };

    const handleSaveBlock = (blockId) => {
      const bloque = blocksWithPer.find((b) => b.id === blockId);

      if (!bloque) return;

      // Crear payload
      const payload = {
        block_id: bloque.id,
        block_score: bloque.porcentajeBloque,
        questions: bloque.preguntas.map((p) => ({
          question_id: p.id,
          evaluacion: p.evaluacion,
          porcentaje: p.porcentajePregunta,
        })),
      };
    };

    // obtener todos los monitoreos desde el backend
    const dataMonitoring = async ()=>{
      try{ 
        const data = await getMonitoring();
        //console.log("Datos de monitoreos:", data);
        setFullMonitoring(data);
      }catch(error){
        console.error("error al obtener los monitoreos:", error);
      }
    }

    // Obtener todos los administradores (agentes) desde el backend
      const loadAdmins = async () => {
        try {
          setLoading(true);
          const data = await getAdmins(clients);
          setAdmins(data);
        } catch (error) {
          console.error("Error al cargar los administradores:", error);
          Toast.fire({
            icon: "error",
            title: "Error al cargar administradores",
          });
        } finally {
          setLoading(false);
        }
      };

    // Función para traer el usuario logueado
    const traerUsuarioLogueado = async ()=>{
        try {
            const response = await axios.get(
              `http://localhost:3000/api/users/${userId}`,
              {
                withCredentials: true,
              }
            );
            setUserInfo(response.data.data); // Asignar al contexto
            setUserName(response.data.data.firstname);
            console.log("Usuario logueado form_report:", response.data.data.firstname);
        } catch (err) {
          console.error("Error al cargar el usuario logueado en form_report", err);
          setUserInfo(null);
        }
    }
    /* api para ver las encuestas */
    const getSurveys = async () => {
        try {
          console.log("clientes api:",clients)
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

    /* api para ver las encuestas mas a detalle */
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
                    title: t("reports.sin_datos"),
                    text: t("reports.texto_sin_datos"),
                    icon: 'info',
                    confirmButtonText: t("buttons.aceptar"),
                    confirmButtonColor: '#FF66B2',
                  });
          }else{
            // Muestra un mensaje de error usando SweetAlert
            Swal.fire({
              title: t("alerts.error"),
              text: t("alerts.error_obtener_datos"),
              icon: 'error',
              confirmButtonText: t("buttons.aceptar"),
              confirmButtonColor: '#FF66B2',
          });
          }  
    
          setLoading(false);
          return;
        }
    
      };

    
    return(
        <Box className="App" sx={{ overflow: "hidden" }}>
            <Box id="body">
                 <HeaderLT1 />
            </Box>
            <Box sx={{m:0, p:0}} >
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
                                  console.log("ID Cliente seleccionado:", e.target.value);
                                }}
                              >
                                <MenuItem value={''}>None</MenuItem>
                                {clientsObjeto.length > 0 ? (
                                  clientsObjeto.map((i) => (
                                    <MenuItem value={i.idClient} key={i.idClient}>
                                      {i.clientName}
                                      
                                    </MenuItem>
                                  ))
                                ) : (
                                  <MenuItem disabled>Cargando Clientes ...</MenuItem>
                                )}
                              </Select>
                            </FormControl>

                            {/* vista formularios */}
                            <FormControl required sx={{ minWidth: "20%" }} className="readOnlyField">
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
                                {surveys
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
                            {/*
                              <FormControl required sx={{ minWidth: "10%" }} className="readOnlyField">
                            <TextField
                                id="outlined-basic"
                                label="Evaluador"
                                variant="outlined"
                                value={userName? userName : ""}
                                InputProps={{ readOnly: true }}
                            />
                            </FormControl>
                            */}
                            
                            {/* vista del agente
                              <FormControl required sx={{ minWidth: "10%" }} className="readOnlyField">
                              <InputLabel id="demo-simple-select-label">Agentes</InputLabel>
                                  <Select
                                      labelId="demo-simple-select-label"
                                      id="demo-simple-select"
                                      value={numeroMonitoreos}
                                      label="Agentes"
                                      onChange={handleAgeChange}
                                  >   
                                      <MenuItem value={''}>None</MenuItem>
                                      {agenteExport.length > 0 ? (
                                          agenteExport.map((i, index) => (
                                              <MenuItem value={i} key={index}>
                                                  {i}
                                              </MenuItem>
                                          ))
                                      ) : (
                                          <MenuItem disabled>Cargando Agentes ...</MenuItem>
                                      )}
                                      
                                      
                                  </Select>
                            </FormControl>
                            */}
                            
                            


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
                          {/* mensaje de arvertenca en campos

                          {!loading && allResponses.length === 0 && (
                            <Box mt={3}>
                              <Alert severity="info" sx={{ textAlign: "center" }}>
                                {t("reports.mensaje_reporte")}
                              </Alert>
                            </Box>
                          )}
                          
                          */}
                          
                        </CardContent>
                      </Card>
                    </Grid>
                </Box>
            </Box>

            <Box sx={{ alignItems: "stretch", flexWrap: "nowrap", padding: 0, display : "flex" }}>
                      {/* <SidebarLT1 /> */}
                      <Box className="container" mt={0}>
                          {fullMonitoring.length > 0 && (
                            <TableFormReport
                              header={selectedKeys}
                              data={fullMonitoring}
                              
                            />
                          )}
                      </Box>
              </Box>
            
        </Box>
        
        
    );
}
export default FormReport;