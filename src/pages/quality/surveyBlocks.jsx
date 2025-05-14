import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import HeaderLT1 from "../../components/header/headerLT1";
import axios from "axios";
import useInput from "../../components/hooks/useInput";
import { UserContext } from "../../context/UserContext";
import { useParams, useLocation } from "react-router-dom";
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
} from "../../pages/survey/singleChoiceQuestion";
import "../../assets/css/survey.css";
import {
  Yes_no,
  Textfield_s,
  SingleChoiceView,
  MultipleChoiceView,
} from "../survey/questions";
import {
  createBlock,
  getAllBlocks,
  updateBlock,
  deleteBlock,
} from "../../services/blockService";
import getRangeOptions from "../survey/conditional";
import "../../assets/css/surveyBlocks.css";
import ModalSurveyBlocks from "../../components/Modals/modalSurveyBlocks";
import Cookies from "js-cookie";
// import { position } from "html2canvas/dist/types/css/property-descriptors/position";

export default function SurveyBlocks({}) {
  const { id_form } = useParams();
  const location = useLocation();
  const [formData, setFormData] = useState(location.state?.form || null);
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
  // State para manejo de preguntas validas
  const [hasValidQuestions, setHasValidQuestions] = useState(false);
  const [textFieldAnswer, setTextFieldAnswer] = useState("");

  //Id bloque creado
  const [bloques, setBloques] = useState([]);

  // Paginador
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(3); // Número de bloques por página
  const [searchTerm, setSearchTerm] = useState(""); // Para filtrado
  const [staticData, setStaticData] = useState([]); // Copia de los datos para filtrado
  const blockRefs = useRef([]);

  // Estados para manejo de posicionamiento relativo de bloques
  const [positionType, setPositionType] = useState(""); // 'before' o 'after'
  const [referenceBlockId, setReferenceBlockId] = useState(""); // ID del bloque de referencia

  // Estados para manejo de bloques
  const [blocks, setBlocks] = useState([]);
  const [newBlock, setNewBlock] = useState({ name: "", textQuestion: "" });

  // Estado para los bloques de la encuesta
  const [surveyBlocks, setSurveyBlocks] = useState([]); 

  /* ***********************************************************************************************************/
  /* Component Logic*/
  /* ***********************************************************************************************************/

  // useEffect(() => {
  //   i18n.changeLanguage(languageUser);
  //   getSurvey(id_form, config, setSurveyData);
  //   updateSurveyQuestions();
  // }, [id_form, languageUser]);

  const fetchFormData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/form/${id_form}`,
        config
      );
      setFormData(response.data?.data || response.data);
    } catch (err) {
      console.error("Error al obtener datos del formulario:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Solo hacer fetch si no llegó por navegación
    if (!formData && id_form) {
      fetchFormData();
    }
  }, [id_form, formData]);

  useEffect(() => {
    setStaticData([...data]);
  }, [data]);

  useEffect(() => {
    // Verificar si hay al menos una pregunta con texto y tipo
    const hasValid = questionsList.some((q) => q.text && q.type);
    setHasValidQuestions(hasValid);

    // Si hay alguna pregunta válida, actualizar questionType
    if (hasValid) {
      const validQuestion = questionsList.find((q) => q.text && q.type);
      questionType.handleChange(validQuestion.type);
    }
  }, [questionsList]);

  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    withCredentials: true,
  };

  const updateSurveyQuestions = () => {
    getSurveyQuestions(id_form, config)
      .then(setData)
      .catch((error) => {
        console.error("Error al obtener las preguntas de la encuesta", error);
      });
  };

  const handleCancel = () => {
    setValueConditional(false);
    setIsChecked(false);
    setSingleChoiceData({ options: [], correctAnswer: null });
    setMultipleChoiceData({ options: [], correctAnswers: [] });
    setidToEdit(null);
    setQuestionsList([{ text: "", type: "", options: [], correctAnswers: [] }]);
    setHasValidQuestions(false);
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
      resetFormFields(); // Limpia todo el estado base
      setTitle("Crear Bloque");
      setDescriptionText("");
      description.handleChange("");
      questionType.handleChange("");
      section.handleChange("Na");
      percentage.handleChange("");
      frm_option.handleChange("Na");
      conditional.handleChange("NO");
      id_conditional.handleChange(0);
      conditional_answer.handleChange("NO");
      survey_id.handleChange(idsurvey);
      // Limpia inputs adicionales
      setQuestionCountInput(""); // limpia el input de cantidad de preguntas
      setSelectorData({ options: [], selectedOption: null }); // limpia selectores
      setSingleChoiceData({ options: [], correctAnswer: null });
      setMultipleChoiceData({ options: [], correctAnswers: [] });
      setSelectorData({ options: [], selectedOption: null });
      setQuestionsList([
        { text: "", type: "", options: [], correctAnswers: [] },
      ]);
      setHasValidQuestions(false);
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
        const optionsDataArray = optionsData ? optionsData.split(",") : [];
        const selectedOption = questionDetails?.selected_answer;

        setSelectorData({
          options: optionsDataArray.map((text) => ({
            text: text.trim(),
            checked: false,
          })),
          selectedOption: selectedOption,
        });

        // Actualizar QuestionsList

        setQuestionsList((prevQuestions) =>
          prevQuestions.map((q) => {
            if (q.type === "selector_opt") {
              return {
                ...q,
                options: optionsDataArray.map((text) => ({
                  text: text.trim(),
                  checked: false,
                })),
                selected_answer: selectedOption,
              };
            }
            return q;
          })
        );
      }

      id_conditional.handleChange(questionDetails?.id_conditional || null);
      conditional.handleChange(questionDetails?.conditional || "");
      description.handleChange(questionDetails?.question || "");
      questionType.handleChange(questionDetails?.type || "");
      conditional_answer.handleChange(
        questionDetails?.conditional_answer || ""
      );
      setidToEdit(questionDetails?.id);
      setQuestionsList(questionDetails?.preguntas || []);
    }

    const posiciones = data.map((bloque) => parseInt(bloque.posicion));
    const nuevaPosicion =
      posiciones.length > 0 ? Math.max(...posiciones) + 1 : 1;

    posicionInput.handleChange(nuevaPosicion.toString()); // Asigna internamente

    const preguntasConvertidas = (questionDetails.preguntas || []).map((p) => ({
      text: p.text || p.question || "", // usa el campo correcto
      type: p.type || "",
      options: p.options || [],
      correctAnswers: p.correctAnswers || [],
    }));

    setQuestionsList(preguntasConvertidas);
  };
  
  const validar = async (id, survey_idt) => {
    try {
      setError("");
      setLoading(true); // Mostrar indicador de carga

      // Preparar los datos según el tipo de pregunta
      let selectedAnswer, options, selectedAnswerToString, optionsToSave;

      switch (questionType.input) {
        case "radio_opt":
          selectedAnswer = singleChoiceData.correctAnswer;
          options = singleChoiceData.options;
          selectedAnswerToString = selectedAnswer
            ? selectedAnswer.toString()
            : "";
          optionsToSave = options.map((option) => option.text).join(", ");
          break;
        case "check_opt":
          selectedAnswer = multipleChoiceData.correctAnswers;
          options = multipleChoiceData.options;
          selectedAnswerToString = selectedAnswer.join(", ");
          optionsToSave = options.map((option) => option.text).join(", ");
          break;
        case "selector_opt":
          selectedAnswer = selectorData.selectedOption;
          options = selectorData.options;
          selectedAnswerToString = Array.isArray(selectedAnswer)
            ? selectedAnswer.join(", ")
            : selectedAnswer || "";
          optionsToSave = Array.isArray(options)
            ? options
                .map((option) =>
                  typeof option === "object" ? option.text : option
                )
                .join(", ")
            : "";
          break;
        case "textfield_s":
          selectedAnswer = textFieldAnswer;
          options = [];
          selectedAnswerToString = selectedAnswer
            ? selectedAnswer.toString()
            : "";
          optionsToSave = ""; // No hay opciones para este tipo de pregunta
          break;
        default:
          selectedAnswerToString = "";
          optionsToSave = "";
      }

      // Recargar opciones de pregunta antes de guardar
      const refillQuestions = questionsList.map((q) => {
        let select_option = "";
        let selected_answer = "";

        if (q.type === "radio_opt") {
          select_option = singleChoiceData.options
            .map((opt) => opt.text)
            .join(", ");
          selected_answer = singleChoiceData.correctAnswer?.toString() || "";
        } else if (q.type === "check_opt") {
          select_option = multipleChoiceData.options
            .map((opt) => opt.text)
            .join(", ");
          selected_answer = multipleChoiceData.correctAnswers.join(", ");
        } else if (q.type === "selector_opt") {
          select_option = (q.options || [])
            .map((opt) => (typeof opt === "object" ? opt.text : opt))
            .join(", ");
        }

        return {
          ...q,
          select_option,
          selected_answer,
        };
      });

      const newPositionBlock = calBlockPosition();
      let parametros;
      let response;

      // Procesar según la operación (crear o actualizar)
      if (operation === 1) {
        // Crear nuevo bloque
        parametros = {
          form_id: id_form,
          nombreBloque: nombreInput.input,
          ponderacion: parseInt(ponderacionInput.input || 0),
          position: newPositionBlock || 0,
          preguntas: refillQuestions,
          type:
            questionsList.length > 0 && questionsList[0].type
              ? questionsList[0].type
              : "",
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

        console.log(parametros);

        try {
          response = await axios.post(
            "http://localhost:3000/api/blocks",
            parametros,
            config
          );

          if (response.status === 201 || response.status === 200) {
            const newBlock = response.data;

            // Actualizar el estado con el nuevo bloque
            setData((prevData) => {
              const nuevosDatos = [...prevData, newBlock];
              // Ordenar los bloques por posición
              nuevosDatos.sort(
                (a, b) => parseInt(a.posicion) - parseInt(b.posicion)
              );
              return nuevosDatos;
            });

            // Mostrar mensaje de éxito
            Toast.fire({
              icon: "success",
              title: "Bloque creado exitosamente",
            });
            
            // Recargar los bloques
            // getSurveyBlocks();

            // Cerrar el modal y resetear el formulario
            document.getElementById("btnClose").click();
            handleCancel();
          }
        } catch (apiError) {
          console.error("Error al crear el bloque:", apiError);
          setError(
            apiError.response?.data?.message || "Error al crear el bloque"
          );
          Toast.fire({
            icon: "error",
            title:
              apiError.response?.data?.message || "Error al crear el bloque",
          });
        }
      } else if (operation === 2) {
        // Actualizar bloque existente
        parametros = {
          type: questionType.input,
          preguntas: refillQuestions,
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
              ? selectedAnswerToString
              : null,
          select_option:
            questionType.input === "check_opt" ||
            questionType.input === "radio_opt" ||
            questionType.input === "selector_opt"
              ? optionsToSave
              : null,
        };

        try {
          response = await axios.put(
            `http://localhost:3000/api/blocks/${idToEdit}`,
            parametros,
            config
          );

          if (response.status === 200) {
            const updatedBlock = response.data;

            // Actualizar los datos en el estado
            setData((prevData) =>
              prevData.map((b) =>
                b.id === idToEdit ? { ...b, ...updatedBlock } : b
              )
            );

            // Mostrar mensaje de éxito
            Toast.fire({
              icon: "success",
              title: "Bloque actualizado correctamente",
            });

            // Limpiar estado y cerrar modal
            setPositionType("");
            setReferenceBlockId("");
            document.getElementById("btnClose").click();
            setValueConditional(false);
            handleCancel();
          }
        } catch (apiError) {
          console.error("Error al actualizar el bloque:", apiError);
          setError(
            apiError.response?.data?.message || "Error al actualizar el bloque"
          );
          Toast.fire({
            icon: "error",
            title:
              apiError.response?.data?.message ||
              "Error al actualizar el bloque",
          });
        }
      }
    } catch (generalError) {
      console.error("Error general en la función validar:", generalError);
      setError("Ha ocurrido un error inesperado");
      Toast.fire({
        icon: "error",
        title: "Ha ocurrido un error inesperado",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSingleChoiceChange = (updatedData) => {
    setSingleChoiceData(updatedData);
    console.log("updated Data:", singleChoiceData.correctAnswer);
  };

  const handleMultipleChoiceChange = (data) => {
    setMultipleChoiceData(data)({
      options: data.options || [],
      correctAnswers: Array.isArray(data.correctAnswers)
        ? data.correctAnswers
        : [],
    });
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
    setQuestionCountInput(""); // Limpiar input
  };

  const handleInputChange = (index, key, value) => {
    const updatedQuestions = [...questionsList];
    updatedQuestions[index][key] = value;
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

  // Manejo el envío de pregunta
  const handleSubmit = () => {
    if (validateInputs()) {
      // Aquí puedes manejar el envío de los datos
      console.log("Pregunta válida. Enviar datos...");
    }
  };

  const handleSelectorChange = (data) => {
    setSelectorData(data);

    // Actualizar directamente en questionsList el tipo selector
    setQuestionsList((prevQuestions) =>
      prevQuestions.map((q, idx) => {
        if (q.type === "selector_opt") {
          return {
            ...q,
            options: data.options, // Guardar todas las opciones
            selected_answer: data.selectedOption, // Guardar la respuesta seleccionada
          };
        }
        return q;
      })
    );
  };

  const areAllFieldsCompleted = () => {
    // Verificación de nombre del bloque
    if (operation === 1 && nombreInput.input.trim() === "") {
      return false;
    }

    // Verificamos que existan preguntas
    if (questionsList.length === 0) {
      return false;
    }

    // Verificacióm para que cada pregunta tenga todos sus campos requeridos diligenciados
    const allQuestionsValid = questionsList.every((question) => {
      // Verificar que el texto de la pregunta no esté vacío
      if (!question.text || question.text.trim() === "") return false;

      // Verificar que tenga un tipo seleccionado
      if (!question.type || question.type === "") return false;

      // Verificaciones específicas según el tipo de pregunta
      if (question.type === "selector_opt") {
        // Si es un selector, debe tener opciones
        return selectorData.options && selectorData.options.length > 0;
      }

      if (question.type === "check_opt") {
        // Si es selección múltiple, debe tener opciones
        return (
          multipleChoiceData.options && multipleChoiceData.options.length > 0
        );
      }

      if (question.type === "radio_opt") {
        // Si es selección única, debe tener opciones
        return singleChoiceData.options && singleChoiceData.options.length > 0;
      }

      // Para campos de texto no es necesario verificar opciones adicionales
      return true;
    });

    // Si la operación es de edición, verificamos el tipo y descripción
    if (operation === 2) {
      return (
        questionType.input.trim() !== "" &&
        description.input.trim() !== "" &&
        allQuestionsValid
      );
    }

    return allQuestionsValid;
  };

  const resetFormFields = () => {
    nombreInput.handleChange("");
    ponderacionInput.handleChange("");
    posicionInput.handleChange("");
    questionType.handleChange("");
    description.handleChange("");
    section.handleChange("");
    percentage.handleChange("");
    frm_option.handleChange("");
    conditional.handleChange("");
    id_conditional.handleChange("0");
    survey_id.handleChange("");
    conditional_answer.handleChange("");
    setTextFieldAnswer("");

    // Limpiar estados de posicionamiento
    setPositionType("");
    setReferenceBlockId("");

    setQuestionCountInput("");
    setQuestionsList([{ text: "", type: "", options: [], correctAnswers: [] }]);
    setSelectorData({ options: [], selectedOption: null });
    setSingleChoiceData({ options: [], correctAnswer: null });
    setMultipleChoiceData({ options: [], correctAnswers: [] });
    setIsChecked(false);
    setValueConditional(false);
    setHasValidQuestions(false);
  };

  // Id único para cada bloque

  const handleAgregarBloque = () => {
    if (!nombreInput.value || !posicionInput.value || !ponderacionInput.value)
      return;

    const nuevaPosicion = calBlockPosition(); // Calcula la posición basada en los selects

    const nuevoBloque = {
      blockId: generateId(),
      nombre: nombreInput.value,
      posicion: nuevaPosicion,
      ponderacion: parseInt(ponderacionInput.value),
      preguntas: [],
    };

    setBloques((prev) => [...prev, nuevoBloque]);

    // Reset inputs
    nombreInput.reset();
    posicionInput.reset();
    ponderacionInput.reset();
  };

  const renderRespuesta = (question) => {
    const tipo = question.type;
    const respuesta = question.selected_answer || "Sin respuesta";

    switch (tipo) {
      case "textfield_s":
      case "yes_no":
        return (
          <p>
            <strong>Respuesta:</strong>{" "}
            {respuesta !== " " ? respuesta : "Sin respuesta"}
          </p>
        );

      case "radio_opt":
      case "check_opt":
      case "selector_opt":
        return (
          <div>
            <p>
              <strong>Respuesta:</strong> {respuesta}
            </p>
            {question.select_option && (
              <p>
                <small>
                  <strong>Opciones:</strong> {question.select_option}
                </small>
              </p>
            )}
          </div>
        );

      default:
        return (
          <p>
            <em>Tipo de pregunta no soportado</em>
          </p>
        );
    }
  };

  // Agregar función para manejar edición
  const onUpdate = (bloque) => {
    const preguntasBloque = bloque.preguntas || [];

    const bloqueConPreguntas = {
      ...bloque,
      preguntas: preguntasBloque,
    };
    openModal(2, id, bloqueConPreguntas);
    // Abrir modal después de configurar la data
    document.getElementById("modalManageQuestion").classList.add("show");
    document.getElementById("modalManageQuestion").style.display = "block";
  };

  // Paginador bloques

  const filteredData = useMemo(() => {
    return staticData.filter((row) => {
      if (!searchTerm) return true;

      const parsedSearchTerm = parseInt(searchTerm, 10);

      if (!isNaN(parsedSearchTerm) && row.id) {
        return row.id === parsedSearchTerm;
      }

      return Object.values(row).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [staticData, searchTerm]);

  // Calcular el total de páginas
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  // Datos paginados para mostrar en la vista actual
  const paginatedData = useMemo(() => {
    return filteredData.slice(
      (currentPage - 1) * recordsPerPage,
      currentPage * recordsPerPage
    );
  }, [filteredData, currentPage, recordsPerPage]);

  // Posición de bloques

  const calBlockPosition = () => {
    // Si no hay selección relativa, usar la posición por defecto (última posición + 1)
    if (!positionType || !referenceBlockId) {
      const posiciones = data.map((bloque) => parseInt(bloque.posicion));
      return posiciones.length > 0 ? Math.max(...posiciones) + 1 : 1;
    }

    // Encontrar el bloque de referencia
    const bloqueReferencia = data.find(
      (bloque) => bloque.id == referenceBlockId
    );
    if (!bloqueReferencia) return 1;

    const posicionReferencia = parseInt(bloqueReferencia.posicion);
    const nuevosDatos = [...data]; // Clonar el array para no mutar el original directamente

    // Calcular nueva posición basada en el tipo de posicionamiento
    const nuevaPosicion =
      positionType === "before" ? posicionReferencia : posicionReferencia + 1;

    // Actualizar posiciones de los bloques afectados
    nuevosDatos.forEach((bloque) => {
      const posBloque = parseInt(bloque.posicion);
      if (positionType === "before" && posBloque >= posicionReferencia) {
        bloque.posicion = posBloque + 1;
      } else if (positionType === "after" && posBloque > posicionReferencia) {
        bloque.posicion = posBloque + 1;
      }
    });

    // Actualizar solo el estado
    setData(nuevosDatos);

    return nuevaPosicion;
  };

  // Obtener bloques al cargar
  useEffect(() => {
    loadBlocks();
  }, []);

  const loadBlocks = async () => {
    try {
      const res = await getAllBlocks();
      setBlocks(res.data);
    } catch (err) {
      console.error("Error al cargar bloques:", err);
    }
  };

  // Crear bloque
  const handleCreate = async () => {
    try {
      const res = await createBlock(newBlock);
      setBlocks([...blocks, res.data.data]);
      setNewBlock({ name: "", textQuestion: "" });
    } catch (err) {
      console.error("Error al crear bloque:", err);
    }
  };

  //Actualizar bloque
  const handleUpdate = async (id, updatedFields) => {
    try {
      const res = await updateBlock(id, updatedFields);
      setBlocks(blocks.map((b) => (b.id === id ? res.data.data : b)));
    } catch (err) {
      console.error("Error al actualizar:", err);
    }
  };

  // Eliminar bloque
  const handleDelete = async (id) => {
    try {
      await deleteBlock(id);
      setBlocks(blocks.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  };
  // Elimina el bloque - pendiente por revisar**
  const onBulkEmail = (bloque) => {
    console.log("Eliminar bloque", bloque);
  };

  useEffect(() => {
    // Si no se recibió por navegación, hacer fetch
    if (!formData && id_form) {
      fetchFormData();
    }
  }, [id_form, formData]);

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
                      {formData ? (
                        <div className="row d-flex align-items-center">
                          <div className="col-6">
                            <p>
                              <b>Nombre del formulario: </b>
                              {formData.title}
                            </p>
                            <p className="fs-6">
                              <b>Descripción:</b> {formData.description}
                            </p>
                          </div>
                          <div className="col-6 text-end">
                            <p>
                              <b>Fecha de Creación:</b> {formData.creation_date}
                            </p>
                            <p className="fs-6">
                              <b>Última Actualización:</b>{" "}
                              {formData.updated_date || "Sin actualizar"}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-3">
                          <div
                            className="spinner-border text-secondary"
                            role="status"
                          >
                            <span className="visually-hidden">Cargando...</span>
                          </div>
                          <p className="mt-2">
                            Cargando información del formulario...
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-12 mt-3">
                <div className="card p-4 card-outline card-success borderEVA bg-light">
                  <div>
                    <h3 className="text-center">Preguntas</h3>
                    <div className="card-tools ms-4">
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
                    {paginatedData.map((bloque, index) => (
                      <div
                        key={index}
                        ref={(el) => (blockRefs.current[index] = el)}
                        className="shadowbox5 p-3 m-3"
                      >
                        <div className="d-flex justify-content-between mb-2 w-100">
                          <div className="w-100 ps-2">
                            <div className="d-flex justify-content-between align-items-start">
                              <h3 className="mb-3 ms-2">
                                {bloque.nombreBloque || "Bloque sin nombre"}
                              </h3>
                              <span className="text-muted block-weighting me-3">
                                {`${bloque.ponderacion}%` ||
                                  ("0" && bloque.ponderacion > 0)}
                              </span>
                            </div>

                            {/* Se agregan las preguntas a la vista principal */}

                            <div className="mt-2 d-flex flex-column align-items-center">
                              {Array.isArray(bloque.preguntas) &&
                                bloque.preguntas.map((preg, idx) => (
                                  <div
                                    key={idx}
                                    className="shadowbox5 p-3 mb-3"
                                    style={{ width: "100%" }}
                                  >
                                    <div className="d-flex justify-content-between align-items-center">
                                      <div className="w-100">
                                        <p className="mb-1 mb-3 text-center fs-4">
                                          <strong className="questionRender">
                                            Pregunta {idx + 1}:
                                          </strong>{" "}
                                          {preg.text || "Sin texto"}
                                        </p>

                                        {preg.type === "radio_opt" && (
                                          <div className="d-flex flex-column align-items-center">
                                            <SingleChoiceView
                                              options={preg.select_option}
                                              correctOption={
                                                preg.selected_answer
                                              }
                                            />
                                          </div>
                                        )}

                                        {preg.type === "check_opt" && (
                                          <div className="d-flex flex-column align-items-center">
                                            <MultipleChoiceView
                                              options={preg.select_option}
                                              correctOption={
                                                preg.selected_answer
                                              }
                                            />
                                          </div>
                                        )}

                                        {preg.type === "selector_opt" && (
                                          <div className="mb-1">
                                            <label className="form-label">
                                              <strong>
                                                Selecciona una opción:
                                              </strong>
                                            </label>
                                            <select className="form-select">
                                              {(preg.select_option || "")
                                                .split(",")
                                                .map((opt, idx) => {
                                                  const optionText = opt.trim();
                                                  return (
                                                    <option
                                                      key={idx}
                                                      value={optionText}
                                                      selected={
                                                        optionText ===
                                                        preg.selected_answer
                                                      }
                                                    >
                                                      {optionText}
                                                    </option>
                                                  );
                                                })}
                                            </select>
                                          </div>
                                        )}

                                        {preg.type === "textfield_s" && (
                                          <Textfield_s
                                            value={preg.answer || ""}
                                            readOnly
                                          />
                                        )}
                                        {preg.type === "yes_no" && (
                                          <Yes_no
                                            value={preg.answer || ""}
                                            readOnly
                                          />
                                        )}

                                        <div className="text-end me-3">
                                          {preg.conditional === "SI" && (
                                            <i
                                              className="fa-solid fa-question text-primary"
                                              data-bs-toggle="tooltip"
                                              data-bs-placement="top"
                                              data-bs-custom-class="custom-tooltip"
                                              data-bs-title="Esta pregunta es condicional."
                                            ></i>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}

                              <div className="d-flex">
                                <div
                                  className="page-selector btn-group"
                                  role="group"
                                >
                                  <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() =>
                                      setCurrentPage((prev) =>
                                        Math.max(prev - 1, 1)
                                      )
                                    }
                                    disabled={currentPage === 1}
                                  >
                                    &lt;
                                  </button>
                                  <span className="btn btn-outline-secondary">
                                    {currentPage || 1}
                                  </span>
                                  <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() =>
                                      setCurrentPage((prev) =>
                                        Math.min(prev + 1, totalPages)
                                      )
                                    }
                                    disabled={
                                      currentPage === totalPages ||
                                      totalPages === 0
                                    }
                                  >
                                    &gt;
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Menú de acciones (editar/eliminar) */}
                          <div className="dropdown">
                            <button
                              className="btn-rect btn-dropdown"
                              type="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <div className="dropdown-toggle">
                                <i className="fa-solid fa-ellipsis-vertical"></i>
                              </div>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end p-0">
                              <li className="text-start btn-rect">
                                <button
                                  className="btn text-start"
                                  style={{ width: "100%" }}
                                  data-bs-toggle="modal"
                                  onClick={() => onUpdate(bloque)}
                                >
                                  <i className="fa-solid fa-edit"></i> Editar
                                </button>
                              </li>
                              <li className="text-start btn-rect">
                                <button
                                  className="btn text-start"
                                  style={{ width: "100%" }}
                                  onClick={() => onBulkEmail(bloque)}
                                >
                                  <i className="fa-solid fa-trash"></i>{" "}
                                  <span>Eliminar</span>
                                </button>
                              </li>
                            </ul>
                          </div>
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
      <ModalSurveyBlocks
        operation={operation}
        title={title}
        descriptionText={descriptionText}
        questionsList={questionsList}
        handleInputChange={handleInputChange}
        singleChoiceData={singleChoiceData}
        multipleChoiceData={multipleChoiceData}
        selectorData={selectorData}
        handleSingleChoiceChange={handleSingleChoiceChange}
        handleMultipleChoiceChange={handleMultipleChoiceChange}
        handleSelectorChange={handleSelectorChange}
        isChecked={isChecked}
        listConditional={listConditional}
        valueConditional={valueConditional}
        conditionalHandleChange={conditionalHandleChange}
        error={error}
        validar={validar}
        idToEdit={idToEdit}
        id_form={id_form}
        areAllFieldsCompleted={areAllFieldsCompleted}
        handleCancel={handleCancel}
        addNewQuestion={addNewQuestion}
        questionCountInput={questionCountInput}
        setQuestionCountInput={setQuestionCountInput}
        nombreInput={nombreInput}
        ponderacionInput={ponderacionInput}
        posicionInput={posicionInput}
        positionType={positionType}
        setPositionType={setPositionType}
        referenceBlockId={referenceBlockId}
        setReferenceBlockId={setReferenceBlockId}
        data={data}
      />
    </div>
  );
}
