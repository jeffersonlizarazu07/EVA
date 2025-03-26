import React, { useState, useEffect, useContext,useMemo } from 'react';
import HeaderLT1 from '../../components/header/headerLT1';
import axios from "axios";
import SidebarLT1 from '../../components/aside/sidebarLT1';
import useInput from '../../components/hooks/useInput';
import { UserContext } from '../../context/UserContext';
import { useParams } from 'react-router-dom';
import { smallAlertDelete, loadingAlert, Toast2, Toast } from '../../assets/js/alertConfig';
import { useTranslation } from "react-i18next";
import { sendData, deleteQuestion, getSurvey, getSurveyQuestions } from '../../services/surveyRequest';
import { SingleChoiceQuestion, MultipleChoiceQuestion, MultipleChoiceQuestionEdit, SingleChoiceQuestionEdit } from './singleChoiceQuestion';
import "../../assets/css/survey.css";
import {Range_onetofive,Range_zerototen,Range_difficulty,Yes_no, Range_emoji, Textfield_s,SingleChoiceView, MultipleChoiceView} from './questions';
import getRangeOptions from './conditional';

export default function View_survey() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  const [surveyData, setSurveyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [idToEdit, setidToEdit] = useState(null);
  const [error, setError] = useState('');
  const [listConditional, setListConditional] = useState(false);
  const [valueConditional, setValueConditional] = useState(null);
  const [singleChoiceData, setSingleChoiceData] = useState({ options: [], correctAnswer: null });
  const [multipleChoiceData, setMultipleChoiceData] = useState({ options: [], correctAnswers: [] });
  const [isChecked,setIsChecked]=useState(null)
  const [selectedRangeType,setSelectedRangeType]=useState({questionTypeRange:'',answersRange:''})

  const question = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });
  const description = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });
  const questionType = useInput({ defaultValue: '', validate: /^[A-Za-z_]+$/ });
  const section = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });
  const percentage = useInput({ defaultValue: "", validate: /^[^\s@]+@[^\s@]+\.[^\s@]*$/ });
  const frm_option = useInput({ defaultValue: "", validate: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ });
  const conditional = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });
  const id_conditional = useInput({ defaultValue: "0", validate: /^[0-9]*$/ });
  const survey_id = useInput({ defaultValue: "", validate: /^[0-9]*$/ });
  const conditional_answer = useInput({ defaultValue: "", validate: /^[A-Za-z0-9]*$/ });

  const { t, i18n } = useTranslation();
  const { accessToken, languageUser } = useContext(UserContext);

  useEffect(() => {
    i18n.changeLanguage(languageUser);
    getSurvey(id, config, setSurveyData);
    updateSurveyQuestions();
  }, [id, languageUser]);

  const config = {
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    }
  };
  const updateSurveyQuestions = () => {
    getSurveyQuestions(id, config)
      .then(setData)
      .catch(error => {
        console.error('Error fetching survey questions', error);
      });
  };

  const handleCancel = () => {
    setValueConditional(false);
    setIsChecked(false);
    setSingleChoiceData({ options: [], correctAnswer: null });
    setMultipleChoiceData({ options: [], correctAnswers: [] });
    setidToEdit(null);
  };



  const conditionalHandleChange = (e) => {
    const conditional = e;
    setIsChecked(conditional)
    setValueConditional(conditional);
  };

  useEffect(() => {
    if (!valueConditional) {
      setListConditional(false);
      setSingleChoiceData({ options: [], correctAnswer: null });
      setMultipleChoiceData({ options: [], correctAnswers: [] });
    }
    setListConditional(true);
  }, [valueConditional]);

  const openModal = (op, idsurvey, questionDetails) => {
    setOperation(op);
    if (op === 1) {
      setTitle("Nueva Pregunta");
      setDescriptionText('Elige un tipo de pregunta de acuerdo a tus necesidades.');
      description.handleChange("");
      questionType.handleChange("");
      section.handleChange("Na");
      percentage.handleChange("");
      frm_option.handleChange("Na");
      conditional.handleChange("NO");
      id_conditional.handleChange(0);
      conditional_answer.handleChange("NO");
      survey_id.handleChange(idsurvey);
      setSingleChoiceData({ options: [], correctAnswer: null });
      setMultipleChoiceData({ options: [], correctAnswers: [] });
    } else if (op === 2) {
      console.log({ questionDetails });
      setSingleChoiceData({ options: [], correctAnswer: null });
      setMultipleChoiceData({ options: [], correctAnswers: [] });
      setTitle("Editar pregunta");
      setDescriptionText('Modifica la pregunta de acuerdo a tus necesidades.');
      if (questionDetails.conditional=="SI"){  
        setValueConditional(true)
       setIsChecked(true)
       }else{
        setValueConditional(false)
        setIsChecked(false)
       }
   
      if (questionDetails.type=="check_opt"){
          const opstionsMultipleData=questionDetails.select_option.split(",")
          const multipleAnswers=questionDetails.selected_answer.split(",")
          
         setMultipleChoiceData({ options: opstionsMultipleData, correctAnswers: multipleAnswers });
      }
      if (questionDetails.type=="radio_opt"){
        const optiosnData=questionDetails?.select_option
        const optionsDataArray=optiosnData.split(",")
        const answerSelected=questionDetails?.selected_answer.split(",")
        setSingleChoiceData({ options: optionsDataArray, correctAnswer: answerSelected });
      }
      id_conditional.handleChange(questionDetails?.id_conditional || null);
      conditional.handleChange(questionDetails?.conditional || "");
      description.handleChange(questionDetails?.question || "");
      questionType.handleChange(questionDetails?.type || "");
      conditional_answer.handleChange(questionDetails?.conditional_answer|| "")
      setidToEdit(questionDetails?.id);
    }
  };

  const validar = (id, survey_idt) => {
    var parametros;
    var metodo;
    console.log('??  ',singleChoiceData.correctAnswer)
    if (questionType.input.trim() === "" || description.input.trim() === "") {
      setError("Ingresa una pregunta valida.");
    } else {
      
       // Asegúrate de que selectedAnswer sea un índice (número) para radio_opt
       const selectedAnswer = questionType.input === "radio_opt"
       ? singleChoiceData.correctAnswer
       : multipleChoiceData.correctAnswers;
 
        
    
     const options = questionType.input === "radio_opt"
       ? singleChoiceData.options
       : multipleChoiceData.options;
 
     // Para "radio_opt" debería ser solo un número, no un array
     const selectedAnswerToString = questionType.input === "radio_opt"
       ? selectedAnswer.toString() // Convierte a string para guardarlo
       : selectedAnswer.join(', '); // Para check_opt, une los valores
 
     const optionsToSave = options.map(option => option.text).join(', ');
 

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
          selected_answer: questionType.input === "check_opt" || questionType.input ===  "radio_opt"? selectedAnswerToString: " ",
          select_option:questionType.input === "check_opt" || questionType.input ===  "radio_opt"? optionsToSave: "", 
        };
        metodo = "post";
        console.log("parametros: ",parametros)
      } else if (operation === 2) {
        parametros = {
          type: questionType.input,
          percentage: 0,
          conditional: valueConditional ? "SI" : "NO",
          question: description.input,
          survey_id: survey_idt,
          conditional_answer: conditional_answer.input,
          id_conditional: id_conditional.input,
          selected_answer: questionType.input === "check_opt" || questionType.input ===  "radio_opt"? (selectedAnswerToString.length>1? selectedAnswerToString :selectedAnswerToString ): null,
          select_option:questionType.input === "check_opt" || questionType.input ===  "radio_opt"? optionsToSave: null, 
        };
        console.log( "parametros",parametros );
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
          updateSurveyQuestions();
          document.getElementById("btnClose").click();
          setValueConditional(false)
        })
        .catch((error) => {
          console.error("Error en la actualización de preguntas:", error);
        });
    }
  };

  const handleSingleChoiceChange = (updatedData) => {
    setSingleChoiceData(updatedData);
    console.log('updated Data:', singleChoiceData.correctAnswer)
  };

  const handleMultipleChoiceChange = (data) => {
    setMultipleChoiceData(data);

  };
 const handleSelectConditionalQuestionChange = (e) => {
  const selectedId = e.target.value; // Captura el value (question.id)
  const selectedType = e.target.selectedOptions[0].getAttribute('data-type');
  const selectedAnswers = e.target.selectedOptions[0].getAttribute('data-answers') // Convertimos de vuelta a un array u objeto
  setSelectedRangeType({questionTypeRange:selectedType,answersRange:selectedAnswers})
  id_conditional.handleChange(selectedId);
};

