import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import '../../assets/css/encuesta.css';
import { Range_zerototen_survey, Range_onetofive_survey, Yes_no_survey, Range_difficulty_survey, Range_emoji_survey, Single_choice_survey, Multiple_choice_survey } from './questionsSurvey';
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Cookies from "js-cookie";



export default function Survey() {
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
        const surveyCompleted = localStorage.getItem('surveyCompleted');
        if (surveyCompleted) {
            nav("/gratitude"); // Redirigir a Gratitude si ya se completó
        } else {
            getSurvey(fullUrl); // Si no se ha completado, cargar la encuesta
        }
    }, [fullUrl],nav);

    useEffect(() => {
        
        const updatedVisibleQuestions = questions.filter(shouldRenderQuestion);
        setVisibleQuestions(updatedVisibleQuestions);
        console.log(answers)
    }, [answers, questions]); 
   


    // Funncion que envia las respuestas al back
    const handleSubmit = async (event) => {
        const token = accessToken || Cookies.get("accessToken");
  
        if (!token) {
        console.warn("⚠️ Token no disponible aún.");
        return;
        }

        event.preventDefault();
        // Validar que hay respuestas antes de enviar
        if (answers.length === 0) {
            Swal.fire({
                title: 'Error',
                text: 'No hay respuestas para enviar.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#FF66B2',
            });
            return;
        }

         // Validar que todas las preguntas visibles estén respondidas
        const allAnswered = visibleQuestions.every(question =>
            answers.some(answer => answer.question_id === question.id && answer.answer !== "")
        );

        if (!allAnswered) {
            Swal.fire({
            title: 'Error',
            text: 'Por favor responde todas las preguntas antes de enviar.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#FF66B2',
        });
        return;
    }

        const answersWithSurveyId = answers.map(answer => ({
            ...answer,
            survey_id: survey.id 
        }));
    
        console.log("Datos que se van a enviar:", answersWithSurveyId);
    
        try {
            const authConfig = {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            };
            const response = await axios.post("http://localhost:3000/api/answers", answersWithSurveyId,authConfig);
            console.log('respuesta genera', response);
    
            if (response.status === 200 || response.status === 201) {
                console.log('Se recibió status 200, mostrando alerta');
                // Alerta de éxito
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Las respuestas se enviaron correctamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#28a745', // verde
                }).then((result) => {
                    if (result.isConfirmed) {
                        localStorage.setItem('surveyCompleted', 'true'); // Guardar indicador para no dejar ver la encuesta otra vez
                        nav("/gratitude");  // <-- redirige a Gratitude.jsx
                    }
                });
            }
        } catch (error) {
            console.error("Error al enviar respuestas:", error);
            // Alerta de error
            Swal.fire({
                title: 'Error',
                text: 'Hubo un error al enviar las respuestas.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#FF66B2',
            });
        }
    };
    
    
    
    // Funcion para cargar las encuestas 
    const getSurvey = async (link) => {
        const token = accessToken || Cookies.get("accessToken");
  
        if (!token) {
        console.warn("⚠️ Token no disponible aún.");
        return;
        }

        const fullLink = encodeURIComponent(link); 
        console.log("Link enviado al servidor:", fullLink);
        
        try {
            const authConfig = {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
              };
            // Hacer la solicitud al backend para obtener la encuesta y sus preguntas
            const response = await axios.get(`http://localhost:3000/api/surveyByLink?link=${fullLink}`,authConfig);
        
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
        <div>
            <svg
                id="personalized-svg"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1920 1080"
                fill={survey.color_tag1} style={{ zIndex: -1 }}
            >
                <path
                    d="m874.8,203.28S993.6-136.92,0,62.88v1587.6s186.3-116.1,189-197.1h729s359.1,267.3,494.1-62.1v-367.2s-30.34-99.56-132.3-198.84"
                />
            </svg>
            <div className="container container-quiz mt-4">
                <form className="quiz-manage text-center" onSubmit={handleSubmit}>
                    <div className="cont-quiz mb-4" style={{ boxShadow: `${survey.color_tag2} 0px 5px 15px` }}>
                        <div className="row cont-logo">
                            <div className="col-12 mb-2">
                            </div>
                        </div>
                        <div className="row text-center cont-title-quiz">
                            <div className="col-12">
                                <p className="tittle text-center title-quiz">
                                    <img className="logo" src={`/clientes/${survey.logo}`} alt="" /> {title}
                                </p>
                            </div>
                        </div>
                        <div className="row text-center">
                            <div className="col-12">
                                <div className="row">
                                </div>
                            </div>
                            {visibleQuestions.map((question, index) => (
                                <div className="row" key={index}>
                                    <p className="quest fw-bolder fs-5">{question.question}</p>
                                    {question.type === 'range_onetofive' ? (
                                        <Range_onetofive_survey question={question} key={question.id} id={question.id} change={(e) => handleChange(e, question.id)} />
                                    ) : question.type === 'range_zerototen' ? (
                                        <Range_zerototen_survey question={question} key={question.id} id={question.id} change={(e) => handleChange(e, question.id)} />
                                    ) : question.type === 'range_difficulty' ? (
                                        <Range_difficulty_survey question={question} key={question.id} id={question.id} change={(e) => handleChange(e, question.id)} />
                                    ) : question.type === 'yes_no' ? (
                                        <Yes_no_survey question={question} key={question.id} id={question.id} change={(e) => handleChange(e, question.id)} />
                                    ) : question.type === 'range_emoji' ? (
                                        <Range_emoji_survey question={question} key={question.id} id={question.id} change={(e) => handleChange(e, question.id)} />
                                    ) : question.type === 'radio_opt' ? (
                                        <Single_choice_survey answers={question.select_option} key={question.id} id={question.id} change={(e) => handleChange(e, question.id)} />
                                    ) : question.type === 'check_opt' ? (
                                        <Multiple_choice_survey answers={question.select_option} key={question.id} id={question.id} change={handleChangeMultiple} />
                                    ) :  question.type === 'textfield_s' ? (
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            margin="normal"
                                            value={answers.find(a => a.question_id === question.id)?.answer || ''}
                                            onChange={(e) => handleChange(e, question.id)}
                                            sx={{
                                                width: '60%',
                                                margin: '16px auto !important', // centrado horizontal
                                                display: 'block', // necesario para que funcione margin auto
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '8px',
                                                    '& fieldset, &:hover fieldset, &.Mui-focused fieldset': {
                                                        borderColor: 'black',
                                                        borderWidth: '1%',
                                                    }
                                                }
                                            }}
                                        />
                                    ) : null}
                                </div>
                            ))}
                            <div className="row">
                                <div className="col-12">
                                    <button type="submit" className="btn btn-success m-2">
                                        Enviar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}