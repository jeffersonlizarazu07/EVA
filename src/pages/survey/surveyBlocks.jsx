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
// import { sendData, deleteQuestion, getSurvey, getSurveyQuestions } from '../../services/surveyRequest';
import {
  SingleChoiceQuestion,
  MultipleChoiceQuestion,
  MultipleChoiceQuestionEdit,
  SingleChoiceQuestionEdit,
} from "./singleChoiceQuestion";
import "../../assets/css/survey.css";
// import {Range_onetofive,Range_zerototen,Range_difficulty,Yes_no, Range_emoji, Textfield_s,SingleChoiceView, MultipleChoiceView} from './questions';
import getRangeOptions from "./conditional";

export default function SurveyBlocks() {

  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  // const [valueConditional, setValueConditional] = useState(false);
  // const [isChecked, setIsChecked] = useState(false);
  // const [idToEdit, setidToEdit] = useState(null);

  // const description = useInput("");
  // const questionType = useInput("");
  // const section = useInput("");
  // const percentage = useInput("");
  // const frm_option = useInput("");
  // const conditional = useInput("NO");
  // const id_conditional = useInput(0);
  // const conditional_answer = useInput("NO");
  // const survey_id = useInput(id_form);

  // const [singleChoiceData, setSingleChoiceData] = useState({
  //   options: [],
  //   correctAnswer: null,
  // });
  // const [multipleChoiceData, setMultipleChoiceData] = useState({
  //   options: [],
  //   correctAnswers: [],
  // });

  const { id_form } = useParams();

  useEffect(() => {
    console.log("id_form recibido por URL:", id_form);
  }, [id_form]);

  const openModal = (op, idsurvey, questionDetails) => {
    setOperation(op);
    if (op === 1) {
      setTitle("Crear Bloque");
      setDescriptionText(
        "Elige un tipo de pregunta de acuerdo a tus necesidades."
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
      setSingleChoiceData({ options: [], correctAnswer: null });
      setMultipleChoiceData({ options: [], correctAnswers: [] });
    } else if (op === 2) {
      console.log({ questionDetails });
      setSingleChoiceData({ options: [], correctAnswer: null });
      setMultipleChoiceData({ options: [], correctAnswers: [] });
      setTitle("Editar pregunta");
      setDescriptionText("Modifica la pregunta de acuerdo a tus necesidades.");
      if (questionDetails.conditional == "SI") {
        setValueConditional(true);
        setIsChecked(true);
      } else {
        setValueConditional(false);
        setIsChecked(false);
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
    setIsChecked(conditional);
    setValueConditional(conditional);
  };

  return (
    <div className="App">
      <div id="body">
        <HeaderLT1 />
        <section
          style={{ alignItems: "stretch", flexWrap: "nowrap", padding: 0 }}
        >
          <div className="container mt-0">
            <div className="row">
              <div className="col-md-12">
                <div className="card p-4 borderEVA bg-light">
                  <div className="text-center">
                    <h3>Información</h3>
                  </div>
                  <div className="card-body p-0 py-2">
                    <div className="container-fluid">
                      <div className="row d-flex align-items-center">
                        <div className="col-6">
                          <h5>Información del Formulario</h5>
                          <p className="fs-6">Descripción</p>
                        </div>
                        <div className="col-6 text-end">
                          <p className="fs-6">Fecha inicio / Fecha fin</p>
                          <p className="fs-6">Cantidad de muestras:</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-12 mt-3">
                <div className="card p-4 card-outline card-success borderEVA bg-light">
                  <div>
                    <h3 className="text-center">Preguntas</h3>
                    <div className="card-tools">
                      <button
                        className="btn fw-bold btn-sm acces-tabla"
                        onClick={() => openModal(1, id_form)}
                        data-bs-toggle="modal"
                        data-bs-target="#modalManageQuestion"
                      >
                        + Crear Bloque
                      </button>
                    </div>
                  </div>

                  <div className="card-body ui-sorteable">
                    {/* Aquí irían las preguntas renderizadas */}
                    <div className="callout callout info shadowbox5 p-3 m-3">
                      <div className="d-flex justify-content-between">
                        <h5 className="mt-2">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit, sed do eiusmod tempor incididunt ut labore et
                          dolore magna aliqua.
                        </h5>
                        <div className="dropdown">
                          <a
                            className="btn dropdown-toggle"
                            href="#"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <i className="fa-solid fa-ellipsis-vertical"></i>
                          </a>
                          <ul className="dropdown-menu">
                            <li>
                              <button className="dropdown-item" type="button">
                                Editar
                              </button>
                            </li>
                            <li>
                              <button className="dropdown-item" type="button">
                                Eliminar
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="text-end me-3">
                        <i className="fa-solid fa-question text-primary"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div
        className="modal fade"
        id="modalManageQuestion"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className={`${operation===1 ? "modal-dialog modal-xl" : ""} modal-dialog-centered modal-dialog-scrollable`}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="text-start m-2 modal-title">{title}</h5>
            </div>
            <div className="modal-body">
              <div className="row">
                {/* Columna izquierda */}
                
                <div className="col-md-6 p-3">
                  <small>
                    <p className="text-start ms-2 text-secondary">
                      {descriptionText}
                    </p>
                  </small>

                  <div className="form-group m-2 mt-2 mb-4">
                    <label id="labelAnimation" htmlFor="question">
                      <input
                        type="text"
                        name="question"
                        id="question"
                        className="input-new"
                        placeholder=" "
                        // value={description.value}
                        // onChange={description.onChange}
                      />
                      <span className="labelName">Pregunta:</span>
                    </label>
                  </div>

                  <div className="form-group m-2">
                    <label htmlFor="questionType" id="labelAnimation">
                      <select
                        className="input-new text-center"
                        name="questionType"
                        id="questionType"
                      >
                        {/* <option value="" disabled>Seleccione una pregunta</option>
                  <option value="yes_no">Si/No</option>
                  <option value="range_emoji">Rango de emojis</option>
                  <option value="range_onetofive">Rango de 1/5</option>
                  <option value="range_zerototen">Rango de 0/10</option>
                  <option value="range_difficulty">Rango de dificultad</option> */}
                        <option value="textfield_s">Campo de texto</option>
                        <option value="radio_opt">Seleccion única</option>
                        <option value="check_opt">Seleccion múltiple</option>
                      </select>
                      <span className="labelName">Tipo de pregunta:</span>
                    </label>
                  </div>

                  <div className="form-group m-2 mt-4">
                    <label htmlFor="labelName" id="labelAnimation">
                      <input
                        type="text"
                        name="labelName"
                        id="labelName"
                        className="input-new"
                        placeholder=" "
                      />
                      <span className="labelName">
                        Calificativo del nombre:
                      </span>
                    </label>
                  </div>

                  <div className="form-group m-2 mt-4">
                    <label htmlFor="score" id="labelAnimation">
                      <input
                        type="number"
                        name="score"
                        id="score"
                        className="input-new"
                        placeholder=" "
                        min="0"
                      />
                      <span className="labelName">Posible puntuación:</span>
                    </label>
                  </div>

                  <div className="form-group m-2 mt-4">
                    <label htmlFor="applicable" id="labelAnimation">
                      <select
                        className="input-new"
                        name="applicable"
                        id="applicable"
                      >
                        <option value="no">No</option>
                        <option value="yes">Sí</option>
                      </select>
                      <span className="labelName">Aplicable:</span>
                    </label>
                  </div>

                  <div className="form-group m-2 mt-4">
                    <label htmlFor="required" id="labelAnimation">
                      <select
                        className="input-new"
                        name="required"
                        id="required"
                      >
                        <option value="no">No</option>
                        <option value="yes">Sí</option>
                      </select>
                      <span className="labelName">Requerido:</span>
                    </label>
                  </div>
                </div>

                {/* Columna derecha */}
                <div
                  className="col-md-6 p-3 shadowbox5"
                  style={{ borderLeft: "5px solid gray" }}
                >
                  <div className="form-check form-switch m-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="flexSwitchCheckChecked"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexSwitchCheckChecked"
                    >
                      Añadir como pregunta condicional
                    </label>
                  </div>

                  <div className="form-group mt-3 m-2">
                    <label htmlFor="questionConditional" id="labelAnimation">
                      <select
                        className="input-new conditionalQuestionSelect"
                        name="questionConditional"
                        id="questionConditional"
                      >
                        <option value="0" hidden>
                          Seleccionar:
                        </option>
                        <option>Pregunta 1</option>
                        <option>Pregunta 2</option>
                      </select>
                      <span className="labelName">Pregunta:</span>
                    </label>
                  </div>

                  <div className="form-group mt-3 m-2">
                    <label
                      htmlFor="optionConditionalSelector"
                      id="labelAnimation"
                    >
                      <select
                        name="optionConditionalSelector"
                        id="optionConditionalSelector"
                        className="input-new"
                      >
                        <option value="0" hidden>
                          Seleccionar opción
                        </option>
                        <option>Opción A</option>
                        <option>Opción B</option>
                      </select>
                      <span className="labelName">Respuesta:</span>
                    </label>
                  </div>

                  <div className="form-group m-2 mt-4">
                    <label htmlFor="copcScore" id="labelAnimation">
                      <select
                        className="input-new"
                        name="copcScore"
                        id="copcScore"
                      >
                        <option value="">Seleccionar</option>
                        <option value="business">Business Fatal</option>
                        <option value="compliance">Compliance Fatal</option>
                        <option value="enduser">End-User Fatal</option>
                      </select>
                      <span className="labelName">
                        Tipo de puntuación COPC:
                      </span>
                    </label>
                  </div>

                  <div className="form-group m-2 mt-4">
                    <label htmlFor="jobPosition" id="labelAnimation">
                      <select
                        className="input-new"
                        name="jobPosition"
                        id="jobPosition"
                      >
                        <option value="">Seleccionar</option>
                        <option value="agent">Agente</option>
                        <option value="supervisor">Supervisor</option>
                      </select>
                      <span className="labelName">Puesto:</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn bg-gradient-guardar mr-2">Guardar</button>
              <button
                className="btn btn-secondary"
                type="button"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
