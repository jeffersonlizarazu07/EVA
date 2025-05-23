import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
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
  getBlocksByFormId,
  getBlockById,
} from "../../services/blockService";
import {
  createQuestions,
  getQuestionsByBlockId,
  updateQuestions,
} from "../../services/questionsFormService";
import AnswersFormService from "../../services/answersFormService";
import getRangeOptions from "../survey/conditional";
import "../../assets/css/surveyBlocks.css";
import ModalSurveyBlocks from "../../components/Modals/modalSurveyBlocks";
import Cookies from "js-cookie";

export default function SurveyBlocks({}) {
  const { id_form } = useParams();
  const [formData, setFormData] = useState(null);
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

  //formulario
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
    if (Array.isArray(data)) {
      setStaticData([...data]);
      console.log("Static data actualizado", data);
    } else {
      console.warn("La variable 'data' no es un array:", data);
      setStaticData([]); // opcionalmente deja un arreglo vacío
    }
  }, [data]);

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

  // useEffect(() => {
  //   const hasValid = questionsList.some((q) => q.text && q.type);
  //   setHasValidQuestions(hasValid);

  //   // Solo actualiza questionType si está vacío y existe una pregunta válida
  //   if (hasValid && !questionType.input) {
  //     const validQuestion = questionsList.find((q) => q.text && q.type);
  //     if (validQuestion) {
  //       questionType.handleChange(validQuestion.type);
  //     }
  //   }
  // }, [questionsList]);

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
      setTitle("Editar bloque");
      // Cargar datos básicos del bloque
      nombreInput.handleChange(
        questionDetails.block_name || questionDetails.nombre || ""
      );
      ponderacionInput.handleChange(
        (
          questionDetails.percentage ||
          questionDetails.ponderacion ||
          0
        ).toString()
      );
      posicionInput.handleChange(
        (
          questionDetails.block_location ||
          questionDetails.posicion ||
          0
        ).toString()
      );
      if (questionDetails.conditional == "SI") {
        setValueConditional(true);
        setIsChecked(true);
      } else {
        setValueConditional(false);
        setIsChecked(false);
      }

      if (
        questionDetails.preguntas &&
        Array.isArray(questionDetails.preguntas)
      ) {
        const preguntasFormateadas = questionDetails.preguntas.map((p) => ({
          text: p.text || p.question_name || "",
          type: p.type || "",
          options:
            p.options ||
            (p.select_option
              ? p.select_option.split(",").map((o) => o.trim())
              : []),
          correctAnswers: p.correctAnswers || [],
          selected_answer: p.selected_answer || "",
          conditional: p.conditional || "NO",
        }));

        setQuestionsList(preguntasFormateadas);
      }
      setidToEdit(questionDetails.id);
    }

    // Calcular posición para nuevos bloques
    const posiciones = data.map((bloque) =>
      parseInt(bloque.block_location || bloque.posicion || 0)
    );
    const nuevaPosicion =
      posiciones.length > 0 ? Math.max(...posiciones) + 1 : 1;

    if (op === 1) {
      posicionInput.handleChange(nuevaPosicion.toString());
    }
  };

  const validar = async (idToEdit, id_form) => {
    try {
      setError("");
      setLoading(true);

      console.log("questionsList para actualizar:", questionsList);

      // Preparar preguntas con respuestas/selecciones integradas
      const typeMap = {
        radio_opt: 1,
        selector_opt: 2,
        textfield_s: 3,
      };

      const refillQuestions = questionsList.map((q) => {
        let select_option = "";
        let selected_answer = "";

        // Procesar opciones y respuestas según tipo de pregunta
        if (
          q.type === "radio_opt" ||
          q.type === "check_opt" ||
          q.type === "selector_opt"
        ) {
          select_option = Array.isArray(q.options)
            ? q.options
                .map((opt) => (typeof opt === "object" ? opt.text : opt))
                .join(",")
            : "";

          selected_answer =
            q.selected_answer ||
            (Array.isArray(q.correctAnswers)
              ? q.correctAnswers.join(",")
              : q.correctAnswer) ||
            "";
        } else if (q.type === "textfield_s") {
          select_option = "";
          selected_answer = q.selected_answer || "";
        }

        return {
          question_name: q.text || q.question || "Sin texto",
          id_type_question: q.type,
          select_option,
          selected_answer,
          conditional: q.conditional || "NO",
          id_conditional: q.id_conditional || null,
          conditional_answer: q.conditional_answer || "",
        };
      });

      // Calcular la posición del bloque
      const newPositionBlock = calBlockPosition();

      // Crear bloque
      if (operation === 1) {
        const parametros = {
          form_id: id_form,
          nombreBloque: nombreInput.input,
          ponderacion: parseInt(ponderacionInput.input || 0),
          position: newPositionBlock || 0,
        };

        try {
          const response = await axios.post(
            "http://localhost:3000/api/blocks",
            parametros,
            config
          );

          if (response.status === 201 || response.status === 200) {
            const newBlock = response.data;

            if (refillQuestions.length > 0) {
              const responseQuestions = await createQuestions(
                newBlock.id,
                refillQuestions
              );
              const questionIds = responseQuestions;

              if (!questionIds || !Array.isArray(questionIds)) {
                // Enviar respuestas vinculadas a cada pregunta
                for (let i = 0; i < refillQuestions.length; i++) {
                  const question = refillQuestions[i];
                  const questionId = questionIds[i];

                  if (!questionId) {
                    continue;
                  }

                  // Acceder a la respuesta correcta según el tipo de pregunta
                  let answer = "";

                  if (
                    question.type === "radio_opt" ||
                    question.type === "selector_opt"
                  ) {
                    answer = question.selected_answer || "";
                  } else if (question.type === "check_opt") {
                    answer = Array.isArray(question.selected_answers)
                      ? question.selected_answers.join(", ")
                      : "";
                  } else if (question.type === "textfield_s") {
                    // Decidir si se quiere guardar o no.
                    answer = question.selected_answer || "";
                  }

                  if (answer.trim() !== "") {
                    try {
                      await AnswersFormService.createAnswer({
                        question_id: questionId,
                        answer_question: answer,
                      });
                    } catch (err) {
                      console.error(
                        `Error al guardar respuesta "${answer}":`,
                        err
                      );
                    }
                  }
                }
                console.log("📤 Preguntas a guardar:", refillQuestions);

                // Actualizar el bloque con las preguntas vinculadas
                const updatedBlocks = await getBlocksByFormId(id_form);
                setData(updatedBlocks.data.data);
                console.log("Bloques actualizados:", updatedBlocks.data.data);
              }
            }

            await loadBlocks(); // Cargar bloques después de crear uno nuevo

            Toast.fire({
              icon: "success",
              title: "Bloque creado exitosamente",
            });

            document.getElementById("btnClose").click();
            handleCancel();
          }
        } catch (apiError) {
          console.error("Error al crear el bloque:", apiError);
          setError(
            apiError.response?.data?.message ||
              apiError.message ||
              "Error al crear el bloque"
          );
          Toast.fire({
            icon: "error",
            title:
              apiError.response?.data?.message ||
              apiError.message ||
              "Error al crear el bloque",
          });
        }
      }

      // Editar bloque
      else if (operation === 2) {
        const parametros = {
          block_name: nombreInput.input,
          percentage: parseInt(ponderacionInput.input || 0),
          block_location: posicionInput.input || 0,
        };

        try {
          const response = await axios.put(
            `http://localhost:3000/api/blocks/${idToEdit}`,
            parametros,
            config
          );

          if (response.status === 200) {
            // Actualizar preguntas si existen
            if (refillQuestions.length > 0) {
              console.log("Actualizando preguntas del bloque...");
              await updateQuestions(idToEdit, refillQuestions);
            }

            await loadBlocks(); // Cargar bloques después de editar uno existente

            Toast.fire({
              icon: "success",
              title: "Bloque actualizado correctamente",
            });
            document.getElementById("btnClose").click();
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

  // Actualiza las preguntas de un bloque específico
  const updateQuestionsForBlock = async (blockId, preguntas) => {
    try {
      console.log("Actualizando preguntas para bloque:", blockId);
      console.log("Preguntas a actualizar:", preguntas);

      // Llamar al servicio de actualización de preguntas
      const response = await updateQuestions(blockId, preguntas);

      if (response.status === 200) {
        console.log("Preguntas actualizadas exitosamente");
        return { success: true };
      }
    } catch (error) {
      console.error("Error al actualizar preguntas del bloque:", error);
      throw error;
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

    setQuestionsList((prevQuestions) => {
      const updatedQuestions = prevQuestions.map((q) => {
        if (q.type === "selector_opt") {
          const hasChanged =
            JSON.stringify(q.options) !== JSON.stringify(data.options) ||
            q.selected_answer !== data.selectedOption;

          if (hasChanged) {
            return {
              ...q,
              options: data.options,
              selected_answer: data.selectedOption,
            };
          }
        }
        return q;
      });

      // Evitar actualizar si no hubo cambios reales
      const isDifferent =
        JSON.stringify(updatedQuestions) !== JSON.stringify(prevQuestions);
      return isDifferent ? updatedQuestions : prevQuestions;
    });
  };

  const areAllFieldsCompleted = () => {
    const basicBlocksInputs =
      nombreInput.input.trim() !== "" &&
      ponderacionInput.input.trim() !== "" &&
      posicionInput.input.trim() !== "";

    // Si está en modo edición (operation === 2), solo validamos los campos del bloque
    if (operation === 2) {
      return basicBlocksInputs;
    }

    // En creación, se requiere al menos una pregunta válida
    if (questionsList.length === 0) {
      return false;
    }

    // Validación completa de preguntas solo para creación
    const allQuestionsValid = questionsList.every((question) => {
      if (!question.text || question.text.trim() === "") return false;
      if (!question.type || question.type === "") return false;

      if (question.type === "selector_opt") {
        return selectorData.options && selectorData.options.length > 0;
      }

      if (question.type === "check_opt") {
        return (
          multipleChoiceData.options && multipleChoiceData.options.length > 0
        );
      }

      if (question.type === "radio_opt") {
        return singleChoiceData.options && singleChoiceData.options.length > 0;
      }

      return true; // Campo de texto, yes_no, etc.
    });

    return basicBlocksInputs && allQuestionsValid;
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

  // Obtener preguntas por ID de bloque (si no existe)
  const getQuestionsByBlockId = async (blockId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/questions/block/${blockId}`,
        config
      );
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error("Error al obtener preguntas del bloque:", error);
      return [];
    }
  };

  // Agregar función para manejar edición
  const onUpdate = async (bloque) => {
    try {
      // Obtener datos frescos del bloque con sus preguntas
      const response = await getBlockById(bloque.id);
      const bloqueCompleto = response.data;

      // Si el bloque no tiene preguntas cargadas, obtenerlas
      if (!bloqueCompleto.preguntas || bloqueCompleto.preguntas.length === 0) {
        const preguntasResponse = await getQuestionsByBlockId(bloque.id);
        bloqueCompleto.preguntas = preguntasResponse || [];
      }

      openModal(2, id_form, bloqueCompleto);

      // Mostrar el modal
      const modal = document.getElementById("modalManageQuestion");
      if (modal) {
        modal.classList.add("show");
        modal.style.display = "block";
      }
    } catch (error) {
      console.error("Error al obtener datos del bloque:", error);
      Toast.fire({
        icon: "error",
        title: "Error al cargar los datos del bloque",
      });
    }
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
    if (!positionType || !referenceBlockId) {
      const posiciones = data.map((bloque) => parseInt(bloque.posicion));
      return posiciones.length > 0 ? Math.max(...posiciones) + 1 : 1;
    }

    const bloqueReferencia = data.find(
      (bloque) => bloque.id == referenceBlockId
    );
    if (!bloqueReferencia) return 1;

    const posicionReferencia = parseInt(bloqueReferencia.posicion);
    const nuevosDatos = [...data];

    const nuevaPosicion =
      positionType === "before" ? posicionReferencia : posicionReferencia + 1;

    // Actualizar solo el estado
    setData(nuevosDatos);

    return nuevaPosicion; // 🔁 Aquí estaba el problema: no retornaba nada
  };

  // Obtener bloques al cargar
  useEffect(() => {
    if (id_form) {
      loadBlocks();
      // Datos del formulario
      if (!formData) {
        fetchFormData();
      }
    }
  }, [id_form]); // Solo depende de id_form

  const loadBlocks = async () => {
    if (!id_form) {
      console.warn("No hay id_form disponible para cargar bloques");
      return;
    }

    try {
      setLoading(true);
      const res = await getBlocksByFormId(id_form);

      // Verificar que la respuesta tenga la estructura esperada
      const blocksData = res.data?.data || res.data || [];

      if (!Array.isArray(blocksData)) {
        console.warn("La respuesta del servidor no es un array:", blocksData);
        setData([]);
        return;
      }

      const bloquesMapeados = blocksData.map((bloque) => {
        // Mapear preguntas si existen
        const preguntasMapeadas = Array.isArray(bloque.preguntas)
          ? bloque.preguntas.map((preg) => {
              const opciones = preg.select_option
                ? preg.select_option.split(",").map((o) => o.trim())
                : [];

              let tipo = preg.type || "";
              if (!tipo && preg.id_type_question) {
                const typeMap = {
                  1: "radio_opt",
                  2: "selector_opt",
                  3: "textfield_s",
                  4: "check_opt",
                  5: "yes_no",
                };
                tipo = typeMap[preg.id_type_question] || "unknown";
              }

              return {
                id: preg.id,
                text: preg.text || preg.question_name || "Sin texto",
                type: tipo,
                options: opciones,
                select_option: preg.select_option || "",
                selected_answer:
                  preg.conditional_answer || preg.selected_answer || "",
                conditional: preg.conditional || "NO",
                question_name: preg.question_name || preg.text || "Sin texto",
              };
            })
          : [];

        return {
          id: bloque.id,
          block_name: bloque.block_name || bloque.nombre || "Sin nombre",
          percentage: bloque.percentage || bloque.ponderacion || 0,
          block_location: bloque.block_location || bloque.posicion || 0,
          form_id: bloque.form_id,
          preguntas: preguntasMapeadas,
          // Mantener propiedades adicionales por compatibilidad
          nombre: bloque.block_name || bloque.nombre,
          ponderacion: bloque.percentage || bloque.ponderacion,
          posicion: bloque.block_location || bloque.posicion,
        };
      });

      console.log("Bloques mapeados correctamente:", bloquesMapeados);

      // Ordenar por posición
      bloquesMapeados.sort(
        (a, b) =>
          (a.block_location || a.posicion || 0) -
          (b.block_location || b.posicion || 0)
      );

      setData(bloquesMapeados);

      // También actualizar staticData para el filtrado y paginación
      setStaticData(bloquesMapeados);
    } catch (err) {
      console.error("Error al cargar bloques:", err);
      setError("Error al cargar los bloques");
      Toast.fire({
        icon: "error",
        title: "Error al cargar los bloques",
      });
      setData([]);
      setStaticData([]);
    } finally {
      setLoading(false);
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
  const updateBlock = async (id, updatedFields) => {
    try {
      const res = await updateBlock(id, updatedFields);
      setBlocks(blocks.map((b) => (b.id === id ? res.data.data : b)));
    } catch (err) {
      console.error("Error al actualizar:", err);
    }
  };

  // Eliminar bloque
  const handleDeleteBlock = async (id, title) => {
    try {
      const result = await smallAlertDelete.fire({
        icon: "warning",
        title: "",
        html: `<p style="text-align:center;">El bloque <strong>${title}</strong> será eliminado.<br>¿Desea continuar?</p>`,
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#b62a8b",
        customClass: {
          popup: "my-swal-popup",
          actions: "swal2-actions-center",
          icon: "swal2-icon-center",
          title: "swal2-title-center",
        },
      });

      if (!result.isConfirmed) return;

      await deleteBlock(id);

      await loadBlocks(); // Recargar bloques después de eliminar

      Toast.fire({ icon: "success", title: "Bloque eliminado exitosamente" });
    } catch (err) {
      console.error("Error al eliminar el bloque:", err);
      Toast.fire({
        icon: "error",
        title: "Error al eliminar el bloque seleccionado",
      });
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

  // Limpiar el modal al cerrar
  const handleModalClose = () => {
    handleCancel();
    resetFormFields();
    setError("");
    setLoading(false);
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
                                {bloque.block_name ||
                                  bloque.nombre ||
                                  "Sin nombre"}
                              </h3>
                              <span className="text-muted block-weighting me-3">
                                {`${bloque.percentage}%` ||
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
                                          <strong>
                                            {preg.text ||
                                              preg.question_name ||
                                              "Sin texto"}
                                          </strong>
                                        </p>

                                        {preg.type === "radio_opt" && (
                                          <div className="d-flex flex-column align-items-center">
                                            <SingleChoiceView
                                              options={(
                                                preg.options ||
                                                preg.select_option ||
                                                ""
                                              )
                                                .split(",")
                                                .map((o) => o.trim())}
                                              correctOption={
                                                preg.selected_answer
                                              }
                                            />
                                          </div>
                                        )}

                                        {preg.type === "check_opt" && (
                                          <div className="d-flex flex-column align-items-center">
                                            <MultipleChoiceView
                                              options={(
                                                preg.options ||
                                                preg.select_option ||
                                                ""
                                              )
                                                .split(",")
                                                .map((o) => o.trim())}
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
                                            <select
                                              className="form-select"
                                              value={preg.selected_answer || ""}
                                              onChange={(e) => {
                                                const updatedQuestions = [
                                                  ...questionsList,
                                                ];
                                                updatedQuestions[
                                                  index
                                                ].selected_answer =
                                                  e.target.value;
                                                setQuestionsList(
                                                  updatedQuestions
                                                );
                                              }}
                                            >
                                              {(preg.options || []).map(
                                                (opt, idx) => {
                                                  const optionText =
                                                    typeof opt === "string"
                                                      ? opt
                                                      : opt.text || "";
                                                  return (
                                                    <option
                                                      key={idx}
                                                      value={optionText}
                                                    >
                                                      {optionText}
                                                    </option>
                                                  );
                                                }
                                              )}
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
                                  data-bs-target="#modalManageQuestion"
                                  onClick={() => onUpdate(bloque)}
                                >
                                  <i className="fa-solid fa-edit"></i> Editar
                                </button>
                              </li>
                              <li className="text-start btn-rect">
                                <button
                                  className="btn text-start"
                                  style={{ width: "100%" }}
                                  onClick={() =>
                                    handleDeleteBlock(
                                      bloque.id,
                                      bloque.block_name
                                    )
                                  }
                                >
                                  <i className="fa-solid fa-trash"></i>{" "}
                                  {t("delete_block")}
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
