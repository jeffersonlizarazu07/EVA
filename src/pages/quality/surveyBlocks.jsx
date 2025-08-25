import React, { useState, useEffect, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import HeaderLT1 from "../../components/header/headerLT1";
import { apiClient } from "../../utils/axiosConfig";
import useInput from "../../components/hooks/useInput";
import { UserContext } from "../../context/UserContext";
import { useParams } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Grid,
  MenuItem,
  TextField,
  Checkbox,
  CircularProgress,
  Button,
  Autocomplete,
  Card,
  CardContent,
  Container,
  Fade,
  Zoom,
  Slide,
  useTheme,
  Tooltip,
  Collapse,
  Stack,
  Chip
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  ExpandMore,
  ExpandLess,
  QuestionAnswer,
  Analytics,
  Schedule,
  Info,
  RadioButtonUnchecked,
  TextFields,
  ToggleOn,
  DragHandle,
  CheckBox,
  TurnLeft,
  Error as ErrorIcon
} from '@mui/icons-material';
import {
  smallAlertDelete,
  Toast,
} from "../../assets/js/alertConfig";
import {
  getSurveyQuestions,
} from "../../services/surveyRequest";
import "../../assets/css/survey.css";
import {
  createBlock,
  deleteBlock,
  getBlocksByFormId,
  getBlockById,
} from "../../services/blockService";
import {
  createQuestions,
  updateQuestions,
} from "../../services/questionsFormService";
import AnswersFormService from "../../services/answersFormService";
import getRangeOptions from "../survey/conditional";
import "../../assets/css/surveyBlocks.css";
import ModalSurveyBlocks from "../../components/Modals/modalSurveyBlocks";
import Cookies from "js-cookie";
import { updateFormMetadata } from "../../services/form_listService";
import { formatDateTimeShort } from "../../utils/dateUtils";
import { useTranslations } from "../../components/hooks/useTranslations";

