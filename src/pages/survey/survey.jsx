import { styled } from '@mui/material/styles';
import React, { useState, useEffect,useContext } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import '../../assets/css/encuesta.css';
import { Range_zerototen_survey, Range_onetofive_survey, Yes_no_survey, Range_difficulty_survey, Range_emoji_survey, Single_choice_survey, Multiple_choice_survey } from './questionsSurvey';
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import LanguageSelector from '../../components/idiomaSurvey/LanguageSelector';
import { smallAlertDelete, Toast, Toast2 } from "../../assets/js/alertConfig";

import Tooltip from '@mui/material/Tooltip';
import { ThemeContext } from '../../assets/js/ThemeContext';
import Switch from "@mui/material/Switch";
import FormControlLabel from '@mui/material/FormControlLabel';

import { 
    Container, 
    Paper, 
    Typography, 
    Box, 
    Button, 
    Grid
} from '@mui/material';
import zIndex from '@mui/material/styles/zIndex';



export default function Survey() {
  const { theme, toggleTheme } = useContext(ThemeContext) || { theme: 'light', toggleTheme: () => {} };
  const MaterialUISwitch = styled(Switch)(({ theme }) => ({
      width: 62,
      height: 34,
      padding: 7,
      "& .MuiSwitch-switchBase": {
        margin: 1,
        padding: 0,
        transform: "translateX(6px)",
        "&.Mui-checked": {
          color: "#fff",
          transform: "translateX(22px)",
          "& .MuiSwitch-thumb:before": {
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
              "#fff"
            )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
          },
          "& + .MuiSwitch-track": {
            opacity: 1,
            backgroundColor: "#eee",
            ...theme.applyStyles("dark", {
              backgroundColor: "#8796A5",
            }),
          },
        },
      },
      "& .MuiSwitch-thumb": {
        background:
          "linear-gradient(129deg, rgba(199, 14, 143, 1) 37%, rgba(95, 9, 121, 1) 69%)",
        width: 32,
        height: 32,
        "&::before": {
          content: "''",
          position: "absolute",
          width: "100%",
          height: "100%",
          left: 0,
          top: 0,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
            "#fff"
          )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
        },
        ...theme.applyStyles("dark", {
          backgroundColor: "#003892",
        }),
      },
      "& .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#aab4be",
        borderRadius: 20 / 2,
        ...theme.applyStyles("dark", {
          backgroundColor: "#8796A5",
        }),
      },
    }));
    const {t} = useTranslation();
    //const location = useLocation();
    //const queryParams = new URLSearchParams(location.search);
    //const link = queryParams.get("link"); // obtener el link
    const fullUrl = window.location.href
    console.log("URL completa:", fullUrl);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [title, setTitle] = useState("");
    const [survey, setSurvey] = useState({});
    const [visibleQuestions, setVisibleQuestions] = useState([]);
    const nav = useNavigate();
    const accessToken = Cookies.get('accessToken');

    useEffect(() => {
        const completedSurveys = JSON.parse(localStorage.getItem("surveyCompleted") || "[]");
  if (completedSurveys.includes(survey.id)) {
    nav("/gratitude");
  } else {
    getSurvey(fullUrl);
  }
}, [fullUrl, survey.id, nav]);

    useEffect(() => {
        
        const updatedVisibleQuestions = questions.filter(shouldRenderQuestion);
        setVisibleQuestions(updatedVisibleQuestions);
        console.log("dsds",answers)
    }, [answers, questions]); 
   


    // Funncion que envia las respuestas al back
    const handleSubmit = async (event) => {


        event.preventDefault();
        // Validar que hay respuestas antes de enviar
        if (answers.length === 0) {
            Toast2.fire({
                icon: "error",
                title: t("alerts.no_hay_respuestas"),
            });
            return;
        }

         // Validar que todas las preguntas visibles estén respondidas
        const allAnswered = visibleQuestions.every(question =>
            answers.some(answer => answer.question_id === question.id && answer.answer !== "")
        );

        if (!allAnswered) {
        Toast2.fire({
          icon: "error",
          title: t("alerts.todas_preguntas"),
        });
        return;
    }

        const answersWithSurveyId = answers.map(answer => ({
            ...answer,
            survey_id: survey.id 
        }));
    
        console.log("Datos que se van a enviar:", answersWithSurveyId);
    
        try {
            const response = await axios.post("http://localhost:3000/api/answers", answersWithSurveyId);
            console.log('respuesta genera', response);
    
            if (response.status === 200 || response.status === 201) {
                console.log('Se recibió status 200, mostrando alerta');
                // Alerta de éxito
                Swal.fire({
                    title: t("alerts.exito"),
                    text: t("alerts.exito_enviar_respuestas"),
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#28a745', // verde
                })
                .then((result) => {
                    if (result.isConfirmed) {
                        //  Guardar el ID de la encuesta como completada (en array)
                        const completedSurveys = JSON.parse(localStorage.getItem("surveyCompleted") || "[]");
                        if (!completedSurveys.includes(survey.id)) {
                            completedSurveys.push(survey.id);
                            localStorage.setItem("surveyCompleted", JSON.stringify(completedSurveys));
                        }
                
                        //  Redirigir al mensaje de gratitud
                        nav("/gratitude");
                    }
                });
            }
        } catch (error) {
            console.error("Error al enviar respuestas:", error);
            // Alerta de error
            Toast2.fire({
                icon: "error",
                title: `${t("alerts.error_enviar_respuestas")}`,
            });
        }
    };
    
    
    
    // Funcion para cargar las encuestas 
    const getSurvey = async (link) => {
        const fullLink = encodeURIComponent(link); 
        console.log("Link enviado al servidor:", fullLink);
        
        try {
           
            const response = await axios.get(`http://localhost:3000/api/surveyByLink?link=${fullLink}`);
        
            console.log('Contenido de response.data:', response.data);
        
            
            if (response.data && response.data.data) {
                const data = response.data.data;
        
                const survey = {
                    id: data.survey_set.id,  
                    logo: data.survey_set.logo,
                    color_tag1: data.survey_set.color_tag1,
                    color_tag2: data.survey_set.color_tag2
                };
        
                console.log("Encuesta obtenida de la base de datos:", survey);
        
                setSurvey(survey);  
                setTitle(data.survey_set.title); 
        
                // preguntas obtenidas de la BD
                setQuestions(data.question);  
                console.log("Preguntas obtenidas de la base de datos:", data.question);
            } else {
                console.error('No se encontró la encuesta en la respuesta.', response.data);
            }
        } catch (error) {
            console.error("Error al cargar encuesta:", error);
        }
    };
    
    
    
    


    const handleChange = (event, id) => {
        const newAnswer = { answer: event.target.value, question_id: id };
        const newAnswers = answers.map(answer =>
            answer.question_id === id ? { ...answer, answer: event.target.value } : answer
        );
        if (!answers.some(answer => answer.question_id === id)) {
            newAnswers.push(newAnswer);
        }
        setAnswers(newAnswers);
    };

    const handleChangeMultiple = (event, selectedString, id) => {
        const newAnswer = { question_id: id, answer: selectedString };
        const newAnswers = answers.map(answer =>
            answer.question_id === id ? { ...answer, answer: selectedString } : answer
        );
        if (!answers.some(answer => answer.question_id === id)) {
            newAnswers.push(newAnswer);
        }
        setAnswers(newAnswers);
    };

    const shouldRenderQuestion = (question) => {
        if (question.id_conditional) {
            const conditionalAnswerObj = answers.find(answer => answer.question_id === question.id_conditional);
            if (conditionalAnswerObj) {
                const validAnswers = question.conditional_answer.split(',');
                return validAnswers.includes(conditionalAnswerObj.answer);
            }
            return false; // Si no se encuentra la respuesta condicional, la pregunta no se renderiza
        }
        return true; // Si no tiene condicionamiento, la pregunta se renderiza por defecto
    };
    
    return (
    <Box sx={{ position: 'relative' ,   top: 0, left: 0, right: 0, bottom: 0 }}>
      <Box
        sx={{
          position: 'fixed',
          
          right: 50,
          zIndex: 1200,
          background: survey.color_tag1 ,
          borderRadius: 2,
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          width: '10%',
          height: '10%',
        }}
      >
        <Tooltip title="Cambiar a modo oscuro" placement="top">
          <FormControlLabel
            control={
              <MaterialUISwitch
                checked={theme === 'dark'}
                onChange={toggleTheme}
              />
            }
            label=""
          />
        </Tooltip>
        
        <LanguageSelector />
      
      </Box>
      


      {/* Fondo SVG */}
      <svg
                id="personalized-svg"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1920 1080"
                // #b62a8b fill={survey.color_tag1} style={{ zIndex: -1 }}
                fill= {survey.color_tag1}
                className="svg-background"
                style={{zIndex:-1}}
            >
                <path
                    d="m874.8,203.28S993.6-136.92,0,62.88v1587.6s186.3-116.1,189-197.1h729s359.1,267.3,494.1-62.1v-367.2s-30.34-99.56-132.3-198.84"
                />
            </svg>

      <Container maxWidth="lg" sx={{ mt: 4 }}>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              mb: 4,
              width: '80%',
              boxShadow: `${survey.color_tag2} -webkit-box-shadow: -1px -1px 20px 12px ${survey.color_tag2};
                -moz-box-shadow: -1px -1px 20px 12px ${survey.color_tag2};
                box-shadow: -1px -1px 20px 12px ${survey.color_tag2};`,
              borderRadius: 2,
            }}
          >
            
            {/* Título y logo */}
            <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                  }}
                >
                  <Box
                    component="img"
                    src={`/clientes/${survey.logo}`}
                    alt="Logo"
                    sx={{ maxHeight: 60 }}
                  />
                  <Typography variant="h5" fontWeight="bold" color="text.primary">
                    {title}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Preguntas */}
            <Grid container spacing={3}>
              {visibleQuestions.map((question, index) => (
                <Grid item xs={12} key={index}>
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ mb: 2, textAlign: 'center' }}
                    >
                      {question.question}
                    </Typography>

                    {/* Renderizado condicional */}
                    {question.type === 'range_onetofive' ? (
                      <Range_onetofive_survey
                        question={question}
                        id={question.id}
                        change={(e) => handleChange(e, question.id)}
                      />
                    ) : question.type === 'range_zerototen' ? (
                      <Range_zerototen_survey
                        question={question}
                        id={question.id}
                        change={(e) => handleChange(e, question.id)}
                      />
                    ) : question.type === 'range_difficulty' ? (
                      <Range_difficulty_survey
                        question={question}
                        id={question.id}
                        change={(e) => handleChange(e, question.id)}
                      />
                    ) : question.type === 'yes_no' ? (
                      <Yes_no_survey
                        question={question}
                        id={question.id}
                        change={(e) => handleChange(e, question.id)}
                      />
                    ) : question.type === 'range_emoji' ? (
                      <Range_emoji_survey
                        question={question}
                        id={question.id}
                        change={(e) => handleChange(e, question.id)}
                      />
                    ) : question.type === 'radio_opt' ? (
                      <Single_choice_survey
                        answers={question.select_option}
                        id={question.id}
                        change={(e) => handleChange(e, question.id)}
                      />
                    ) : question.type === 'check_opt' ? (
                      <Multiple_choice_survey
                        answers={question.select_option}
                        id={question.id}
                        change={handleChangeMultiple}
                      />
                    ) : question.type === 'textfield_s' ? (
                      <TextField
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={
                          answers.find((a) => a.question_id === question.id)?.answer ||
                          ''
                        }
                        onChange={(e) => handleChange(e, question.id)}
                        sx={{
                          width: '60%',
                          mx: 'auto',
                          display: 'block',
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '& fieldset, &:hover fieldset, &.Mui-focused fieldset': {
                              borderColor: 'black',
                              borderWidth: '1px',
                            },
                          },
                        }}
                      />
                    ) : null}
                  </Box>
                </Grid>
              ))}

              {/* Botón de enviar */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    backgroundColor: '#b62a8b',
                    '&:hover': {
                      backgroundColor: '#581244',
                    },
                  }}
                >
                  {t('buttons.enviar')}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}