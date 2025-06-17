import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AsyncSelect from "react-select/async";
import makeAnimated from "react-select/animated";
import "../../assets/css/newUser.css";
import TableAdmin from "../../components/Tables/tableAgent";
import Swal from "sweetalert2";
import axios from "axios";
import SidebarLT1 from "../../components/aside/sidebarLT1";
import HeaderLT1 from "../../components/header/headerLT1";
import useInput from "../../components/hooks/useInput";
import { UserContext } from "../../context/UserContext";
import { Toast, smallAlertDelete } from "../../assets/js/alertConfig";
import { useTranslation } from "react-i18next";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import {
  getAdmins,
  getClients,
  getUserClients,
  getAgentById,
  getFormsByClient,
  getBlocksForIdForm,
} from "../../services/agent_listService";
import { formatDate, formatDateTimeShort } from "../../utils/dateUtils"; // Formatear fechas de la vista
import ModalAdmin from "../../components/Modals/modalAdminAgent_list";
import ModalViewAdmin from "../../components/Modals/modalViewAdminAgent_list";

const AdminList = () => {
  // Estados para guardar los datos de admins, clientes y clientes seleccionados
  const [admins, setAdmins] = useState([]); // Guarda todos los administradores
  const [admin, setAdmin] = useState([]); // Administrador seleccionado o en edición
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
  const { t, i18n } = useTranslation(); // Hook para traducciones y cambio de idioma dinámico
  const { accessToken, languageUser, clients, userInfo } =
    useContext(UserContext); // Accedo al contexto de usuario para obtener el token y el idioma actual del usuario
  const [loadingClients, setLoadingClients] = useState(false); // Estado para manejar la carga de clientes
  const [userName, setUserName] = useState(""); // Estado para guardar el nombre del usuario que se está creando o editando
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />; // Iconos para los checkboxes (vacío y seleccionado)
  const checkedIcon = <CheckBoxIcon fontSize="small" />; //Icono para checbox seleccionado
  const [monitoringStep, setMonitoringStep] = useState(1); // Manejo la vista actual dentro del modal de monitorización
  const [blocksForForm, setBlocksforForm] = useState([]); // Estado para menjar los bloques de un formulario
  const [monitoringDate, setMonitoringDate] = useState(""); // Control de la fecha de monitorización 

  // Hooks que se ejecutan al montar el componente o si cambia el idioma
  useEffect(() => {
    setFormattedDate(formatDate(new Date())); // Actualizo el estado con la fecha
    loadAdmins(); // Llamo a la función para obtener los administradores
    loadClients(); // Llamo a la función para obtener los clientes
  }, []); // Solo al montar

  useEffect(() => {
    i18n.changeLanguage(languageUser);
  }, [languageUser]); // Cambio del idioma según lo que tenga el usuario (Solo cuando cambie el idioma)

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

  //REQUEST//

  // Obtener todos los administradores (agentes) desde el backend
  const loadAdmins = async () => {
  try {
    setLoading(true);
    const data = await getAdmins(clients);
    setAdmins(data);
  } catch (error) {
    console.error("Error al cargar los administradores:", error);
    Toast.fire({
      icon: "error",
      title: "Error al cargar administradores"
    });
  } finally {
    setLoading(false);
  }
};

  // Función para obtener la lista de clientes registrados
  const loadClients = async () => {
    try {
      const data = await getClients();
      setListClients(data);
    } catch (error) {
      console.error("Error loading clients:", error);
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
      console.log("No hay cliente seleccionado");
      return;
    }

    // Convertir a número y validar
    const numericId = parseInt(selectedId, 10);

    if (isNaN(numericId) || numericId <= 0) {
      console.error("ID de cliente inválido:", selectedId);
      Swal.fire({
        title: "Error",
        text: "ID de cliente inválido",
        icon: "error",
        confirmButtonText: "Ok",
      });
      return;
    }

    // Obtener formularios
    const forms = await getFormsByClient(numericId);

    if (forms && Array.isArray(forms) && forms.length > 0) {
      setFormOptions(forms); // Cargar los formularios en el estado
    } else {
      setFormOptions([]);

      // Mostrar mensaje informativo al usuario
      if (forms === null) {
        // Error en la petición - ya se mostró el error
        return;
      } else {
        // Sin formularios disponibles
        Toast.fire({
          icon: "info",
          title: "No hay formularios disponibles para este cliente",
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
      setBlocksforForm(fetchedBlocks); // // Actualizar el estado con los bloques encontrados
      console.log("Bloques cargados:", fetchedBlocks);
    } else {
      Toast.fire({
        icon: "info",
        title: "No existen bloques creados para este formulario",
      });
      setBlocksforForm([]); // Limpiar bloques si no existen
    }
  };

  // Maneja la selección de un formulario, y carga sus bloques
  const handleFormSelect = async (e) => {
    const selectedId = e.target.value;
    setSelectedFormId(selectedId); // actualizar ID del formulario

    await handleLoadBlocks(e); // también carga los bloques asociados al formulario seleccionado
  };

  // Guarda una nueva monitorización en el sistema
  const handleSaveMonitoring = async (score, feedback, check, agentId) => {
    const payload = {
      monitoring_date: new Date().toISOString().slice(0, 10),
      score, // Puntuación total de la monitorización
      feedback, // Comentarios u observaciones
      check, // Checklist o validación binaria
      id_user: agentId, // ID del agente evaluado
      id_form: selectedFormId, // ID del formulario aplicado
    };

    try {
      const result = await saveMonitoring(payload); // Enviar datos al backend
      console.log("Monitorización guardada exitosamente:", result);
      return result;
    } catch (error) {
      console.error("Error al guardar la monitorización:", error);
      throw error;
    }
  };

  // MODALS //

  // Abrir el modal para iniciar con el monitoreo
  const openModal = async (op, admin) => {
    setOperation(op);

    // Si la operación es 1, es para registrar
    if (op == 1) {
      // Limpiar los valores del formulario
      firstName.handleChange("");
      lastName.handleChange("");
      firstName.handleChange("");
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
        lastName.handleChange(agentData?.lastname || "");
        firstName.handleChange(agentData?.firstname || "");
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
    // Trae los clientes del usuario
    await loadUserClients(admin.id);

    // Obtenemos los datos completos del agente
    const agentData = await getAgentById(admin.id);

    // Cambio el título del modal a "Información"
    setTitle("Información");

    // Cargo la información del admin en los inputs
    lastName.handleChange(agentData?.lastname || "");
    firstName.handleChange(agentData?.firstname || "");
    middleName.handleChange(agentData?.middlename || "");
    email.handleChange(agentData?.email || "");
    password.handleChange("");
    type.handleChange(agentData?.type || "");
    state.handleChange(agentData?.state || "");
    language.handleChange(agentData?.language || "en");
    registration_date.handleChange(agentData?.registration_date || "");
    last_visit_date.handleChange(agentData?.last_visit_date || "Nunca");

    // Guardo el id del admin consultado
    setidToEdit(agentData?.id);

    // Guarda el nombre completo para mostrarlo en el modal
    setUserName(
      `${agentData?.firstname || ""} ${agentData?.middlename || ""} ${
        agentData?.lastname || ""
      }`.trim()
    );
  };

  // Resetea los estados del formulario y del modal al cerrarlo
  const formClientReset = () => {
    setSelectedClientId("");
    setSelectedFormId("");
    setFormOptions([]);
    // setCheck(false);
    setMonitoringStep(1); // Reinicia a la primera vista del modal
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
    handleSaveMonitoring,
    idToEdit,
    t,
    monitoringDate,
    setMonitoringDate
  };

  // Props que se pasan al modal de solo visualización (consulta de datos del usuario)
  const modalViewAdminProps = {
    formatDateTimeShort,
    registration_date,
    type,
    last_visit_date,
    selectedClients,
    firstName,
    middleName,
    lastName,
    state,
    language,
    email,
    listClients,
    t,
  };

  return (
    <div className="App">
      <div id="body">
        {loading && <p>Cargando...</p>}
        <HeaderLT1 />
        <div className="row m-0">
          <div className="col-1 d-none d-flex  align-items-center ms-0 p-0">
            {/* <SidebarLT1 /> */}
          </div>
          <div className="col-12">
            <div className="container-fluid mt-0 mx-auto">
              {admins.length > 0 ? (
                <TableAdmin
                  header={selectedKeys}
                  data={admins}
                  modalId={"modalAdmin"}
                  modalId2={"modalViewAdmin"}
                  onUpdate={(payload) => openModal(2, payload)}
                  onView={(payload) => openModalCont(payload)}
                />
              ) : (
                <div className="text-center py-5">
                  <h4>No existen agentes registrados</h4>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ModalAdmin {...modalAdminProps} />
      <ModalViewAdmin {...modalViewAdminProps} />
    </div>
  );
};

export default AdminList;
