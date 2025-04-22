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
  SelectorQuestion,
  SelectorQuestionEdit,
} from "./singleChoiceQuestion";
import "../../assets/css/survey.css";
import {
  Yes_no,
  Textfield_s,
  SingleChoiceView,
  MultipleChoiceView,
} from "./questions";
import getRangeOptions from "./conditional";
import "../../assets/css/surveyBlocks.css";

export default function SurveyBlocks() {
  const { id } = useParams();
  const [data, setData] = useState([{
    id: 1,
    nombreBloque: "Bloque 1",
    question: "¿Cuál es tu nombre?",
    // type: "textfield_s",
    select_option: "",
    selected_answer: ""
  },]);
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
  const [isChecked, setIsChecked] = useState(false);
  const [selectedRangeType, setSelectedRangeType] = useState({
    questionTypeRange: "",
    answersRange: "",
  });

  const question = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });
  const description = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });
  const nombreInput = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });
  const ponderacionInput = useInput({ defaultValue: "", validate: /^[0-9]*$/ });
  const posicionInput = useInput({ defaultValue: "", validate: /^[0-9]*$/ });
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

  /* Estado de listas de preguntas del botón + Pregunta */
  const [questionsList, setQuestionsList] = useState([
    {
      text: "",
      type: "",
      options: [],
      correctAnswers: [],
    },
  ]);

  /* Contador de número de encuestas segun input */
  const [questionCountInput, setQuestionCountInput] = useState("");

  /* Selector option */

  const [selectorData, setSelectorData] = useState({
    options: [],
    selectedOption: null,
  });
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Validar el input de preguntas del modal

  // const [questionType, setQuestionType] = useState("");
  // const [description, setDescription] = useState("");
  // const [error, setError] = useState("");

  /* ***********************************************************************************************************/
  /* Component Logic*/
  /* ***********************************************************************************************************/

  useEffect(() => {
    i18n.changeLanguage(languageUser);
    getSurvey(id, config, setSurveyData);
    updateSurveyQuestions();
  }, [id, languageUser]);

  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const updateSurveyQuestions = () => {
    getSurveyQuestions(id, config)
      .then(setData)
      .catch((error) => {
        console.error("Error fetching survey questions", error);
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
    setIsChecked(conditional);
    setValueConditional(conditional);
  };

  useEffect(() => {
    if (valueConditional && !listConditional) {
      setListConditional(true);
    } else if (!valueConditional && listConditional) {
      setListConditional(false);
      if (
        singleChoiceData.options.length > 0 ||
        singleChoiceData.correctAnswer !== null
      ) {
        setSingleChoiceData({ options: [], correctAnswer: null });
      }
      if (
        multipleChoiceData.options.length > 0 ||
        multipleChoiceData.correctAnswers.length > 0
      ) {
        setMultipleChoiceData({ options: [], correctAnswers: [] });
      }
    }
  }, [valueConditional, listConditional, singleChoiceData, multipleChoiceData]);
  

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
      setSingleChoiceData({ options: [], correctAnswer: null });
      setMultipleChoiceData({ options: [], correctAnswers: [] });
      setSelectorData({ options: [], selectedOption: null });
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
      if (questionDetails.type == "selector_opt") {
        const optionsData = questionDetails?.select_option;
        const optionsDataArray = optionsData.split(",");
        const selectedOption = questionDetails?.selected_answer;

        setSelectorData({
          options: optionsDataArray.map((text) => ({
            text: text.trim(),
            checked: false,
          })),
          selectedOption: selectedOption,
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

  const validar = (id, survey_idt) => {
    var parametros;
    var metodo;
    console.log("??  ", singleChoiceData.correctAnswer);

    if (questionType.input.trim() === "" || description.input.trim() === "") {
      setError("Ingresa una pregunta valida.");
    } else {
      // Determinar los datos específicos según el tipo de pregunta
      let selectedAnswer, options, selectedAnswerToString, optionsToSave;

      if (questionType.input === "radio_opt") {
        selectedAnswer = singleChoiceData.correctAnswer;
        options = singleChoiceData.options;
        selectedAnswerToString = selectedAnswer
          ? selectedAnswer.toString()
          : "";
        optionsToSave = options.map((option) => option.text).join(", ");
      } else if (questionType.input === "check_opt") {
        selectedAnswer = multipleChoiceData.correctAnswers;
        options = multipleChoiceData.options;
        selectedAnswerToString = selectedAnswer.join(", ");
        optionsToSave = options.map((option) => option.text).join(", ");
      } else if (questionType.input === "selector_opt") {
        selectedAnswer = selectorData.selectedOption;
        options = selectorData.options;
        selectedAnswerToString = selectedAnswer
          ? selectedAnswer.toString()
          : "";
        optionsToSave = options.map((option) => option.text).join(", ");
      }

      if (operation === 1) {
        // Código para crear nueva pregunta
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
            questionType.input === "radio_opt" ||
            questionType.input === "selector_opt"
              ? selectedAnswerToString
              : " ",
          select_option:
            questionType.input === "check_opt" ||
            questionType.input === "radio_opt" ||
            questionType.input === "selector_opt"
              ? optionsToSave
              : "",
        };
        metodo = "post";
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
            questionType.input === "radio_opt" ||
            questionType.input === "selector_opt"
              ? selectedAnswerToString.length > 1
                ? selectedAnswerToString
                : selectedAnswerToString
              : null,
          select_option:
            questionType.input === "check_opt" ||
            questionType.input === "radio_opt" ||
            questionType.input === "selector_opt"
              ? optionsToSave
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
          updateSurveyQuestions();
          document.getElementById("btnClose").click();
          setValueConditional(false);
        })
        .catch((error) => {
          console.error("Error en la actualización de preguntas:", error);
        });
    }
  };

  const handleSingleChoiceChange = (updatedData) => {
    setSingleChoiceData(updatedData);
    console.log("updated Data:", singleChoiceData.correctAnswer);
  };

  const handleMultipleChoiceChange = (data) => {
    setMultipleChoiceData(data);
  };
  const handleSelectConditionalQuestionChange = (e) => {
    const selectedId = e.target.value; // Captura el value (question.id)
    const selectedType = e.target.selectedOptions[0].getAttribute("data-type");
    const selectedAnswers =
      e.target.selectedOptions[0].getAttribute("data-answers"); // Convertimos de vuelta a un array u objeto
    setSelectedRangeType({
      questionTypeRange: selectedType,
      answersRange: selectedAnswers,
    });
    id_conditional.handleChange(selectedId);
  };

  /* Selector Option */
  const rangeOptions = useMemo(
    () =>
      getRangeOptions(
        selectedRangeType.questionTypeRange,
        selectedRangeType.answersRange
      ),
    [selectedRangeType]
  );

  /*Agregar preguntas botón + Pregunta. Si el valor es 0 el botón por defecto crea una encuesta*/
  const addNewQuestion = () => {
    let count = parseInt(questionCountInput);

    // Validar que sea un número válido mayor o igual a 1
    if (isNaN(count) || count < 1) {
      count = 1;
    }

    const newQuestions = Array.from({ length: count }, () => ({
      text: "",
      type: "",
      options: [],
      correctAnswers: [],
    }));

    setQuestionsList((prev) => [...prev, ...newQuestions]);
    setQuestionCountInput(""); // Limpiar input si deseas
  };

  const handleInputChange = (index, field, value) => {
    const updatedQuestions = [...questionsList];
    updatedQuestions[index][field] = value;
    setQuestionsList(updatedQuestions);
  };

  // Validar el input de preguntas del modal

  const validateInputs = () => {
    // Validación de questionType: solo letras y guiones bajos
    const questionTypeValid = /^[A-Za-z_]+$/.test(questionType);
    const descriptionValid = description.trim() !== "";

    if (!questionTypeValid) {
      setError(
        "El tipo de pregunta no es válido. Solo se permiten letras y guiones bajos."
      );
      return false;
    }

    if (!descriptionValid) {
      setError("La descripción de la pregunta es obligatoria.");
      return false;
    }

    // Si pasa todas las validaciones
    setError(""); // Limpiar cualquier error previo
    return true;
  };

  // Función para manejar el envío de la pregunta
  const handleSubmit = () => {
    if (validateInputs()) {
      // Aquí puedes manejar el envío de los datos
      console.log("Pregunta válida. Enviar datos...");
    }
  };

  const handleSelectorChange = (data) => {
    setSelectorData(data);
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
                        onClick={() => openModal(1)}
                        data-bs-toggle="modal"
                        data-bs-target="#modalManageQuestion"
                      >
                        + Crear Bloque
                      </button>
                    </div>
                  </div>

                  <div className="card-body ui-sorteable">
                    {/* Código para traer datos del formulario Crear Bloque */}
                    {data.map((bloque) => (
                      <div key={bloque.id} className="shadowbox5 p-3 m-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h5 className="m-0">
                            {bloque.nombreBloque || "Bloque sin nombre"}
                          </h5>
                          <div className="dropdown">
                            <button
                              className="btn btn-outline-dark btn-sm dropdown-toggle"
                              type="button"
                              data-bs-toggle="dropdown"
                            >
                              ⋮
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() =>
                                    console.log("Editar bloque", bloque)
                                  }
                                >
                                  Editar
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() =>
                                    console.log("Eliminar bloque", bloque)
                                  }
                                >
                                  Eliminar
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <p className="mb-1">{bloque.question}</p>
                      </div>
                    ))}

                    {data.map((question) => (
                      <div
                        key={question.id}
                        className="callout callout info shadowbox5 p-3 m-3"
                      >
                        <div className="row ">
                          <div className="col-md-12 col-12"></div>
                        </div>

                        <div className="d-flex justify-content-between">
                          <h5 className="mt-2">{question.question}</h5>
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
                                <button
                                  className="dropdown-item"
                                  type="button"
                                  data-bs-toggle="modal"
                                  data-bs-target="#modalManageQuestion"
                                  onClick={() => openModal(2, id, question)}
                                >
                                  Editar
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item"
                                  type="button"
                                  onClick={() =>
                                    deleteQuestion(
                                      question,
                                      config,
                                      updateSurveyQuestions,
                                      t
                                    )
                                  }
                                >
                                  Eliminar
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>

                        {question.type == "yes_no" ? (
                          <Yes_no />
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

                        <div className="text-end me-3">
                          {question.conditional === "SI" ? (
                            <i
                              className="fa-solid fa-question text-primary"
                              data-bs-toggle="tooltip"
                              data-bs-placement="top"
                              data-bs-custom-class="custom-tooltip"
                              data-bs-title="This top tooltip is themed via CSS variables."
                            ></i>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    ))}
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
        <div
          className={`${
            operation === 1 ? "modal-dialog modal-xl" : ""
          } modal-dialog-centered modal-dialog-scrollable`}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="text-start m-2 modal-title">
                {title || "Crear Bloque de Formulario"}
              </h5>
            </div>
            <div className="modal-body">
              <div className="row position-relative">
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
                        value={nombreInput.input}
                        onChange={(e) =>
                          nombreInput.handleChange(e.target.value)
                        }
                        required
                      />
                      <span className="labelName">Nombre de bloque</span>
                    </label>
                  </div>

                  <div className="form-group m-2 mt-2 mb-4">
                    <label id="labelAnimation" htmlFor="question">
                      <input
                        type="text"
                        name="question"
                        id="question"
                        className="input-new"
                        placeholder=" "
                        value={ponderacionInput.input}
                        onChange={(e) =>
                          ponderacionInput.handleChange(e.target.value)
                        }
                        required
                      />
                      <span className="labelName">Ponderación</span>
                    </label>
                  </div>

                  <div className="form-group m-2 mt-2 mb-4">
                    <label id="labelAnimation" htmlFor="question">
                      <input
                        type="text"
                        name="question"
                        id="question"
                        className="input-new"
                        placeholder=" "
                        value={posicionInput.input}
                        onChange={(e) =>
                          posicionInput.handleChange(e.target.value)
                        }
                        required
                      />
                      <span className="labelName">Posición del bloque</span>
                    </label>
                  </div>

                  <div className="block-position">
                    <h5>Posición</h5>
                    <div className="d-flex gap-3 m-2">
                      <div className="form-group flex-fill">
                        <label htmlFor="select1" className="w-100">
                          <select>
                            <option value="0" hidden>
                              Antes
                            </option>
                            <option>Antes</option>
                            <option>Después</option>
                          </select>
                        </label>
                      </div>
                      <div className="form-group flex-fill">
                        <label htmlFor="select2" className="w-100">
                          <select>
                            <option value="0" hidden>
                              Comentarios
                            </option>
                            <option>Comentarios</option>
                            <option>Notas</option>
                          </select>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Línea divisoria */}
                <div className="vertical-divider"></div>

                {/* Columna derecha */}
                <div className="col-md-6">
                  {/* Botón para agregar preguntas */}
                  <div className="card-tools row ms-2">
                    {/* Input para cantidad de preguntas */}
                    <div class="col-sm-5">
                      <div className="form-group">
                        <label
                          htmlFor="questionConditional"
                          id="labelAnimation"
                        >
                          <input
                            type="number"
                            className="input-new conditionalQuestionSelect"
                            name="questionConditional"
                            id="questionConditional"
                            value={questionCountInput}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d*$/.test(value)) {
                                setQuestionCountInput(value);
                              }
                            }}
                          />
                          <span className="labelName">Número de preguntas</span>
                        </label>
                      </div>
                    </div>
                    <div class="col-auto">
                      <button
                        className="btn fw-bold btn-sm add-question-btn p-2"
                        onClick={addNewQuestion}
                      >
                        + Pregunta
                      </button>
                    </div>
                  </div>

                  {questionsList.map((q, index) => (
                    <div key={index} className="shadowbox5 p-2 m-3">
                      {/* Input para escribir el texto de la pregunta */}
                      <div className="form-group m-2">
                        <h5>Pregunta {index + 1}</h5>
                        <label id="labelAnimation">
                          <input
                            type="text"
                            className="input-new"
                            placeholder=""
                            value={q.text || ""}
                            onChange={(e) =>
                              handleInputChange(index, "text", e.target.value)
                            }
                          />
                          <span className="labelName">
                            Texto de la pregunta:
                          </span>
                        </label>
                      </div>

                      {/* Tipo de pregunta */}
                      <div className="form-group m-2">
                        <label
                          htmlFor={`questionType_${index}`}
                          id="labelAnimation"
                        >
                          <select
                            className="input-new text-center"
                            name={`questionType_${index}`}
                            id={`questionType_${index}`}
                            value={q.type}
                            onChange={(e) =>
                              handleInputChange(index, "type", e.target.value)
                            }
                          >
                            <option value="" disabled>
                              Seleccione opción
                            </option>
                            <option value="selector_opt">Seleccionador</option>
                            <option value="check_opt">
                              Selección múltiple
                            </option>
                            <option value="textfield_s">Campo de texto</option>
                          </select>
                          <span className="labelName">Tipo de pregunta:</span>
                        </label>
                      </div>

                      {/* Lógica para diferentes tipos de preguntas */}
                      {q.type === "selector_opt" && operation === 1 && (
                        <SelectorQuestion
                          options={selectorData.options}
                          selectedOption={selectorData.selectedOption}
                          onChange={handleSelectorChange}
                        />
                      )}

                      {operation === 1 && (
                        <div className="mt-2 mb-2">
                          {q.type === "yes_no" ? <Yes_no /> : null}
                          {q.type === "textfield_s" ? <Textfield_s /> : null}
                        </div>
                      )}

                      {operation === 2 && (
                        <>
                          <div className="form-check form-switch m-2">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`flexSwitchCheckChecked_${index}`}
                              checked={isChecked}
                              onChange={(e) =>
                                conditionalHandleChange(e.target.checked)
                              }
                            />
                          </div>

                          {isChecked && listConditional && valueConditional && (
                            <div
                              className="col-6 p-2 shadowbox5"
                              style={{ borderLeft: "5px solid gray" }}
                            >
                              {/* ... contenido condicional ... */}
                            </div>
                          )}
                        </>
                      )}

                      {error && (
                        <p className="text-danger text-center">{error}</p>
                      )}

                      {operation === 2 && (
                        <div className="mt-2 mb-2">
                          {q.type === "yes_no" ? <Yes_no /> : null}
                          {q.type === "textfield_s" ? <Textfield_s /> : null}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Footer del modal */}
            <div className="modal-footer">
              {questionType.input && (
                <button
                  className="btn bg-gradient-guardar mr-2"
                  id="btn-send-survey"
                  onClick={() => validar(idToEdit, id)}
                >
                  Guardar
                </button>
              )}
              <button
                className="btn btn-secondary"
                type="button"
                data-bs-dismiss="modal"
                id="btnClose"
                onClick={handleCancel}
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
