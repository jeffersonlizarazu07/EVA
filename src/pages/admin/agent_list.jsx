import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
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
  // URL del endpoint para obtener los administradores (agentes)
  const urlUsers = "http://localhost:3000/api/agent";
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
  // const [formClientReset, setFormClientReset] = useState(false); // Estado para resetear el formulario de cliente

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
  // Función para obtener todos los administradores desde el backend
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
      console.log("🔍 Obteniendo formularios para cliente ID:", clientId);

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

      console.log("✅ Respuesta exitosa:", response.data);
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
    console.log("🔄 Cliente seleccionado:", selectedId);

    // Limpiar estados previos
    setSelectedClientId(selectedId);
    setSelectedFormId("");
    setFormOptions([]);

    // Validar selección
    if (!selectedId || selectedId === "") {
      console.log("🔄 No hay cliente seleccionado");
      return;
    }

    // Convertir a número y validar
    const numericId = parseInt(selectedId, 10);

    if (isNaN(numericId) || numericId <= 0) {
      console.error("❌ ID de cliente inválido:", selectedId);
      Swal.fire({
        title: "Error",
        text: "ID de cliente inválido",
        icon: "error",
        confirmButtonText: "Ok",
      });
      return;
    }

    console.log("🔍 Buscando formularios para cliente:", numericId);

    // Obtener formularios
    const forms = await getFormsByClient(numericId);

    if (forms && Array.isArray(forms) && forms.length > 0) {
      console.log("✅ Formularios obtenidos:", forms.length);
      setFormOptions(forms);
    } else {
      console.log("⚠️ No se encontraron formularios");
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
        console.log("Monitorización guardada correctamente:", result);
        // Aquí podrías cerrar el modal o mostrar un mensaje de éxito
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

      // Limpiar estados de formularios
      setSelectedClientId("");
      setSelectedFormId("");
      setFormOptions([]);

      // Si hay un admin, trae los clientes que tiene asignado
      if (admin && admin.id) {
        try {
          console.log("🔍 Cargando datos para admin:", admin.id);

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

          console.log("✅ Admin y clientes cargados correctamente");
        } catch (error) {
          console.error("❌ Error cargando datos del admin:", error);
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

  const formClientReset = () => {
    // Reset de los select del formulario al cerrar el modal
    setSelectedClientId("");
    setSelectedFormId("");
    setFormOptions([]);
    setScore("");
    setFeedback("");
    setCheck(false);
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
                  <h4>No hay agentes registrados</h4>
                </div>
              )}
            </div>
          </div>
        </div>
        <div></div>
      </div>

      <div id="modalAdmin" className="modal fade" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <label className="h5">{userName || "Nuevo Agente"} </label>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="close"
                onClick={formClientReset}
              ></button>
            </div>

            <div className="modal-body">
              <h4 className="fw-bold mb-3">Crear una monitorización</h4>
              <h5 className="mb-3">Configuración de Monitorizaciones</h5>

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
                    onChange={(e) => {
                      console.log("Formulario seleccionado:", e.target.value);
                      setSelectedFormId(e.target.value);
                    }}
                    disabled={!selectedClientId || loading}
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

                  {/* Mensajes de estado mejorados */}
                  {selectedClientId && !loading && formOptions.length === 0 && (
                    <small className="text-warning d-block mt-1">
                      <i className="fas fa-exclamation-triangle"></i>
                      No hay formularios disponibles para este cliente
                    </small>
                  )}

                  {selectedClientId && formOptions.length > 0 && (
                    <small className="text-success d-block mt-1">
                      <i className="fas fa-check-circle"></i>
                      {formOptions.length} formulario(s) disponible(s)
                    </small>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Fecha de monitorización{" "}
                    <span className="text-danger">*</span>
                  </label>
                  <input type="date" className="form-control" />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Evaluador <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={
                      userInfo
                        ? `${userInfo.firstname || ""} ${
                            userInfo.lastname || ""
                          }`
                        : "Cargando..."
                    }
                    readOnly
                  />
                </div>

                <div className="col-12">
                  <div className="form-check">
                    <button
                      className="btn btn-link"
                      style={{
                        color: "white",
                        background: "rgba(175, 14, 110, 0.717)",
                      }}
                      type="button"
                      id="btnVerBloques"
                    >
                      Ver Bloques
                    </button>
                  </div>
                </div>
              </div>
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
              <button onClick={saveMonitoring} className="btn btn-primary">
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
