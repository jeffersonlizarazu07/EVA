import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import '../../assets/css/encuesta.css';
import { Range_zerototen_survey, Range_onetofive_survey, Yes_no_survey, Range_difficulty_survey, Range_emoji_survey, Single_choice_survey, Multiple_choice_survey } from './questionsSurvey';
import Swal from "sweetalert2";

export default function Survey() {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [title, setTitle] = useState("");
    const [survey, setSurvey] = useState({});
    const [visibleQuestions, setVisibleQuestions] = useState([]);
    const { link } = useParams(); 
    const nav = useNavigate();

    useEffect(() => {
        getSurvey(link);
    }, [link]);

    useEffect(() => {
        // Actualiza las preguntas visibles cuando cambien las respuestas
        const updatedVisibleQuestions = questions.filter(shouldRenderQuestion);
        setVisibleQuestions(updatedVisibleQuestions);
        console.log(answers)
    }, [answers, questions]); // Ejecuta el efecto cada vez que las respuestas o preguntas cambian

    const handleSubmit = async (event) => {
        event.preventDefault();
        const url = "http://localhost:8000/api/answer";
        try {
            console.log(answers);
            const response = await axios.post(url, answers);
            console.log(response);
            if (response.data.status) {
                setAnswers([]);
                Swal.fire({
                    title: 'Cargando...',
                    didOpen: () => {
                        Swal.showLoading();
                    },
                    allowOutsideClick: false,
                });
                setTimeout(() => {
                    Swal.close();
                    nav("/gratitude");
                }, 2000);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const getSurvey = async () => {
        const response = await axios.get(`http://localhost:8000/api/survey?link=http://localhost:8000/survey/${link}`);
        const survey = {
            id: response.data.data.survey_set.id,
            logo: response.data.data.survey_set.logo,
            color_tag1: response.data.data.survey_set.color_tag1,
            color_tag2: response.data.data.survey_set.color_tag2
        };
        setSurvey(survey);
        setQuestions(response.data.data.questions);
        setTitle(response.data.data.survey_set.title);
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
                                    ) : (
                                        "<Textfield_s/>"
                                    )}
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