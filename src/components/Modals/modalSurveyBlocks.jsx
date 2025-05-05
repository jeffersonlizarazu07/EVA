import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import axios from "axios";
import useInput from "../../components/hooks/useInput";

import {
  smallAlertDelete,
  loadingAlert,
  Toast2,
  Toast,
} from "../../assets/js/alertConfig";

import {
  SingleChoiceQuestion,
  MultipleChoiceQuestion,
  MultipleChoiceQuestionEdit,
  SingleChoiceQuestionEdit,
  SelectorQuestion,
  SelectorQuestionEdit,
} from "../../pages/survey/singleChoiceQuestion";

import {
  Yes_no,
  Textfield_s,
  SingleChoiceView,
  MultipleChoiceView,
} from "../../pages/survey/questions";

import getRangeOptions from "../../pages/survey/conditional";

export const ModalSurveyBlocks = ({
  surveyId,
  data,
  setData,
  positionType,
  referenceBlockId,
  updateSurveyQuestions,
  onClose,
  config,
  existingQuestions,
  questionDetails,
  isOpen,
  mode,
  bloqueData,
}) => {
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  const [idToEdit, setidToEdit] = useState(null);
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
  const [hasValidQuestions, setHasValidQuestions] = useState(false);
  const [textFieldAnswer, setTextFieldAnswer] = useState("");

  const [questionsList, setQuestionsList] = useState([
    {
      text: "",
      type: "",
      options: [],
      correctAnswers: [],
    },
  ]);

  const [questionCountInput, setQuestionCountInput] = useState("");
  const [error, setError] = useState("");

  /* ***********************************************************************************************************/
  /* Component Logic*/
  /* ***********************************************************************************************************/

  // Verificar si hay preguntas válidas
  useEffect(() => {
    // Verificar si existe al menos una pregunta con texto y tipo
    const hasValid = questionsList.some((q) => q.text && q.type);
    setHasValidQuestions(hasValid);
    // Si hay alguna pregunta válida, actualizar questionType
    if (hasValid) {
      const validQuestion = questionsList.find((q) => q.text && q.type);
      questionType.handleChange(validQuestion.type);
    }
  }, [questionsList]);

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

  const conditionalHandleChange = (e) => {
    const conditional = e;
    setIsChecked(conditional);
    setValueConditional(conditional);
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

  useEffect(() => {
    if (!isOpen) return;

    setOperation(mode);

    if (mode === 1) {
      resetFormFields(); // Limpia todos los inputs y estados personalizados

      setTitle("Crear Bloque");
      setDescriptionText("");

      // Limpia valores de campos individuales
      description.handleChange("");
      questionType.handleChange("");
      section.handleChange("Na");
      percentage.handleChange("");
      frm_option.handleChange("Na");
      conditional.handleChange("NO");
      id_conditional.handleChange(0);
      conditional_answer.handleChange("NO");
      survey_id.handleChange(surveyId); // Se recibe desde props

      // Limpia campos específicos
      setQuestionCountInput("");
      setSelectorData({ options: [], selectedOption: null });
      setSingleChoiceData({ options: [], correctAnswer: null });
      setMultipleChoiceData({ options: [], correctAnswers: [] });
      setQuestionsList([
        { text: "", type: "", options: [], correctAnswers: [] },
      ]);
      setHasValidQuestions(false);
      setIsChecked(false);
      setValueConditional(false);

      // Asigna nueva posición automática
      const posiciones = data.map((bloque) => parseInt(bloque.posicion));
      const nuevaPosicion =
        posiciones.length > 0 ? Math.max(...posiciones) + 1 : 1;
      posicionInput.handleChange(nuevaPosicion.toString());
    }

    if (mode === 2 && bloqueData) {
      console.log("Bloque cargado:", bloqueData);
      console.log("Preguntas convertidas:", preguntasConvertidas);
      
      setTitle("Editar pregunta");
      setDescriptionText("Modifica la pregunta de acuerdo a tus necesidades.");

      // Limpiar datos previos
      setSingleChoiceData({ options: [], correctAnswer: null });
      setMultipleChoiceData({ options: [], correctAnswers: [] });

      // Condicionalidad
      const isConditional = bloqueData.conditional === "SI";
      setValueConditional(isConditional);
      setIsChecked(isConditional);

      // Manejo según tipo
      if (bloqueData.type === "check_opt") {
        const options = bloqueData.select_option?.split(",") || [];
        const answers = bloqueData.selected_answer?.split(",") || [];
        setMultipleChoiceData({
          options,
          correctAnswers: answers,
        });
      }

      if (bloqueData.type === "radio_opt") {
        const options = bloqueData.select_option?.split(",") || [];
        const answer = bloqueData.selected_answer?.split(",") || [];
        setSingleChoiceData({
          options,
          correctAnswer: answer,
        });
      }

      if (bloqueData.type === "selector_opt") {
        const options = bloqueData.select_option?.split(",") || [];
        const selectedOption = bloqueData.selected_answer || "";

        const formattedOptions = options.map((text) => ({
          text: text.trim(),
          checked: false,
        }));

        setSelectorData({
          options: formattedOptions,
          selectedOption,
        });

        // Opcional: si también quieres reflejar en questionsList
        setQuestionsList((prev) =>
          prev.map((q) =>
            q.type === "selector_opt"
              ? {
                  ...q,
                  options: formattedOptions,
                  selected_answer: selectedOption,
                }
              : q
          )
        );
      }

      // Inputs individuales
      id_conditional.handleChange(bloqueData.id_conditional || null);
      conditional.handleChange(bloqueData.conditional || "");
      description.handleChange(bloqueData.question || "");
      questionType.handleChange(bloqueData.type || "");
      conditional_answer.handleChange(bloqueData.conditional_answer || "");
      setidToEdit(bloqueData.id);

      // Posición
      const posiciones = data.map((bloque) => parseInt(bloque.posicion));
      const nuevaPosicion =
        posiciones.length > 0 ? Math.max(...posiciones) + 1 : 1;
      posicionInput.handleChange(nuevaPosicion.toString());

      // Establecer preguntas convertidas
      const preguntasConvertidas = (bloqueData.preguntas || []).map((p) => ({
        text: p.text || p.question || "",
        type: p.type || "",
        options: p.options || [],
        correctAnswers: p.correctAnswers || [],
      }));
      setQuestionsList(preguntasConvertidas);
    }
  }, [isOpen, mode, bloqueData]);

  // Función para validar datos antes de guardar
  const validar = (id, survey_idt) => {
    // Array para almacenar errores
    var parametros;
    var metodo;

    setError("");

    let selectedAnswer, options, selectedAnswerToString, optionsToSave;

    if (questionType.input === "radio_opt") {
      selectedAnswer = singleChoiceData.correctAnswer;
      options = singleChoiceData.options;
      selectedAnswerToString = selectedAnswer ? selectedAnswer.toString() : "";
      optionsToSave = options.map((option) => option.text).join(", ");
    } else if (questionType.input === "check_opt") {
      selectedAnswer = multipleChoiceData.correctAnswers;
      options = multipleChoiceData.options;
      selectedAnswerToString = selectedAnswer.join(", ");
      optionsToSave = options.map((option) => option.text).join(", ");
    } else if (questionType.input === "selector_opt") {
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
    } else if (questionType.input === "textfield_s") {
      selectedAnswer = textFieldAnswer;
      options = [];
      selectedAnswerToString = selectedAnswer ? selectedAnswer.toString() : "";
      optionsToSave = ""; // No hay opciones para este tipo de pregunta
    }

    // Recargar de opciones de pregunta antes de guardar

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

    if (operation === 1) {
      // Crear nuevo bloque
      parametros = {
        id: Date.now(), // Genera un ID único para el localStorage
        nombreBloque: nombreInput.input,
        ponderacion: ponderacionInput.input || 0,
        posicion: newPositionBlock || 0,
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
      metodo = "post";

      let nuevosDatos;
      if (positionType && referenceBlockId) {
        // Si hay un bloque de referencia y un tipo de posición, reordenar los bloques
        nuevosDatos = [...data, parametros]; // Clonar el array para no mutar el original directamente
        nuevosDatos.push(parametros); // Agregar el nuevo bloque al array

        // ordenar por posición asignada
        nuevosDatos.sort((a, b) => parseInt(a.posicion) - parseInt(b.posicion));
      } else {
        // Si no hay un bloque de referencia, simplemente agregar el nuevo bloque al final
        nuevosDatos = [...data, parametros]; // Clonar el array para no mutar el original directamente
      }

      setData(nuevosDatos); // Actualiza el estado de bloques en pantalla
      localStorage.setItem("bloquesGuardados", JSON.stringify(nuevosDatos)); // Guarda en localStorage

      // Reordenar todos los bloques por su campo `posicion`
      nuevosDatos.sort((a, b) => parseInt(a.posicion) - parseInt(b.posicion));

      // Asignar posiciones consecutivas para evitar duplicadas o saltos
      const bloquesReordenados = nuevosDatos.map((bloque, index) => ({
        ...bloque,
        posicion: index + 1,
      }));

      setData(bloquesReordenados);
      localStorage.setItem(
        "bloquesGuardados",
        JSON.stringify(bloquesReordenados)
      );

      localStorage.setItem("bloquesGuardados", JSON.stringify(nuevosDatos));
    } else if (operation === 2) {
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

      const nuevosDatos = data.map((b) =>
        b.id === idToEdit ? { ...b, ...parametros } : b
      );
      setData(nuevosDatos);
      localStorage.setItem("bloquesGuardados", JSON.stringify(nuevosDatos));
    }

    console.log("Parámetros a guardar:", parametros);

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
        // // Actualizar preguntas después de la llamada a sendData
        // const nuevosDatos = [...data, parametros];
        // setData(nuevosDatos); // Actualiza el estado de bloques en pantalla
        // localStorage.setItem("bloquesGuardados", JSON.stringify(nuevosDatos)); // Guarda en localStorage
        updateSurveyQuestions(); // Actualiza la lista de preguntas en el componente
        Toast.fire({
          icon: "success",
          title: "Bloque guardado correctamente",
        });

        setPositionType(""); // Limpiar tipo de posición
        setReferenceBlockId(""); // Limpiar bloque de referencia

        document.getElementById("btnClose").click();
        setValueConditional(false);
        setPositionType(""); // Limpiar tipo de posición
        // setReferenceBlockId(""); // Limpiar bloque de referencia
        handleCancel(); // Limpiar formulario
      })
      .catch((error) => {
        console.error("Error en la actualización de preguntas:", error);
      });
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

  // Localstorage temporal

  // Leer al iniciar
  useEffect(() => {
    const bloques = localStorage.getItem("bloquesGuardados");
    if (bloques) {
      const bloquesData = JSON.parse(bloques);
      // Ordenar bloques por posición
      bloquesData.sort((a, b) => parseInt(a.posicion) - parseInt(b.posicion));
      setData(bloquesData);
    }
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      localStorage.setItem("bloquesGuardados", JSON.stringify(data));
    }
  }, [data]);

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

    // Actualizar el estado y el localStorage con los bloques reordenados
    setData(nuevosDatos);
    localStorage.setItem("bloquesGuardados", JSON.stringify(nuevosDatos));

    return nuevaPosicion;
  };

  return (
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
                      onChange={(e) => nombreInput.handleChange(e.target.value)}
                      required
                    />
                    <span className="labelName">Nombre de bloque</span>
                  </label>
                </div>

                <div className="form-group m-2 mt-2 mb-4">
                  <label id="labelAnimation" htmlFor="question">
                    <input
                      type="number"
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

                <div className="block-position mb-4">
                  <h5 className="mb-3">Posición del bloque</h5>
                  <div className="d-flex gap-3 m-2">
                    <div className="form-group flex-fill">
                      <label
                        htmlFor="positionTypeSelect"
                        className="form-label"
                      ></label>
                      <select
                        id="positionTypeSelect"
                        className="form-select"
                        value={positionType}
                        onChange={(e) =>
                          setPositionType(e.target.value.toLowerCase())
                        }
                      >
                        <option value="" hidden>
                          Seleccione posición
                        </option>
                        <option value="before">⬆️ Antes de</option>
                        <option value="after">⬇️ Después de</option>
                      </select>
                    </div>
                    <div className="form-group flex-fill">
                      <label
                        htmlFor="referenceBlock"
                        className="form-label"
                      ></label>
                      <select
                        id="referenceBlock"
                        className="form-select"
                        value={referenceBlockId || ""}
                        onChange={(e) => setReferenceBlockId(e.target.value)}
                        disabled={!positionType}
                      >
                        <option value="" hidden>
                          Seleccione bloque
                        </option>
                        {data.map((bloque) => (
                          <option key={bloque.id} value={bloque.id}>
                            {`Bloque ${bloque.posicion}: ${
                              bloque.nombreBloque || "Sin nombre"
                            }`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {positionType && referenceBlockId && (
                    <div className="alert alert-info mt-3">
                      <i className="fa-solid fa-info-circle me-2"></i>
                      El bloque se colocará{" "}
                      {positionType === "before"
                        ? "antes del"
                        : "después del"}{" "}
                      bloque seleccionado y se actualizarán automáticamente las
                      posiciones de los demás bloques.
                    </div>
                  )}
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
                      <label htmlFor="questionConditional" id="labelAnimation">
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
                        <span className="labelName">Texto de la pregunta:</span>
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
                          <option value="check_opt">Selección múltiple</option>
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
                        {q.type === "yes_no" && <Yes_no />}
                        {q.type === "textfield_s" && <Textfield_s />}
                        {q.type === "radio_opt" && (
                          <SingleChoiceQuestion
                            options={singleChoiceData.options}
                            correctOption={singleChoiceData.correctAnswer}
                            onChange={handleSingleChoiceChange}
                          />
                        )}
                        {q.type === "check_opt" && (
                          <MultipleChoiceQuestion
                            options={multipleChoiceData.options || []}
                            correctAnswers={
                              Array.isArray(multipleChoiceData.correctAnswers)
                                ? multipleChoiceData.correctAnswers
                                : []
                            }
                            onChange={handleMultipleChoiceChange}
                          />
                        )}
                      </div>
                    )}

                    {operation === 2 && (
                      <>
                        <div className="form-check form-switch">
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
                          ></div>
                        )}
                      </>
                    )}

                    {error && (
                      <p className="text-danger text-center">{error}</p>
                    )}

                    {operation === 2 && (
                      <div className="mt-2 mb-2">
                        {q.type === "yes_no" && <Yes_no />}
                        {q.type === "textfield_s" && <Textfield_s />}
                        {q.type === "radio_opt" && (
                          <SingleChoiceQuestionEdit
                            options={singleChoiceData.options}
                            correctOption={singleChoiceData.correctAnswer}
                            onChange={handleSingleChoiceChange}
                          />
                        )}
                        {q.type === "check_opt" && (
                          <MultipleChoiceQuestionEdit
                            options={multipleChoiceData.options || []}
                            correctAnswers={
                              Array.isArray(multipleChoiceData.correctAnswers)
                                ? multipleChoiceData.correctAnswers
                                : []
                            }
                            onChange={handleMultipleChoiceChange}
                          />
                        )}
                        {q.type === "selector_opt" && (
                          <SelectorQuestionEdit
                            options={selectorData.options}
                            selectedOption={selectorData.selectedOption}
                            onChange={handleSelectorChange}
                          />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Footer del modal */}
          <div className="modal-footer">
            <button
              className="btn bg-gradient-guardar mr-2"
              id="btn-send-survey"
              onClick={() => validar(idToEdit, id)}
              disabled={!areAllFieldsCompleted()}
            >
              Guardar
            </button>
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
  );
};
