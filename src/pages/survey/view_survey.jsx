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
import { useTranslation } from "react-i18next";
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
  useTheme
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
  Update
} from '@mui/icons-material';

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

  const { t, i18n } = useTranslation();
  const { accessToken, languageUser } = useContext(UserContext);

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
    i18n.changeLanguage(languageUser);
    getSurvey(id, config, setSurveyData);
    updateSurveyQuestions();
  }, [id, languageUser]);


useEffect(() => {
  const fetchData = async () => {
    const questions = await getSurveyQuestions(id, config);
    //setSurveyData({ sampleCount: questions.length });
    setSurveyData(prevData => ({
       ...prevData,
       sampleCount: Array.isArray(questions) ? questions.length : 0
     }));
  };

  fetchData();
}, []);

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
    openModal(2, id, selectedQuestion);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    deleteQuestion(selectedQuestion, config, updateSurveyQuestions, t);
    handleMenuClose();
  };


  const validar = (id, survey_idt) => {
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
          // Actualizar preguntas después de la llamada a sendData
          //updateSurveyQuestions();
          //document.getElementById("btnClose").click();
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
        <Box component="section" 
          sx={{
            alignItems: "stretch", 
            flexWrap: "nowrap", 
            padding: 0, 
            height: "85vh", 
            overflowY: "auto"
          }}
          >
        {/* <SidebarLT1/> */}
        <Container sx={{mt: 2, maxWidth: "95% !important", px: 3}}>
          <Grid container spacing={3}>            
            <Grid item xs={12}>
              {/* Botón de retorno moderno */}
              <Button 
                variant="outlined"
                size="medium"
                startIcon={<ArrowBack />}
                sx={{  
                  mb: 3,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  fontSize: '0.95rem',        
                  color: '#b62a8b',
                  borderColor: '#b62a8b',
                  boxShadow: '0 2px 8px rgba(182, 42, 139, 0.15)',
                  transition: 'all 0.1s ease',    
                  '&:hover': {
                    borderColor: '#b62a8b',
                    backgroundColor: '#b62a8b',
                    color: 'white',
                    boxShadow: '0 4px 16px rgba(182, 42, 139, 0.25)',
                    transform: 'translateY(-1px)'
                  }
                }}
                onClick={() => nav("/survey_list")} 
              >
              </Button>

              {/* Tarjeta de información modernizada */}
              <Card sx={{
                borderRadius: '20px',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                  : '0 8px 32px rgba(0, 0, 0, 0.08)',
                border: '1px solid',
                borderColor: theme.palette.mode === 'dark' 
                  ? 'rgba(182, 42, 139, 0.2)' 
                  : 'rgba(182, 42, 139, 0.1)',
                background: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                overflow: 'hidden',
                position: 'relative',
                transition: 'all 0.15s ease',
                '&:hover': {
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 12px 40px rgba(0, 0, 0, 0.4)'
                    : '0 12px 40px rgba(0, 0, 0, 0.12)',
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
              }}>             
                <CardContent sx={{ p: 4 }}>
                  <Box textAlign="center" mb={3}>
                    <Typography variant="h4" sx={{ 
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      mb: 1,
                      letterSpacing: '-0.5px'
                    }}>
                      {t("vistaEncuestas.informacion_encuesta")}
                    </Typography>
                    <Box sx={{
                      width: '60px',
                      height: '4px',
                      backgroundColor: '#b62a8b',
                      borderRadius: '2px',
                      margin: '0 auto'
                    }} />
                  </Box>
                  
                  <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={8}>
                      <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                        <Typography variant="h5" sx={{ 
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          mb: 2,
                          lineHeight: 1.3
                        }}>
                          {surveyData.data?.title || 'Título de la encuesta'}
                        </Typography>
                        <Typography variant="body1" sx={{
                          color: theme.palette.text.secondary,
                          lineHeight: 1.6,
                          fontSize: '1.05rem'
                        }}>
                          {surveyData.data?.description || 'Descripción de la encuesta'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ 
                        textAlign: { xs: 'center', md: 'right' },
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3
                      }}>
                        <Box>
                          <Typography variant="body2" sx={{
                            fontSize: '0.9rem',
                            color: theme.palette.text.secondary,
                            mb: 0.5,
                            fontWeight: 500
                          }}>
                            Período de encuesta
                          </Typography>
                          <Typography variant="body1" sx={{
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: theme.palette.text.primary
                          }}>
                            {surveyData.data?.start_date || "Sin fecha"} - {surveyData.data?.end_date || "Sin fecha"}
                          </Typography>
                        </Box>
                        
                        <Box>
                          <Typography variant="body2" sx={{
                            fontSize: '0.9rem',
                            color: theme.palette.text.secondary,
                            mb: 0.5,
                            fontWeight: 500
                          }}>
                            Cantidad de veces respondida
                          </Typography>
                          <Typography variant="h6" sx={{
                            fontWeight: 700,
                            color: '#b62a8b'
                          }}>
                            {surveyData.data?.responseCount ?? 0}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sx={{ mt: 4 }}>
              <Card sx={{
                borderRadius: '20px',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                  : '0 8px 32px rgba(0, 0, 0, 0.08)',
                border: '1px solid',
                borderColor: theme.palette.mode === 'dark' 
                  ? 'rgba(182, 42, 139, 0.2)' 
                  : 'rgba(182, 42, 139, 0.1)',
                background: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                overflow: 'hidden',
                position: 'relative',
                transition: 'all 0.15s ease',
                '&:hover': {
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 12px 40px rgba(0, 0, 0, 0.4)'
                    : '0 12px 40px rgba(0, 0, 0, 0.12)',
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
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Box>
                      <Typography variant="h4" sx={{ 
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                        mb: 1,
                        letterSpacing: '-0.5px'
                      }}>
                        {t("vistaEncuestas.preguntas_encuesta")}
                      </Typography>
                      <Box sx={{
                        width: '60px',
                        height: '4px',
                        backgroundColor: '#b62a8b',
                        borderRadius: '2px'
                      }} />
                    </Box>
                    <Button                      
                      startIcon={<Add />}
                      onClick={() => openModal(1, id)}
                      variant="contained"
                      size="large"
                      sx={{
                        borderRadius: '16px',
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '1rem',
                        px: 4,
                        py: 1.5,
                        backgroundColor: '#b62a8b',
                        boxShadow: '0 4px 16px rgba(182, 42, 139, 0.3)',
                        transition: 'all 0.1s ease',
                        '&:hover': {
                          backgroundColor: '#9c1c6b',
                          boxShadow: '0 6px 24px rgba(182, 42, 139, 0.4)',
                          transform: 'translateY(-1px)'
                        }
                      }}
                    > 
                      {t("vistaEncuestas.agregar_pregunta")}
                    </Button>
                  </Box>
            
                  <Box sx={{ mt: 2 }}>
                    {data.length === 0 ? (
                      <Box sx={{
                        textAlign: 'center',
                        py: 8,
                        color: theme.palette.text.secondary
                      }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                          No hay preguntas aún
                        </Typography>
                        <Typography variant="body2">
                          Comienza agregando tu primera pregunta a la encuesta
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {data.map((question, index) => (
                          <Paper
                            key={question.id}
                            elevation={0}
                            sx={{ 
                              borderRadius: '16px',
                              border: '1px solid',
                              borderColor: theme.palette.mode === 'dark' 
                                ? 'rgba(182, 42, 139, 0.2)' 
                                : 'rgba(0, 0, 0, 0.08)',
                              background: theme.palette.mode === 'dark' 
                                ? 'rgba(255, 255, 255, 0.05)' 
                                : 'rgba(255, 255, 255, 0.9)',
                              backdropFilter: 'blur(10px)',
                              transition: 'all 0.1s ease',
                              '&:hover': {
                                boxShadow: theme.palette.mode === 'dark'
                                  ? '0 8px 24px rgba(0, 0, 0, 0.4)'
                                  : '0 8px 24px rgba(0, 0, 0, 0.12)',
                                transform: 'translateY(-1px)',
                                borderColor: 'rgba(182, 42, 139, 0.2)'
                              }
                            }}
                          >
                            <CardContent sx={{ p: 3 }}>
                              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                <Box sx={{ flex: 1, mr: 2 }}>
                                  <Box display="flex" alignItems="center" mb={1}>
                                    <Typography 
                                      variant="body2" 
                                      sx={{ 
                                        backgroundColor: 'rgba(182, 42, 139, 0.1)',
                                        color: '#b62a8b',
                                        px: 2,
                                        py: 0.5,
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        mr: 2
                                      }}
                                    >
                                      Pregunta {index + 1}
                                    </Typography>
                                    {question.conditional === "SI" && (
                                      <Typography 
                                        variant="body2" 
                                        sx={{ 
                                          backgroundColor: 'rgba(255, 193, 7, 0.1)',
                                          color: '#f57c00',
                                          px: 2,
                                          py: 0.5,
                                          borderRadius: '20px',
                                          fontSize: '0.8rem',
                                          fontWeight: 600,
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 0.5
                                        }}
                                      >
                                        <Help sx={{ fontSize: 14 }} />
                                        Condicional
                                      </Typography>
                                    )}
                                  </Box>
                                  <Typography variant="h6" sx={{ 
                                    fontWeight: 600,
                                    color: theme.palette.text.primary,
                                    lineHeight: 1.4,
                                    mb: 2
                                  }}>
                                    {question.question}
                                  </Typography>
                                </Box>
                                <IconButton
                                  onClick={(e) => handleMenuClick(e, question)}
                                  sx={{
                                    backgroundColor: 'rgba(182, 42, 139, 0.05)',
                                    borderRadius: '12px',
                                    transition: 'all 0.1s ease',
                                    '&:hover': { 
                                      backgroundColor: 'rgba(182, 42, 139, 0.1)',
                                      transform: 'scale(1.02)'
                                    }
                                  }}
                                >
                                  <MoreVert sx={{ color: '#b62a8b' }} />
                                </IconButton>
                              </Box>
                              
                              <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                PaperProps={{
                                  sx: {
                                    borderRadius: '12px',
                                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                                    border: '1px solid rgba(0, 0, 0, 0.08)',
                                    mt: 1
                                  }
                                }}
                              >
                                <MenuItemComponent 
                                  sx={{ 
                                    display: 'flex', 
                                    gap: 1.5,
                                    py: 1.5,
                                    px: 2,
                                    color: '#2d3748',
                                    fontWeight: 500,
                                    '&:hover': { 
                                      backgroundColor: 'rgba(182, 42, 139, 0.05)',
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
                                    px: 2,
                                    color: '#e53e3e',
                                    fontWeight: 500,
                                    '&:hover': { 
                                      backgroundColor: 'rgba(229, 62, 62, 0.05)'
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
                                backgroundColor: theme.palette.mode === 'dark' 
                                  ? 'rgba(255, 255, 255, 0.03)' 
                                  : 'rgba(248, 249, 250, 0.7)',
                                borderRadius: '12px',
                                p: 2,
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
                        ))}
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
   
      {/* Modal modernizado */}
      <Dialog
        open={modalOpen}
        onClose={handleCancel}
        maxWidth={operation === 1 ? "md" : "lg"}
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(182, 42, 139, 0.1)',
            overflow: 'hidden'
          }
        }}
      >
        <Box sx={{ 
          background: 'linear-gradient(135deg, #b62a8b 0%, #d63384 100%)',
          color: 'white',
          position: 'relative'
        }}>
          <DialogTitle sx={{ 
            fontSize: '1.5rem',
            fontWeight: 700,
            py: 3,
            px: 4
          }}>
            {title}
          </DialogTitle>
        </Box>
        <DialogContent sx={{ 
          p: 4, 
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.05)' 
            : '#fafbfc' 
        }}>
          <Grid container spacing={4}>
            <Grid item xs={operation === 1 ? 12 : 6}>
              <Typography variant="body1" sx={{ 
                mb: 3,
                color: theme.palette.text.secondary,
                fontSize: '1.05rem',
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
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : '#ffffff',
                    '&:hover fieldset': {
                      borderColor: '#b62a8b',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#b62a8b',
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
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : '#ffffff',
                    '&:hover fieldset': {
                      borderColor: '#b62a8b',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#b62a8b',
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
                <Box sx={{ mt: 2, mb: 2 }}>
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
                  p: 3, 
                  borderRadius: '16px',
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
                        mb: 2,
                        '& .MuiFormControlLabel-label': {
                          fontWeight: 600,
                          color: theme.palette.text.primary
                        }
                      }}
                    />
                  )}
                  
                  {listConditional && valueConditional && (
                    <>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {t("vistaEncuestas.respuesta_pregunta_condicional")}
                      </Typography>

                      <FormControl className="readOnlyField" fullWidth sx={{ mb: 3 }}>
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
                                // data-type={question.type}
                                // data-answers={question.select_option}
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
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2" sx={{ mb: 2 }}>
                            {t("vistaEncuestas.es")}
                          </Typography>
                          <FormControl className="readOnlyField" fullWidth>
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
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}
            
            {operation === 2 && (
              <Grid item xs={12}>
                <Box sx={{ mt: 2, mb: 2 }}>
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
          p: 4, 
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.05)' 
            : '#ffffff',
          borderTop: '1px solid rgba(0, 0, 0, 0.08)',
          gap: 2
        }}>
          <Button
            variant="outlined"
            onClick={handleCancel}
            size="large"
            sx={{            
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1.5,
              color: '#6c757d',
              borderColor: '#dee2e6',
              transition: 'all 0.1s ease',
              '&:hover': {
                borderColor: '#b62a8b',
                backgroundColor: 'rgba(182, 42, 139, 0.05)',
                color: '#b62a8b'
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
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                px: 4,
                py: 1.5,
                backgroundColor: '#b62a8b',
                boxShadow: '0 4px 16px rgba(182, 42, 139, 0.3)',
                transition: 'all 0.1s ease',
                '&:hover': {
                  backgroundColor: '#9c1c6b',
                  boxShadow: '0 6px 24px rgba(182, 42, 139, 0.4)',
                  transform: 'translateY(-1px)'
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
