import React, { useState, useEffect, useContext, useMemo } from "react";
import HeaderLT1 from "../../components/header/headerLT1";
import axios from "axios";
import useInput from "../../components/hooks/useInput";
import { UserContext } from "../../context/UserContext";
import { useParams } from "react-router-dom";
import {
  smallAlertDelete,
  loadingAlert,
  Toast2,
  Toast,
} from "../../assets/js/alertConfig";
import {
  sendData,
  deleteQuestion,
  getSurvey,
  getSurveyQuestions,
} from "../../services/surveyRequest";
import {
  SingleChoiceQuestion,
  MultipleChoiceQuestion,
  MultipleChoiceQuestionEdit,
  SingleChoiceQuestionEdit,
} from "./singleChoiceQuestion";
import "../../assets/css/survey.css";
import {
  Range_onetofive,
  Range_zerototen,
  Range_difficulty,
  Yes_no,
  Range_emoji,
  Textfield_s,
  SingleChoiceView,
  MultipleChoiceView,
} from "./questions";
import getRangeOptions from "./conditional";
import { useNavigate } from "react-router-dom";

// Material-UI Imports
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem as MenuItemComponent,
  Alert,
  Paper,
  Divider,
  useTheme,
  CircularProgress,
  Fade,
  Slide,
  Zoom,
  Stack,
  Chip
} from '@mui/material';
import {
  TurnLeft,
  ArrowBack,
  Add,
  MoreVert,
  Edit,
  Delete,
  Help,
  Link, 
  Update,
  Info,
  QuestionAnswer,
  Analytics,
  Schedule
} from '@mui/icons-material';
import { useTranslations } from "../../components/hooks/useTranslations";

export default function View_survey() {
  const theme = useTheme();
  const nav = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  const [surveyData, setSurveyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [idToEdit, setidToEdit] = useState(null);
  const [error, setError] = useState("");
  const [listConditional, setListConditional] = useState(false);
  const [valueConditional, setValueConditional] = useState(null);
  const [singleChoiceData, setSingleChoiceData] = useState({
    options: [],
    correctAnswer: null,
  });
  const [multipleChoiceData, setMultipleChoiceData] = useState({
    options: [],
    correctAnswers: [],
  });

  const [isChecked, setIsChecked] = useState(null);
  const [selectedRangeType, setSelectedRangeType] = useState({
    questionTypeRange: "",
    answersRange: "",
  });

   // Estados para Material-UI Modal y Menu
  const [modalOpen, setModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const [validationErrors, setValidationErrors] = useState({}); // estado para almacenar los errores de validación

  // Estados para animaciones
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [showCards, setShowCards] = useState(false);

  const question = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });
  const description = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });
  const questionType = useInput({ defaultValue: "", validate: /^[A-Za-z_]+$/ });
  const section = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });
  const percentage = useInput({
    defaultValue: "",
    validate: /^[^\s@]+@[^\s@]+\.[^\s@]*$/,
  });
  const frm_option = useInput({
    defaultValue: "",
    validate:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  });
  const conditional = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });
  const id_conditional = useInput({ defaultValue: "0", validate: /^[0-9]*$/ });
  const survey_id = useInput({ defaultValue: "", validate: /^[0-9]*$/ });
  const conditional_answer = useInput({
    defaultValue: "",
    validate: /^[A-Za-z0-9]*$/,
  });

  const { t } = useTranslations();
  const { accessToken, languageUser, userType } = useContext(UserContext);
  
  // Verificar si el usuario es agente (solo visualización)
  const isAgent = userType === "4" || userType === 4;

  useEffect(() => {
  // Limpiar errores cuando cambie el tipo de pregunta
  if (questionType.input) {
    clearValidationErrors();
  }
}, [questionType.input]);

useEffect(() => {
  // Limpiar errores cuando se actualice correctAnswer
  if (singleChoiceData.correctAnswer !== null && 
      singleChoiceData.correctAnswer !== undefined &&
      singleChoiceData.correctAnswer !== -1) {
    clearValidationErrors();
  }
}, [singleChoiceData.correctAnswer]);

useEffect(() => {
  // Limpiar errores cuando se actualicen las respuestas múltiples
  if (multipleChoiceData.correctAnswers && 
      multipleChoiceData.correctAnswers.length > 0) {
    clearValidationErrors();
  }
}, [multipleChoiceData.correctAnswers]);

  useEffect(() => {
    getSurvey(id, config, setSurveyData);
    updateSurveyQuestions();
  }, [id]);

useEffect(() => {
  const fetchData = async () => {
    const questions = await getSurveyQuestions(id, config);
    setSurveyData(prevData => ({
       ...prevData,
       sampleCount: Array.isArray(questions) ? questions.length : 0
     }));
  };

  fetchData();
}, []);

// Efecto para animaciones de carga
useEffect(() => {
  if (data.length >= 0) {
    setLoadingQuestions(false);
    setTimeout(() => setShowCards(true), 300);
  }
}, [data]);

