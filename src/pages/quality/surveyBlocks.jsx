import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import HeaderLT1 from "../../components/header/headerLT1";
import axios from "axios";
import useInput from "../../components/hooks/useInput";
import { UserContext } from "../../context/UserContext";
import { useParams } from "react-router-dom";
import {
  Modal,
  Box,
  Paper,
  Typography,
  IconButton,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Divider,
  Button,
  Autocomplete
} from "@mui/material";
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
import { updateFormMetadata } from "../../services/form_listService";
import { formatDateTimeShort } from "../../utils/dateUtils";

export default function SurveyBlocks({}) {
  const { id_form } = useParams();
  const { userId } = useContext(UserContext);
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
  const { accessToken, languageUser, user } = useContext(UserContext);

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
  /* ***********************************************************************************************************/
  /* Component Logic*/
  /* ***********************************************************************************************************/

  useEffect(() => {
    i18n.changeLanguage(languageUser);
  }, [languageUser]);

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
        { text: "", type: "", options: [], correctAnswers: [] },
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
          { text: "", type: "", options: [], correctAnswers: [] },
        ]);
        setQuestionCountInput("1");
      }

      setidToEdit(questionDetails.id);
    }
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

                  for (let i = 0; i < preguntas.length; i++) {
                    const pregunta = preguntas[i];
                    const question_id = questionIds[i]; // IDs que devuelve createQuestionsForBlock

                    const respuesta =
                      pregunta.selected_answer ||
                      pregunta.selectorSelectedOption ||
                      pregunta.textfieldValue ||
                      ""; // Para tipo texto o seleccionador

                    if (respuesta.trim() !== "") {
                      await AnswersFormService.createAnswer({
                        question_id,
                        answer_question: respuesta,
                      });
                    }
                  }

                  // Acceder a la respuesta correcta según el tipo de pregunta
                  let answer = "";

                  if (
                    question.type === "check_opt" ||
                    question.type === "selector_opt"
                  ) {
                    answer = question.selected_answer || "";
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

                // Actualizar el bloque con las preguntas vinculadas
                const updatedBlocks = await getBlocksByFormId(id_form);
                setData(updatedBlocks.data.data);
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
              await updateQuestions(idToEdit, refillQuestions);
            }

            // Actualizar metadatos del formulario
            const updatedForm = await updateFormMetadata(id_form, userId);
            if (updatedForm) {
              setFormData(updatedForm); // 👈 Esto actualizará la fecha en tu UI
            }
            await fetchFormData();

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

  // Id único para cada bloque

  // const handleAgregarBloque = () => {
  //   if (!nombreInput.value || !ponderacionInput.value) return;

  //   const nuevaPosicion = calBlockPosition(); // Calcula la posición basada en los selects

  //   const nuevoBloque = {
  //     blockId: generateId(),
  //     nombre: nombreInput.value,
  //     posicion: nuevaPosicion,
  //     ponderacion: parseInt(ponderacionInput.value),
  //     preguntas: [],
  //   };

  //   setBloques((prev) => [...prev, nuevoBloque]);

  //   // Reset inputs
  //   nombreInput.reset();
  //   posicionInput.reset();
  //   ponderacionInput.reset();
  // };

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
  };

  return (
    <Box className="App">
      <Box id="body">
        <HeaderLT1 />

        <section
          style={{ alignItems: "stretch", flexWrap: "nowrap", padding: 0 }}
        >
          <div className="container mt-0">
            <div className="row">
              {/* Sección de Información del Formulario */}
              <div className="col-md-12">
                <div className="card p-4 borderEVA">
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
                              <b>Fecha de Creación:</b>{" "}
                              {formatDateTimeShort(formData.creation_date)}
                            </p>
                            <p className="fs-6">
                              <b>Última Actualización:</b>{" "}
                              {formatDateTimeShort(formData.updated_date) ||
                                "Sin actualizar"}
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
                            Sesión caducada, por favor incie sesion nuevamente.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección de Preguntas y Bloques */}
              <div className="col-md-12 mt-3">
                <div className="card p-4 card-outline card-success borderEVA">
                  {/* Header de la sección de preguntas */}
                  <div>
                    <h3 className="text-center">Preguntas</h3>
                    <div className="card-tools d-flex justify-content-end me-4">
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

                  {/* Drag and Drop Context para los bloques */}
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="blocksDroppable">
                      {(provided) => (
                        <div
                          className="card-body ui-sorteable"
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {/* Mapeo de bloques arrastrables */}
                          {data.map((bloque, index) => (
                            <Draggable
                              key={bloque.id}
                              draggableId={String(bloque.id)}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="border-top p-3 m-3"
                                >
                                  {/* Header del bloque con título y ponderación */}
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

                                      {/* Contenedor de preguntas del bloque */}
                                      <div className="mt-2 d-flex flex-column align-items-center">
                                        {/* Mapeo de preguntas dentro del bloque */}
                                        {Array.isArray(bloque.preguntas) &&
                                          bloque.preguntas.map((preg, idx) => {
                                            const isCollapsed =
                                              collapsedQuestions[
                                                `${bloque.id}-${idx}`
                                              ];

                                            return (
                                              <div
                                                key={idx}
                                                className="border border-secondary-subtle p-3 mb-5 rounded"
                                                style={{ width: "100%" }}
                                              >
                                                {/* Header de la pregunta con botón de colapso */}
                                                <div className="d-flex justify-content-between align-items-center">
                                                  <p className="mb-3 fs-5">
                                                    <strong>
                                                      {preg.text ||
                                                        preg.question_name ||
                                                        "Sin texto"}
                                                    </strong>
                                                  </p>
                                                  <button
                                                    className="btn btn-sm btn-outline-secondary"
                                                    onClick={() =>
                                                      toggleCollapse(
                                                        bloque.id,
                                                        idx
                                                      )
                                                    }
                                                  >
                                                    {isCollapsed ? "+" : "-"}
                                                  </button>
                                                </div>

                                                {/* Contenido expandible de la pregunta */}
                                                <div className="m-2">
                                                  {!isCollapsed && (<>
                                                    {/* Pregunta tipo selección múltiple */}
                                                    {preg.type === "check_opt" && (
                                                      <Autocomplete
                                                        multiple
                                                        options={(preg.options || []).map((opt) =>
                                                          typeof opt === "object" && opt !== null ? opt.text : String(opt)
                                                        )}
                                                        renderOption={(props, option, { selected }) => (
                                                          <li {...props} key={option}>
                                                            <Checkbox checked={selected} style={{ marginRight: 8 }} />
                                                            {option}
                                                          </li>
                                                        )}
                                                        renderInput={(params) => (
                                                          <TextField
                                                            {...params}
                                                            label="Selecciona una opción:"
                                                            placeholder="Selecciona una o varias opciones"
                                                            className="readOnlyField"
                                                          />
                                                        )}
                                                        sx={{ mb: 2 }}
                                                      />
                                                    )}

                                                    {/* Pregunta tipo selección única */}
                                                    {preg.type === "selector_opt" && (
                                                      <TextField
                                                        select
                                                        fullWidth
                                                        label="Selecciona una opción:"
                                                        sx={{ mb: 2 }}
                                                        className="readOnlyField"
                                                      >
                                                        <MenuItem value="">Selecciona una opción</MenuItem>
                                                        {(preg.options || []).map((opt, index) => {
                                                          const optionText =
                                                            typeof opt === "string" ? opt : opt.text || "";
                                                          return (
                                                            <MenuItem key={index} value={optionText}>
                                                              {optionText}
                                                            </MenuItem>
                                                          );
                                                        })}
                                                      </TextField>
                                                    )}
                                    
                                                    {/* Pregunta tipo Campo de texto corto */}
                                                    {preg.type === "textfield_s" && (
                                                      <Textfield_s
                                                        value={
                                                          preg.selected_answer ||
                                                          ""
                                                        }
                                                        readOnly
                                                      />
                                                    )}

                                                    {/* Pregunta tipo Sí/No */}
                                                    {preg.type === "yes_no" && (
                                                      <Yes_no
                                                        value={
                                                          preg.selected_answer ||
                                                          ""
                                                        }
                                                        readOnly
                                                      />
                                                    )}
                                                  </>
                                                )}
                                                </div>

                                                <div>
                                                  <p className="mb-3 ms-1 text-end">
                                                    {errorLabels[preg.error] ||
                                                      "No seleccionado"}
                                                    {"."}
                                                  </p>
                                                </div>
                                              </div>
                                            );
                                          })}

                                      </div>
                                    </div>

                                    {/* Menú desplegable de acciones (editar/eliminar) */}
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
                                            <i className="fa-solid fa-edit"></i>{" "}
                                            Editar
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
                              )}
                            </Draggable>
                          ))}

                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Box>

      {/* Modal para gestión de bloques de encuesta */}
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
        options={multipleChoiceData.options}
        correctAnswers={multipleChoiceData.correctAnswers}
        onChange={handleMultipleChoiceChange}
        migrateQuestionData={migrateQuestionData}
        selectError={selectError}
        handleErrorOpt={handleErrorOpt}
      />
    </Box>
  );
}