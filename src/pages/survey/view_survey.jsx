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
  Divider
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
import { useTranslations } from "../../components/hooks/useTranslations";

export default function View_survey() {
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

  const { t } = useTranslations();
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
    getSurvey(id, config, setSurveyData);
    updateSurveyQuestions();
  }, [id]);


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
    <Box style={{ overflow: "hidden" }}>      
        <HeaderLT1/>
        <Box component = "section" 
          sx={{alignItems: "stretch", 
            flexWrap: "nowrap", 
            padding: 0, 
            height: "85vh", 
            overflowY: "auto" 
          }}>
        {/* <SidebarLT1/> */}
        <Container sx={{mt:0, maxWidth: "93.5% !important"}}>
          <Grid container >            
            <Grid item xs={12} md={12} >
              <Button 
                variant="outlined"
                size="small"
                sx={{  
                  minWidth: 0,       
                  width: 30,
                  height: 30,
                  padding: 0,
                  marginBottom: 1,
                  borderRadius: '50%',        
                  color: '#b62a8b',
                  borderColor: '#b62a8b',    
                  '&:hover': {
                    borderColor: '#b62a8b',
                    backgroundColor: '#b62a8b',
                    color: 'white'
                  }
                }}
                onClick={() => nav("/survey_list")} 
              >
                <TurnLeft /> 
              </Button>
              <Card className="borderEVA" sx={{padding: "1.25rem", backgroundColor: '#f8f9fa'}}>             
                <Box textAlign="center">
                  <Typography variant="h5" sx={{ fontWeight: "bold"}}>
                    {t("vistaEncuestas.informacion_encuesta")}
                  </Typography>
                </Box>
                <CardContent sx={{ p: 0, py: 2 }}>
                   <Grid container alignItems="center">
                    <Grid item xs={6}>
                      {console.log("-----surveyData aca ------", surveyData)}
                      <Typography variant="h6" sx={{ fontWeight: "bold"}}>{surveyData.data?.title}</Typography>
                      <Typography variant="body2" >{surveyData.data?.description}</Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                      {console.log("-----surveyData aca", surveyData)}
                      <Typography variant="body2" sx={{fontSize: 16}}>
                        {surveyData.data?.start_date || "Sin fecha"} / 
                        {surveyData.data?.end_date || "Sin fecha"}
                      </Typography>
                      <Typography variant="body2" sx={{fontSize: 16}}>
                        {t("vistaEncuestas.cantidad_preguntas")}: {surveyData.sampleCount || 0}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sx={{ mt: 3 }}>
              <Card className ="borderEVA" sx={{padding: "1.25rem", backgroundColor: '#f8f9fa'}}>
                <Box display="flex" flexDirection="column"   mb={2}>
                  <Box  sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: "bold"}}>
                      {t("vistaEncuestas.preguntas_encuesta")}
                    </Typography>
                  </Box>
                  <Box>
                    <Button                      
                      startIcon={<Add />}
                      onClick={() => openModal(1, id)}
                      variant="h5"
                      size="small"
                      sx={{
                        height: 30, 
                        width: 175,
                        fontSize: 12,
                        whiteSpace: 'nowrap',
                        fontWeight: "bold",
                        borderRadius: '18px',
                        border: '1px solid #b62a8b',
                        color: 'black',
                        borderColor: '#b62a8b',    
                        '&:hover': {
                          borderColor: '#b62a8b',
                          backgroundColor: '#b62a8b',
                          color: 'white'
                        }
                      }}
                    > {t("vistaEncuestas.agregar_pregunta")}</Button>
                  </Box>
                </Box>
            
                  <CardContent>
                    {data.map((question) => (
                      <Paper
                      className="shadowbox5"
                      key={question.id}
                      elevation={3}
                      sx={{ p: 3, m: 2, backgroundColor: '#f8f9fa' }}
                      >
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" sx={{ mt: 1, fontWeight: "bold" }}>
                          {question.question}
                        </Typography>
                        <IconButton
                          onClick={(e) => handleMenuClick(e, question)}
                        >
                          <MoreVert  
                            sx={{ 
                              color:' #b62a8b',
                              '&:hover': { backgroundColor: '#e9ecef' }
                            }} />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleMenuClose}
                          PaperProps={{
                            elevation: 0, // <- elimina la sombra
                            sx: {
                              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1) !important' // sombra más sutil
                            }
                          }}
                        >
                          <MenuItemComponent sx={{ 
                              display: 'flex', 
                              gap: 1,
                              color:' #b62a8b',
                              '&:hover': { backgroundColor: '#f8f9fa' }
                              }}  
                            onClick={handleEditClick}>
                            <Edit sx={{ fontSize: 18 }} />
                            {t("survey.editar")}
                          </MenuItemComponent>
                          <MenuItemComponent
                            sx={{ 
                                display: 'flex', 
                                gap: 1,
                                color:' #b62a8b',
                                '&:hover': { backgroundColor: '#f8f9fa' }
                                }}  
                            onClick={handleDeleteClick}>
                            <Delete sx={{ fontSize: 18 }} />
                            {t("vistaEncuestas.eliminar")}
                          </MenuItemComponent>
                        </Menu>
                      </Box>

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

                      <Box textAlign="right" sx={{ mt: 2 }}>
                        {question.conditional === "SI" && (
                          <Box display="flex" alignItems="center" justifyContent="flex-end">
                            <Help color="primary" sx={{ mr: 1 }} />
                            <Typography variant="body2">
                              {t("vistaEncuestas.pregunta_condicionals")}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Paper>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>
      
   
      <Dialog
        open={modalOpen}
        onClose={handleCancel}
        maxWidth={operation === 1 ? "md" : "md"}
        fullWidth
      >
        <Box sx={{ borderBottom: '1px solid #e0e0e0'}}>
          <DialogTitle>{title}</DialogTitle>
        </Box>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={operation === 1 ? 12 : 6}>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                {descriptionText}
              </Typography>
               
              <TextField
                className="readOnlyField"
                fullWidth
                label={t("vistaEncuestas.pregunta")}
                variant="outlined"
                value={description.input}
                onChange={(e) => description.handleChange(e.target.value)}
                sx={{ mb: 3 }}
                required
              />

              <FormControl className="readOnlyField" fullWidth sx={{ mb: 3 }}>
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
                <Paper sx={{ p: 2, borderLeft: '5px solid gray' }}>
                  {operation===2 && data.length>=1 && (
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={isChecked} 
                          onChange={(e) => conditionalHandleChange(e.target.checked)}
                        />
                      }
                      label={t("vistaEncuestas.pregunta_condicional")}
                      sx={{ mb: 2 }}
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
        
        <DialogActions>
          {questionType.input && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => validar(idToEdit, id)}
              sx={{
                  backgroundColor: '#b62a8b',
                  '&:hover': {
                    backgroundColor: '#581244',
                  }
                }}
            >              
              {t("buttons.guardar")}
            </Button>
          )}
          <Button
            variant="outlined"
            onClick={handleCancel}
            sx={{            
                  color: '#b62a8b',       // Texto morado
                  borderColor: '#b62a8b',  // Borde morado
                  '&:hover': {
                    borderColor: '#b62a8b', // Borde morado oscuro al hover
                    backgroundColor: 'rgba(156, 39, 176, 0.04)' // Fondo muy transparente al hover
                  }
                }}
          >
            {t("buttons.cancelar")}
          </Button>
        </DialogActions>
          
        </Dialog>
      
    </Box>
  );
}
