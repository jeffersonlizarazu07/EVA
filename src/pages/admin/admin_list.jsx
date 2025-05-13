import React, { useState, useEffect, useContext } from "react";
import AsyncSelect from "react-select/async";
// import Select from "react-select";
import makeAnimated from "react-select/animated";
import "../../assets/css/newUser.css";
import TableAdmin from "../../components/Tables/tableAdmin";
import Swal from "sweetalert2";
import axios from "axios";
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
  // URL base para los usuarios (admins) y para los usuarios-clientes
  const urlUsers = "http://localhost:3000/api/users";
  const urlUsersClients = "http://localhost:3000/api/users_client";

  // Estados principales del componente
  const [admins, setAdmins] = useState([]); // Lista de admins cargados desde el backend
  const [listClients, setListClients] = useState([]); // Lista de clientes cargados desde el backend
  const [operation, setOperation] = useState([1]); // Tipo de operación (crear o editar)
  const [title, setTitle] = useState(); // Título dinámico del modal
  const [idToEdit, setidToEdit] = useState(null); // ID del admin que se está editando
  const [formattedDate, setFormattedDate] = useState(""); // Fecha actual formateada
  const [loading, setLoading] = useState(false); // Bandera de carga (puede ser útil)
  const [userclients, setUserClients] = useState([]); // Relación de clientes por usuario
  const [selectedClients, setSelectedClients] = useState([]); // Clientes seleccionados para un admin

  // Traducción e idioma desde el contexto global del usuario
  const { t, i18n } = useTranslation();
  const { accessToken, languageUser, setClients, userId, clients } = useContext(UserContext);

  // Íconos para los checkboxes (Material UI)
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  // Se ejecuta cuando cambia el idioma del usuario o se monta el componente
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    // Formateo de la fecha (YYYY-MM-DD)
    const formattedDater = `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`;

    // Cargo admins y clientes desde el backend
    setFormattedDate(formattedDater);
    getAdmins();

    // Cambio el idioma actual del usuario
    i18n.changeLanguage(languageUser);
    getClients();
  }, [languageUser]);
  const config = {
    withCredentials: true,
  };
  // Llaves para campos específicos al mostrar data
  const selectedKeys = ["firstname", "lastname", "type", "state"];
  const lastName = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });
  const firstName = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });
  const middleName = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });
  const email = useInput({
    defaultValue: "",
    validate: /^[^\s@]+@[^\s@]+\.[^\s@]*$/,
  });
  const cPassword = useInput({ defaultValue: "" });
  const password = useInput({
    defaultValue: "",
    validate: (value) =>
      value === "" ||
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,15}$/.test(
        value
      ),
  });

  const type = useInput({ defaultValue: "", validate: /^[1-4]+$/ });
  const state = useInput({ defaultValue: "", validate: /^[0-1]+$/ });
  const language = useInput({ defaultValue: "", validate: /^(es|en|it|pt)$/ });
  const registration_date = useInput({
    defaultValue: "",
    validate: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
  });
  const last_visit_date = useInput({
    defaultValue: "",
    validate: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
  });

  // ----------- PETICIONES A LA API ----------- //
  // Obtener todos los admins
  const getAdmins = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/users`, {
        withCredentials: true,
      });
      setAdmins(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Obtener todos los clientes
  const getClients = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/clients`, {
        withCredentials: true,
      });
      setListClients(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Obtener los clientes asignados a un admin específico
  const getUserClients = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/users_client/${id}`,
        { withCredentials: true }
      );
      const responseData = response.data.data;
      console.log("respues", response.data.data);
      setSelectedClients(responseData.map((client) => client.idClient));
      console.log({ selectedClients });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Envío de datos al servidor (crear o editar admin)
  const sendData2 = async (metodo, { password, cPassword, ...rest }) => {
    if (selectedClients.length === 0) {
      Toast.fire({
        icon: "warning",
        title: t("UserModal.AssignClient"),
      });
      return;
    }
  
    if (password && cPassword !== password) {
      Toast.fire({
        icon: "error",
        title: t("UserModal.PasswordMismatch"),
      });
      return;
    }

    const nombre = rest.firstname; // Se usará para el mensaje dinámico

    // PUT
    if (metodo.toUpperCase() === "PUT") {
      if (!password || password.trim() === "") {
        delete rest.password;
      } else {
        rest.password = password;
      }
  
      
      try {
        const respuesta = await axios.put(
          `${urlUsers}/${idToEdit}`,
          rest,
          config
        );
      
        const envioC = await sendClients(respuesta.data.data.id, 2);
        if(envioC ){
          if (idToEdit ==  userId){
            try {
              const response = await axios.get(`http://localhost:3000/api/users/${userId}/clients`, config);
              if(response.status == 200){
                setClients(response.data.data);
                console.log("clientes", clients);
                console.log("respuesta", response.data.data);
              }
            }catch (error) {
              console.error("Error fetching data:", error);
            }
          }
        }
        Toast.fire({
          icon: "success",
          title: `${nombre}${t("alertCreateEdit.SuccessAlert")}`,
        });
  
        document.getElementById("btnCerrar").click();
        getAdmins();
      } catch (error) {
        console.error("Error:", error);
        Toast.fire({
          icon: "error",
          title: `${nombre} - ${t("alertCreateEdit.ErrorAlert")}`,
        });
      }
    }

    // POST
    if (metodo.toUpperCase() === "POST") {
      const duplicados = admins.find((u) => u.email === rest.email);
      if (duplicados) {
        Toast.fire({
          icon: "error",
          title: t("UserModal.DuplicatedUser"),
        });
        return;
      }
  
      try {
        const respuesta = await axios.post(`${urlUsers}`, { ...rest, password }, config);
  
        sendClients(respuesta.data.data.id, 1);
  
        Toast.fire({
          icon: "success",
          title: `${nombre}${t("alertCreateEdit.SuccessAlert")}`,
        });
  
        document.getElementById("btnCerrar").click();
        getAdmins();
      } catch (error) {
        console.error("Error: ", error);
        Toast.fire({
          icon: "error",
          title: `${nombre} - ${t("alertCreateEdit.ErrorAlert")}`,
        });
      }
    }
  };

  const sendClients = async (id, metodo) => {
    if (metodo == 1) {
      const parametros = selectedClients.map((client) => ({
        idUser: id,
        clientId: client,
      }));
      try {
        const respuesta = await axios.post(
          `${urlUsersClients}`,
          parametros,
          config
        );
        console.log("Response: ", respuesta);
      } catch (error) {
        console.log("Error: ", error);
      }
    } else if (metodo == 2) {
      const parametros = {
        clientIds: selectedClients.map((client) => client),
      };
      try {
        const respuesta = await axios.put(
          `${urlUsersClients}/${id}`,
          parametros,
          config
        );
        if(respuesta.status == 200){
         return true;
        }
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  };
  const deactivateUser = (admin) => {
    const url = `http://localhost:3000/api/users`;
    const id = admin.id;
    const name = admin.firstname;
  
    // Estado a enviar: 0 = desactivado
    const parametros = { state: 0 };
  
    // Confirmación antes de desactivar
    smallAlertDelete
      .fire({
        toast: false,
        icon: "warning",
        title: "Deshabilitar elemento",
        text: `${t("alertDeactivate.InitialPhrase")} ${name} ${t(
          "alertDeactivate.FinalPhrase"
        )}`,
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#b62a8b",
        customClass :{
          actions: 'swal2-actions-center ', 
          icon: 'icono-personalizado',
          title: 'titulo-pequeno',
        },

      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.patch(`${url}/${id}`, parametros, {
              withCredentials: true,
            });
  
            // Notificación de éxito al desactivar
            Toast.fire({
              icon: "success",
              title: `${t("alertDeactivate.InitialPhrase")} ${name}${t(
                "alertDeactivate.SuccessAlert"
              )}`,
            });
          } catch (error) {
            // Notificación de error al desactivar
            Toast.fire({
              icon: "error",
              title: `${t("alertDeactivate.InitialPhrase")} ${name}${t(
                "alertDeactivate.ErrorAlert"
              )}`,
            });
            console.error(error);
          }
        }
        getAdmins(); // Refrescar lista de admins
      });
  };  
  
  const activeUser = (admin) => {
    const url = `http://localhost:3000/api/users`;
    const id = admin.id;
    const name = admin.firstname;
  
    // Estado a enviar: 1 = activo
    const parametros = { state: 1 };
  
    smallAlertDelete
      .fire({
        icon: "warning",
        toast: false,
        title: "Activar elemento",
        text: `${name} ${t("alertActivate.FinalPhrase")}`,
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#b62a8b",
        customClass :{
          actions: 'swal2-actions-center ', 
          icon: 'icono-personalizado',
          title: 'titulo-pequeno',
        },
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.patch(`${url}/${id}`, parametros, {
              withCredentials: true,
            });
  
            // Notificación de éxito al activar
            Toast.fire({
              icon: "success",
              title: `${t("alertActivate.InitialPhrase")} ${
                admin.firstname
              } ${t("alertActivate.SuccessAlert")}`,
            });
          } catch (error) {
            // Notificación de error al activar
            Toast.fire({
              icon: "error",
              title: `${t("alertActivate.InitialPhrase")}${admin.firstName}${t(
                "alertActivate.ErrorAlert"
              )}`,
            });
            console.error(error);
          }
        }
        getAdmins(); // Refrescar lista de admins
      });
  };
  
  //MODALS//
  const openModal = (op, admin) => {
    setOperation(op);
    if (op == 1) {
      setTitle(t("UserModal.RegisterUser"));
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
    } else if (op == 2) {
      getUserClients(admin.id);
      setTitle(t("UserModal.EditUser"));
      lastName.handleChange(admin?.lastname || "");
      firstName.handleChange(admin?.firstname || "");
      middleName.handleChange(admin?.middlename || "");
      email.handleChange(admin?.email || "");
      password.handleChange("");
      type.handleChange(admin?.type || "");
      state.handleChange(admin?.state || "");
      language.handleChange(admin?.language || "en");
      registration_date.handleChange(admin?.registration_date || "");

      setidToEdit(admin?.id);
    }
  };

  const openModalCont = async (admin) => {
    console.log("admin completo:", admin);
    console.log("fecha:", admin.registration_date);

    await getUserClients(admin.id);
    setTitle("Información");
    lastName.handleChange(admin?.lastname || "");
    firstName.handleChange(admin?.firstname || "");
    middleName.handleChange(admin?.middlename || "");
    email.handleChange(admin?.email || "");
    password.handleChange("");
    type.handleChange(admin?.type || "");
    state.handleChange(admin?.state || "");
    language.handleChange(admin?.language || "en");
    registration_date.handleChange(admin?.registration_date || "");

    last_visit_date.handleChange(admin?.last_visit_date || "Nunca");
    setidToEdit(admin?.id);
  };

  const formatDate = (dateTimeString) => {
    const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{1,6}Z$/;
    if (regex.test(dateTimeString)) {
      const dateTime = new Date(dateTimeString);
      const day = dateTime.getDate().toString().padStart(2, "0");
      const month = (dateTime.getMonth() + 1).toString().padStart(2, "0");
      const year = dateTime.getFullYear();
      const hours = dateTime.getHours().toString().padStart(2, "0");
      const minutes = dateTime.getMinutes().toString().padStart(2, "0");
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } else {
      return dateTimeString;
    }
  };

  const validar = () => {
    var parametros;
    var metodo;
  
    // Imprime los valores para depurar
    console.log("lastName:", lastName.input);
    console.log("firstName:", firstName.input);
    console.log("email:", email.input);
    console.log("type:", type.input);
    console.log("registration_date:", registration_date.input);
  
    // Verificación de campos vacíos
    if (
      lastName.input.trim() == "" ||
      firstName.input.trim() == "" ||
      email.input.trim() == "" ||
      password.input.trim() == "" ||
      cPassword.input.trim() == "" ||
      type.input == ""
    ) {
      // Asegúrate de que `Toast` está correctamente configurado
      Toast.fire({
        icon: "error",
        title: t("alerts.fillRequiredFields"), // Verifica que `nombre` tiene valor
      });
      return; // Sale de la función si hay campos vacíos
    } else {
      // Si la validación pasa, asignamos los parámetros y el método
      if (operation === 1) {
        parametros = {
          lastname: lastName.input,
          firstname: firstName.input,
          middlename: middleName.input,
          email: email.input,
          password: password.input,
          cPassword: cPassword.input,
          type: type.input,
          language: "es",
        };
        metodo = "post";
      } else if (operation === 2) {
        parametros = {
          lastname: lastName.input,
          firstname: firstName.input,
          middlename: middleName.input,
          email: email.input,
          type: type.input,
          cPassword: cPassword.input,
          language: "es",
          registration_date: registration_date.input,
        };
        if (password.input.trim() !== "") {
          parametros.password = password.input;
        }
  
        metodo = "put";
      }
  
      console.log("Parametros:", parametros);
  
      sendData2(metodo, parametros); // Llamada a la función de envío de datos
    }
  };

  //? Select //

  const onChange = (event, value) => {
    const selectedClientIds = value.map((client) => client.id);
    console.log(selectedClientIds);

    setSelectedClients(selectedClientIds);
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
              {admins.length > 0 && (
                <TableAdmin
                  header={selectedKeys}
                  data={admins}
                  onCreate={() => openModal(1)}
                  onRemove={(item) => deactivateUser(item)}
                  modalId={"modalAdmin"}
                  modalId2={"modalViewAdmin"}
                  onUpdate={(payload) => openModal(2, payload)}
                  onView={(payload) => openModalCont(payload)}
                  onActive={(payload) => activeUser(payload)}
                />
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
              <label className="h5">{title}</label>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="close"
              ></button>
            </div>
            <div className="modal-body d-flex justify-content-between">
              <div className="row flex-column m-0 w-50">
                <div className="col text-center fs-4 mb-2">
                  {t("UserModal.UserData")}
                </div>
                <div className="col mb-3">
                  <label id="labelAnimation">
                    <input
                      placeholder=""
                      className="input-new"
                      type="text"
                      name="firstname"
                      value={firstName.input}
                      onChange={(e) => firstName.handleChange(e.target.value)}
                    />
                    <span className="labelName">
                      {t("UserModal.FirstName")}:
                    </span>
                  </label>
                </div>
                <div className="col mb-3">
                  <label id="labelAnimation">
                    <input
                      className="input-new"
                      placeholder=""
                      type="text"
                      name="middleName"
                      value={middleName.input}
                      onChange={(e) => middleName.handleChange(e.target.value)}
                    />
                    <span className="labelName">
                      {t("UserModal.MiddleName")}:
                    </span>
                  </label>
                </div>
                <div className="col mb-3">
                  <label id="labelAnimation">
                    <input
                      className="input-new"
                      placeholder=""
                      type="text"
                      name="lastname"
                      value={lastName.input}
                      onChange={(e) => lastName.handleChange(e.target.value)}
                    />
                    <span className="labelName">
                      {t("UserModal.LastName")}:
                    </span>
                  </label>
                </div>
                <div className="col mb-3">
                  <Autocomplete
                    multiple
                    limitTags={1}
                    id="checkboxes-tags-demo"
                    options={listClients}
                    disableCloseOnSelect
                    onChange={onChange}
                    getOptionLabel={(option) => option.client}
                    value={listClients.filter((client) =>
                      selectedClients.includes(client.id)
                    )}
                    // renderOption={(props, option, { selected }) => (
                    //   <li key={option.id} {...props}>
                    //     <Checkbox
                    //       icon={icon}
                    //       checkedIcon={checkedIcon}
                    //       style={{ marginRight: 8 }}
                    //       checked={selected}
                    //     />
                    //     {option.client}
                    //   </li>
                    // )}
                    renderOption={(props, option, { selected }) => {
                      const { key, ...rest } = props;
                      return (
                        <li key={option.id} {...rest}>
                          <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          {option.client}
                        </li>
                      );
                    }}
                    style={{ width: "100%" }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t("viewUserModal.Clients")}
                        placeholder={t("viewUserModal.Clients")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="row flex-column m-0 w-50">
                <div className="col text-center fs-4 mb-2">
                  {t("UserModal.AdminData")}
                </div>
                <div className="col mb-3">
                  <label id="labelAnimation">
                    <input
                      className="input-new"
                      placeholder=""
                      type="text"
                      name="email"                      
                      onChange={(e) => email.handleChange(e.target.value)}
                      value={email.input}
                    />
                    <span className="labelName">{t("UserModal.Email")}:</span>
                  </label>
                </div>
                <div className="col mb-3">
                  <label id="labelAnimation">
                    <input
                      className="input-new"
                      placeholder=""
                      type="password"
                      name="password"
                      onChange={(e) => password.handleChange(e.target.value)}
                      value={password.value}
                    />
                    <span className="labelName">
                      {t("UserModal.Password")}:
                    </span>
                  </label>
                </div>
                <div className="col mb-3">
                  <label id="labelAnimation">
                    <input
                      className="input-new"
                      placeholder=""
                      type="password"
                      name="cPassword"
                      onChange={(e) => cPassword.handleChange(e.target.value)}
                      value={cPassword.value}
                    />
                    <span className="labelName">
                      {t("UserModal.ConfirmPassword")}:
                    </span>
                    <small>
                      {t(
                        "headerlt.Leave_this_blank_if_you_dont_want_to_change_the_password"
                      )}
                    </small>
                  </label>
                </div>
                <div className="col mb-3">
                  <label id="labelAnimation">
                    <select
                      className="input-new input-optttt text-center"
                      name="type"
                      onChange={(e) => type.handleChange(e.target.value)}
                      value={type.input}
                    >
                      <option
                        value="0"
                        disabled
                        className="opt-default"
                      >
                        {t("UserModal.SelectRole")}
                      </option>
                      <option value="1" className="opt-superadmin">
                        {t("UserModal.SuperAdmin")}
                      </option>
                      <option value="2" className="opt-admin">
                        {t("UserModal.Admin")}
                      </option>
                      <option value="3" className="opt-editor">
                        {t("UserModal.Editor")}
                      </option>
                      <option value="4" className="opt-viewer">
                        {t("UserModal.Viwer")}
                      </option>
                    </select>
                    <span className="labelName">{t("UserModal.Type")}</span>
                  </label>
                </div>
                <div className="col mb-3"></div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                id="btnCerrar"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => setSelectedClients([])}
              >
                {t("UserModal.Close")}
              </button>
              <button
                onClick={() => validar(idToEdit)}
                className="btn-primary btn"
              >
                {t("UserModal.Save")}
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
                        : "Agente"
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
                        const client = listClients.find((c) => c.id === clientId);
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
