import { useState, useEffect, useContext } from "react";
import SidebarLT1 from "../../components/aside/sidebarLT1";
import HeaderLT1 from "../../components/header/headerLT1";
import SidebarLT2 from "../../components/aside/sidebarLT2";
import HeaderLT2 from "../../components/header/headerLT2";
import useInput from "../../components/hooks/useInput";
import TableSurvey from "../../components/Tables/tableSurvey";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { smallAlertDelete, Toast, Toast2 } from "../../assets/js/alertConfig";
import { generateRandomLink } from "../../components/survey/encrypt";
import { useTranslation } from "react-i18next";
import { formatDate,getTomorrowDate } from "../../utils/dateUtils.jsx";
import Cookies from "js-cookie"; // si no lo has importado ya
import { getSurveyQuestions } from "../../services/surveyRequest";

import ModalEnvioMasivo from "../../components/Modals/modalEnvioMasivo";

import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  Grid,
  Divider,
  Chip,
  Stack
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  Edit as EditIcon,
  Add as AddIcon
} from '@mui/icons-material';

const SurveyList = () => {
  // //todo Poner Tokens const {accessToken, RefreshToken} = useAuth(AuthContext)

  const [modalOpen, setModalOpen] = useState(false); //estado del modal mui

  // En el estado del componente añade:
  const [showEnvioModal, setShowEnvioModal] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const { t, i18n } = useTranslation();
  //const url = "http://localhost:3000/api/surveys";
  const headers = ["Title", "Start_date", "End_date", "state"];
  const [operation, setOperation] = useState([1]);
  const [idToEdit, setidToEdit] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  const [survey, setSurvey] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [endDate, setEndDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [errorFechas, setErrorFechas] = useState(false);
  const [errorFechasMessage, setErrorFechasMessage] = useState("");
  const [newTitle, setNewTitle]=useState("")
  const [formattedDate,setFormattedDate]=useState({})
  const title = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });
  const start_date = useInput({
    defaultValue: "",
    validate: /^\d{4}-\d{2}-\d{2}$/,
  });
  const end_date = useInput({
    defaultValue: "",
    validate: /^\d{4}-\d{2}-\d{2}$/,
  });
  const description = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });
  const link = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });
  const state = useInput({ defaultValue: "", validate: /^[0-2 ]*$/ });
  const idClient = useInput({ defaultValue: "", validate: /^[1-4]+$/ });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // const { t, i18n } = useTranslation();
  const [isFormValid, setIsFormValid] = useState(true);
  const [viewModalOpen, setViewModalOpen] = useState(false); // Estado del modal de vista


  const { userType, userId, languageUser } = useContext(UserContext);
  const accessToken = Cookies.get('accessToken');

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
  };

  const handleOpenViewModal = () => {
    setViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedClients([]);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  useEffect(() => {
    getSurveys();
    const today = new Date();
    const formattedDater = formatDate(today);
    const formattedDaterTomorrow = getTomorrowDate(today);
    setFormattedDate({
      dateToday: formattedDater,
      dateTomorrow: formattedDaterTomorrow,
    });
  }, [userId]);
  

  useEffect(() => {
    console.log("******",clients);
    if (userId && accessToken) {
      getClients(userId);
    }
  }, [userId, accessToken]);
  

  useEffect(() => {
    i18n.changeLanguage(languageUser);
  }, [languageUser]);
  

  const config = {
    headers: {
    },
    withCredentials: true,
  };
  

  const getSurveys = async () => {
    try {
      //const response = await axios.get(url, config);
      const response = await axios.get(`http://localhost:3000/api/surveys-user/${userId}`, config);
      console.log("Encuestas: ", response.data);
      setSurvey(response.data.data); // <-- ¡aquí está el fix!
    } catch (error) {
      console.error("Error al obtener encuestas:", error);
      if (error.response) {
        console.error("Detalles del error:", error.response.data);
      }
    }
  };
  
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
        setClients(response.data.data);
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

  const activeSurvey = (survey) => {
    const url = `http://localhost:3000/api/survey`;
    const id = survey.id;
    const name = survey.title;
    const parametros = {
      state: 1,
    };
    smallAlertDelete
      .fire({
        title: t("alertActivate.activar_elemento"),
        toast: false,
        icon: "warning",
        text: t("alertActivate.la_encuesta") + ` ${name} ` + t("alertActivate.mensaje_activar"),
        showCancelButton: true,
        confirmButtonText: t("buttons.confirmar"),
        cancelButtonText: t("buttons.cancelar"),
        confirmButtonColor: "#b62a8b",
        customClass :{
          actions: 'swal2-actions-center ', 
          icon: 'icono-personalizado',
          title: 'titulo-pequeno',
        },
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.patch(`${url}/${id}`, parametros, {
              withCredentials: true,
            });

            Toast.fire({
              icon: "success",
              title: t("alertActivate.la_encuesta") + ` ${survey.title} ` + t("alertActivate.SuccessAlert"),
            });

            // getSurveys();
          } catch (error) {
            Toast.fire({
              icon: "error",
              title: t("alertActivate.la_encuesta") +` ${survey.title} ` + t("alertActivate.ErrorAlert"),
            });
            console.error(error);
          }
        }
        getSurveys();
      });
  };

  const deactivateSurvey = (survey) => {
    const url = `http://localhost:3000/api/survey`;
    const id = survey.id;
    const name = survey.title;
    const parametros = {
      state: 0,
    };

    smallAlertDelete
      .fire({
        icon: "warning",
        toast: false,
        title: t("alertDeactivate.deshabilitar_elemento"),
        text: t("alertDeactivate.la_encuesta") +` ${name} ` + t("alertDeactivate.mensaje_desactivar"),
        showCancelButton: true,
        confirmButtonText: t("buttons.confirmar"),
        cancelButtonText: t("buttons.cancelar"),
        confirmButtonColor: "#b62a8b",
        customClass :{
          actions: 'swal2-actions-center ', 
          icon: 'icono-personalizado',
          title: 'titulo-pequeno',
        },
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.patch(`${url}/${id}`, parametros, config);
            Toast.fire({
              icon: "success",
              title: t("alertDeactivate.la_encuesta") + ` ${survey.title} ` + t("alertDeactivate.SuccessAlert"),
            });
          } catch (error) {
            alert("error", "Error al eliminar");
            console.error(error);
          }
        }
        getSurveys();
      });
  };

  const parseLocalDate = (dateString) => {
    if (!dateString || typeof dateString !== "string") {
      console.warn("se recibio un valor invalido:", dateString);
      return null;
    }  
    const [year, month, day] = dateString.split("-");
    return new Date(year, month - 1, day); // Recuerda: month es 0-indexed
  };

  const validateDates = (dateStart, dateEnd) => {
    setErrorFechasMessage(""); //reinicior la variable de mensaje de error
    
    if (!dateStart || !dateEnd) {
      console.warn("Una o ambas fechas no están definidas:", dateStart, dateEnd);
      return false;
    }

    const start = parseLocalDate(dateStart);
    const end = parseLocalDate(dateEnd);
    const today = new Date();

    //  Validar antes de usar setHours
    if (!start || !end) {
      setErrorFechas(true);
      setErrorFechasMessage("Fechas inválidas.");
      return false;
    }
    
    // Normaliza TODAS las fechas a medianoche
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    //validar que la fecha de inicio no sea menor a la fecha actual
    if (start < today)  {
      setErrorFechas(true);
      setErrorFechasMessage(t("alerts.error_fecha_incio"))
      setIsFormValid(false);
      return false;
    }

    if (end < start) {
      setErrorFechas(true);
      setErrorFechasMessage(t("alerts.error_fecha_inicio_fin"));
      setIsFormValid(false);
      return false;
    } 
    setErrorFechas(false);
    setIsFormValid(true);
    return true;
  };

  useEffect(() => {
    validateDates(start_date.input, end_date.input);
  }, [start_date.input, end_date.input]);

  const formatDateForInput = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return date.toISOString().split('T')[0];
  };
  

  const openModal = (op, survey) => {
    setOperation(op);  
    if (op == 1) {
      setModalTitle(t("survey.añadir_encuesta"));
      title.handleChange("");
      start_date.handleChange("");
      end_date.handleChange("");
      description.handleChange("");
      link.handleChange("");
      idClient.handleChange("");
    } else if (op == 2) {
      console.log("esto es survey",survey)
      setModalTitle(t("survey.editar_encuesta"));
      title.handleChange(survey?.title || "");
      setNewTitle(survey?.title || "");
      start_date.handleChange(formatDateForInput(survey?.start_date));
      end_date.handleChange(formatDateForInput(survey?.end_date));
      description.handleChange(survey?.description || "");
      link.handleChange(survey?.link || "");
      console.log("----**idClient", survey.idClient);
      idClient.handleChange(survey?.idClient || "");
      setidToEdit(survey?.id);
    }
    handleOpenModal();
  };
  
  const validar = (id) => {
    var parametros;
    var metodo;
    const dates = validateDates();

    console.log("idCliente se envia", idClient.input);

    if (
      title.input.trim() == "" ||
      start_date.input.trim() == "" ||
      end_date.input.trim() == "" ||
      description.input.trim() == "" ||
      !idClient.input || idClient.input == "" 
    ) {
         smallAlertDelete
      .fire({
        icon: "warning",
        toast: false,
        text: t("alerts.fillRequiredFields"),
        confirmButtonText: t("buttons.confirmar"),        
        confirmButtonColor: "#b62a8b",
        customClass :{
          actions: 'swal2-actions-center ', 
          icon: 'icono-personalizado',
          title: 'titulo-pequeno',
        },
      })
    } else {
      if (operation == 1) {
        const link = generateRandomLink(title.input, idClient.input);
        console.log(link);
        parametros = {
          title: title.input,
          start_date: start_date.input,
          end_date: end_date.input,
          description: description.input,
          idClient: idClient.input,
          link: link,
          //type: "survey",
          state: 1,
        };
        console.log("datos del link a crear:", parametros);
        metodo = "post";
      } else if (operation == 2) {
        const titleExists = survey.some(item => item.title === title.input  );

        
        parametros = {
          title: title.input == newTitle && titleExists? undefined: title.input,
          start_date: start_date.input,
          end_date: end_date.input,
          description: description.input,
          idClient: idClient.input,
          link: link.input,
          //type: "survey",
        };
        metodo = "put";
      }
      sendData(metodo, parametros, id);
    }
  };
  const sendData = async (metodo, parametros) => {
    try {
      if (metodo.toUpperCase() == "POST") {
        const handleCreateSurvey = async () => {
          setLoading(true);
          try {
            const response = await axios.post(
              "http://localhost:3000/api/surveys",
              parametros,
              config
            );
            const responseData = response.data;
            console.log("Respuesta solicitud Post:", responseData);
            if (responseData.status) {
              getSurveys();
              handleCloseModal();
              Toast.fire({
                icon: "success",
                title: t("alerts.mensaje_crear_encuesta"),
              });
            }
          } catch (error) {
            console.error(error);
          } finally {
            setLoading(false);
          }
        };

        handleCreateSurvey();
      } else if (metodo.toUpperCase() == "PUT") {
        const url = `http://localhost:3000/api/survey`;
        const response = await axios.put(
          `${url}/${idToEdit}`,
          parametros,
          config
        );
        if (response.status === 200) {
          handleCloseModal();
          Toast.fire({
            icon: "success",
            title: t("alerts.mensaje_encuesta_editada"),
          });
        }
        getSurveys();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const openModalCont =  async (survey) => {
     /* await getClient(survey.id)  */
     setModalTitle("Información de la encuesta");
     title.handleChange(survey?.title || "");
     start_date.handleChange(survey?.start_date || "");
     end_date.handleChange(survey?.end_date || "");
     state.handleChange(survey?.state || "");
     description.handleChange(survey?.description || "");
     link.handleChange(survey?.link || "No presenta link anexado");
     idClient.handleChange(survey?.idClient || "");
     handleOpenViewModal();
  };

  const openModalBulk = (survey)  => {
    setSelectedSurvey(survey);
    setShowEnvioModal(true);
  };

  // Función que cuenta cuántas copias del mismo título existen
  const countExistingCopies = (title, allSurveys) => {
    const regex = new RegExp(`^${title} copia(?: \\((\\d+)\\))?$`);
    const matches = allSurveys
      .map((s) => {
        const match = s.title.match(regex);
        return match ? (match[1] ? parseInt(match[1]) : 1) : null;
      })
      .filter((val) => val !== null);

    if (matches.length === 0) return '';
    const maxNumber = Math.max(...matches);
    return ` (${maxNumber + 1})`;
  };

  const getAllSurveys = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/surveys", config);
      return response.data.data; // Asegúrate que el backend devuelve las encuestas dentro de .data
    } catch (error) {
      console.error("Error al obtener todas las encuestas", error);
      return []; // Evita errores si falla
    }
  };

  const duplicateSurvey = (survey) => {
    console.log("**DAtos encuesta a duplicar",survey);
    smallAlertDelete
      .fire({
        icon: "warning",
        toast: false,
        title: t("survey.duplicar_encuesta"),
        text: t("alertActivate.la_encuesta") + ` ${survey.title} ` + t("survey.se_duplicara"),
        showCancelButton: true,
        confirmButtonText: t("buttons.confirmar"),
        cancelButtonText: t("buttons.cancelar"),
        confirmButtonColor: "#b62a8b",
        customClass :{
          actions: 'swal2-actions-center ', 
          icon: 'icono-personalizado',
          title: 'titulo-pequeno',
        }
      })
      .then(async (result) => {
        if (result.isConfirmed) {
// Obtén todas las encuestas existentes
        const allSurveys = await getAllSurveys(); // <-- asegúrate que esta función existe
        const suffix = countExistingCopies(survey.title, allSurveys);
        const newTitle = `${survey.title} copia${suffix}`;

          //se genera un nuevo link
          const link = generateRandomLink(survey.title, survey.idClient);
          const randomLink = link + Math.floor(Math.random() * 100) + 1;

          //crea el objeto con los datos a duplicar
          const DataToDuplicate = {
            description: survey.description,
            start_date: formattedDate.dateToday,
            end_date: formattedDate.dateTomorrow,
            idClient: survey.idClient,
            state: survey.state,
            title: newTitle ,
            //type: survey.type,
            link: randomLink,
          };
          // sendData("post", DataToDuplicate);
          // getSurveys();

          //crea la encuesta duplicada 
          const response = await axios.post("http://localhost:3000/api/surveys",DataToDuplicate, config);

          //obtiene el id de la encuesta duplicada
          const newSrurveyId = response.data.data.id;
          console.log("id de la encuesta duplicada--------------------", newSrurveyId);

          //obtener las preguntas de la encuesta original
          const originalQuestions = await getSurveyQuestions(survey.id, config);  
          console.log("Preguntas de la encuesta original:", originalQuestions);

          if (!originalQuestions || originalQuestions.length === 0) {
            // Si no hay preguntas, solo actualiza la lista de encuestas
            getSurveys();
            return;
          }
          
          // Objeto para mapear IDs originales a IDs duplicados
          const questionIdMap = {};

          // Itera sobre cada pregunta de la encuesta original para duplicarla en la nueva encuesta y copiarlas
          for( const question of originalQuestions){
              const questionToDuplicate = {
              survey_id : newSrurveyId, // asociar a la nueva encuesta
              question : question.question,
              type : question.type,
              select_option : question.select_option,
              selected_answer : question.selected_answer,
              id_conditional : question.id_conditional,
              conditional_answer : question.conditional_answer,
              conditional : question.conditional
            };  
            try {
              // Envía una petición POST al backend para crear la copia de la pregunta en la nueva encuesta
              const newQuestionResponse = await axios.post("http://localhost:3000/api/question", questionToDuplicate, config);
            // Guarda la relación entre el ID original de la pregunta y el nuevo ID asignado a la pregunta duplicada
              questionIdMap[question.id] = newQuestionResponse.data.data.id;
          
            }catch (error) {
              console.error("error al duplicar preguntas", error);
            }
          }
          
         // Obtiene todas las preguntas de la encuesta recién duplicada, incluyendo las nuevas IDs
         const duplicatedQuestions = await getSurveyQuestions(newSrurveyId, config);
            
         // Itera sobre las preguntas duplicadas para actualizar las referencias condicionales
            for (const duplicatedQuestion of duplicatedQuestions) {
              // Verifica si la pregunta duplicada tiene una condición asociada 
              if (duplicatedQuestion.id_conditional) {
                  // Utiliza el mapa de IDs para obtener el nuevo ID de la pregunta a la que hace referencia la condición
                  duplicatedQuestion.id_conditional = questionIdMap[duplicatedQuestion.id_conditional];
                  try {
                    // Envía una petición PUT al backend para actualizar el id_conditional de la pregunta duplicada con el nuevo ID
                    await axios.put(`http://localhost:3000/api/question/conditional/${duplicatedQuestion.id}`, {id_conditional: duplicatedQuestion.id_conditional},config)  
                  } catch (error) {
                    console.error("Error al actualizar id_conditional", error);
                  }
              }
           }
          getSurveys();
        }
      });
  };
  

  const openSurvey = (survey) => {
    console.log('catching survey', survey)
    navigate(`/view_survey/${survey.id}`);
  };

  const copyLink = (survey) => {
    const { link } = survey;
    navigator.clipboard.writeText(link);
    Toast.fire({
      icon: "success",
      title: t("alerts.link_copiado"),
    });
  }

  console.log("encuestas a mostrar:", survey);
  console.log("Valor de start_date.input en el render:", start_date.input);

  return (
    <Box className="App" sx={{ overflow: "hidden" }}>
      <Box id="body">
        {userType == "1" || userType == "2" ? <HeaderLT1 /> : <HeaderLT2 />}
        <Box m={0} sx={{ alignItems: "stretch", flexWrap: "nowrap", padding: 0, display : "flex" }}>
          {/* <Box div className="col-1 d-flex  align-items-center mx-auto p-0">
          {/* {userType == "1" || userType == "2" ? <SidebarLT1 /> : <SidebarLT2 />} 
          </div> */}
          <Box className="container" mt={0} sx={{ maxWidth: "97%" }}>
            {survey.length > 0 ? (
              <TableSurvey
                header={headers}
                data={survey}
                onCreate={() => openModal(1)}
                onUpdate={(payload) => openModal(2, payload)}
                modalId={"modalSurvey"}
                modalId2={"modalViewSurvey"}
                onView={(payload) => openModalCont(payload)}
                onCheck={(payload) => openSurvey(payload)}
                onRemove={(item) => deactivateSurvey(item)}
                onActive={(payload) => activeSurvey(payload)}
                onDuplicate={(item) => duplicateSurvey(item)}
                onCopyLink={(item)=> copyLink(item)}
                onBulkEmail={(payload)=> openModalBulk(payload)}
              />
            ) : (
              <Box sx={{ textAlign: 'center', py: 5,}}>
                <Typography>{t("survey.no_hay_encuestas_disponibles")}</Typography>
                  <Button
                  sx={{
                    color: 'white',
                    backgroundColor: '#b62a8b', // Color morado estándar de MUI
                    '&:hover': {
                      backgroundColor: '#581244', // Morado más oscuro al hover
                    }
                  }}         
                    data-bs-toggle="modal"
                    data-bs-target="#modalSurvey"
                    className="btn btn-primary mt-3"
                    onClick={() => openModal(1)}
                  >
                    {t("survey.crear_encuesta")}
                  </Button>
              </Box>
            )}
          </Box>
          
        </Box>
      </Box>
     
     <Modal
      open={viewModalOpen}
      onClose={handleCloseViewModal}
      aria-labelledby="view-modal-title"
      aria-describedby="view-modal-description"
      sx={{
        zIndex: 5,
      }}
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '90%', sm: 600, md: 800 },
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: 0,
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <Paper elevation={3}>
          {/* Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            p: 2, 
            borderBottom: '1px solid #e0e0e0' 
          }}>
            <Typography variant="h6" component="h2" id="view-modal-title">
              {modalTitle}
            </Typography>
            <IconButton 
              onClick={handleCloseViewModal}
              sx={{ color: 'grey.500' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Body */}
          <Box sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <TextField
                  className="readOnlyField"
                  fullWidth
                  label={t("survey.titulo")}
                  value={title.input}
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                  
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  className="readOnlyField"
                  fullWidth
                  select
                  label={t("survey.cliente")}
                  value={idClient.input}
                  variant="outlined"
                  SelectProps={{
                    native: true,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    readOnly: true,
                  }}
                  
                >
                  <option value="" disabled>
                    {t("survey.selecciona_cliente")}
                  </option>
                  {clients.length > 0 ? (
                    clients.map((client) => (
                      <option value={client.idClient} key={client.id}>
                        {client.clientName}
                      </option>
                    ))
                  ) : (
                    <option disabled>Cargando clientes...</option>
                  )}
                </TextField>
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                className="readOnlyField"
                  fullWidth
                  label={t("survey.fecha_inicio")}
                  type="date"
                  value={start_date.input}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  className="readOnlyField"
                  fullWidth
                  label={t("survey.fecha_fin")}
                  type="date"
                  value={end_date.input}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                  
                />
              </Grid>
            </Grid>

            <TextField
               className="readOnlyField"
              fullWidth
              label={t("survey.descripcion")}
              multiline
              rows={4}
              value={description.input}
              variant="outlined"
              sx={{ 
                mt: 2,
              }}
              InputProps={{
                readOnly: true,
              }}
            />
          </Box>

          {/* Footer */}
          <Divider />
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: 2, 
            p: 2 
          }}>
            <Button
              variant="outlined"          
              onClick={handleCloseViewModal}
              sx={{            
                color: '#b62a8b',       // Texto morado
                borderColor: '#b62a8b',  // Borde morado
                '&:hover': {
                  borderColor: '#b62a8b', // Borde morado oscuro al hover
                  backgroundColor: 'rgba(156, 39, 176, 0.04)' // Fondo muy transparente al hover
                }
              }}
            >
              {t("buttons.cerrar")}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Modal>
 {showEnvioModal && (
  <ModalEnvioMasivo 
    survey={selectedSurvey} 
    onClose={() => setShowEnvioModal(false)} 
  />
)}
     <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{
    zIndex: 5, // ⬅️ Reduce el z-index del modal (valor por defecto de MUI)
  }}
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 600, md: 800 },
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 0,
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          <Paper elevation={3}>
            {/* Header */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              p: 2, 
              borderBottom: '1px solid #e0e0e0' 
            }}>
              <Typography variant="h6" component="h2" id="modal-title">
                {modalTitle}
              </Typography>
              <IconButton 
                onClick={handleCloseModal}
                sx={{ color: 'grey.500' }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Body */}
            <Box sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <TextField
                    className="readOnlyField"
                    fullWidth
                    label={t("survey.titulo")}
                    value={title.input}
                    onChange={(e) => title.handleChange(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    className="readOnlyField"
                    fullWidth
                    select
                    label={t("survey.cliente")}
                    value={idClient.input}
                    onChange={(e) => idClient.handleChange(e.target.value)}
                    variant="outlined"
                    SelectProps={{
                      native: true,
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  >
                    <option value="" disabled>
                      {t("survey.selecciona_cliente")}
                    </option>
                    {clients.map((client) => (
                      <option value={client.idClient} key={client.id}>
                        {client.clientName}
                      </option>
                    ))}
                  </TextField>
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                   className="readOnlyField"
                    fullWidth
                    label={t("survey.fecha_inicio")}
                    type="date"
                    value={start_date.input}
                    onChange={(e) => {
                      start_date.handleChange(e.target.value);
                      validateDates(e.target.value, end_date.input);
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    className="readOnlyField"
                    fullWidth
                    label={t("survey.fecha_fin")}
                    type="date"
                    value={end_date.input}
                    onChange={(e) => {
                      end_date.handleChange(e.target.value);
                      validateDates(start_date.input, e.target.value);
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="outlined"
                  />
                </Grid>
              </Grid>

              {errorFechas && (
                <Typography color="error" sx={{ mt: 1 }}>
                  {errorFechasMessage}
                </Typography>
              )}

              <TextField
                className="readOnlyField"
                fullWidth
                label={t("survey.descripcion")}
                multiline
                rows={4}
                value={description.input}
                onChange={(e) => description.handleChange(e.target.value)}
                variant="outlined"
                sx={{ mt: 2 }}
              />
            </Box>

            {/* Footer */}
            <Divider />
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: 2, 
              p: 2 
            }}>
              <Button
                variant="outlined"
                onClick={handleCloseModal}
                sx={{            
                  color: '#b62a8b',       // Texto morado
                  borderColor: '#b62a8b',  // Borde morado
                  '&:hover': {
                    borderColor: '#b62a8b', // Borde morado oscuro al hover
                    backgroundColor: 'rgba(156, 39, 176, 0.04)' // Fondo muy transparente al hover
                  }
                }}
              >
                {t("buttons.cerrar")}
              </Button>
              <Button
                variant="contained"
                onClick={() => validar(idToEdit)}
                disabled={errorFechas || !isFormValid}
                sx={{
                  backgroundColor: '#b62a8b',
                  '&:hover': {
                    backgroundColor: '#581244',
                  }
                }}
              >
                {t("buttons.guardar")}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Modal>
    </Box>
  );
};

export default SurveyList;
