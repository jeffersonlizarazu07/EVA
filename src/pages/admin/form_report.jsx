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
  Alert,
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
import { useEffect, useContext, useState } from "react";
import { useTranslations } from "../../components/hooks/useTranslations"; 
import { UserContext } from "../../context/UserContext";

/* formulario*/
import TableFormReport from "../../components/Tables/tableFormReport";
import {
  getMonitoring,
  getClientsAndForms,
  getResponseMult,
} from "../../services/agent_listService";

/* transformar a exel  */
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const FormReport = () => {
  //importacion del exel seleccionado
  const [seleccionados, setSeleccionados] = useState([]);

  const nav = useNavigate();
  // estados para el lenguaje
  const { t } = useTranslations();
  const { clients, userInfo } = useContext(UserContext);

  // estados para la ficha del filtro
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  //  formulario
  const [fullMonitoring, setFullMonitoring] = useState([]);
  
  //const [monitoringSinFilter, setMonitoringSinFilter] = useState([])
  const [monitoringAgente, setMonitoringAgente] = useState([])
  const [monitoringEvaluador, setMonitoringEvaluador] = useState([])
  
  // estado para respuestas multiples
  const [responseMulti, setResponseMulti] = useState([]);
  // clientes corregidos
  const [clientsAndFroms, setClientsAndForms] = useState([]);
  const [formsInfo, setFormsInfo] = useState([]);
  // agente y evaluador
  const [agenteFilter, setAgenteFilter]= useState([])
  const [evaluadorFilter, setEvaluadorFilter]= useState([])
  
  //console.log("fulll",fullMonitoring )
  //console.log("xxxxxxx",clientsAndFroms )
  //console.log("jjjjjjjjj",formsInfo )

  // filtros para formulario
  const [idClienteFiltro, setIdClienteFiltro] = useState("");
  const [filtroSeleccionado, setFiltroSeleccionado] = useState("");
  const [reportesFiltrados, setReportesFiltrados] = useState([]);
 

  // formato para exel
  const [formatExel, setFormatExel] = useState([]);

  // Promedio del score 
  const [footerDatas, setFooterDatas]= useState([]);
  //cantidad de errores por pregunta
  const [errorConteo, setErrorConteo] = useState([]);
  //cantidad de errores general
  const [errorGeneral, setErrorGeneral] = useState([]);
  

  
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

  fullMonitoring.forEach((monitoreo) => {
    monitoreo.preguntas.forEach((p) => {
      if (!preguntaSet.has(p.texto)) {
        preguntaSet.set(p.texto, p);
      }
    });
  });

  // Ahora construimos los headers únicos y ordenados
  const preguntaHeaders = Array.from(preguntaSet.keys()).map(
    (texto, index) => ({
      key: `Pregunta ${index + 1}`,
      label: texto,
    })
  );

  // los heders de la tabla
  const selectedKeys = [
    { key: "nombre_agente", label: t("clientTable.agente") },
    { key: "nombre_monitor", label: t("clientTable.evaluador") },
    { key: "fecha_monitoreo", label: t("clientTable.fecha_monitoreo") },
    { key: "score", label: t("clientTable.score") },
    { key: "nombre_form", label: t("clientTable.Formulario") },
    ...preguntaHeaders,

    { key: "feedback", label: t("clientTable.feedback") },
  ];
  //console.log("datosssssss:",filtroSeleccionado,":", agenteFilter ,":", evaluadorFilter)

  // cambio de lenguaje y clientes en el filtro
  useEffect(() => {
    getClientsAndFormsFuncion();
  }, []);  // <-- array vacío para que corra solo una vez al montar

  // para inicializar la informacion de la tabla y clientes en el filtro
  useEffect(() => {
    const  getFullMonitorySinFiltre = async ()=>{
      const data2 = await getMonitoring();
      const agente = [
        ...new Map(data2.map(i => [i.nombre_agente,
          {
            nombre_agente: i.nombre_agente,
            
          }
        ])).values()
      ]
      const evaluador = [
        ...new Map(data2.map(i => [i.nombre_monitor,
          {
            
            nombre_monitor: i.nombre_monitor
          }
        ])).values()
      ]
      setMonitoringAgente(agente)
      setMonitoringEvaluador(evaluador)
    }
    getFullMonitorySinFiltre();
    getResponseMultFuncion();
    getClientsAndFormsFuncion();
    if (!reportesFiltrados || reportesFiltrados.length === 0) {
      dataMonitoring();
    }
  }, []);

  // *
  useEffect(() => {
    if (fullMonitoring.length > 0) {
      footerData(fullMonitoring);
    }
  }, [fullMonitoring]);

  // cambio de informacion en la tabla por filtros
  useEffect(() => {
    if (reportesFiltrados.length > 0) {
      dataMonitoring();
    }
  }, [reportesFiltrados]);

  

  //contar los errores individual 

  const obtenerErroresPorPregunta = (fullMonitoring, responseMulti) => {
    // Indexar configs por pregunta
    const configsByQ = responseMulti.reduce((acc, r) => {
      (acc[r.question_id] ||= []).push(r);
      return acc;
    }, {});

    const conteo = {};

    // Utilidad: igualdad de conjuntos numéricos (ignora orden)
    const sameSet = (a, b) => {
      if (a.length !== b.length) return false;
      const setB = new Set(b);
      return a.every(x => setB.has(x));
    };

    // Determinar si una respuesta es incorrecta
    const esRespuestaIncorrecta = (pregunta) => {
      const configs = configsByQ[pregunta.id_questions] || [];
      if (configs.length === 0) return false; // sin config => no contamos como error

      // Buscar una config con opciones (si ninguna tiene, es texto libre)
      const cfgConOpciones = configs.find(c => c.select_option && c.select_option.trim() !== "");

      //  Caso TEXTO LIBRE 
      if (!cfgConOpciones) {
        // si no hay opciones, mientras haya algo en la respuesta, es correcto
        const hayRespuesta = pregunta.respuesta && String(pregunta.respuesta).trim() !== "";
        return !hayRespuesta; // incorrecta solo si viene vacía
      }

      // Caso OPCIONES 
      const opciones = cfgConOpciones.select_option.split(",").map(s => s.trim());

      // Correctas: posiciones (asumimos base 0, p. ej. "2" = tercera opción)
      const correctas = (cfgConOpciones.selected_answer || "")
        .split(",")
        .map(s => s.trim())
        .filter(Boolean)
        .map(n => Number(n));

      // Dadas: pueden venir como texto ("Opción 1") o como índices ("0,2")
      const dadasRaw = String(pregunta.respuesta || "")
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);

      const dadas = dadasRaw.map(v => {
        if (/^\d+$/.test(v)) return Number(v); // ya es índice
        // convertir texto a índice (case-insensitive)
        const idx = opciones.findIndex(o => o.toLowerCase() === v.toLowerCase());
        return idx; // -1 si no existe => error
      });

      // Si alguna respuesta no mapeó a índice válido => incorrecta
      if (dadas.some(i => i < 0)) return true;

      // Comparar como conjuntos (mismo tamaño y mismos índices)
      return !sameSet(dadas, correctas);
    };

    //Recorrer monitoreos/preguntas y contabilizar
    fullMonitoring.forEach((monitoreo) => {
      monitoreo.preguntas.forEach((pregunta) => {
        const key = `${pregunta.texto}|${pregunta.type_error}`;

        if (!conteo[key]) {
          conteo[key] = {
            texto: pregunta.texto,
            tipo_error: pregunta.type_error,
            total_preguntas: 0,
            cantidad_malas: 0
            
          };
        }

        conteo[key].total_preguntas++;

        if (pregunta.type_error && esRespuestaIncorrecta(pregunta)) {
          conteo[key].cantidad_malas++;
        }
      });
    });

    // Porcentajes
    return Object.values(conteo).map(item => ({
      ...item,
      porcentaje: item.total_preguntas
        ? parseFloat((100-(item.cantidad_malas * 100) / item.total_preguntas).toFixed(2))
        : 0
    }));
  };

  // contar los errores en general 
  const conteoErrorGeneral = (general) => {
    const datos = {}

    general.forEach((i) => {
      const key = i.tipo_error
      if (!datos[key]) {
        datos[key] = {
          tipo_error: i.tipo_error,
          cantidad_malas: 0,
          total_preguntas: 0,
          porcentajeAcumulado: 0,
          monitoreo: i.total_preguntas
        }
      }

      // acumular totales
      datos[key].cantidad_malas += i.cantidad_malas
      datos[key].total_preguntas += i.total_preguntas
      datos[key].porcentajeAcumulado += i.porcentaje
    })

    // calcular porcentaje
    return Object.values(datos).map(item => ({
      ...item,
      porcentaje: item.total_preguntas > 0 
        // ? parseFloat(((item.cantidad_malas * 100) / item.total_preguntas).toFixed(2))
        //parseFloat(((item.cantidad_malas / item.total_preguntas) * 100).toFixed(2))  
        ? parseFloat(((item.cantidad_malas / item.total_preguntas) * 100).toFixed(2)) 
        : 0
    }))
  }

  // logica para hacer comparacion con answer
  const getRespuestaTransformada = (pregunta) => {
    // Se extrae la respuesta original y el id de la pregunta
    const respuestaOriginal = pregunta.respuesta;
    const idPregunta = pregunta.id_questions;
    const type_error = pregunta.type_error

    // Se busca en la lista de respuestas múltiples la que corresponde a esta pregunta
    const respuestaMulti = responseMulti.find(
      (r) => r.question_id === idPregunta
    );

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
  const getResponseMultFuncion = async () => {
    try {
      const response = await getResponseMult();
      setResponseMulti(response);
    } catch (error) {
      console.error("Error obtener respuestas multiple :", error);
    }
  };

  // obtener clientes y formularios
  const getClientsAndFormsFuncion = async () => {
    try {
      const response = await getClientsAndForms();

      // obtener sin repetidosclientes
      const uniqueClients = [
        ...new Map(
          response.map((i) => [
            i.idClient,
            { client: i.client, idClient: i.idClient },
          ])
        ).values(),
      ];

      // obtener informacion de los formularios
      const infoForms = response.map((i) => ({
        id: i.id,
        idClient: i.idClient,
        title: i.title,
        creation_date: i.creation_date ? i.creation_date.split("T")[0] : null,
        updated_date: i.updated_date ? i.updated_date.split("T")[0] : null,
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
          preguntas: [],
        };
      }

      agrupado[key].preguntas.push({
        texto: item.question_name,
        //respuesta: item.answer,

        respuesta: getRespuestaTransformada({
          respuesta: item.answer,
          id_questions: item.id,
          type_error: item.type_error.split("_")[0],
        }),
        id_questions: item.id,         
        type_error: item.type_error.split("_")[0],

      });
    });
    
    setFormatExel(agrupado);
    footerData( Object.values(agrupado))
    return Object.values(agrupado);
  };

  // Datos para el footer de la table 

 const footerData = (data) => {
  // Promedio de score
  const suma = data.reduce((acc, item) => acc + Number(item.score || 0), 0);
  const promedioGeneral = suma / data.length;

  // Total de preguntas
  const totalPreguntas = data.reduce((acc, item) => acc + (data?.length || 0), 0);

  setFooterDatas([{
    promedio: promedioGeneral,
    preguntas: data.length
  }]);
};

  // tarer reportes filtrados

  const getFilterReports = async () => {
    try {
      const agenteParam = String(agenteFilter || '').trim() || "null";
      const evaluadorParam = String(evaluadorFilter || '').trim() || "null";
      // formateo de fecha sin horas
      const formattedStartDate = startDate
        ? dayjs(startDate).format("YYYY-MM-DD")
        : "";
      const formattedEndDate = endDate
        ? dayjs(endDate).format("YYYY-MM-DD")
        : "";

      const filtro = await axios.get(
        `http://localhost:3000/api/answersform/filter/${filtroSeleccionado}/${formattedStartDate}/${formattedEndDate}/${agenteParam}/${evaluadorParam}`,
        config
      );

      if (!filtro.data || filtro.data.length === 0) {
        Swal.fire({
          title: t("reports.sin_datos"),
          text: t("reports.texto_sin_datos"),
          icon: "info",
          confirmButtonText: t("buttons.aceptar"),
          confirmButtonColor: "#FF66B2",
        });
      }
      //console.log("aki:",filtro.data)
      setReportesFiltrados(filtro.data);
    } catch (error) {
      console.log("Error al consumir la api", error);
    }
  };

  // descargar lo filtrado en exel

  const exportExel = () => {
    // filtro entre exportacion total y seleccionados
    const dataCargada = seleccionados.length ? seleccionados : formatExel;

    if (
      !dataCargada ||
      dataCargada.length === 0 ||
      Object.keys(dataCargada).length === 0
    ) {
      Swal.fire({
        title: t("reports.sin_datos"),
        text: t("reports.texto_sin_datos"),
        icon: "info",
        confirmButtonText: t("buttons.aceptar"),
        confirmButtonColor: "#FF66B2",
      });

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
        ...preguntasPlanas, // Se agregan dinámicamente todas las preguntas y respuestas
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
      const datosAgrupados = agruparPorMonitoreo(data);
      
      //console.log("datos sin nada", data2);
      setFullMonitoring(datosAgrupados);
      const erroresAgrupados = obtenerErroresPorPregunta(datosAgrupados, responseMulti);
      setErrorConteo(erroresAgrupados);
      console.log("conteo de errores",erroresAgrupados);
      const erroresGeneral = conteoErrorGeneral(erroresAgrupados);
      setErrorGeneral(erroresGeneral);
      console.log("conteo de errores agrupados",erroresGeneral);
      
      console.log("monitoreo", datosAgrupados)
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

  return (
    <Box className="App" sx={{ overflow: "hidden" }}>
      <Box id="body">
          {userInfo?.type === 3 || userInfo?.type === 2 ? (
            <HeaderLT2 />
          ) : (
            <HeaderLT1 />
          )}
        <Box sx={{ m: 0, p: 0, display: "flex", justifyContent: "center", alignItems: "center"}}>
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
                    flexWrap="nowrap"
                    alignItems="center"
                    justifyContent="flex-start"
                    gap={2}
                    sx={{
                      mb: 2,
                      whiteSpace: "nowrap", // Mantiene los elementos en una sola línea
                      width: "100%", 
                    }}
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
                    <FormControl
                      required
                      sx={{ minWidth: "16%" }}
                      className="readOnlyField"
                    >
                      <InputLabel id="demo-simple-select-label">
                        {t("survey.selecciona_cliente")}
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={idClienteFiltro}
                        label={t("survey.selecciona_cliente")}
                        onChange={(e) => {
                          setIdClienteFiltro(e.target.value);
                        }}
                      >
                        <MenuItem value={""}>None</MenuItem>
                        {clientsAndFroms.length > 0 ? (
                          clientsAndFroms.map((i) => (
                            <MenuItem value={i.idClient} key={i.idClient}>
                              {i.client}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>{t("clientTable.cargando_clientes")}</MenuItem>
                        )}
                      </Select>
                    </FormControl>

                    {/* vista formularios */}
                    <FormControl
                      required
                      sx={{ minWidth: "16%" }}
                      className="readOnlyField"
                    >
                      <InputLabel>{t("survey.form")}</InputLabel>
                      <Select
                        labelId="survey-select-label"
                        id="survey-select"
                        value={filtroSeleccionado}
                        onChange={(e) => {
                          const response = parseInt(e.target.value);
                          const infoCapturado = formsInfo.find(
                            (i) => i.id === response
                          );
                          setFiltroSeleccionado(Number(infoCapturado.id));
                        }}
                        input={<OutlinedInput label="Formulario" />}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {formsInfo
                          .filter((item) => item.idClient === idClienteFiltro)
                          .map((item, i) => (
                            <MenuItem key={i} value={item.id}>
                              {item.title}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                    {/* Agente*/}
                    <FormControl
                      required
                      sx={{ minWidth: "10%" }}
                      className="readOnlyField"
                    >
                      <InputLabel id="demo-simple-select-label">
                        {("Agente")}
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={agenteFilter}
                        label={("Agente")}
                        onChange={(e) => {
                          setAgenteFilter(e.target.value);
                        }}
                      >
                        <MenuItem value={""}>None</MenuItem>
                        {monitoringAgente.length > 0 ? (
                          [...new Set(monitoringAgente.map(i => i.nombre_agente))].map(nombre => (
                            <MenuItem value={nombre} key={nombre}>
                              {nombre}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>{t("clientTable.cargando_clientes")}</MenuItem>
                        )}
                      </Select>
                    </FormControl>

                    {/* Evaluador */}
                    <FormControl
                      required
                      sx={{ minWidth: "10%" }}
                      className="readOnlyField"
                    >
                      <InputLabel id="demo-simple-select-label">
                        {("Evaluador")}
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={evaluadorFilter}
                        label={("Evaluador")}
                        onChange={(e) => {
                          setEvaluadorFilter(e.target.value);
                        }}
                      >
                        <MenuItem value={""}>None</MenuItem>
                        {monitoringEvaluador.length > 0 ? (
                          [...new Set(monitoringEvaluador.map(i => i.nombre_monitor))].map(nombre => (
                            <MenuItem value={nombre} key={nombre}>
                              {nombre}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>{t("clientTable.cargando_clientes")}</MenuItem>
                        )}
                      </Select>
                    </FormControl>
                    {/* vista fechas */}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        className="readOnlyField"
                        label={t("reports.fecha_inicio")}
                        value={startDate}
                        onChange={handleStartDateChange}
                        sx={{ width: "19%" }}
                      />
                      <DatePicker
                        className="readOnlyField"
                        label={t("reports.fecha_fin")}
                        value={endDate}
                        onChange={handleEndDateChange}
                        sx={{ width: "19%" }}
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

        <Box
          sx={{
            alignItems: "stretch",
            flexWrap: "nowrap",
            padding: 0,
            display: "flex",
          }}
        >
          <Box className="container" mt={0}>
            {fullMonitoring.length > 0 && (
              <TableFormReport
                header={selectedKeys}
                data={fullMonitoring}
                onSelectionChange={(rows) => setSeleccionados(rows)}
                footerData={footerDatas}
                table2={errorConteo}
                table3={errorGeneral}
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
                    {t("reports.mensaje_reporte_formulario")}
                  </Alert>
                </Box>
              </Fade>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};
export default FormReport;
