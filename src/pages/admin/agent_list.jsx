import React, { useState, useEffect, useContext } from "react";
import "../../assets/css/newUser.css";
import TableAdmin from "../../components/Tables/tableAgent";
import HeaderLT1 from "../../components/header/headerLT1";
import HeaderLT2 from "../../components/header/headerLT2";
import useInput from "../../components/hooks/useInput";
import { UserContext } from "../../context/UserContext";
import { Toast, smallAlertDelete } from "../../assets/js/alertConfig";
import { useTranslations } from "../../components/hooks/useTranslations";
import {
  getAdmins,
  getClients,
  getUserClients,
  getAgentById,
  getFormsByClient,
  getBlocksForIdForm,
  saveMonitoringAndAnswers,
} from "../../services/agent_listService";
import { formatDate, formatDateTimeShort } from "../../utils/dateUtils"; // Formatear fechas de la vista
import ModalAdmin from "../../components/Modals/modalAdminAgent_list";
import ModalViewAdmin from "../../components/Modals/modalViewAdminAgent_list";
import { Box, Typography } from "@mui/material";

const AdminList = () => {
  // Estados para guardar los datos de admins, clientes y clientes seleccionados
  const [admins, setAdmins] = useState([]); // Guarda todos los administradores
  const [listClients, setListClients] = useState([]); // Clientes disponibles en el sistema
  const [userClients, setUserClients] = useState([]); // Clientes asociados a un usuario específico
  const [operation, setOperation] = useState([1]); // Estado para manejar la operación actual (ej: crear, editar, etc.)
  const [title, setTitle] = useState(); // Estado para el título del formulario/modal
  const [idToEdit, setidToEdit] = useState(null); // Estado para guardar el id del usuario que voy a editar
  const [formattedDate, setFormattedDate] = useState(""); // Estado para la fecha formateada de hoy (yyyy-mm-dd)
  const [loading, setLoading] = useState(false); // Estado para controlar el estado de carga (ej: mostrar spinner)
  const [selectedClients, setSelectedClients] = useState([]); // Estado para manejar los clientes seleccionados (checkbox múltiple)
  const [selectedClientId, setSelectedClientId] = useState(""); // Estado para el cliente seleccionado
  const [formOptions, setFormOptions] = useState([]); // Estado para manejar las opciones de formularios disponibles
  const [selectedFormId, setSelectedFormId] = useState(""); //Estado para manejar el formulario seleccionado
  const { t } = useTranslations(); // Hook para traducciones y cambio de idioma dinámico
  const { accessToken, clients, userInfo } = useContext(UserContext); // Accedo al contexto de usuario para obtener el token y el idioma actual del usuario
  const [userName, setUserName] = useState(""); // Estado para guardar el nombre del usuario que se está creando o editando
  const [monitoringStep, setMonitoringStep] = useState(1); // Manejo la vista actual dentro del modal de monitorización
  const [blocksForForm, setBlocksForForm] = useState([]); // Estado para menjar los bloques de un formulario
  const [monitoringDate, setMonitoringDate] = useState(""); // Control de la fecha de monitorización
  const [blocksWithPer, setBlocksWithPer] = useState([]); // Guarda el porcentaje del bloque actualizado
  const [isModalOpen, setIsModalOpen] = useState(false); // Maneja el abrir/cerrar del modal
  const [feedback, setFeedback] = React.useState("");
  const [selectedBlockId, setSelectedBlockId] = useState(null); // Bloque seleccionado para calificar
  const [openViewModal, setOpenViewModal] = React.useState(false);
  const [viewAdminData, setViewAdminData] = React.useState(null);
  // Validaciones de la primer vista del modal
  const [clientError, setClientError] = useState(false); // Validación visual si el select de cliente se encuentra vacio al confrmar
  const [formError, setFormError] = useState(false); // Validación visual si formulario se encuentra vacio al confirmar
  const [dateError, setDateError] = useState(false); // Validación visual si no se asignó una fecha de monitorización al confirmar
  const [feedbackError, setFeedbackError] = useState(false);
  const [erroresPorPregunta, setErroresPorPregunta] = useState({});
  const [conteoDeAgentes, setConteoDeAgentes] = useState("0");
  useEffect(() => {
    console.log("Nuevo conteo desde useEffect:", conteoDeAgentes);
  }, [conteoDeAgentes]);

  // Hooks que se ejecutan al montar el componente o si cambia el idioma
  useEffect(() => {
    setFormattedDate(formatDate(new Date()));

    if (clients && clients.length > 0) {
      console.log("✅ Clients listos:", clients);
      loadAdmins(); // <- solo ahora sí llamamos
    } else {
      console.log("⚠️ Clients aún vacíos en el contexto");
    }

    loadClients(); // esto puede ir siempre
  }, [clients]);

  // Configuración para hacer peticiones que incluyan credenciales (cookies)
  const config = {
    withCredentials: true,
  };

  const selectedKeys = ["firstname", "lastname", "type", "state"]; // Claves seleccionadas para mostrar en tabla o formulario

  // Hooks personalizados para los campos del formulario, con validaciones incluidas
  const lastName = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ }); // Apellido, solo letras y espacios
  const firstName = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ }); // Primer nombre, solo letras y espacios
  const middleName = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ }); // Segundo nombre, solo letras y espacios
  // Email, con expresión regular para validar formato correcto
  const email = useInput({
    defaultValue: "",
    validate: /^[^\s@]+@[^\s@]+\.[^\s@]*$/,
  });
  const cPassword = useInput({ defaultValue: "" }); // Confirmar contraseña (sin validación por ahora)

  // Contraseña, válida si está vacía o si cumple con la política de seguridad
  const password = useInput({
    defaultValue: "",
    validate: (value) =>
      value === "" ||
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,15}$/.test(
        value
      ),
  });

  const type = useInput({ defaultValue: "5", validate: () => true }); // Tipo de usuario (por defecto es 5), sin validación extra
  const state = useInput({ defaultValue: "", validate: /^[0-1]+$/ }); // Estado (activo/inactivo), solo acepta 0 o 1
  const language = useInput({ defaultValue: "", validate: /^(es|en|it|pt)$/ }); // Idioma, acepta solo códigos válidos: es, en, it, pt

  // Fecha de registro en formato yyyy-mm-dd hh:mm:ss
  const registration_date = useInput({
    defaultValue: "",
    validate: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
  });

  // Fecha de última visita en formato yyyy-mm-dd hh:mm:ss
  const last_visit_date = useInput({
    defaultValue: "",
    validate: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
  });

  // Función para obtener la lista de clientes registrados
  const loadClients = async () => {
    try {
      const data = await getClients();
      setListClients(data);
    } catch (error) {
      console.error("Error loading clients:", error);
    }
  };

  // Obtener todos los administradores (agentes) desde el backend
  const loadAdmins = async () => {
    try {
      setLoading(true);
      const data = await getAdmins(clients);

      if (!data || data.length === 0) {
        setConteoDeAgentes(0);
      } else {
        setConteoDeAgentes(data.length);
        console.log("Administradores cargados:", data.length);
      }

      setAdmins(data);
    } catch (error) {
      console.error("Error al cargar los administradores:", error);
      Toast.fire({
        icon: "error",
        title: t("monitoringModal.ErrorAdmins"),
      });
    } finally {
      setLoading(false);
    }
  };

  // Obtener los clientes asignados a un usuario específico
  const loadUserClients = async (id) => {
    try {
      const { selectedClients: clients, userClients: users } =
        await getUserClients(id);
      setSelectedClients(clients); // Clientes seleccionados actualmente (asignados)
      setUserClients(users); // Clientes asociados al usuario
    } catch (error) {
      console.error("Error loading user clients:", error);
      setSelectedClients([]); // Limpiar en caso de error
      setUserClients([]);
    }
  };

  // Manejo del onChange del select
  const handleClientChange = async (e) => {
    const selectedId = e.target.value;

    // Limpiar estados previos
    setSelectedClientId(selectedId);
    setSelectedFormId("");
    setFormOptions([]);

    // Validar selección
    if (!selectedId || selectedId === "") {
      return;
    }

    // Convertir a número y validar
    const numericId = parseInt(selectedId, 10);

    if (isNaN(numericId) || numericId <= 0) {
      console.error("ID de cliente inválido:", selectedId);
      Toast.fire({
        icon: "error",
        title: t("monitoringModal.ErrorClients"),
      });
      return;
    }

    // Obtener formularios
    const forms = await getFormsByClient(numericId);

    if (forms && Array.isArray(forms) && forms.length > 0) {
      setFormOptions(forms);
    } else {
      setFormOptions([]);

      // Mostrar mensaje informativo al usuario
      if (forms === null) {
        // Error en la petición - ya se mostró el error en consola, no mostramos alerta
        return;
      } else if (
        forms?.error === "No se encontraron formularios para este cliente"
      ) {
        Toast.fire({
          icon: "info",
          title: t("monitoringModal.ErrorForms"), // Aquí usas la traducción para ese mensaje
        });
      } else {
        // Otros casos sin formularios
        Toast.fire({
          icon: "info",
          title: t("monitoringModal.ErrorForms"),
        });
      }
    }
  };

  // Cargar los bloques asociados al formulario seleccionado
  const handleLoadBlocks = async (e) => {
    const selectedId = e.target.value;
    setSelectedFormId(selectedId); // Guardar el ID del formulario seleccionado

    const fetchedBlocks = await getBlocksForIdForm(selectedId); // Obtener bloques desde el backend

    if (fetchedBlocks && fetchedBlocks.length > 0) {
      setBlocksForForm(fetchedBlocks); // // Actualizar el estado con los bloques encontrados
    } else {
      Toast.fire({
        icon: "info",
        title: t("monitoringModal.ErrorBlocks"),
      });
      setBlocksForForm([]); // Limpiar bloques si no existen
    }
  };

  // Maneja la selección de un formulario, y carga sus bloques
  const handleFormSelect = async (e) => {
    const selectedId = e.target.value;
    setSelectedFormId(selectedId); // actualizar ID del formulario

    await handleLoadBlocks(e); // también carga los bloques asociados al formulario seleccionado
  };

  // MODALS //
  // Abrir el modal para iniciar con el monitoreo
  const openModal = async (op, admin) => {
    setIsModalOpen(true); // abre el modal
    setOperation(op);

    // Si la operación es 1, es para registrar
    if (op == 1) {
      // Limpiar los valores del formulario
      firstName.handleChange("");
      lastName.handleChange("");
      middleName.handleChange("");
      email.handleChange("");
      password.handleChange("");
      type.handleChange(0);
      language.handleChange("es");
      state.handleChange(1);
      registration_date.handleChange(formattedDate);
      last_visit_date.handleChange(formattedDate);
      setSelectedClients([]); // Limpiar clientes seleccionados

      // Limpiar estados de formulario
      setSelectedClientId("");
      setSelectedFormId("");
      setFormOptions([]);
      setBlocksforIdForm([]);

      // Si hay un admin, trae los clientes que tiene asignado
      if (admin && admin.id) {
        try {
          // Trae los clientes del agente seleccionado
          await loadUserClients(admin.id);

          setTitle(
            `Crear monitorización para ${admin.firstname} ${admin.lastname}`
          );
          setidToEdit(admin.id); // ID del agente a quien se le hará la monitorización

          // Guarda el nombre del monitoreador para mostrarlo en el modal
          setUserName(
            `${admin.firstname || ""} ${admin.middlename || ""} ${
              admin.lastname || ""
            }`.trim()
          );
        } catch (error) {
          console.error("Error cargando datos", error);
          setTitle("Nueva monitorización");
          setUserName("");
        }
      } else {
        // Si no hay admin definido, inicializar los estados
        setSelectedClients([]);
        setUserClients([]);
        setTitle("Nueva monitorización");
        setUserName("");
      }

      // Si la operación es 2, es para editar
    } else if (op == 2) {
      // Para editar, obtenemos los datos completos del agente
      const agentData = await getAgentById(admin.id);

      if (agentData) {
        // Trae los clientes que tiene asignado el admin
        await loadUserClients(admin.id); // Cargar clientes asociados al agente

        // Datos obtenidos del backend
        setTitle(t("UserModal.EditUser"));
        firstName.handleChange(agentData?.firstname || "");
        lastName.handleChange(agentData?.lastname || "");
        middleName.handleChange(agentData?.middlename || "");
        email.handleChange(agentData?.email || "");
        password.handleChange("");
        type.handleChange(agentData?.type || "");
        state.handleChange(agentData?.state || "");
        language.handleChange(agentData?.language || "en");
        registration_date.handleChange(agentData?.registration_date || "");
        last_visit_date.handleChange(agentData?.last_visit_date || "");

        // Guardo el id del usuario que se está editando
        setidToEdit(agentData?.id);

        // Guarda el nombre para mostrarlo en el modal
        setUserName(
          `${agentData?.firstname || ""} ${agentData?.middlename || ""} ${
            agentData?.lastname || ""
          }`.trim()
        );
      }
    }
  };

  // Esta función abre el modal de solo consulta (información del usuario)
  const openModalCont = async (admin) => {
    await loadUserClients(admin.id);

    const agentData = await getAgentById(admin.id);

    firstName.handleChange(agentData?.firstname || "");
    lastName.handleChange(agentData?.lastname || "");
    middleName.handleChange(agentData?.middlename || "");
    email.handleChange(agentData?.email || "");
    password.handleChange("");
    type.handleChange(agentData?.type || "");
    state.handleChange(agentData?.state || "");
    language.handleChange(agentData?.language || "en");
    registration_date.handleChange(agentData?.registration_date || "");
    last_visit_date.handleChange(agentData?.last_visit_date || "Nunca");

    setidToEdit(agentData?.id);

    setUserName(
      `${agentData?.firstname || ""} ${agentData?.middlename || ""} ${
        agentData?.lastname || ""
      }`.trim()
    );

    // Guardamos los datos del agente para mostrar en el modal
    setViewAdminData(agentData);

    // Abrimos el modal de vista
    setOpenViewModal(true);
  };
  //para cerrar el modal
  const handleCloseViewModal = () => {
    setOpenViewModal(false);
    setViewAdminData(null);
  };

  // Resetea los estados del formulario y del modal al cerrarlo
  const formClientReset = () => {
    setIsModalOpen(false); // cierra el modal
    setSelectedClientId("");
    setSelectedFormId("");
    setFormOptions([]);
    setFeedback("");
    setMonitoringDate("");
    setMonitoringStep(1); // Reinicia a la primera vista del modal
  };

  // Score
  const calBlocksPercentage = (bloques) => {
    return bloques.map((block) => {
      const initBlockPer = block.percentage;
      const allCorrect = block.preguntas.every(
        (pregunta) => pregunta.evaluacion !== "1"
      );
      const finalBlockPer = allCorrect ? initBlockPer : 0;

      return {
        ...block,
        porcentajeBloque: Math.round(finalBlockPer * 10) / 10,
      };
    });
  };

  useEffect(() => {
    if (blocksForForm.length > 0) {
      const result = calBlocksPercentage(blocksForForm);
      setBlocksWithPer(result);
    }
  }, [blocksForForm]);

  const calFormScore = () => {
    const total = blocksWithPer.reduce(
      (suma, bloque) => suma + bloque.porcentajeBloque,
      0
    );

    return Math.round(total * 10) / 10;
  };

  const validarRespuesta = (pregunta) => {
    if (pregunta.id_type_question === 1) {
      const respuestasCorrectas = pregunta.selected_answer
        ? pregunta.selected_answer.split(",").map((r) => parseInt(r.trim()))
        : [];

      const seleccionUsuario = pregunta.seleccionMultiple || [];

      const opciones = pregunta.select_option
        ? pregunta.select_option.split(",").map((opt) => opt.trim())
        : [];

      const indicesSeleccion = seleccionUsuario
        .map((opt) => opciones.indexOf(opt))
        .sort(); // Convertimos selección del usuario a índices
      respuestasCorrectas.sort(); // Ordenamos también las respuestas correctas

      return (
        indicesSeleccion.length === respuestasCorrectas.length &&
        indicesSeleccion.every((val, idx) => val === respuestasCorrectas[idx])
      );
    }

    if (pregunta.id_type_question === 2) {
      const respuestasCorrectas = pregunta.selected_answer
        ? pregunta.selected_answer.split(",").map((r) => r.trim())
        : [];
      const seleccionUsuario = pregunta.respuestaSeleccionada || "";
      return (
        respuestasCorrectas.length === 1 &&
        seleccionUsuario === respuestasCorrectas[0]
      );
    }

    if (pregunta.id_type_question === 3) {
      return true;
    }

    return false;
  };

  const handleUpdatePregunta = (idPregunta, campo, valor) => {
    const updatedBlocks = blocksForForm.map((block) => {
      const updatedPreguntas = block.preguntas.map((preg) => {
        if (preg.id === idPregunta) {
          const preguntaActualizada = { ...preg, [campo]: valor };

          const esCorrecta = validarRespuesta(preguntaActualizada);
          return {
            ...preguntaActualizada,
            evaluacion: esCorrecta ? "0" : "1",
          };
        }
        return preg;
      });

      return { ...block, preguntas: updatedPreguntas };
    });

    setBlocksForForm(updatedBlocks);

    const updatedBlocksWithPer = calBlocksPercentage(updatedBlocks);
    setBlocksWithPer(updatedBlocksWithPer);
  };

  //Guarda monitoreo, respuestas y maneja el paso del modal
  const handleNextStep = async () => {
    if (monitoringStep === 1) {
      const isClientValid = selectedClientId !== "";
      const isFormValid = selectedFormId !== "";
      const isDateValid = monitoringDate !== "";

      setClientError(!isClientValid);
      setFormError(!isFormValid);
      setDateError(!isDateValid);

      setMonitoringStep(2);
    } else if (monitoringStep === 2) {
      // Verifica si todas las preguntas están respondidas
      const preguntasNoRespondidas = [];
      const nuevosErrores = {};

      for (const bloque of blocksWithPer) {
        for (const pregunta of bloque.preguntas) {
          const tipo = pregunta.id_type_question;

          const respondida =
            (tipo === 1 &&
              pregunta.seleccionMultiple &&
              pregunta.seleccionMultiple.length > 0) ||
            (tipo === 2 &&
              pregunta.respuestaSeleccionada !== undefined &&
              pregunta.respuestaSeleccionada !== "") ||
            (tipo === 3 &&
              pregunta.textoRespuesta &&
              pregunta.textoRespuesta.trim() !== "");

          if (!respondida) {
            preguntasNoRespondidas.push(pregunta.id);
            nuevosErrores[pregunta.id] = true;
          } else {
            nuevosErrores[pregunta.id] = false;
          }
        }
      }

      setErroresPorPregunta(nuevosErrores);
      if (preguntasNoRespondidas.length > 0) {
        Toast.fire({
          icon: "error",
          title: t("monitoringModal.AlertQuestion"),
        });
        return;
      }
      setMonitoringStep(3);
    } else if (monitoringStep === 3) {
      const payload = {
        monitoringDate,
        id_user_monitor: userInfo.id,
        id_user_agent: idToEdit, // correcto: id del agente monitoreado
        id_form: selectedFormId,
        score: calFormScore(),
        feedback,
        answers: [],
      };

      for (const bloque of blocksWithPer) {
        for (const pregunta of bloque.preguntas) {
          let answer_value = null;

          if (pregunta.id_type_question === 1) {
            if (
              pregunta.seleccionMultiple &&
              pregunta.seleccionMultiple.length > 0
            ) {
              const opciones = pregunta.select_option
                .split(",")
                .map((o) => o.trim());
              const indicesSeleccionados = pregunta.seleccionMultiple
                .map((opcionSeleccionada) =>
                  opciones.indexOf(opcionSeleccionada)
                )
                .filter((index) => index !== -1);
              answer_value = indicesSeleccionados.join(",");
            }
          } else if (pregunta.id_type_question === 2) {
            if (
              pregunta.respuestaSeleccionada !== undefined &&
              pregunta.respuestaSeleccionada !== ""
            ) {
              answer_value = pregunta.respuestaSeleccionada;
            }
          } else if (pregunta.id_type_question === 3) {
            if (
              pregunta.textoRespuesta &&
              pregunta.textoRespuesta.trim() !== ""
            ) {
              answer_value = pregunta.textoRespuesta.trim();
            }
          }

          if (answer_value === null || answer_value === "") continue;

          payload.answers.push({
            question_id: pregunta.id,
            answer_question: answer_value,
          });
        }
      }

      try {
        const response = await saveMonitoringAndAnswers(payload);

        Toast.fire({
          icon: "success",
          title: t("alertCreateEdit.SuccessAlert"),
        });

        formClientReset();
      } catch (error) {
        let errorMessage = `${t("alertCreateEdit.ErrorAlert")}`;
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        Toast.fire({
          icon: "error",
          title: errorMessage,
        });
      }
    }
  };

  // Props que se pasan al modal principal para crear o editar monitorizaciones
  const modalAdminProps = {
    monitoringStep,
    setMonitoringStep,
    formClientReset,
    userName,
    loading,
    setLoading,
    selectedFormId,
    setSelectedFormId,
    handleFormSelect,
    selectedClientId,
    setSelectedClientId,
    openModal,
    userClients,
    handleClientChange,
    formOptions,
    callSelectedForm: formOptions.find((f) => f.id === Number(selectedFormId)),
    blocksForForm,
    userInfo,
    formattedDate,
    idToEdit,
    t,
    monitoringDate,
    setMonitoringDate,
    blocksWithPer,
    setBlocksWithPer,
    calBlocksPercentage,
    handleUpdatePregunta,
    calFormScore,
    clientError,
    setClientError,
    formError,
    setFormError,
    dateError,
    setDateError,
    feedbackError,
    setFeedbackError,
    erroresPorPregunta,
    setErroresPorPregunta,
    selectedBlockId,
    setSelectedBlockId,
    handleNextStep,
    open: isModalOpen,
    feedback,
    setFeedback,
  };

  // Props que se pasan al modal de solo visualización (consulta de datos del usuario)
  const modalViewAdminProps = {
    open: openViewModal,
    onClose: handleCloseViewModal,
    formatDateTimeShort,
    registration_date: { input: viewAdminData?.registration_date || "" },
    type: { input: viewAdminData?.type || "" },
    last_visit_date: { input: viewAdminData?.last_visit_date || "" },
    selectedClients: viewAdminData?.clients || [],
    firstName: { input: viewAdminData?.firstname || "" },
    middleName: { input: viewAdminData?.middlename || "" },
    lastName: { input: viewAdminData?.lastname || "" },
    state: { input: viewAdminData?.state || 0 },
    language: { input: viewAdminData?.language || "en" },
    email: { input: viewAdminData?.email || "" },
    userClients,
    t,
  };

  console.log("👀 Estado admins en render:", admins);

  return (
    <Box className="App" sx={{ overflow: "hidden" }}>
      <Box id="body">
        {loading && <p>Cargando...</p>}
        {userInfo?.type === 4 || userInfo === 3 ? <HeaderLT2 /> : <HeaderLT1 />}
        <Box
          sx={{
            lignItems: "stretch",
            flexWrap: "nowrap",
            padding: 0,
            display: "flex",
          }}
        >
          <Box className="container" mt={0}>
            {loading ? (
              <Typography variant="h6" sx={{ textAlign: "center", py: 5 }}>
                Cargando agentes...
              </Typography>
            ) : admins.length > 0 ? (
              <TableAdmin
                header={selectedKeys}
                data={admins}
                onUpdate={(payload) => openModal(2, payload)}
                onView={(payload) => openModalCont(payload)}
              />
            ) : (
              <Box sx={{ textAlign: "center", py: 5 }}>
                <Typography variant="h6">No existen agentes registrados</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <ModalAdmin {...modalAdminProps} />
      <ModalViewAdmin {...modalViewAdminProps} />
    </Box>
  );
};

export default AdminList;
