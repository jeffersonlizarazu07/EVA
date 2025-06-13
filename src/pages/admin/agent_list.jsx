import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AsyncSelect from "react-select/async";
// import Select from "react-select";
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

const AdminList = () => {
  // URL del endpoint para obtener los clientes
  const urlUsersClients = "http://localhost:3000/api/users_client";

  // Estados para guardar los datos de admins, clientes y clientes seleccionados
  const [admins, setAdmins] = useState([]);
  const [admin, setAdmin] = useState([]);
  const [listClients, setListClients] = useState([]);
  const [userClients, setUserClients] = useState([]);
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

  // Hook que se ejecuta al montar el componente o si cambia el idioma
  useEffect(() => {
    // Genero la fecha de hoy en formato yyyy-mm-dd
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const formattedDater = `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`;
    setFormattedDate(formattedDater); // Actualizo el estado con la fecha

    getAdmins(); // Llamo a la función para obtener los administradores
    i18n.changeLanguage(languageUser); // Cambio el idioma según lo que tenga el usuario
    getClients(); // Llamo a la función para obtener los clientes
  }, [languageUser]);

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
  const getAdmins = async () => {
    try {
      // Hago la petición a la API para traer los agentes
      const response = await axios.post(
        `http://localhost:3000/api/agent`,
        { clients },
        {
          withCredentials: true,
        }
      );

      // Guardo los datos de los admins en el estado
      setAdmins(response.data.data);
    } catch (error) {
      // Si algo sale mal, lo muestro en consola
      console.error("Error fetching data:", error);
    }
  };

  // Función para obtener la lista de clientes registrados
  const getClients = async () => {
    try {
      // Hago la petición a la API de clientes
      const response = await axios.get(`http://localhost:3000/api/clients`, {
        withCredentials: true,
      });

      // Guardo los datos en el estado de clientes
      setListClients(response.data.data);
    } catch (error) {
      // Capturo el error si ocurre
      console.error("Error fetching data:", error);
    }
  };

  // Función para obtener los clientes asignados a un usuario específico
  const getUserClients = async (id) => {
    try {
      // Hago la petición pasando el ID del usuario
      const response = await axios.get(
        `http://localhost:3000/api/users_client/${id}`,
        { withCredentials: true }
      );
      const responseData = response.data.data;

      if (responseData && responseData.length > 0) {
        // Guardo los IDs de los clientes seleccionados en el estado
        setSelectedClients(responseData.map((client) => client.idClient));

        setUserClients(
          responseData.map((client) => ({
            id: client.idClient,
            name: client.clientName,
          }))
        );
      } else {
        // Si no hay clientes, limpiar los estados
        setSelectedClients([]);
        setUserClients([]);
      }
    } catch (error) {
      console.error("Error fetching user clients:", error);
      // Limpiar estados en caso de error
      setSelectedClients([]);
      setUserClients([]);
    }
  };

  // Función para obtener un agente específico por ID
  const getAgentById = async (agentId) => {
    try {
      setLoading(true); // Mostrar indicador de carga

      const response = await axios.get(
        `http://localhost:3000/api/agent/${agentId}`,
        { withCredentials: true }
      );
      return response.data.data; // Retornar los datos del agente
    } catch (error) {
      console.error("Error obteniendo agente:", error);

      // Mostrar mensaje de error al usuario
      Swal.fire({
        title: "Error",
        text: "No se pudo obtener la información del agente",
        icon: "error",
        confirmButtonText: "Ok",
      });

      return null;
    } finally {
      setLoading(false); // Ocultar indicador de carga
    }
  };

  // Traer formularios asociados a un cliente seleccionado
  const getFormsByClient = async (clientId) => {
    try {
      setLoading(true);

      // Validar que clientId sea válido
      if (!clientId || isNaN(clientId)) {
        console.error("Client ID inválido:", clientId);
        return null;
      }

      // Convertir a número para asegurar el tipo correcto
      const numericClientId = parseInt(clientId, 10);

      if (numericClientId <= 0) {
        console.error("Client ID debe ser mayor a 0:", numericClientId);
        return null;
      }

      // Usar params en lugar de query string manual para mejor manejo
      const response = await axios.get(
        `http://localhost:3000/api/clients/forms`,
        {
          params: { clientId: numericClientId }, // Usar params para pasar el ID del cliente
          withCredentials: true,
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error completo:", error);
      console.error("Error response:", error.response);

      // Mostrar mensaje más específico según el error
      let errorMessage =
        "No se pudo obtener la información de los formularios del cliente seleccionado";

      if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || "ID de cliente inválido";
      } else if (error.response?.status === 404) {
        errorMessage = "No se encontraron formularios para este cliente";
      }

      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Ok",
      });
      return null;
    } finally {
      setLoading(false);
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
      setFormOptions(forms);
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

  const getBlocksForIdForm = async (formId) => {
    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:3000/api/blocks/form/${formId}`,
        {
          withCredentials: true,
        }
      );
      setLoading(false);
      console.log("Bloques cargados:", res.data.data);
      console.log(JSON.stringify(res.data.data, null, 2));
      return res.data.data;
    } catch (error) {
      console.error("Error al cargar bloques:", error);
      return [];
    }
  };

  const handleLoadBlocks = async (e) => {
    const selectedId = e.target.value;
    setSelectedFormId(selectedId);

    const fetchedBlocks = await getBlocksForIdForm(selectedId);

    if (fetchedBlocks && fetchedBlocks.length > 0) {
      setBlocksforForm(fetchedBlocks);
      console.log("Bloques cargados:", fetchedBlocks);
    } else {
      Toast.fire({
        icon: "info",
        title: "No existen bloques creados para este formulario",
      });
      setBlocksforForm([]); // Limpiar bloques si no existen
    }
  };

  useEffect(() => {
    console.log("Bloques actualizados:", blocksForForm);
  }, [blocksForForm]);

  const handleFormSelect = async (e) => {
    const selectedId = e.target.value;
    setSelectedFormId(selectedId); // actualizar ID del formulario

    await handleLoadBlocks(e); // también carga los bloques asociados
  };
  const saveMonitoring = async () => {
    const payload = {
      monitoring_date: new Date().toISOString().slice(0, 10),
      score,
      feedback,
      check,
      id_user: agentId,
      id_form: selectedFormId,
    };

    try {
      const response = await fetch("/api/monitoring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
      } else {
        console.error("Error al guardar la monitorización:", result.message);
      }
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };

  // MODALS //

  // abrir el modal para seguir con el monitoreo
  const openModal = async (op, admin) => {
    setOperation(op);

    // Si la operación es 1, es para registrar
    if (op == 1) {
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
          await getUserClients(admin.id);

          setTitle(
            `Crear monitorización para ${admin.firstname} ${admin.lastname}`
          );
          setidToEdit(admin.id);

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
        getUserClients(admin.id);

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
    await getUserClients(admin.id);

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

  // Función para formatear fechas que vienen del backend en formato ISO
  const formatDate = (dateTimeString) => {
    // Expresión regular para validar si el string es un formato ISO con milisegundos y zona horaria Z
    const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{1,6}Z$/;

    // Si la fecha cumple con el formato, la transformo
    if (regex.test(dateTimeString)) {
      const dateTime = new Date(dateTimeString);
      const day = dateTime.getDate().toString().padStart(2, "0");
      const month = (dateTime.getMonth() + 1).toString().padStart(2, "0");
      const year = dateTime.getFullYear();
      const hours = dateTime.getHours().toString().padStart(2, "0");
      const minutes = dateTime.getMinutes().toString().padStart(2, "0");

      // Retorno la fecha formateada en formato dd/mm/yyyy hh:mm
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } else {
      return dateTimeString; // Si no cumple con el formato, la devuelvo tal cual está
    }
  };

  // Resetea los estados del formulario y del modal al cerrarlo
  const formClientReset = () => {
    setSelectedClientId("");
    setSelectedFormId("");
    setFormOptions([]);
    setCheck(false);
    setMonitoringStep(1); // Reinicia a la primera vista del modal
  };

  const callSelectedForm = formOptions.find(
    (form) => form.id === Number(selectedFormId)
  );

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

      <div id="modalAdmin" className="modal fade" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
          <div className="modal-content">
            <div className="modal-header flex-column pb-1">
              {/* Botón volver arriba */}
              {monitoringStep === 2 && (
                <div className="w-100 d-flex justify-content-start mb-1">
                  <button
                    className="btn hola btn-block btn-sm btn-default btn-flat fw-bold acces-tabla  mb-2"
                    onClick={() => setMonitoringStep(1)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-arrow-90deg-left"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1.146 4.854a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H12.5A2.5 2.5 0 0 1 15 6.5v8a.5.5 0 0 1-1 0v-8A1.5 1.5 0 0 0 12.5 5H2.707l3.147 3.146a.5.5 0 1 1-.708.708z"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="btn-close mb-0"
                    data-bs-dismiss="modal"
                    aria-label="close"
                    onClick={formClientReset}
                  ></button>
                </div>
              )}

              {/* Info del modal: título y botón cerrar */}
              <div className="w-100 d-flex justify-content-between align-items-center">
                <label className="h5 mb-2">{userName || "Nuevo Agente"}</label>
              </div>
            </div>

            <div className="modal-body">
              {/*Primer vista del modal de monitorización*/}
              {monitoringStep === 1 && (
                <>
                  <h4 className="fw-bold mb-4">Crear una monitorización</h4>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Monitor Client</label>
                      <select
                        className="form-select"
                        value={selectedClientId || ""}
                        onChange={handleClientChange}
                        disabled={loading}
                      >
                        <option value="">Seleccione un cliente</option>
                        {userClients.map((client) => (
                          <option key={client.id} value={client.id}>
                            {client.name}
                          </option>
                        ))}
                      </select>
                      {loading && (
                        <small className="text-info">
                          <i className="fas fa-spinner fa-spin"></i> Cargando...
                        </small>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Monitorizaciones <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        value={selectedFormId || ""}
                        onChange={handleFormSelect}
                      >
                        <option value="">
                          {!selectedClientId
                            ? "Primero seleccione un cliente"
                            : loading
                            ? "Cargando formularios..."
                            : formOptions.length === 0
                            ? "No hay formularios disponibles"
                            : "Seleccionar formulario"}
                        </option>
                        {formOptions.map((form) => (
                          <option key={form.id} value={form.id}>
                            {form.title}
                          </option>
                        ))}
                      </select>

                      {/* Mensajes de estado */}
                      {selectedClientId &&
                        !loading &&
                        formOptions.length === 0 && (
                          <small className="text-warning d-block mt-1">
                            <i className="fas fa-exclamation-triangle"></i>
                            No hay formularios disponibles para este cliente
                          </small>
                        )}

                      {selectedClientId && formOptions.length > 0 && (
                        <small className="text-success d-block mt-1"></small>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Fecha de monitorización{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <input type="date" className="form-control ms-0" />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Evaluador <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control ms-0"
                        value={
                          userInfo
                            ? `${userInfo.firstname || ""} ${
                                userInfo.lastname || ""
                              }`
                            : "Cargando..."
                        }
                        readOnly
                      ></input>
                    </div>
                  </div>
                </>
              )}
              {/* Segunda vista del modal de monitorización */}
              {monitoringStep === 2 && (
                <div
                  className="col-12"
                  style={{ maxHeight: "65vh", overflowY: "auto", scrollbarWidth: "none" }}
                >
                  <h5 className="fw-bold mb-4 mt-0">
                    Configuración de Monitorizaciones
                  </h5>
                  <div className="shadowbox5 p-3">
                    <h4 className="text-center mb-3">
                      Información del Formulario
                    </h4>

                    <div className="infoForm d-flex align-items-center">
                      <p className="fw-bold mb-0 me-2">
                        Nombre del formulario:
                      </p>
                      <label className="mb-0">
                        {callSelectedForm?.title ||
                          "Formulario no seleccionado"}
                      </label>
                    </div>

                    <p className=" fw-bold m-0">Form Score:</p>

                    <div className="d-flex align-items-center">
                      <p className="fw-bold mb-0">Posible puntuación:</p>
                      <label className="m-0 p-0 ms-1">100%.</label>
                    </div>
                  </div>

                  <div className="shadowbox5 mb-4 mt-3 ms-0 ps-0 align-items-center">
                    <h4 className="text-center mt-3">Información del Bloque</h4>

                    {blocksForForm.length === 0 ? (
                      <p>
                        No se ha cargado o existe error al llamar los bloques.
                      </p>
                    ) : (
                      blocksForForm.map((block) => (
                        <div key={block.id} className="mb-4 pb-3">
                          <div className="w-100 border-bottom ps-3 mb-3">
                            <div className="d-flex mb-2">
                              <p className="fw-bold p-0 m-0">
                                Nombre del bloque:
                              </p>
                              <label className="ms-1">
                                {block.block_name}.
                              </label>
                            </div>

                            <div className="d-flex mb-3">
                              <p className="fw-bold mb-0">Puntuación:</p>
                              <label className="ms-1">
                                {block.percentage || "No existe puntuación"}.
                              </label>
                            </div>
                          </div>

                          {/* Preguntas */}
                          <div className="ms-3 mt-3">
                            <h6 className="fw-bold mb-2">Preguntas</h6>

                            {block.preguntas.length === 0 ? (
                              <p className="text-muted">
                                Este bloque no tiene preguntas registradas.
                              </p>
                            ) : (
                              <div
                                className="accordion me-3"
                                id={`accordionPreguntas-${block.id}`}
                              >
                                {block.preguntas.map((pregunta, idx) => (
                                  <div
                                    className="accordion-item"
                                    key={pregunta.id}
                                  >
                                    <h2
                                      className="accordion-header"
                                      id={`heading-${block.id}-${idx}`}
                                    >
                                      <button
                                        className="accordion-button collapsed"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target={`#collapse-${block.id}-${idx}`}
                                        aria-expanded="false"
                                        aria-controls={`collapse-${block.id}-${idx}`}
                                      >
                                        {pregunta.question_name}
                                      </button>
                                    </h2>
                                    <div
                                      id={`collapse-${block.id}-${idx}`}
                                      className="accordion-collapse collapse"
                                      aria-labelledby={`heading-${block.id}-${idx}`}
                                      data-bs-parent={`#accordionPreguntas-${block.id}`}
                                    >
                                      <div className="accordion-body">
                                        {/* Render dinámico por tipo */}
                                        {pregunta.id_type_question === 1 && (
                                          <select
                                            className="form-select"
                                            disabled
                                          >
                                            {(pregunta.select_option || "")
                                              .split(";")
                                              .map((opt, i) => (
                                                <option key={i}>{opt}</option>
                                              ))}
                                          </select>
                                        )}

                                        {pregunta.id_type_question === 2 && (
                                          <div>
                                            {(pregunta.select_option || "")
                                              .split(";")
                                              .map((opt, i) => (
                                                <div
                                                  className="form-check"
                                                  key={i}
                                                >
                                                  <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    disabled
                                                  />
                                                  <label className="form-check-label">
                                                    {opt}
                                                  </label>
                                                </div>
                                              ))}
                                          </div>
                                        )}

                                        {pregunta.id_type_question === 3 && (
                                          <textarea
                                            className="form-control"
                                            placeholder="Respuesta abierta..."
                                            disabled
                                          />
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                id="btnCerrar"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={formClientReset}
              >
                Cancelar
              </button>
              <button
                onClick={() => setMonitoringStep(2)}
                className="btn btn-primary"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div id="modalViewAdmin" className="modal fade" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div
              className="modal-header mb-0 pb-0"
              style={{ borderBottom: "none" }}
            >
              <label className="h5">{t("viewUserModal.UserDetails")}</label>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="close"
              ></button>
            </div>
            <div>
              {" "}
              <p
                style={{
                  marginLeft: "15px",
                  marginBottom: 0,
                  padding: 0,
                  color: "gray",
                  fontSize: "small",
                }}
              >
                Información detallada del perfil de usuario.
              </p>
            </div>
            <div className="modal-body d-flex ">
              <div className="col  m-2 ">
                <div className="m-1 p-1">
                  <label className="fw-semibold ">
                    {t("viewUserModal.Name")}
                  </label>
                  <input
                    type="text"
                    className="form-control mt-1"
                    value={`${firstName.input} ${middleName.input} ${lastName.input}`}
                    readOnly
                  />
                </div>
                <div className="m-1 p-1">
                  <span className="fw-semibold ">
                    {" "}
                    {t("viewUserModal.State")}
                  </span>
                  <p className="form-control mt-1">
                    {`${
                      state.input === 1
                        ? `${t("clientTable.Active")}`
                        : `${t("clientTable.Inactive")}`
                    }`}{" "}
                  </p>
                </div>
                <div className="m-1 p-1">
                  <span className="fw-semibold ">
                    {t("viewUserModal.RegisterDate")}
                  </span>
                  <p className="form-control mt-1">
                    {" "}
                    {formatDate(registration_date.input)}
                  </p>
                </div>
                <div className="m-1 p-1">
                  <span className="fw-semibold ">
                    {t("viewUserModal.Language")}
                  </span>
                  <p className="form-control mt-1">
                    {" "}
                    {`${
                      language.input == "es"
                        ? `${t("headerlt.Spanish")}`
                        : language.input == "en"
                        ? `${t("headerlt.English")}`
                        : language.input == "it"
                        ? `${t("headerlt.Italian")}`
                        : `${t("headerlt.Portuguese")}`
                    }`}
                  </p>
                </div>
              </div>
              <div className="col  m-2  ">
                <div className="m-1 p-1">
                  <span className="fw-semibold ">
                    {t("viewUserModal.Email")}
                  </span>
                  <input
                    type="text"
                    className="form-control mt-1"
                    value={email.input}
                    readOnly
                  />
                </div>
                <div className="m-1 p-1">
                  <span className="fw-semibold ">
                    {t("viewUserModal.Role")}
                  </span>
                  <p type="text" className="form-control mt-1 role-option">
                    {" "}
                    {` ${
                      type.input === 1
                        ? "Super Administrador"
                        : type.input === 2
                        ? "Administrador"
                        : type.input == 3
                        ? "Editor"
                        : type.input == 4
                        ? "Agente"
                        : "cual rol"
                    }`}{" "}
                  </p>
                </div>
                <div className="m-1 p-1">
                  <span className="fw-semibold ">
                    {t("viewUserModal.LastVisit")}
                  </span>
                  <p className="form-control mt-1">
                    {formatDate(last_visit_date.input)}{" "}
                  </p>
                </div>
                <div className="m-1 p-1">
                  <span className="fw-semibold ">
                    {t("viewUserModal.Clients")}
                  </span>

                  <ul className="form-control mt-1">
                    {selectedClients.length > 0 ? (
                      selectedClients.map((clientId) => {
                        const client = listClients.find(
                          (c) => c.id === clientId
                        );
                        return client ? (
                          <li key={client.id}>{client.client}</li>
                        ) : null;
                      })
                    ) : (
                      <li>{t("viewUserModal.NotClients")}</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminList;