const rangeOptions = useMemo(() => getRangeOptions(selectedRangeType.questionTypeRange,selectedRangeType.answersRange), [selectedRangeType]); 

  return (
    <div className="App">
      <div id="body">
        <HeaderLT1/>
        <section style={{alignItems:"stretch", flexWrap:"nowrap", padding:0}}>
        <SidebarLT1/>
        <div className="container mt-0">
          <div className="row">
            <div className="col-md-12">
              <div className="card p-4 borderEVA bg-light">
                <div className="text-center">
                  <h3>Información Encuesta</h3>
                </div>
                <div className="card-body p-0 py-2">
                  <div className="container-fluid">
                    <div className="row d-flex align-items-center">
                      <div className="col-6">
                        <h5>{surveyData.title}</h5>
                        <p className="fs-6">{surveyData.description}</p>
                      </div>
                      <div className="col-6 text-end">
                        <p className="fs-6">{surveyData.start_date} / {surveyData.end_date}</p>
                        <p className="fs-6">Cantidad de muestras:   </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12 mt-3">
              <div className="card p-4 card-outline card-success borderEVA bg-light">
                <div>
                  <h3 className="text-center">Preguntas de Encuesta</h3>
                  <div className="card-tools">
                    <button className="btn fw-bold btn-sm acces-tabla" data-bs-toggle="modal"  data-bs-target="#modalManageQuestion" onClick={() => openModal(1,id)}> + Agregar Nueva pregunta</button>
                  </div>
                </div>
            
                  <div className="card-body ui-sorteable">
                      {data.map(question=>(
                        <div key={question.id} className="callout callout info shadowbox5 p-3 m-3">
                          <div className="row ">
                            <div className="col-md-12 col-12">
                           
                            </div>
                          </div>
                          <div className="d-flex justify-content-between">
                             <h5 className='mt-2'>{question.question}</h5>
                            <div className="dropdown">
                                <a className="btn  dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="fa-solid fa-ellipsis-vertical">
                                  </i>
                                </a>
                                  <ul className="dropdown-menu">
                                    <li><button className="dropdown-item"  type='button'  data-bs-toggle="modal" data-bs-target="#modalManageQuestion" onClick={() => openModal(2,id,question)}>Editar</button></li>
                                    <li><button className="dropdown-item"  type='button' onClick={()=> deleteQuestion(question,config, updateSurveyQuestions,t)}>Eliminar</button></li>
                                  </ul>
                            </div> 
                            
                          </div>
                         
                          {question.type=='range_onetofive'?(
                           <Range_onetofive/>)
                           :(question.type=="range_zerototen"?(
                            <Range_zerototen/>)
                            :(question.type=="range_difficulty"? (
                            <Range_difficulty/>)
                            :(question.type=="yes_no"? (
                            <Yes_no/>)
                            :(question.type=="range_emoji"?(
                            <Range_emoji/>)
                            :(question.type=="textfield_s"?
                              <Textfield_s/>
                            :(question.type=="radio_opt"? <SingleChoiceView options={question.select_option} correctOption={question.selected_answer}/>
                            :<MultipleChoiceView options={question.select_option} correctOption={question.selected_answer}/>))))))}

                        <div className="text-end me-3">
                        {question.conditional==="SI"? (<i className="fa-solid fa-question text-primary"  data-bs-toggle="tooltip" data-bs-placement="top"
                          data-bs-custom-class="custom-tooltip"
                          data-bs-title="This top tooltip is themed via CSS variables."></i>):("")}
                            </div>
                        </div>
                        
                      
                      ))
                      }
                  </div>
                 
              </div>
            </div>
          </div>
        </div>
        </section>
        </div>
    <div
      className="modal fade" id="modalManageQuestion" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" >
      <div className={`${operation===1? "modal-lg":"modal-xl"} modal-dialog modal-dialog-centered modal-dialog-scrollable"`} >
        <div className="modal-content">
          <div className="modal-header">
                <h5 className='text-start m-2 modal-title'>{title}</h5>
          </div>
          <div className="modal-body ">
          <div className={`${operation === 1 ? "" : "pe-5"} row ` }>
          <div className={`${operation === 1 ? "col-12" : "col-6"} p-3` } >
                <small>
                <p className='text-start  ms-2 text-secondary'>{descriptionText}</p>
                </small>
               
                <div className="form-group m-2 mt-2 mb-4" >
              
                <label id="labelAnimation" htmlFor="question" >
                  <input
                    type="text"
                    name="question"
                    id="question"
                    className="input-new"
                    placeholder=" "
                      value={description.input}
                      onChange={(e) => description.handleChange(e.target.value)}
                    required
                  />
                      <span className="labelName" >Pregunta:</span>
                      </label>
              </div>
              <div className="form-group m-2 ">
           
                <label htmlFor="middlename" id="labelAnimation">
                <select   className="input-new text-center" placeholder=" "   name='questionType' onChange={(e)=> questionType.handleChange(e.target.value)} value={questionType.input} >
                  <option value="" disabled>Seleccione una pregunta</option>
                  <option value="yes_no">Si/No</option>
                  <option value="range_emoji">Rango de emojis</option>
                  <option value="range_onetofive">Rango de 1/5</option>
                  <option value="range_zerototen">Rango de 0/10</option>
                  <option value="range_difficulty">Rango de dificultad</option>
                  <option value="textfield_s">Campo de texto</option>
                  <option value="radio_opt">Seleccion unica</option>
                  <option value="check_opt">Seleccion multiple</option>
                </select>
                <span className="labelName">Tipo de pregunta:</span>
                </label>
              </div>
              {questionType.input==="radio_opt" && operation==1? (<SingleChoiceQuestion   options={singleChoiceData.options}  correctAnswer={singleChoiceData.correctAnswer}  onChange={handleSingleChoiceChange}/>)
                :(questionType.input=="check_opt" && operation==1? <MultipleChoiceQuestion   options={multipleChoiceData.options}  correctAnswers={multipleChoiceData.correctAnswers}  onChange={handleMultipleChoiceChange}/>
                :(questionType.input=="check_opt" && operation==2? <MultipleChoiceQuestionEdit idToEdit={idToEdit} options={multipleChoiceData.options} correctAnswers={multipleChoiceData.correctAnswers} onChange={handleMultipleChoiceChange}/>:
                (questionType.input=="radio_opt" && operation==2?  <SingleChoiceQuestionEdit options={singleChoiceData.options} correctAnswer={singleChoiceData.correctAnswer} idToEdit={idToEdit} onChange={handleSingleChoiceChange}/> :"")
                ))}
                
              {operation===1? ( <div className="mt-2 mb-2">
                    {questionType.input=='range_onetofive'?(
                      <Range_onetofive/>)
                      :(questionType.input=="range_zerototen"?(
                      <Range_zerototen/>)
                      :(questionType.input=="range_difficulty"? (
                      <Range_difficulty/>)
                      :(questionType.input=="yes_no"? (
                      <Yes_no/>)
                      :(questionType.input=="range_emoji"?(
                      <Range_emoji/>)
                      :(questionType.input=="textfield_s"?
                      <Textfield_s/>
                    :"")))))}
                  </div>):null}
             
                  </div>
              
              { questionType.input && operation===2?(
                <>
                <div className="col-6  p-2 shadowbox5 " style={{borderLeft:"5px solid gray"}}>
                  {operation===2 && data.length>=1?( <div className="form-check form-switch  m-2">
                    <input className="form-check-input" type="checkbox" id="flexSwitchCheckChecked" checked={isChecked} onChange={(e)=> conditionalHandleChange(e.target.checked)}/>
                    <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Añadir como pregunta condicional</label>
                      </div>):(" ") }
                      {listConditional && valueConditional? (
                      <>
                          <div className="text ms-2 p-0">
                            <span> Si la respuesta de la pregunta: </span>
                          </div>
                       
                        <div className="form-group  mt-3 m-2 ">
                                 
                      <label htmlFor="middlename" id="labelAnimation">              
                        <select className=' input-new conditionalQuestionSelect '  name='questionConditional' placeholder=" " onChange={(e)=> handleSelectConditionalQuestionChange(e)} value={id_conditional.input} >
                          <option value="0" selected hidden>Seleccionar:</option>
                          {data.map((question) => (
                            question.type=="textfield_s" || question.id===idToEdit ? null:
                            <option key={question.id} value={question.id} data-type={question.type}  data-answers={question.select_option} >
                           {question.question.length>55? question.question.substring(0, 55) + "..." :question.question} 
                            </option>
                            
                           ))}
                        </select>
                        <span className="labelName">Pregunta:</span>
                      </label>    
                      </div>
                      {id_conditional.input && (
                      <div className="mt-2">
                          <div className="text ms-2 mt-2 p-0">
                            <span> Es: </span>
                          </div>
                          <div className="form-group mt-3 m-2">
                            <label id='labelAnimation'>
                            <select name="optionConditionalSelector" className="input-new" placeholder=" "  onChange={(e)=>conditional_answer.handleChange(e.target.value)} value={conditional_answer.input}>
                              <option value="0" selected hidden>Seleccionar opcion</option>
                              {rangeOptions.map((option, index) => (
                                <option key={index} value={option.value}>
                                  {option.optionText}
                                </option>
                              ))}
                            </select>
                            <span className="labelName">Respuesta:</span>
                            </label>
                          </div>
                          </div>
                      )}
                      </>
                      ):null}
                      </div>
                </>
            ):null}
               {error && <p className='text-danger text-center'>{error}</p>}
               {operation===2? ( <div className="mt-2 mb-2">
                    {questionType.input=='range_onetofive'?(
                      <Range_onetofive/>)
                      :(questionType.input=="range_zerototen"?(
                      <Range_zerototen/>)
                      :(questionType.input=="range_difficulty"? (
                      <Range_difficulty/>)
                      :(questionType.input=="yes_no"? (
                      <Yes_no/>)
                      :(questionType.input=="range_emoji"?(
                      <Range_emoji/>)
                      :(questionType.input=="textfield_s"?
                      <Textfield_s/>
                    :"")))))}
                  </div>):null}
            
          </div>
        </div>
        <div className="modal-footer">
              {questionType.input && (
                <button className="btn bg-gradient-guardar mr-2" id="btn-send-survey"  onClick={() => validar(idToEdit,id)}>
                  Guardar
                </button>
                )}
                <button className="btn btn-secondary" type="button" data-bs-dismiss="modal" id='btnClose' onClick={handleCancel}>
                  Cancelar
                </button>
              </div>
        </div>
      </div>
    </div> 
        </div>
      )       
}
