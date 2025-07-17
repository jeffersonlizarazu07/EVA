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
  
  getMonitoring,
  getClientsAndForms,
} from "../../services/agent_listService";



/* transformar a exel  */
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const FormReport= () => {

    const nav = useNavigate();
    // estados para el lenguaje 
    const { t, i18n } = useTranslation();
    const { languageUser, clients  } = useContext(UserContext);
    
    // estados para la ficha del filtro 
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    
    //  formulario 
    const [fullMonitoring, setFullMonitoring] = useState([]); // Guarda todos los monitoreos

    // formulario headers dinamicos
    const preguntaHeaders = fullMonitoring.length > 0
      ? fullMonitoring[0].preguntas.map((p, index) => ({
          key: `Pregunta ${index + 1}`,
          label: p.texto,
        }))
      : [];

    const selectedKeys = [
      
      
      { key: "nombre_agente", label: "Agente" },
      { key: "nombre_monitor", label: "Evaluador" },
      { key: "fecha_monitoreo", label: "Fecha de Monitoreo" },
      { key: "score", label: "Score" },
      { key: "nombre_form", label: "Formulario" },
      ...preguntaHeaders,
      
      { key: "feedback", label: "Feedback" },
    ];
    
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
    
    // para inicializar la informacion de la tabla y clientes en el filtro 
    useEffect(() => {
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

    // cambio de lenguaje y clientes en el filtro 
    useEffect(() => {
      i18n.changeLanguage(languageUser);
      getClientsAndFormsFuncion();
      
    }, [languageUser, i18n]);

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
        //console.log("informacion formularios obtenidos ...!:", infoForms);
      } catch (error) {
        console.error("Error al obtener clientes y formularios:", error);
        
      }
    };
   
    // Agrupar los las preguntas y respuestas para hacerlo reactiva en a tabla MUI
    const agruparPorMonitoreo = (data) => {
      const agrupado = {};

      data.forEach((item) => {
        const key = `${item.nombre_agente}|${item.nombre_monitor}|${item.nombre_form}|${item.fecha_monitoreo}|${item.score}|${item.feedback}`;

        if (!agrupado[key]) {
          agrupado[key] = {
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
          respuesta: item.answer,
        });
      });

      setFormatExel(agrupado);
      return Object.values(agrupado);
    };

    // tarer reportes filtrados

    const getFilterReports = async ()=>{

      try {
        const formattedStartDate = startDate ? dayjs(startDate).format("YYYY-MM-DD") : "";
        const formattedEndDate = endDate ? dayjs(endDate).format("YYYY-MM-DD") : "";
        ///answersform/filter/:fromId/:starDate/:endDate
        const filtro = await axios.get(
          `http://localhost:3000/api/answersform/filter/${filtroSeleccionado}/${formattedStartDate}/${formattedEndDate}`,
            config
        )
        console.log("Reportes Filtradossssssssssssssssssss",filtro.data)
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
      if (!reportesFiltrados || reportesFiltrados.length === 0) {
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


      const data = Object.values(formatExel).map((item) => {
        const preguntasPlanas = item.preguntas?.reduce((acc, p, i) => {
          acc[`Pregunta ${i + 1}`] = p.respuesta;
          return acc;
        }, {});

        return {
          Fecha: item.fecha_monitoreo,
          Puntaje: item.score,
          Agente: item.nombre_agente,
          Monitor: item.nombre_monitor,
          Encuesta: item.nombre_form,
          ...preguntasPlanas,
          Comentario: item.feedback,
        };
      });
      

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "Reportes");

      const exelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([exelBuffer], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      });

      saveAs(blob, "reportes_filtrados.xlsx");
    };


    // obtener todos los monitoreos desde el backend
    const dataMonitoring = async () => {
      try {
        //const data = await getMonitoring();
        const data =  reportesFiltrados && reportesFiltrados.length>0 
          ? reportesFiltrados
          : await getMonitoring();
        ;
        const datosAgrupados = agruparPorMonitoreo(data);
        setFullMonitoring(datosAgrupados);
      } catch (error) {
        console.error("error al obtener los monitoreos:", error);
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
                              <InputLabel>{t("reports.encuesta")}</InputLabel>
                              <Select
                                labelId="survey-select-label"
                                id="survey-select"
                                value={filtroSeleccionado}
                                onChange={(e) => {
                                  
                                  const response = parseInt(e.target.value);
                                  const infoCapturado = formsInfo.find(i=> i.id === response)
                                  setFiltroSeleccionado(Number(infoCapturado.id));
                                  console.log("Formulario:", filtroSeleccionado);
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
                              
                            />
                          )}
                      </Box>
              </Box>
            
        </Box>
        
        
    );
}
export default FormReport;