export default function SurveyBlocks({}) {
  const nav = useNavigate();
  const theme = useTheme();
  const { id_form } = useParams();
  const { userId } = useContext(UserContext);
  const [formData, setFormData] = useState(null);
  const [data, setData] = useState([]);
  
  // Estado para controlar si el modal está abierto
  const [modalOpen, setModalOpen] = useState(false);
  // Estado para guardar la operación y datos que pasas al modal
  const [operation, setOperation] = useState(null);
  const [modalData, setModalData] = useState(null);

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

  const { t } = useTranslations();
  const { accessToken, languageUser, user } = useContext(UserContext);

  /* Estado de listas de preguntas del botón + Pregunta */
  const [questionsList, setQuestionsList] = useState([
    {
      id: null,
      text: "",
      type: "",
      error: "",
      options: [],
      correctAnswers: [],
    },
  ]);
  console.log("yyyyyyyyyy", questionsList)

  /* Contador de número de encuestas segun input */
  const [questionCountInput, setQuestionCountInput] = useState("");

  /* Selector option */
  const [selectorData, setSelectorData] = useState({
    options: [],
    selectedOption: null,
  });
  // State para manejo de preguntas validas
  const [hasValidQuestions, setHasValidQuestions] = useState(false);
  const [textFieldAnswer, setTextFieldAnswer] = useState("");

  // Paginador
  const [searchTerm, setSearchTerm] = useState(""); // Para filtrado
  const [staticData, setStaticData] = useState([]); // Copia de los datos para filtrado

  // Estados para manejo de posicionamiento relativo de bloques
  const [positionType, setPositionType] = useState(""); // 'Antes o despues de'
  const [referenceBlockId, setReferenceBlockId] = useState(""); // ID del bloque de referencia

  // Estados para manejo de bloques
  const [blocks, setBlocks] = useState([]);
  const [newBlock, setNewBlock] = useState({ name: "", textQuestion: "" });

  //formulario
  const [collapsedQuestions, setCollapsedQuestions] = useState({}); // Estado para manejar el colapso de preguntas
  const [selectError, setSelectError] = useState(""); // Select errores

  // Estados para animaciones
  const [loadingBlocks, setLoadingBlocks] = useState(true);
  const [showCards, setShowCards] = useState(false);

  /* ***********************************************************************************************************/
  /* Component Logic*/
  /* ***********************************************************************************************************/

  const fetchFormData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(
        `/form/${id_form}`,
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
    } else {
      console.warn("La variable 'data' no es un array:", data);
      setStaticData([]); // opcionalmente deja un arreglo vacío
    }
  }, [data]);

  // Efecto para animaciones de carga
  useEffect(() => {
    if (data.length > 0) {
      setLoadingBlocks(false);
      setTimeout(() => setShowCards(true), 300);
    }
  }, [data]);

  const config = {
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
    setQuestionsList([{ text: "", error:"", type: "", options: [], correctAnswers: [] }]);
    setHasValidQuestions(false);
  };

  const conditionalHandleChange = (e) => {
    const conditional = e;
    setIsChecked(conditional);
    setValueConditional(conditional);
  };

  //para abrir el modal
  const openModal = (op, idsurvey, questionDetails) => {
    setOperation(op);

    if (op === 1) {
      resetFormFields();
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
      setQuestionCountInput("");
      setSelectorData({ options: [], selectedOption: null });
      setSingleChoiceData({ options: [], correctAnswer: null });
      setMultipleChoiceData({ options: [], correctAnswers: [] });
      setQuestionsList([
        { text: "", error:"", type: "", options: [], correctAnswers: [] },
      ]);
      setHasValidQuestions(false);

    } else if (op === 2) {
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

      if (questionDetails.conditional === "SI") {
        setValueConditional(true);
        setIsChecked(true);
      } else {
        setValueConditional(false);
        setIsChecked(false);
      }

      // Formatear preguntas individuales con mapeo mejorado
      if (
        questionDetails.preguntas &&
        Array.isArray(questionDetails.preguntas)
      ) {
        const preguntasFormateadas = questionDetails.preguntas.map((p) => {
          const typeMap = {
            1: "check_opt",
            2: "selector_opt",
            3: "textfield_s",
          };

          const tipo = p.type || typeMap[p.id_type_question] || "";

          const preguntaBase = {
            id: p.id || null, 
            text: p.text || p.question_name || "",
            error: p.type_error,
            type: tipo,
            conditional: p.conditional || "NO",
          };

          // Mapear datos específicos según el tipo de pregunta
          switch (tipo) {
            case "selector_opt":
              // Para selector - opciones y respuesta seleccionada
              const selectorOptions = p.select_option
                ? p.select_option.split(",").map((o) => o.trim())
                : [];

              preguntaBase.selectorOptions = selectorOptions;
              preguntaBase.selectorSelectedOption = p.selected_answer || "";
              preguntaBase.options = selectorOptions;

              // Actualizar el estado del selector
              setSelectorData({
                options: selectorOptions,
                selectedOption: p.selected_answer || "",
              });
              break;

            case "check_opt":
              const checkboxOptions = p.select_option
                ? p.select_option
                    .split(",")
                    .map((o) => ({ text: o.trim(), checked: false }))
                : [];

              const selectedAnswers = (p.selected_answer || "")
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s !== "");

              const checkboxCorrectAnswers = [];

              selectedAnswers.forEach((ans) => {
                const idx = checkboxOptions.findIndex(
                  (opt) => opt.text === ans
                );
                if (idx >= 0) {
                  checkboxCorrectAnswers.push(idx);
                  checkboxOptions[idx].checked = true;
                }
              });

              preguntaBase.checkboxOptions = checkboxOptions;
              preguntaBase.checkboxCorrectAnswers = checkboxCorrectAnswers;

              preguntaBase.options = checkboxOptions.map((opt) => opt.text);

              // IMPORTANTE: Actualizar el estado del checkbox múltiple
              setMultipleChoiceData({
                options: checkboxOptions,
                correctAnswers: checkboxCorrectAnswers,
              });
              break;

            case "textfield_s":
              preguntaBase.textfieldValue = p.selected_answer || "";

              // IMPORTANTE: Actualizar el estado del campo de texto
              setTextFieldAnswer(p.selected_answer || "");
              break;

            default:
              preguntaBase.options = p.options || [];
              preguntaBase.selected_answer = p.selected_answer || "";
              break;
          }

          return preguntaBase;
        });

        // Aplicar migración y establecer la lista de preguntas
        const preguntasMigradas = preguntasFormateadas.map(migrateQuestionData);
        setQuestionsList(preguntasMigradas);

        // Actualizar el contador de preguntas
        setQuestionCountInput(preguntasFormateadas.length.toString());

        // IMPORTANTE: Actualizar estados específicos para cada tipo de pregunta
        updateQuestionStatesForEdit(preguntasFormateadas);
      } else {
        setQuestionsList([
          { text: "", error:"", type: "", options: [], correctAnswers: [] },
        ]);
        setQuestionCountInput("1");
      }

      setidToEdit(questionDetails.id);
    }
     // Setear los datos para el modal
    setModalData(questionDetails);
    setModalOpen(true); // abrir el modal
  };

  // Limpiar el modal al cerrar
  const handleModalClose = () => {
    handleCancel();
    resetFormFields();
    setError("");
    setLoading(false);
    setModalOpen(false);
  };

  const validar = async (idToEdit, id_form) => {
    try {
      setError("");
      setLoading(true);

      // Preparar preguntas con respuestas/selecciones integradas
      const typeMap = {
        check_opt: 1,
        selector_opt: 2,
        textfield_s: 3,
      };

      const refillQuestions = questionsList.map((q) => {
        let select_option = "";
        let selected_answer = "";

        const safeString = (value) => {
          if (value === null || value === undefined) return "";
          if (typeof value === "string") return value;
          if (typeof value === "object") {
            return value.text || value.label || value.value || "";
          }
          return String(value);
        };

        // Procesa opciones y respuestas según tipo de pregunta
        if (
          q.type === "check_opt" ||
          q.type === "selector_opt" ||
          q.type === "textfield_s"
        ) {
          if (q.type === "check_opt") {
            // ARREGLO: Verificar que checkboxOptions existe y es array
            if (Array.isArray(q.checkboxOptions)) {
              const validOptions = q.checkboxOptions
                .map(safeString)
                .filter(
                  (text) =>
                    text && typeof text === "string" && text.trim() !== ""
                );
              select_option = validOptions.join(",");
            }

            // Manejar respuestas correctas
            if (
              Array.isArray(q.checkboxCorrectAnswers) &&
              Array.isArray(q.checkboxOptions)
            ) {
              const validAnswers = q.checkboxCorrectAnswers
                .map((i) => {
                  const option = q.checkboxOptions?.[i];
                  return safeString(option);
                })
                .filter(
                  (text) =>
                    text && typeof text === "string" && text.trim() !== ""
                );
              selected_answer = validAnswers.join(",");
            } else {
              selected_answer = safeString(q.checkboxCorrectAnswers);
            }
          } else if (q.type === "selector_opt") {
            // ARREGLO: Usar la misma lógica segura para selector
            if (Array.isArray(q.selectorOptions)) {
              const validOptions = q.selectorOptions
                .map(safeString)
                .filter(
                  (text) =>
                    text && typeof text === "string" && text.trim() !== ""
                );
              select_option = validOptions.join(",");
            }
            selected_answer = safeString(q.selectorSelectedOption);
          } else if (q.type === "textfield_s") {
            select_option = "";
            selected_answer = safeString(q.textfieldValue);
          }
        }

        return {
          id: q.id ?? q.question?.id ?? null,
          question_name: q.text || q.question || "Sin texto",
          type_error: q.error,
          id_type_question: q.type || typeMap[q.type] || null,
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
          position: newPositionBlock || 0 || "",
        };

        try {
          const response = await apiClient.post("/blocks", parametros, config);

          if (response.status === 201 || response.status === 200) {
            const newBlock = response.data;

            // Crear preguntas si hay
            if (refillQuestions.length > 0) {
              // Nos aseguramos de tener la respuesta seleccionada sincronizada
              const preguntasConRespuestas = refillQuestions.map((q) => ({
                ...q,
                selected_answer:
                  q.selected_answer ||
                  q.selectorSelectedOption ||
                  q.textfieldValue ||
                  "",
              }));

              // Crear preguntas
              const responseQuestions = await createQuestions(newBlock.id, preguntasConRespuestas);
              const questionIds = responseQuestions;
            }

            // Cargar bloques y actualizar vista
            await loadBlocks();

            Toast.fire({
              icon: "success",
              title: "Bloque creado exitosamente",
            });

            handleModalClose();
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
      }
      // Editar bloque
      else if (operation === 2) {
        const parametros = {
          block_name: nombreInput.input,
          percentage: parseInt(ponderacionInput.input || 0),
          block_location: posicionInput.input || 0,
        };

        try {
          const response = await apiClient.put(`/blocks/${idToEdit}`, parametros, config);

          if (response.status === 200) {
            // Actualizar preguntas si existen
            if (refillQuestions.length > 0) {
              await updateQuestions(idToEdit, refillQuestions);
            }

            // Actualizar metadatos del formulario
            const updatedForm = await updateFormMetadata(id_form, userId);
            if (updatedForm) {
              setFormData(updatedForm); // Esto actualizará la fecha en tu UI
            }
            await fetchFormData();

            await loadBlocks(); // Cargar bloques después de editar uno existente

            Toast.fire({
              icon: "success",
              title: "Bloque actualizado correctamente",
            });
            handleModalClose();
          }
        } catch (apiError) {
          console.error("Error al actualizar el bloque:", apiError);
          setError(
            apiError.response?.data?.message || "Error al actualizar el bloque"
          );
          Toast.fire({
            icon: "error",
            title:
              apiError.response?.data?.message || "Error al actualizar el bloque",
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

  const updateQuestionStatesForEdit = (preguntas) => {
    preguntas.forEach((pregunta, index) => {
      switch (pregunta.type) {
        case "selector_opt":
          if (pregunta.selectorOptions && pregunta.selectorOptions.length > 0) {
            setSelectorData({
              options: pregunta.selectorOptions,
              selectedOption: pregunta.selectorSelectedOption || "",
            });
          }
          break;

        case "check_opt":
          if (pregunta.checkboxOptions && pregunta.checkboxOptions.length > 0) {
            setMultipleChoiceData({
              options: pregunta.checkboxOptions,
              correctAnswers: pregunta.checkboxCorrectAnswers || [],
            });
          }
          break;

        case "textfield_s":
          setTextFieldAnswer(pregunta.textfieldValue || "");
          break;
      }
    });
  };

  // Actualiza las preguntas de un bloque específico
  const updateQuestionsForBlock = async (blockId, preguntas) => {
    try {
      // Llamar al servicio de actualización de preguntas
      const response = await updateQuestions(blockId, preguntas);

      if (response.status === 200) {
        return { success: true };
      }
    } catch (error) {
      console.error("Error al actualizar preguntas del bloque:", error);
      throw error;
    }
  };

  const handleSingleChoiceChange = (updatedData) => {
    setSingleChoiceData(updatedData);
  };

  const handleMultipleChoiceChange = (data) => {
    setMultipleChoiceData({
      options: data.options || [],
      correctAnswers: Array.isArray(data.correctAnswers)
        ? data.correctAnswers
        : [],
    });
  };
  const migrateQuestionData = (question) => {
    const migrated = { ...question };

    // Ya migrado
    if (
      migrated.selectorOptions ||
      migrated.checkboxOptions ||
      migrated.textfieldValue ||
      migrated.yesNoValue
    ) {
      return migrated;
    }

    // Selector
    if (migrated.type === "selector_opt" && migrated.options) {
      migrated.selectorOptions = migrated.options;
      migrated.selectorSelectedOption = migrated.selected_answer || "";
    }

    // Selección múltiple
    if (migrated.type === "check_opt" && migrated.options) {
      migrated.checkboxOptions = migrated.options.map((opt) =>
        typeof opt === "string" ? { text: opt } : opt
      );

      // Asegurar que las respuestas correctas estén en índice
      if (Array.isArray(migrated.selected_answer)) {
        migrated.checkboxCorrectAnswers = migrated.selected_answer;
      } else if (typeof migrated.selected_answer === "string") {
        migrated.checkboxCorrectAnswers = migrated.selected_answer
          .split(",")
          .map((ans) => {
            const index = migrated.checkboxOptions.findIndex(
              (opt) => (typeof opt === "string" ? opt : opt.text) === ans.trim()
            );
            return index >= 0 ? index : null;
          })
          .filter((i) => i !== null);
      } else {
        migrated.checkboxCorrectAnswers = [];
      }
    }

    // Campo de texto
    if (migrated.type === "textfield_s") {
      migrated.textfieldValue = migrated.selected_answer || "";
    }

    // Sí/No
    if (migrated.type === "yes_no") {
      migrated.yesNoValue = migrated.selected_answer || "";
    }

    return migrated;
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
      id: null,
      text: "",
      error: "",
      type: "",
      options: [],
      correctAnswers: [],
    }));

    setQuestionsList((prev) => [...prev, ...newQuestions]);
    setQuestionCountInput(""); // Limpiar input
  };

  const handleInputChange = (index, field, value) => {
    setQuestionsList((prev) => {
      const newList = [...prev];
      newList[index] = {
        ...newList[index],
        [field]: value,
      };
      return newList;
    });
    
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

  useEffect(() => {
    console.log("¿Están todos los campos completos?", areAllFieldsCompleted());
  }, [nombreInput.input, ponderacionInput.input, questionsList, operation]);

  const areAllFieldsCompleted = () => {
    return operation === 2 ? validateEditMode() : validateCreateMode();
  };

  const validateEditMode = () => {
    const basicBlocksInputs =
      nombreInput.input.trim() !== "" &&
      ponderacionInput.input.trim() !== ""

    if (questionsList.length === 0) return false;

    const allQuestionsValid = questionsList.every((question) => {
      if (!question.text || question.text.trim() === "") return false;
      if (!question.type || question.type.trim() === "") return false;

      if (question.type === "selector_opt") {
        return question.selectorOptions && question.selectorOptions.length > 0;
      }

      if (question.type === "check_opt") {
        return question.checkboxOptions && question.checkboxOptions.length > 0;
      }

      return true;
    });

    return basicBlocksInputs && allQuestionsValid;
  };

  const validateCreateMode = () => {
    const basicBlocksInputs =
      nombreInput.input.trim() !== "" &&
      ponderacionInput.input.trim() !== "";

    console.log('nombreInput:', nombreInput.input, 'ponderacionInput:', ponderacionInput.input);

    if (questionsList.length === 0) return false;

    const allQuestionsValid = questionsList.every((question) => {
      if (!question.text || question.text.trim() === "") return false;
      if (!question.type || question.type.trim() === "") return false;

      if (question.type === "selector_opt") {
        return question.selectorOptions && question.selectorOptions.length > 0;
      }

      if (question.type === "check_opt") {
        return question.checkboxOptions && question.checkboxOptions.length > 0;
      }

      return true;
    });

    return basicBlocksInputs && allQuestionsValid;
  };

  const obtenerPorcentajeTotalBloques = async (formId) => {
    try {
      const response = await apiClient.get(`/blocks/form/${formId}`);
      const bloques = response.data?.data || [];

      const total = bloques.reduce((suma, bloque) => {
        return suma + (Number(bloque.percentage) || 0);
      }, 0);

      console.log('porcentaje de bloques',total);
      return total;
      
    } catch (error) {
      console.error("Error al obtener bloques del formulario:", error);
      return 0;
    }
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
    setSelectError("");
  };

  // Obtener preguntas por ID de bloque (si no existe)
  const getQuestionsByBlockId = async (blockId) => {
    try {
      const response = await apiClient.get(
        `/questions/block/${blockId}`,
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
        const preguntasResponse =
          await AnswersFormService.getQuestionsAndAnswersByBlockId(bloque.id);
        bloqueCompleto.preguntas = preguntasResponse;

        preguntasResponse || [];
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

    return nuevaPosicion; //
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
      setLoadingBlocks(true);
      const res = await getBlocksByFormId(id_form);
      console.log("xxxxxxxx", res.data.data)

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

              const optionObjects = opciones.map((opt) => ({ text: opt }));

              let tipo = preg.type || "";
              if (!tipo && preg.id_type_question) {
                const typeMap = {
                  1: "check_opt",
                  2: "selector_opt",
                  3: "textfield_s",
                };
                tipo = typeMap[preg.id_type_question] || "unknown";
              }

              return {
                id: preg.id,
                text: preg.text || preg.question_name || "Sin texto",
                error: preg.type_error,
                type: tipo,
                options: optionObjects,
                select_option: preg.select_option || "",
                selected_answer: preg.conditional_answer || preg.selected_answer || "",
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
      setLoadingBlocks(false);
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
  };

  useEffect(() => {
    // Si no se recibió por navegación, hacer fetch
    if (!formData && id_form) {
      fetchFormData();
    }
  }, [id_form, formData]);

  const toggleCollapse = (blockId, questionIndex) => {
    const key = `${blockId}-${questionIndex}`;
    setCollapsedQuestions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleAnswerChange = (blockId, questionIndex, newValue) => {
    setData((prev) =>
      prev.map((bloque) => {
        if (bloque.id !== blockId) return bloque;
        const updatedPreguntas = bloque.preguntas.map((preg, idx) => {
          if (idx !== questionIndex) return preg;
          return { ...preg, selected_answer: newValue };
        });
        return { ...bloque, preguntas: updatedPreguntas };
      })
    );
  };

  //Implementación del Drag and Drop
  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const reorderedData = Array.from(data);
    const [removed] = reorderedData.splice(source.index, 1);
    reorderedData.splice(destination.index, 0, removed);

    // Actualizar block_location como orden lógico
    setData(reorderedData);
    setStaticData(reorderedData);
  };

  // Select errores
  const handleErrorOpt = (index, field, value) => {
    const updatedQuestions = [...questionsList];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value, // Actualiza el campo dinámicamente
    };
    setQuestionsList(updatedQuestions);
  };

  // Errores mapeados para mostrar en el render
  const errorLabels = {
    ecc_opt: "ECC - Error crítico de cumplimiento",
    ecuf_opt: "ECUF - Error crítico de usuario final",
    ecn_opt: "ECN - Error crítico de negocio",
    enc_opt: "ECN - Error no crítico",
  };

  // Función para obtener el icono según el tipo de pregunta
  const getQuestionIcon = (type) => {
    switch (type) {
      case "check_opt":
        return <CheckBox sx={{ fontSize: 18 }} />;
      case "selector_opt":
        return <RadioButtonUnchecked sx={{ fontSize: 18 }} />;
      case "textfield_s":
        return <TextFields sx={{ fontSize: 18 }} />;
      case "yes_no":
        return <ToggleOn sx={{ fontSize: 18 }} />;
      default:
        return <QuestionAnswer sx={{ fontSize: 18 }} />;
    }
  };

  // Función para obtener el label del tipo de pregunta
  const getQuestionTypeLabel = (type) => {
    const typeLabels = {
      check_opt: "Selección múltiple",
      selector_opt: "Selección única", 
      textfield_s: "Campo de texto",
      yes_no: "Sí / No"
    };
    return typeLabels[type] || "Desconocido";
  };

  return (
    <Box className="App">
      <Box id="body">
        <HeaderLT1 />
  
        <Container maxWidth="xl" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
          {/* Información del Formulario */}
          <Slide direction="down" in={true} timeout={300}>
            <Card 
              sx={{
                borderRadius: '24px',
                background: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid',
                borderColor: theme.palette.mode === 'dark' 
                  ? 'rgba(182, 42, 139, 0.2)' 
                  : 'rgba(182, 42, 139, 0.1)',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 20px 60px rgba(0, 0, 0, 0.3)'
                  : '0 20px 60px rgba(182, 42, 139, 0.1)',
                mb: 4,
                overflow: 'hidden',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #b62a8b 0%, #d63384 100%)'
                }
              }}
            >
              <CardContent sx={{ p: 5 }}>
                
                <Box sx={{ position: "relative", mb: 4 }}>
                  {/* Botón para volver */}
                  <Box sx={{ position: "absolute", left: 0, top: 0 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        minWidth: 0,
                        width: 30,
                        height: 30,
                        padding: 0,
                        borderRadius: "50%",
                        color: "#b62a8b",
                        borderColor: "#b62a8b",
                        "&:hover": {
                          borderColor: "#b62a8b",
                          backgroundColor: "#b62a8b",
                          color: "white",
                        },
                      }}
                      onClick={() => nav("/forms")}
                    >
                      <TurnLeft />
                    </Button>
                  </Box>

                  {/* Título centrado */}
                  <Box textAlign="center">
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 600,
                        color: '#b62a8b',
                        mb: 1.5,
                        letterSpacing: '-0.2px'
                      }}
                    >
                      <Info sx={{ fontSize: 40, mr: 2, verticalAlign: 'middle', color: '#b62a8b' }} />
                      Información del Formulario
                    </Typography>
                    <Box sx={{
                      width: '80px',
                      height: '4px',
                      background: '#b62a8b',
                      borderRadius: '2px',
                      margin: '0 auto'
                    }} />
                  </Box>
                </Box>

                {formData ? (
                  <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={8}>
                      <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            mb: 1.5,
                            lineHeight: 1.35
                          }}
                        >
                          {formData.title || 'Título del formulario'}
                        </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{
                            color: theme.palette.text.secondary,
                            lineHeight: 1.6,
                            fontSize: '1.1rem'
                          }}
                        >
                          {formData.description || 'Descripción del formulario'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Stack spacing={3} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
                        <Box>
                          <Typography 
                            variant="body2" 
                            sx={{
                              fontSize: '0.9rem',
                              color: theme.palette.text.secondary,
                              mb: 1,
                              fontWeight: 600
                            }}
                          >
                            <Schedule sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                            Fecha de Creación
                          </Typography>
                          <Typography 
                            variant="subtitle1" 
                            sx={{
                              fontWeight: 600,
                              color: '#b62a8b'
                            }}
                          >
                            {formatDateTimeShort(formData.creation_date)}
                          </Typography>
                        </Box>
                        
                        <Box>
                          <Typography 
                            variant="body2" 
                            sx={{
                              fontSize: '0.9rem',
                              color: theme.palette.text.secondary,
                              mb: 1,
                              fontWeight: 600
                            }}
                          >
                            <Analytics sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                            Última Actualización
                          </Typography>
                          <Typography 
                            variant="subtitle1" 
                            sx={{
                              fontWeight: 600,
                              color: '#b62a8b'
                            }}
                          >
                            {formatDateTimeShort(formData.updated_date) || "Sin actualizar"}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>
                ) : (
                  <Box textAlign="center" py={4}>
                    <CircularProgress size={60} sx={{ mb: 3, color: '#b62a8b' }} />
                    <Typography variant="h6" color="text.secondary">
                      Cargando información del formulario...
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Slide>
  
          {/* Sección de Bloques */}
          <Fade in={true} timeout={400}>
            <Card 
              sx={{
                borderRadius: '24px',
                background: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid',
                borderColor: theme.palette.mode === 'dark' 
                  ? 'rgba(182, 42, 139, 0.2)' 
                  : 'rgba(182, 42, 139, 0.1)',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 20px 60px rgba(0, 0, 0, 0.3)'
                  : '0 20px 60px rgba(182, 42, 139, 0.1)',
                overflow: 'hidden',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #b62a8b 0%, #d63384 100%)'
                }
              }}
            >
              <CardContent sx={{ p: 5 }}>
                {/* Header de la sección */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                  <Box>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 600,
                        color: '#b62a8b',
                        mb: 1.5,
                        letterSpacing: '-0.2px'
                      }}
                    >
                      <QuestionAnswer sx={{ fontSize: 40, mr: 2, verticalAlign: 'middle', color: '#b62a8b' }} />
                      Bloques de Preguntas
                    </Typography>
                    <Box sx={{
                      width: '80px',
                      height: '4px',
                      background: '#b62a8b',
                      borderRadius: '2px'
                    }} />
                  </Box>
                  
                  <Zoom in={true} timeout={300}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<Add />}
                      onClick={() => openModal(1, id_form)}
                      sx={{
                        borderRadius: '20px',
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        px: 4,
                        py: 2,
                        background: 'linear-gradient(90deg, #b62a8b 0%, #d63384 100%)',
                        boxShadow: '0 8px 25px rgba(182, 42, 139, 0.4)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          background: 'linear-gradient(90deg, #a02478 0%, #c42d76 100%)',
                          boxShadow: '0 12px 35px rgba(182, 42, 139, 0.6)',
                          transform: 'translateY(-2px) scale(1.02)'
                        }
                      }}
                    >
                      Crear Bloque
                    </Button>
                  </Zoom>
                </Box>
  
                {/* Contenido de bloques */}
                <Box sx={{ mt: 4 }}>
                  {loadingBlocks ? (
                    <Box textAlign="center" py={8}>
                      <CircularProgress size={60} sx={{ mb: 3, color: '#b62a8b' }} />
                      <Typography variant="h6" color="text.secondary">
                        Cargando bloques...
                      </Typography>
                    </Box>
                  ) : data.length === 0 ? (
                    <Fade in={true} timeout={300}>
                      <Box 
                        sx={{
                          textAlign: 'center',
                          py: 8,
                          color: theme.palette.text.secondary,
                          background: theme.palette.mode === 'dark' 
                            ? 'rgba(182, 42, 139, 0.05)' 
                            : 'rgba(182, 42, 139, 0.02)',
                          borderRadius: '16px',
                          border: '2px dashed',
                          borderColor: 'rgba(182, 42, 139, 0.3)'
                        }}
                      >
                        <QuestionAnswer sx={{ fontSize: 80, mb: 3, opacity: 0.3, color: '#b62a8b' }} />
                        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
                          No hay bloques aún
                        </Typography>
                        <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                          Comienza creando tu primer bloque de preguntas
                        </Typography>
                      </Box>
                    </Fade>
                  ) : (
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="blocksDroppable">
                        {(provided) => (
                          <Box
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
                          >
                            {data.map((bloque, index) => (
                              <Draggable
                                key={bloque.id}
                                draggableId={String(bloque.id)}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <Fade 
                                    in={showCards} 
                                    timeout={200 + (index * 50)}
                                    key={bloque.id}
                                  >
                                    <Paper
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      elevation={0}
                                      sx={{ 
                                        borderRadius: '20px',
                                        background: theme.palette.mode === 'dark' 
                                          ? 'rgba(255, 255, 255, 0.05)' 
                                          : 'rgba(255, 255, 255, 0.9)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid',
                                        borderColor: theme.palette.mode === 'dark' 
                                          ? 'rgba(182, 42, 139, 0.2)' 
                                          : 'rgba(182, 42, 139, 0.1)',
                                        transition: 'all 0.15s ease',
                                        transform: snapshot.isDragging ? 'rotate(3deg) scale(1.02)' : 'none',
                                        boxShadow: snapshot.isDragging 
                                          ? '0 20px 40px rgba(182, 42, 139, 0.3)'
                                          : theme.palette.mode === 'dark'
                                            ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                                            : '0 8px 32px rgba(182, 42, 139, 0.08)',
                                        '&:hover': {
                                          boxShadow: theme.palette.mode === 'dark'
                                            ? '0 16px 48px rgba(0, 0, 0, 0.4)'
                                            : '0 16px 48px rgba(182, 42, 139, 0.15)',
                                          transform: 'translateY(-4px)',
                                          borderColor: 'rgba(182, 42, 139, 0.4)'
                                        },
                                        overflow: 'hidden',
                                        position: 'relative'
                                      }}
                                    >
                                      <CardContent sx={{ p: 4 }}>
                                        {/* Header del bloque */}
                                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
                                          <Box sx={{ flex: 1, mr: 2 }}>
                                            <Box display="flex" alignItems="center" mb={2}>
                                              <Box
                                                {...provided.dragHandleProps}
                                                sx={{
                                                  cursor: 'grab',
                                                  mr: 2,
                                                  p: 1,
                                                  borderRadius: '8px',
                                                  background: 'rgba(182, 42, 139, 0.1)',
                                                  '&:hover': {
                                                    background: 'rgba(182, 42, 139, 0.2)',
                                                  },
                                                  '&:active': {
                                                    cursor: 'grabbing'
                                                  }
                                                }}
                                              >
                                                <DragHandle sx={{ color: '#b62a8b' }} />
                                              </Box>
                                              
                                              <Typography 
                                                variant="h6" 
                                                sx={{ 
                                                  fontWeight: 600,
                                                  color: theme.palette.text.primary,
                                                  lineHeight: 1.35
                                                }}
                                              >
                                                {bloque.block_name || bloque.nombre || "Sin nombre"}
                                              </Typography>
                                              
                                              <Chip
                                                label={`${bloque.percentage || bloque.ponderacion || 0}%`}
                                                sx={{
                                                  ml: 2,
                                                  fontWeight: 700,
                                                  background: 'linear-gradient(90deg, #b62a8b 0%, #d63384 100%)',
                                                  color: 'white'
                                                }}
                                              />
                                            </Box>
                                          </Box>
  
                                          {/* Menú de acciones */}
                                          <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Tooltip title="Editar bloque">
                                              <IconButton
                                                onClick={() => onUpdate(bloque)}
                                                sx={{
                                                  background: 'rgba(182, 42, 139, 0.1)',
                                                  color: '#b62a8b',
                                                  borderRadius: '12px',
                                                  transition: 'all 0.1s ease',
                                                  '&:hover': { 
                                                    background: 'rgba(182, 42, 139, 0.2)',
                                                    transform: 'scale(1.05)'
                                                  }
                                                }}
                                              >
                                                <Edit sx={{ fontSize: 20 }} />
                                              </IconButton>
                                            </Tooltip>
                                            
                                            <Tooltip title="Eliminar bloque">
                                              <IconButton
                                                onClick={() => handleDeleteBlock(bloque.id, bloque.block_name)}
                                                sx={{
                                                  background: 'rgba(244, 67, 54, 0.1)',
                                                  color: '#f44336',
                                                  borderRadius: '12px',
                                                  transition: 'all 0.1s ease',
                                                  '&:hover': { 
                                                    background: 'rgba(244, 67, 54, 0.2)',
                                                    transform: 'scale(1.05)'
                                                  }
                                                }}
                                              >
                                                <Delete sx={{ fontSize: 20 }} />
                                              </IconButton>
                                            </Tooltip>
                                          </Box>
                                        </Box>
  
                                        {/* Preguntas del bloque */}
                                        <Box sx={{ mt: 3 }}>
                                          {Array.isArray(bloque.preguntas) && bloque.preguntas.length > 0 ? (
                                            <Stack spacing={2}>
                                              {bloque.preguntas.map((preg, idx) => {
                                                const isCollapsed = collapsedQuestions[`${bloque.id}-${idx}`];
                                                
                                                return (
                                                  <Paper
                                                    key={idx}
                                                    elevation={0}
                                                    sx={{
                                                      borderRadius: '16px',
                                                      background: theme.palette.mode === 'dark' 
                                                        ? 'rgba(255, 255, 255, 0.03)' 
                                                        : 'rgba(182, 42, 139, 0.02)',
                                                      border: '1px solid',
                                                      borderColor: theme.palette.mode === 'dark' 
                                                        ? 'rgba(182, 42, 139, 0.2)' 
                                                        : 'rgba(182, 42, 139, 0.1)',
                                                      transition: 'all 0.1s ease',
                                                      '&:hover': {
                                                        borderColor: 'rgba(182, 42, 139, 0.5)',
                                                        background: theme.palette.mode === 'dark' 
                                                          ? 'rgba(255, 255, 255, 0.05)' 
                                                          : 'rgba(182, 42, 139, 0.03)'
                                                      }
                                                    }}
                                                  >
                                                    <Box sx={{ p: 3 }}>
                                                      {/* Header de la pregunta */}
                                                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                                        <Box display="flex" alignItems="center" sx={{ flex: 1 }}>
                                                          <Chip
                                                            icon={getQuestionIcon(preg.type)}
                                                            label={getQuestionTypeLabel(preg.type)}
                                                            size="small"
                                                            sx={{
                                                              mr: 2,
                                                              background: 'rgba(182, 42, 139, 0.1)',
                                                              color: '#b62a8b',
                                                              border: 'none',
                                                              fontWeight: 600
                                                            }}
                                                          />
                                                          
                                                          <Typography 
                                                            variant="h6" 
                                                            sx={{ 
                                                              fontWeight: 600,
                                                              color: theme.palette.text.primary,
                                                              lineHeight: 1.4
                                                            }}
                                                          >
                                                            {preg.text || preg.question_name || "Sin texto"}
                                                          </Typography>
                                                        </Box>
                                                        
                                                        <IconButton
                                                          onClick={() => toggleCollapse(bloque.id, idx)}
                                                          sx={{
                                                            background: theme.palette.mode === 'dark' 
                                                              ? 'rgba(255, 255, 255, 0.05)' 
                                                              : 'rgba(182, 42, 139, 0.05)',
                                                            borderRadius: '10px',
                                                            transition: 'all 0.1s ease',
                                                            '&:hover': { 
                                                              background: theme.palette.mode === 'dark' 
                                                                ? 'rgba(255, 255, 255, 0.1)' 
                                                                : 'rgba(182, 42, 139, 0.1)',
                                                              transform: 'scale(1.05)'
                                                            }
                                                          }}
                                                        >
                                                          {isCollapsed ? <ExpandMore /> : <ExpandLess />}
                                                        </IconButton>
                                                      </Box>
  
                                                      {/* Contenido expandible de la pregunta */}
                                                      <Collapse in={!isCollapsed} timeout={300}>
                                                        <Box sx={{ mt: 2 }}>
                                                          {/* Renderizado de diferentes tipos de preguntas */}
                                                          {preg.type === "check_opt" && (
                                                            <Autocomplete
                                                              multiple
                                                              options={(preg.options || []).map((opt) =>
                                                                typeof opt === "object" && opt !== null ? opt.text : String(opt)
                                                              )}
                                                              value={preg.selected_answer ? preg.selected_answer.split(',').filter(item => item.trim() !== '') : []}
                                                              onChange={(event, newValue) => {
                                                                handleAnswerChange(bloque.id, idx, newValue.join(','));
                                                              }}
                                                              renderOption={(props, option, { selected }) => (
                                                                <li {...props} key={option}>
                                                                  <Checkbox checked={selected} style={{ marginRight: 8 }} />
                                                                  {option}
                                                                </li>
                                                              )}
                                                              renderInput={(params) => (
                                                                <TextField
                                                                  {...params}
                                                                  label="Selecciona opciones:"
                                                                  placeholder="Selecciona una o varias opciones"
                                                                  sx={{
                                                                    '& .MuiOutlinedInput-root': {
                                                                      borderRadius: '12px',
                                                                      '&:hover fieldset': {
                                                                        borderColor: '#b62a8b',
                                                                      },
                                                                      '&.Mui-focused fieldset': {
                                                                        borderColor: '#b62a8b',
                                                                      }
                                                                    }
                                                                  }}
                                                                />
                                                              )}
                                                              sx={{ mb: 2 }}
                                                              className="readOnlyField"
                                                            />
                                                          )}

                                                          {preg.type === "selector_opt" && (
                                                            <TextField
                                                              select
                                                              fullWidth
                                                              label="Selecciona una opción:"
                                                              value={preg.selected_answer || ""}
                                                              onChange={(event) => {
                                                                handleAnswerChange(bloque.id, idx, event.target.value);
                                                              }}
                                                              sx={{ mb: 2 }}
                                                              className="readOnlyField"
                                                            >
                                                              <MenuItem value="">Selecciona una opción</MenuItem>
                                                              {(preg.options || []).map((opt, index) => {
                                                                const optionText =
                                                                  typeof opt === "string" ? opt : opt.text || "";
                                                                return (
                                                                  <MenuItem key={index} value={index}>
                                                                    {optionText}
                                                                  </MenuItem>
                                                                );
                                                              })}
                                                            </TextField>
                                                          )}
                          
                                                          {preg.type === "textfield_s" && (
                                                            <TextField
                                                              fullWidth
                                                              label="Campo de texto"
                                                              placeholder="Respuesta de texto..."
                                                              value={preg.selected_answer || ""}
                                                              onChange={(event) => {
                                                                handleAnswerChange(bloque.id, idx, event.target.value);
                                                              }}
                                                              className="readOnlyField"
                                                              sx={{
                                                                '& .MuiOutlinedInput-root': {
                                                                  borderRadius: '12px',
                                                                  '&:hover fieldset': {
                                                                    borderColor: '#b62a8b',
                                                                  },
                                                                  '&.Mui-focused fieldset': {
                                                                    borderColor: '#b62a8b',
                                                                  }
                                                                }
                                                              }}
                                                            />
                                                          )}

                                                          {preg.type === "yes_no" && (
                                                            <TextField
                                                              select
                                                              fullWidth
                                                              label="Sí / No"
                                                              value={preg.selected_answer || ""}
                                                              onChange={(event) => {
                                                                handleAnswerChange(bloque.id, idx, event.target.value);
                                                              }}
                                                              sx={{
                                                                '& .MuiOutlinedInput-root': {
                                                                  borderRadius: '12px',
                                                                  '&:hover fieldset': {
                                                                    borderColor: '#b62a8b',
                                                                  },
                                                                  '&.Mui-focused fieldset': {
                                                                    borderColor: '#b62a8b',
                                                                  }
                                                                }
                                                              }}
                                                            >
                                                              <MenuItem value="">Selecciona una opción</MenuItem>
                                                              <MenuItem value="Si">Sí</MenuItem>
                                                              <MenuItem value="No">No</MenuItem>
                                                            </TextField>
                                                          )}
  
                                                          {/* Error type indicator */}
                                                          <Box display="flex" justifyContent="flex-end" mt={2}>
                                                            <Chip
                                                              icon={<ErrorIcon sx={{ fontSize: 16 }} />}
                                                              label={errorLabels[preg.error] || "Sin error asignado"}
                                                              size="small"
                                                              sx={{
                                                                background: preg.error 
                                                                  ? 'rgba(244, 67, 54, 0.1)' 
                                                                  : 'rgba(158, 158, 158, 0.1)',
                                                                color: preg.error ? '#f44336' : '#9e9e9e',
                                                                fontWeight: 600
                                                              }}
                                                            />
                                                          </Box>
                                                        </Box>
                                                      </Collapse>
                                                    </Box>
                                                  </Paper>
                                                );
                                              })}
                                            </Stack>
                                          ) : (
                                            <Box 
                                              sx={{
                                                textAlign: 'center',
                                                py: 4,
                                                color: theme.palette.text.secondary,
                                                background: theme.palette.mode === 'dark' 
                                                  ? 'rgba(182, 42, 139, 0.02)' 
                                                  : 'rgba(182, 42, 139, 0.02)',
                                                borderRadius: '12px',
                                                border: '1px dashed',
                                                borderColor: 'rgba(182, 42, 139, 0.3)'
                                              }}
                                            >
                                              <QuestionAnswer sx={{ fontSize: 48, mb: 2, opacity: 0.3, color: '#b62a8b' }} />
                                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                Este bloque no tiene preguntas aún
                                              </Typography>
                                            </Box>
                                          )}
                                        </Box>
                                      </CardContent>
                                    </Paper>
                                  </Fade>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </Box>
                        )}
                      </Droppable>
                    </DragDropContext>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Container>
  
        {/* Modal para gestión de bloques */}
        <ModalSurveyBlocks
          open={modalOpen}
          handleModalClose={handleModalClose}
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
          obtenerPorcentajeTotalBloques={obtenerPorcentajeTotalBloques}
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
          options={multipleChoiceData.options}
          correctAnswers={multipleChoiceData.correctAnswers}
          onChange={handleMultipleChoiceChange}
          migrateQuestionData={migrateQuestionData}
          selectError={selectError}
          handleErrorOpt={handleErrorOpt}
        />
      </Box>
    </Box>
    );
}