const config = {
  headers: {
  },
  withCredentials: true,
};
 
  //Función para limpiar errores
  const clearValidationErrors = () => {
   setError("");
  };

  const updateSurveyQuestions = async () => {
    try {
      const result = await getSurveyQuestions(id, config);
      setData(result || []); // Si no viene nada, al menos dejamos un array vacío
    } catch (error) {
      console.error("Error fetching survey questions", error);
      setData([]); // evita que quede undefined y cause crash
    }
  };

  const handleCancel = () => {
    setValueConditional(false);
    setIsChecked(false);
    setSingleChoiceData({ options: [], correctAnswer: [] });
    setMultipleChoiceData({ options: [], correctAnswers: [] });
    setidToEdit(null);
    //limpiar también los valores de los inputs
    id_conditional.handleChange(0);
    conditional_answer.handleChange("");
    conditional.handleChange("NO");
    setModalOpen(false); // Cerrar modal Material-UI
    clearValidationErrors()
     questionType.handleChange("");
    description.handleChange("");
  };

  const conditionalHandleChange = (e) => {
    const conditional = e;
    setIsChecked(conditional);
    setValueConditional(conditional);

    //si se desmarca limpiar los valores relacionados a la pregunta condicional
    if(!conditional) {
      id_conditional.handleChange(0);
      conditional_answer.handleChange("");
    }
  };

  useEffect(() => {
    if (!valueConditional) {
      setListConditional(false);
      setSingleChoiceData({ options: [], correctAnswer: [] });
      setMultipleChoiceData({ options: [], correctAnswers: [] });
    }
    setListConditional(true);
  }, [valueConditional]);

  useEffect(() => {
  // Efecto para actualizar rangeOptions cuando cambie la pregunta condicional seleccionada
  if (operation === 2 && id_conditional.input && selectedRangeType.questionTypeRange) {
    // Force re-render of rangeOptions when conditional question changes
    const questionFound = data.find(q => q.id.toString() === id_conditional.input.toString());
    if (questionFound) {
      setSelectedRangeType({
        questionTypeRange: questionFound.type,
        answersRange: questionFound.select_option,
      });
    }
  }
}, [operation, id_conditional.input, data]);

  const openModal = (op, idsurvey, questionDetails) => {
    // Prevenir que los agentes abran el modal
    if (isAgent) {
      return;
    }
    
    console.log("---question" , questionDetails);
    setOperation(op);
    if (op === 1) {
      setTitle(t("vistaEncuestas.nueva_pregunta"));
      setDescriptionText(
        (t("vistaEncuestas.descripcion_pregunta"))
      );
      description.handleChange("");
      questionType.handleChange("");
      section.handleChange("Na");
      percentage.handleChange("");
      frm_option.handleChange("Na");
      conditional.handleChange("NO");
      id_conditional.handleChange(0);
      conditional_answer.handleChange("NO");
      survey_id.handleChange(idsurvey);
      setSingleChoiceData({ options: [], correctAnswer: [] });
      setMultipleChoiceData({ options: [], correctAnswers: [] });
       setSelectedRangeType({
      questionTypeRange: "",
      answersRange: "",
    });
    } else if (op === 2) {
      console.log({ questionDetails });
      setSingleChoiceData({ options: [], correctAnswer: [] });
      setMultipleChoiceData({ options: [], correctAnswers: [] });
      setTitle(t("vistaEncuestas.editar_pregunta"));
      setDescriptionText(t("vistaEncuestas.descripcion_pregunta"));
      if (questionDetails.conditional == "SI") {
        setValueConditional(true);
        setIsChecked(true);
        if (questionDetails.id_conditional && questionDetails.id_conditional !== 0) {
        const conditionalQuestion = data.find(q => 
          q.id.toString() === questionDetails.id_conditional.toString()
        );
        
        if (conditionalQuestion) {
          setSelectedRangeType({
            questionTypeRange: conditionalQuestion.type,
            answersRange: conditionalQuestion.select_option,
          });
        }
      }
      } else {
        setValueConditional(false);
        setIsChecked(false);
         setSelectedRangeType({
        questionTypeRange: "",
        answersRange: "",
      });
      }

      if (questionDetails.type == "check_opt") {
        const opstionsMultipleData = questionDetails.select_option.split(",");
        const multipleAnswers = questionDetails.selected_answer.split(",");

        setMultipleChoiceData({
          options: opstionsMultipleData,
          correctAnswers: multipleAnswers,
        });
      }
      if (questionDetails.type == "radio_opt") {
        const optiosnData = questionDetails?.select_option;
        const optionsDataArray = optiosnData.split(",");
        const answerSelected = questionDetails?.selected_answer.split(",");
        console.log("res", answerSelected);
        setSingleChoiceData({
          options: optionsDataArray,
          correctAnswer: answerSelected,
        });
      }
      id_conditional.handleChange(questionDetails?.id_conditional || null);
      conditional.handleChange(questionDetails?.conditional || "");
      description.handleChange(questionDetails?.question || "");
      questionType.handleChange(questionDetails?.type || "");
      conditional_answer.handleChange(
        questionDetails?.conditional_answer || ""
      );
      setidToEdit(questionDetails?.id);
    }
    setModalOpen(true); // Abrir modal Material-UI
  };

  
  // Funciones para el menú de Material-UI
  const handleMenuClick = (event, question) => {
    setAnchorEl(event.currentTarget);
    setSelectedQuestion(question);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedQuestion(null);
  };

  const handleEditClick = () => {
    // Prevenir que los agentes editen preguntas
    if (isAgent) {
      return;
    }
    
    openModal(2, id, selectedQuestion);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    // Prevenir que los agentes eliminen preguntas
    if (isAgent) {
      return;
    }
    
    deleteQuestion(selectedQuestion, config, updateSurveyQuestions, t);
    handleMenuClose();
  };

  const validar = (id, survey_idt) => {
    // Prevenir que los agentes validen/guarden cambios
    if (isAgent) {
      return;
    }
    
    var parametros;
    var metodo;
    clearValidationErrors();
    console.log(" --******---??  ", singleChoiceData);
    if (questionType.input.trim() === "" || description.input.trim() === "") {
      setError(t("alerts.ingrese_pregunta_valida"));
      return
    } else {
      if (questionType.input === "check_opt") {
      // Validar que existan opciones
      if (!multipleChoiceData.options || multipleChoiceData.options.length === 0) {
         setError(t("alerts.debe_agregar_pregunta"));
         return
      }
      
      // Validar que haya opciones con texto
      const hasEmptyOptions = multipleChoiceData.options.some(option => 
        !option || (typeof option === 'object' ? !option.text?.trim() : !option.toString().trim())
      );
      
      if (hasEmptyOptions) {
        setError(t("alerts.debe_agregar_pregunta_respuesta"));
        return
      }
      
      // Validar que se haya seleccionado al menos una respuesta correcta
      if (!multipleChoiceData.correctAnswers || multipleChoiceData.correctAnswers.length === 0) {
        setError(t("alerts.debe_seleccionar_respuesta"));
        return
      }
    }
    
    // Verificar si es una pregunta de opción única (radio_opt)
    if (questionType.input === "radio_opt") {
      // Validar que existan opciones
      if (!singleChoiceData.options || singleChoiceData.options.length === 0) {
         setError(t("alerts.debe_agregar_pregunta"));
         return
      }
      
      // Validar que haya opciones con texto
      const hasEmptyOptions = singleChoiceData.options.some(option => 
        !option || (typeof option === 'object' ? !option.text?.trim() : !option.toString().trim())
      );
      
      if (hasEmptyOptions) {
        setError(t("alerts.debe_agregar_pregunta_respuesta"));     
        return
      }   
      
      // Validar que se haya seleccionado una respuesta correcta
      console.log("el valor", (singleChoiceData.correctAnswer === null))
      console.log("el valor", (singleChoiceData.correctAnswer === undefined))
      console.log("el valor", (singleChoiceData.correctAnswer === ''))
      
      if (singleChoiceData.correctAnswer === null || singleChoiceData.correctAnswer === undefined || singleChoiceData.correctAnswer === '' || singleChoiceData.correctAnswer.length === 0) {
        setError(t("alerts.debe_seleccionar_respuesta_unica"));   
        return
      }
    }

      
      // Asegúrate de que selectedAnswer sea un índice (número) para radio_opt
      const selectedAnswer =
        questionType.input === "radio_opt"
          ? singleChoiceData.correctAnswer
          : multipleChoiceData.correctAnswers;

      const options =
        questionType.input === "radio_opt"
          ? singleChoiceData.options
          : multipleChoiceData.options;

      let selectedAnswerToString = "";  
      // Para "radio_opt" debería ser solo un número, no un array
      // const selectedAnswerToString =
      if( questionType.input === "radio_opt"){
        selectedAnswerToString = selectedAnswer != null && selectedAnswer !== undefined 
        ? selectedAnswer.toString() 
        : "";
      }else {
      // Para check_opt, verificar si es un array válido antes de hacer join
      selectedAnswerToString = Array.isArray(selectedAnswer) && selectedAnswer.length > 0
        ? selectedAnswer.join(", ")
        : "";
    }
       const optionsToSave = Array.isArray(options) && options.length > 0
      ? options.map((option) => {
          // CAMBIO 3: Verificar si option es un objeto con propiedad text o es un string directo
          return typeof option === 'object' && option.text 
            ? option.text 
            : option.toString();
        }).join(", ")
      : "";

      if (operation === 1) {
        parametros = {
          type: questionType.input,
          percentage: 0,
          conditional: valueConditional ? "SI" : "NO",
          question: description.input,
          survey_id: survey_idt,
          frm_option: frm_option.input,
          id_conditional: id_conditional.input,
          conditional_answer: conditional_answer.input,
          section: section.input,
          selected_answer:
            questionType.input === "check_opt" ||
            questionType.input === "radio_opt"
              ? selectedAnswerToString
              : " ",
          select_option:
            questionType.input === "check_opt" ||
            questionType.input === "radio_opt"
              ? optionsToSave
              : "",
        };
        metodo = "post";
        console.log("parametros: ", parametros);
      } else if (operation === 2) {
        parametros = {
          type: questionType.input,
          percentage: 0,
          conditional: valueConditional ? "SI" : "NO",
          question: description.input,
          survey_id: survey_idt,
          conditional_answer: conditional_answer.input,
          id_conditional: id_conditional.input,
           selected_answer:
          questionType.input === "check_opt" ||
          questionType.input === "radio_opt"
            ? selectedAnswerToString || null
            : null,
          select_option:
            questionType.input === "check_opt" ||
            questionType.input === "radio_opt"
            ? optionsToSave || null
            : null,
        };
        console.log("parametros", parametros);
        metodo = "put";
      }

      sendData(
        metodo,
        parametros,
        config,
        id,
        setLoading,
        setError,
        updateSurveyQuestions,
        t
      )
        .then(() => {
          setModalOpen(false); // Cerrar modal Material-UI
          setValueConditional(false);
          setSingleChoiceData({ options: [], correctAnswer: [] });
          setMultipleChoiceData({ options: [], correctAnswers: [] });
        })
        .catch((error) => {
          console.error("Error en la actualización de preguntas:", error);
        });
    }
  };

  const handleSingleChoiceChange = (updatedData) => {
        setSingleChoiceData(updatedData);
    console.log("updated Data:", updatedData);
    console.log("updated Data----:", updatedData.correctAnswer);

    
  };

  const handleMultipleChoiceChange = (data) => {
    console.log("Multiple Choice Data:", data);
    setMultipleChoiceData(data);
  };
  const handleSelectConditionalQuestionChange = (e) => {
    const selectedId = e.target.value; // Captura el value (question.id)
    const selectedQuestion = data.find(question => question.id.toString() === selectedId.toString());
  
    if (selectedQuestion) {
      // Ahora obtenemos los datos directamente del objeto encontrado
      const selectedType = selectedQuestion.type;
      const selectedAnswers = selectedQuestion.select_option;
      
      setSelectedRangeType({
        questionTypeRange: selectedType,
        answersRange: selectedAnswers,
      });
        conditional_answer.handleChange("");
    } else {
      // Si no se encuentra la pregunta, limpiar los valores
      setSelectedRangeType({
        questionTypeRange: "",
        answersRange: "",
      });
          conditional_answer.handleChange("");
    }
    id_conditional.handleChange(selectedId);
  };

  const rangeOptions = useMemo(
    () =>
      getRangeOptions(
        selectedRangeType.questionTypeRange,
        selectedRangeType.answersRange,
        t
      ),
    [selectedRangeType]
  );

  return (
    <Box className="App">
      <Box id="body">
        <HeaderLT1/>
        
        <Container maxWidth="xl" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
          {/* Información de la Encuesta */}
          <Slide direction="down" in={true} timeout={300}>
            <Card 
              sx={{
                borderRadius: '24px',
                background: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid',
                borderColor: theme.palette.mode === 'dark' 
                  ? 'rgba(182, 42, 139, 0.2)' 
                  : 'rgba(182, 42, 139, 0.1)',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 20px 60px rgba(0, 0, 0, 0.3)'
                  : '0 20px 60px rgba(182, 42, 139, 0.1)',
                mb: 4,
                overflow: 'hidden',
                position: 'relative',
                transition: 'all 0.15s ease',
                '&:hover': {
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 24px 70px rgba(0, 0, 0, 0.4)'
                    : '0 24px 70px rgba(182, 42, 139, 0.15)',
                  transform: 'translateY(-2px)'
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #b62a8b 0%, #d63384 100%)'
                }
              }}
            >
              <CardContent sx={{ p: 5 }}>
                <Box textAlign="center" mb={4}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 600,
                      color: '#b62a8b',
                      mb: 1.5,
                      letterSpacing: '-0.2px'
                    }}
                  >
                    <Info sx={{ fontSize: 40, mr: 2, verticalAlign: 'middle', color: '#b62a8b' }} />
                    {t("vistaEncuestas.informacion_encuesta")}
                  </Typography>
                  <Box sx={{
                    width: '80px',
                    height: '4px',
                    background: '#b62a8b',
                    borderRadius: '2px',
                    margin: '0 auto'
                  }} />
                </Box>
                
                <Grid container spacing={4} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          mb: 1.5,
                          lineHeight: 1.35
                        }}
                      >
                        {surveyData.data?.title || 'Título de la encuesta'}
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{
                          color: theme.palette.text.secondary,
                          lineHeight: 1.6,
                          fontSize: '1.1rem'
                        }}
                      >
                        {surveyData.data?.description || 'Descripción de la encuesta'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Stack spacing={3} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
                      <Box>
                        <Typography 
                          variant="body2" 
                          sx={{
                            fontSize: '0.9rem',
                            color: theme.palette.text.secondary,
                            mb: 1,
                            fontWeight: 600
                          }}
                        >
                          <Schedule sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                          Período de encuesta
                        </Typography>
                        <Typography 
                          variant="subtitle1" 
                          sx={{
                            fontWeight: 600,
                            color: '#b62a8b'
                          }}
                        >
                          {surveyData.data?.start_date || "Sin fecha"} - {surveyData.data?.end_date || "Sin fecha"}
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography 
                          variant="body2" 
                          sx={{
                            fontSize: '0.9rem',
                            color: theme.palette.text.secondary,
                            mb: 1,
                            fontWeight: 600
                          }}
                        >
                          <Analytics sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                          Cantidad de veces respondida
                        </Typography>
                        <Typography 
                          variant="h6" 
                          sx={{
                            fontWeight: 700,
                            color: '#d63384'
                          }}
                        >
                          {surveyData.data?.responseCount ?? 0}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Slide>

          {/* Sección de Preguntas */}
          <Fade in={true} timeout={400}>
            <Card 
              sx={{
                borderRadius: '24px',
                background: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid',
                borderColor: theme.palette.mode === 'dark' 
                  ? 'rgba(182, 42, 139, 0.2)' 
                  : 'rgba(182, 42, 139, 0.1)',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 20px 60px rgba(0, 0, 0, 0.3)'
                  : '0 20px 60px rgba(182, 42, 139, 0.1)',
                overflow: 'hidden',
                position: 'relative',
                transition: 'all 0.15s ease',
                '&:hover': {
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 24px 70px rgba(0, 0, 0, 0.4)'
                    : '0 24px 70px rgba(182, 42, 139, 0.15)',
                  transform: 'translateY(-2px)'
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #b62a8b 0%, #d63384 100%)'
                }
              }}
            >
              <CardContent sx={{ p: 5 }}>
                {/* Header de la sección */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                  <Box>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 600,
                        color: '#b62a8b',
                        mb: 1.5,
                        letterSpacing: '-0.2px'
                      }}
                    >
                      <QuestionAnswer sx={{ fontSize: 40, mr: 2, verticalAlign: 'middle', color: '#b62a8b' }} />
                      {t("vistaEncuestas.preguntas_encuesta")}
                      {isAgent && (
                        <Chip
                          label="Solo Visualización"
                          size="small"
                          sx={{
                            ml: 2,
                            background: 'rgba(108, 117, 125, 0.1)',
                            color: '#6c757d',
                            border: '1px solid rgba(108, 117, 125, 0.3)',
                            fontWeight: 600,
                            borderRadius: '20px'
                          }}
                        />
                      )}
                    </Typography>
                    <Box sx={{
                      width: '80px',
                      height: '4px',
                      background: '#b62a8b',
                      borderRadius: '2px'
                    }} />
                  </Box>
                  
                  {!isAgent && (
                    <Zoom in={true} timeout={300}>
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<Add />}
                        onClick={() => openModal(1, id)}
                        sx={{
                          borderRadius: '20px',
                          textTransform: 'none',
                          fontWeight: 700,
                          fontSize: '1.1rem',
                          px: 4,
                          py: 2,
                          background: 'linear-gradient(90deg, #b62a8b 0%, #d63384 100%)',
                          boxShadow: '0 8px 25px rgba(182, 42, 139, 0.4)',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            background: 'linear-gradient(90deg, #a02478 0%, #c42d76 100%)',
                            boxShadow: '0 12px 35px rgba(182, 42, 139, 0.6)',
                            transform: 'translateY(-2px) scale(1.02)'
                          }
                        }}
                      >
                        {t("vistaEncuestas.agregar_pregunta")}
                      </Button>
                    </Zoom>
                  )}
                </Box>
        
                {/* Contenido de preguntas */}
                <Box sx={{ mt: 4 }}>
                  {loadingQuestions ? (
                    <Box textAlign="center" py={8}>
                      <CircularProgress size={60} sx={{ mb: 3, color: '#b62a8b' }} />
                      <Typography variant="h6" color="text.secondary">
                        Cargando preguntas...
                      </Typography>
                    </Box>
                  ) : data.length === 0 ? (
                    <Fade in={true} timeout={300}>
                      <Box 
                        sx={{
                          textAlign: 'center',
                          py: 8,
                          color: theme.palette.text.secondary,
                          background: theme.palette.mode === 'dark' 
                            ? 'rgba(182, 42, 139, 0.05)' 
                            : 'rgba(182, 42, 139, 0.02)',
                          borderRadius: '16px',
                          border: '2px dashed',
                          borderColor: 'rgba(182, 42, 139, 0.3)'
                        }}
                      >
                        <QuestionAnswer sx={{ fontSize: 80, mb: 3, opacity: 0.3, color: '#b62a8b' }} />
                        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
                          No hay preguntas aún
                        </Typography>
                        <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                          Comienza agregando tu primera pregunta a la encuesta
                        </Typography>
                      </Box>
                    </Fade>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {data.map((question, index) => (
                        <Fade 
                          in={showCards} 
                          timeout={200 + (index * 50)}
                          key={question.id}
                        >
                          <Paper
                            elevation={0}
                            sx={{ 
                              borderRadius: '20px',
                              background: theme.palette.mode === 'dark' 
                                ? 'rgba(255, 255, 255, 0.05)' 
                                : 'rgba(255, 255, 255, 0.9)',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid',
                              borderColor: theme.palette.mode === 'dark' 
                                ? 'rgba(182, 42, 139, 0.2)' 
                                : 'rgba(182, 42, 139, 0.1)',
                              transition: 'all 0.15s ease',
                              '&:hover': {
                                boxShadow: theme.palette.mode === 'dark'
                                  ? '0 16px 48px rgba(0, 0, 0, 0.4)'
                                  : '0 16px 48px rgba(182, 42, 139, 0.15)',
                                transform: 'translateY(-4px)',
                                borderColor: 'rgba(182, 42, 139, 0.4)'
                              },
                              overflow: 'hidden',
                              position: 'relative'
                            }}
                          >
                            <CardContent sx={{ p: 4 }}>
                              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
                                <Box sx={{ flex: 1, mr: 2 }}>
                                  <Box display="flex" alignItems="center" mb={2}>
                                    <Chip
                                      label={`Pregunta ${index + 1}`}
                                      sx={{
                                        mr: 2,
                                        background: 'rgba(182, 42, 139, 0.1)',
                                        color: '#b62a8b',
                                        border: 'none',
                                        fontWeight: 700,
                                        borderRadius: '20px'
                                      }}
                                    />
                                    {question.conditional === "SI" && (
                                      <Chip
                                        icon={<Help sx={{ fontSize: 14 }} />}
                                        label="Condicional"
                                        size="small"
                                        sx={{
                                          background: 'rgba(255, 193, 7, 0.1)',
                                          color: '#f57c00',
                                          border: 'none',
                                          fontWeight: 600,
                                          borderRadius: '20px'
                                        }}
                                      />
                                    )}
                                  </Box>
                                  <Typography 
                                    variant="h6" 
                                    sx={{ 
                                      fontWeight: 600,
                                      color: theme.palette.text.primary,
                                      lineHeight: 1.4,
                                      mb: 2
                                    }}
                                  >
                                    {question.question}
                                  </Typography>
                                </Box>
                                {!isAgent && (
                                  <IconButton
                                    onClick={(e) => handleMenuClick(e, question)}
                                    sx={{
                                      background: 'rgba(182, 42, 139, 0.1)',
                                      color: '#b62a8b',
                                      borderRadius: '12px',
                                      transition: 'all 0.1s ease',
                                      '&:hover': { 
                                        background: 'rgba(182, 42, 139, 0.2)',
                                        transform: 'scale(1.05)'
                                      }
                                    }}
                                  >
                                    <MoreVert />
                                  </IconButton>
                                )}
                              </Box>
                              
                              <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                PaperProps={{
                                  sx: {
                                    borderRadius: '16px',
                                    boxShadow: '0 16px 48px rgba(0, 0, 0, 0.15)',
                                    border: '1px solid rgba(182, 42, 139, 0.1)',
                                    mt: 1,
                                    overflow: 'hidden'
                                  }
                                }}
                              >
                                <MenuItemComponent 
                                  sx={{ 
                                    display: 'flex', 
                                    gap: 1.5,
                                    py: 1.5,
                                    px: 3,
                                    color: '#2d3748',
                                    fontWeight: 600,
                                    transition: 'all 0.1s ease',
                                    '&:hover': { 
                                      background: 'rgba(182, 42, 139, 0.05)',
                                      color: '#b62a8b'
                                    }
                                  }}  
                                  onClick={handleEditClick}
                                >
                                  <Edit sx={{ fontSize: 18 }} />
                                  {t("survey.editar")}
                                </MenuItemComponent>
                                <MenuItemComponent
                                  sx={{ 
                                    display: 'flex', 
                                    gap: 1.5,
                                    py: 1.5,
                                    px: 3,
                                    color: '#e53e3e',
                                    fontWeight: 600,
                                    transition: 'all 0.1s ease',
                                    '&:hover': { 
                                      background: 'rgba(229, 62, 62, 0.05)'
                                    }
                                  }}  
                                  onClick={handleDeleteClick}
                                >
                                  <Delete sx={{ fontSize: 18 }} />
                                  {t("vistaEncuestas.eliminar")}
                                </MenuItemComponent>
                              </Menu>

                              {/* Contenido de la pregunta */}
                              <Box sx={{ 
                                background: theme.palette.mode === 'dark' 
                                  ? 'rgba(255, 255, 255, 0.03)' 
                                  : 'rgba(182, 42, 139, 0.02)',
                                borderRadius: '16px',
                                border: '1px solid',
                                borderColor: theme.palette.mode === 'dark' 
                                  ? 'rgba(182, 42, 139, 0.2)' 
                                  : 'rgba(182, 42, 139, 0.1)',
                                p: 3,
                                mt: 2
                              }}>
                                {question.type == "range_onetofive" ? (
                                  <Range_onetofive />
                                ) : question.type == "range_zerototen" ? (
                                  <Range_zerototen />
                                ) : question.type == "range_difficulty" ? (
                                  <Range_difficulty />
                                ) : question.type == "yes_no" ? (
                                  <Yes_no />
                                ) : question.type == "range_emoji" ? (
                                  <Range_emoji />
                                ) : question.type == "textfield_s" ? (
                                  <Textfield_s />
                                ) : question.type == "radio_opt" ? (
                                  <SingleChoiceView
                                    options={question.select_option}
                                    correctOption={question.selected_answer}
                                  />
                                ) : (
                                  <MultipleChoiceView
                                    options={question.select_option}
                                    correctOption={question.selected_answer}
                                  />
                                )}
                              </Box>
                            </CardContent>
                          </Paper>
                        </Fade>
                      ))}
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Container>
   
        {/* Modal modernizado */}
        <Dialog
          open={modalOpen}
          onClose={handleCancel}
          maxWidth={operation === 1 ? "md" : "lg"}
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '24px',
              boxShadow: '0 25px 80px rgba(0, 0, 0, 0.15)',
              border: '1px solid rgba(182, 42, 139, 0.1)',
              overflow: 'hidden',
              background: theme.palette.mode === 'dark' 
                ? 'rgba(18, 18, 18, 0.95)' 
                : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)'
            }
          }}
        >
          <Box sx={{ 
            background: 'linear-gradient(135deg, #b62a8b 0%, #d63384 100%)',
            color: 'white',
            position: 'relative'
          }}>
            <DialogTitle sx={{ 
              fontSize: '1.6rem',
              fontWeight: 700,
              py: 4,
              px: 5,
              textAlign: 'center'
            }}>
              {title}
            </DialogTitle>
          </Box>
          <DialogContent sx={{ 
            p: 5, 
            background: theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.02)' 
              : 'rgba(248, 249, 250, 0.5)' 
          }}>
            <Grid container spacing={4}>
              <Grid item xs={operation === 1 ? 12 : 6}>
                <Typography variant="body1" sx={{ 
                  mb: 4,
                  color: theme.palette.text.secondary,
                  fontSize: '1.1rem',
                  lineHeight: 1.6
                }}>
                  {descriptionText}
                </Typography>
                 
                <TextField
                  fullWidth
                  label={t("vistaEncuestas.pregunta")}
                  variant="outlined"
                  value={description.input}
                  onChange={(e) => description.handleChange(e.target.value)}
                  required
                  sx={{ 
                    mb: 4,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '16px',
                      background: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : '#ffffff',
                      '&:hover fieldset': {
                        borderColor: '#b62a8b',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#b62a8b',
                        borderWidth: '2px'
                      }
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#b62a8b',
                    }
                  }}
                />

                <FormControl 
                  fullWidth 
                  sx={{ 
                    mb: 4,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '16px',
                      background: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : '#ffffff',
                      '&:hover fieldset': {
                        borderColor: '#b62a8b',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#b62a8b',
                        borderWidth: '2px'
                      }
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#b62a8b',
                    }
                  }}
                >
                  <InputLabel>{t("vistaEncuestas.tipo_pregunta")}</InputLabel>
                  <Select
                    value={questionType.input}
                    onChange={(e) => questionType.handleChange(e.target.value)}
                    label={t("vistaEncuestas.tipo_pregunta")}
                  >
                    <MenuItem value="" disabled>
                      {t("vistaEncuestas.seleccione_pregunta")}
                    </MenuItem>
                    <MenuItem value="yes_no">{t("vistaEncuestas.si_no")}</MenuItem>
                    <MenuItem value="range_emoji">{t("vistaEncuestas.rango_emoji")}</MenuItem>
                    <MenuItem value="range_onetofive">{t("vistaEncuestas.rango_1_5")}</MenuItem>
                    <MenuItem value="range_zerototen">{t("vistaEncuestas.rango_0_10")}</MenuItem>
                    <MenuItem value="range_difficulty">{t("vistaEncuestas.rango_dificultad")}</MenuItem>
                    <MenuItem value="textfield_s">{t("vistaEncuestas.campo_texto")}</MenuItem>
                    <MenuItem value="radio_opt">{t("vistaEncuestas.seleccion_unica")}</MenuItem>
                    <MenuItem value="check_opt">{t("vistaEncuestas.seleccion_multiple")}</MenuItem>
                  </Select>
                </FormControl>

                {questionType.input==="radio_opt" && operation==1? (
                  <SingleChoiceQuestion   
                    options={singleChoiceData.options}  
                    correctAnswer={singleChoiceData.correctAnswer}  
                    onChange={handleSingleChoiceChange}
                  />
                ) : (questionType.input=="check_opt" && operation==1? (
                  <MultipleChoiceQuestion   
                    options={multipleChoiceData.options}  
                    correctAnswers={multipleChoiceData.correctAnswers}  
                    onChange={handleMultipleChoiceChange}
                  />
                ) : (questionType.input=="check_opt" && operation==2? (
                  <MultipleChoiceQuestionEdit 
                    idToEdit={idToEdit} 
                    options={multipleChoiceData.options} 
                    correctAnswers={multipleChoiceData.correctAnswers} 
                    onChange={handleMultipleChoiceChange}
                  />
                ) : (questionType.input=="radio_opt" && operation==2? (
                  <SingleChoiceQuestionEdit 
                    options={singleChoiceData.options} 
                    correctAnswer={singleChoiceData.correctAnswer} 
                    idToEdit={idToEdit} 
                    onChange={handleSingleChoiceChange}
                  />
                ) : "")))}
                  
                {operation===1 && (
                  <Box sx={{ mt: 3, mb: 2 }}>
                    {questionType.input=='range_onetofive'? (
                      <Range_onetofive/>
                    ) : (questionType.input=="range_zerototen"? (
                      <Range_zerototen/>
                    ) : (questionType.input=="range_difficulty"? (
                      <Range_difficulty/>
                    ) : (questionType.input=="yes_no"? (
                      <Yes_no/>
                    ) : (questionType.input=="range_emoji"? (
                      <Range_emoji/>
                    ) : (questionType.input=="textfield_s"?
                      <Textfield_s/>
                    : "")))))}
                  </Box>
                )}
              </Grid>
                
              {questionType.input && operation===2 && (
                <Grid item xs={6}>
                  <Paper sx={{ 
                    p: 4, 
                    borderRadius: '20px',
                    background: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid',
                    borderColor: theme.palette.mode === 'dark' 
                      ? 'rgba(182, 42, 139, 0.2)' 
                      : 'rgba(182, 42, 139, 0.1)',
                    borderLeft: '5px solid #b62a8b'
                  }}>
                    {operation===2 && data.length>=1 && (
                      <FormControlLabel
                        control={
                          <Switch 
                            checked={isChecked} 
                            onChange={(e) => conditionalHandleChange(e.target.checked)}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#b62a8b',
                              },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#b62a8b',
                              },
                            }}
                          />
                        }
                        label={t("vistaEncuestas.pregunta_condicional")}
                        sx={{ 
                          mb: 3,
                          '& .MuiFormControlLabel-label': {
                            fontWeight: 600,
                            color: theme.palette.text.primary
                          }
                        }}
                      />
                    )}
                    
                    {listConditional && valueConditional && (
                      <>
                        <Typography variant="body2" sx={{ mb: 3, fontWeight: 600 }}>
                          {t("vistaEncuestas.respuesta_pregunta_condicional")}
                        </Typography>

                        <FormControl 
                          fullWidth 
                          sx={{ 
                            mb: 4,
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px'
                            }
                          }}
                        >
                          <InputLabel>{t("vistaEncuestas.pregunta")}</InputLabel>
                          <Select
                            placeholder=" "
                            value={id_conditional.input}
                            onChange={handleSelectConditionalQuestionChange}
                            label="Pregunta"
                          >
                            <MenuItem value="0">
                              {t("vistaEncuestas.seleccionar")}
                            </MenuItem>
                            {data.map((question) =>
                              question.type == "textfield_s" ||
                              question.id === idToEdit ? null : (
                                <MenuItem
                                  key={question.id}
                                  value={question.id}
                                >
                                  {question.question.length > 55
                                    ? question.question.substring(0, 55) + "..."
                                    : question.question}
                                </MenuItem>
                              )
                            )}
                          </Select>
                        </FormControl>
                        
                        {id_conditional.input && (
                          <Box sx={{ mt: 3 }}>
                            <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
                              {t("vistaEncuestas.es")}
                            </Typography>
                            <FormControl 
                              fullWidth
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '12px'
                                }
                              }}
                            >
                              <InputLabel>{t("vistaEncuestas.respuesta")}</InputLabel>
                              <Select
                                value={conditional_answer.input}
                                onChange={(e) => conditional_answer.handleChange(e.target.value)}
                                label={t("vistaEncuestas.respuesta")}
                              >
                                <MenuItem value="0">
                                  {t("vistaEncuestas.seleccionar_opcion")}
                                </MenuItem>
                                {rangeOptions.map((option, index) => (
                                  <MenuItem key={index} value={option.value}>
                                    {option.optionText}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Box>
                        )}
                      </>
                    )}
                  </Paper>
                </Grid>
              )}
              
              {error && (
                <Grid item xs={12}>
                  <Alert 
                    severity="error"
                    sx={{
                      borderRadius: '12px',
                      border: '1px solid rgba(244, 67, 54, 0.2)'
                    }}
                  >
                    {error}
                  </Alert>
                </Grid>
              )}
              
              {operation === 2 && (
                <Grid item xs={12}>
                  <Box sx={{ mt: 3, mb: 2 }}>
                    {questionType.input == "range_onetofive" ? (
                      <Range_onetofive />
                    ) : questionType.input == "range_zerototen" ? (
                      <Range_zerototen />
                    ) : questionType.input == "range_difficulty" ? (
                      <Range_difficulty />
                    ) : questionType.input == "yes_no" ? (
                      <Yes_no />
                    ) : questionType.input == "range_emoji" ? (
                      <Range_emoji />
                    ) : questionType.input == "textfield_s" ? (
                      <Textfield_s />
                    ) : ""}
                  </Box>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          
          <DialogActions sx={{ 
            p: 5, 
            background: theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.02)' 
              : '#ffffff',
            borderTop: '1px solid rgba(182, 42, 139, 0.1)',
            gap: 3
          }}>
            <Button
              variant="outlined"
              onClick={handleCancel}
              size="large"
              sx={{            
                borderRadius: '16px',
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                color: '#6c757d',
                borderColor: '#dee2e6',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#b62a8b',
                  background: 'rgba(182, 42, 139, 0.05)',
                  color: '#b62a8b',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              {t("buttons.cancelar")}
            </Button>
            {questionType.input && (
              <Button
                variant="contained"
                onClick={() => validar(idToEdit, id)}
                size="large"
                sx={{
                  borderRadius: '16px',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '1rem',
                  px: 5,
                  py: 1.5,
                  background: 'linear-gradient(90deg, #b62a8b 0%, #d63384 100%)',
                  boxShadow: '0 8px 25px rgba(182, 42, 139, 0.4)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #a02478 0%, #c42d76 100%)',
                    boxShadow: '0 12px 35px rgba(182, 42, 139, 0.6)',
                    transform: 'translateY(-2px) scale(1.02)'
                  }
                }}
              >              
                {t("buttons.guardar")}
              </Button>
            )}
          </DialogActions>
            
          </Dialog>
      </Box>
    </Box>
  );
}