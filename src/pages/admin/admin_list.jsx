import React, { useState, useEffect, useContext } from "react";
import AsyncSelect from "react-select/async";
// import Select from "react-select";
import makeAnimated from "react-select/animated";
import "../../assets/css/newUser.css";
import TableAdmin from "../../components/Tables/tableAdmin";
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
  // //todo Poner Tokens const {accessToken, RefreshToken} = useAuth(AuthContext)

  const urlUsers = "http://localhost:8000/api/user";
  const urlUsersClients = "http://localhost:8000/api/user_clients";
  const [admins, setAdmins] = useState([]);
  const [clients, setClients] = useState([]);
  const [operation, setOperation] = useState([1]);
  const [title, setTitle] = useState();
  const [idToEdit, setidToEdit] = useState(null);
  const [formattedDate, setFormattedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [userclients, setUserClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const { t, i18n } = useTranslation();
  const { accessToken, languageUser } = useContext(UserContext);
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const formattedDater = `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`;
    setFormattedDate(formattedDater);
    getAdmins();
    i18n.changeLanguage(languageUser);
    getClients();
  }, [languageUser]);
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const selectedKeys = ["firstname", "lastname", "type", "state"];
  const lastName = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });
  const firstName = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });
  const middleName = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });
  const email = useInput({
    defaultValue: "",
    validate: /^[^\s@]+@[^\s@]+\.[^\s@]*$/,
  });
  const password = useInput({
    defaultValue: "",
    validate:
      /^(?=.[A-Z])(?=.[a-z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%?&]{8,15}$/,
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

  //REQUEST//
  const getAdmins = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/users`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setAdmins(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getClients = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/clients`,
        config
      );
      setClients(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getUserClients = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/user_client/${id}`,
        config
      );
      const responseData = response.data.data;
      console.log(responseData);
      setSelectedClients(responseData.map((client) => client.idClient));
      console.log({ selectedClients });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  const sendData2 = async (metodo, parametros1) => {
    if (metodo.toUpperCase() === "POST") {
      const duplicados = admins.find((u) => u.email === parametros1.email);
      if (duplicados) {
        alert("Este administrador ya existe");
        return;
      }
      try {
        await axios
          .post(`${urlUsers}s`, parametros1, config)
          .then(function (respuesta) {
            console.log("Response: ", respuesta);
            sendClients(respuesta.data.data.id, 1)
            document.getElementById("btnCerrar").click();
            getAdmins();
          })
          .catch(function (error) {
            console.log("Error: ", error);
          });
      } catch {
        console.error("Error:", error);
      }
    } else if (metodo.toUpperCase() == "PUT") {
      try {
        await axios
          .put(`${urlUsers}/${idToEdit}`, parametros1, config)
          .then(function (respuesta) {
            console.log("Respuesta: ", respuesta);
            sendClients(respuesta.data.data.id, 2);
            document.getElementById("btnCerrar").click();
            getAdmins();
          })
          .catch(function (error) {
            console.log("Error: ", error);
          });
      } catch {
        console.log("Error:", error);
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
        const respuesta = await axios.post(`${urlUsersClients}`, parametros, config);
        console.log("Response: ", respuesta);
      } catch (error) {
        console.log("Error: ", error);
      }
    } else if (metodo == 2) {
      const parametros = {
        "clientIds": selectedClients.map((client) => (
          client
        ))
      };
      try {
        const respuesta = await axios.put(`${urlUsersClients}/${id}`, parametros, config);
        console.log("Response: ", respuesta);
      } catch (error) {
        console.log("Error: ", error);
      }
    }

  };

  const deactivateUser = (admin) => {
    const url = `http://localhost:8000/api/user`;
    const id = admin.id;
    const name = admin.firstname;
    const parametros = {
      state: 0,
    };
    smallAlertDelete
      .fire({
        text: `${t("alertDeactivate.InitialPhrase")}${name} ${t(
          "alertDeactivate.FinalPhrase"
        )}`,
        showCancelButton: true,
        confirmButtonText: `${t("alertDeactivate.Confirm")}`,
        cancelButtonText: `${t("alertDeactivate.Cancel")}`,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.patch(`${url}/${id}`, parametros, config);
            // getAdmins();
          } catch (error) {
            alert("error", "Error al eliminar el admin");
            console.error(error);
          }
        }
        getAdmins();
      });
  };

  const activeUser = (admin) => {
    const url = `http://localhost:8000/api/user`;
    const id = admin.id;
    const name = admin.firstname;
    const parametros = {
      state: 1,
    };
    smallAlertDelete
      .fire({
        text: `${t("alertActivate.InitialPhrase")} ${name} ${t(
          "alertActivate.FinalPhrase"
        )}`,
        showCancelButton: true,
        confirmButtonText: `${t("alertActivate.Confirm")}`,
        cancelButtonText: `${t("alertActivate.Cancel")}`,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.patch(`${url}/${id}`, parametros, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            Toast.fire({
              icon: "success",
              title: `${t("alertActivate.InitialPhrase")} ${
                admin.firstname
              } ${t("alertActivate.SuccessAlert")}`,
            });

            // getAdmins();
          } catch (error) {
            Toast.fire({
              icon: "error",
              title: `${t("alertActivate.InitialPhrase")}${admin.firstName}${t(
                "alertActivate.ErrorAlert"
              )}`,
            });
            console.error(error);
          }
        }
        getAdmins();
      });
  };

  //REQUEST//

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
      /* userxClients.handleChange(clientes) */
    } else if (op == 2) {
      getUserClients(admin.id);
      setTitle(t("UserModal.EditUser"));
      lastName.handleChange(admin?.lastname || "");
      firstName.handleChange(admin?.firstname || "");
      middleName.handleChange(admin?.middlename || "");
      email.handleChange(admin?.email || "");
      password.handleChange(admin?.password || "");
      type.handleChange(admin?.type || "");
      state.handleChange(admin?.state || "");
      language.handleChange(admin?.language || "en");
      setidToEdit(admin?.id);
    }
  };

  const openModalCont = async (admin) => {
    await getUserClients(admin.id);
    setTitle("Información");
    lastName.handleChange(admin?.lastname || "");
    firstName.handleChange(admin?.firstname || "");
    middleName.handleChange(admin?.middlename || "");
    email.handleChange(admin?.email || "");
    password.handleChange(admin?.password || "");
    type.handleChange(admin?.type || "");
    state.handleChange(admin?.state || "");
    language.handleChange(admin?.language || "en");
    registration_date.handleChange(admin?.created_at || "");
    last_visit_date.handleChange(admin?.updated_at || "Nunca");
    setidToEdit(admin?.id);
  };

  const formatDate = (dateTimeString) => {
    const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}Z$/;
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
    if (
      lastName.input.trim() == "" ||
      firstName.input.trim() == "" ||
      email.input.trim() == "" ||
      type.input == ""
    ) {
      console.log("Hola");
      alert("Campos mal diligenciados");
    } else {
      if (operation === 1) {
        parametros = {
          lastname: lastName.input,
          firstname: firstName.input,
          middlename: middleName.input,
          email: email.input,
          password: password.input,
          type: type.input,
          language: "es",
          registration_date: formattedDate,
          last_visit_date: "0000-00-00 00:00:00",
        };
        metodo = "post";
      } else if (operation === 2) {
        parametros = {
          lastname: lastName.input,
          firstname: firstName.input,
          middlename: middleName.input,
          email: email.input,
          password: password.input,
          type: type.input,
          language: "es",
          registration_date: "0000-00-00",
          last_visit_date: "0000-00-00 00:00:00",
        };
        metodo = "put";
      }
      console.log(parametros);

      sendData2(metodo, parametros);
    }
  };

  //? Select //

  const onChange = (event, value) => {
    const selectedClientIds = value.map((client) => client.id);
    console.log(selectedClientIds);

    setSelectedClients(selectedClientIds);
  };

  //? Select //

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
            <div className="container mt-0 ms-0">
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
                      placeholder=" "
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
                      placeholder=" "
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
                      placeholder=" "
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
                    options={clients}
                    disableCloseOnSelect
                    onChange={onChange}
                    getOptionLabel={(option) => option.client}
                    value={clients.filter((client) =>
                      selectedClients.includes(client.id)
                    )}
                    renderOption={(props, option, { selected }) => (
                      <li key={option.id} {...props}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.client}
                      </li>
                    )}
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
                      placeholder=" "
                      type="text"
                      name="email"
                      value={email.input}
                      onChange={(e) => email.handleChange(e.target.value)}
                    />
                    <span className="labelName">{t("UserModal.Email")}:</span>
                  </label>
                </div>
                <div className="col mb-3">
                  <label id="labelAnimation">
                    <input
                      className="input-new"
                      placeholder=" "
                      type="password"
                      name="password"
                      onChange={(e) => password.handleChange(e.target.value)}
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
                      placeholder=" "
                      type="password"
                      name="cPassword"
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
                      className="input-new text-center"
                      name="type"
                      onChange={(e) => type.handleChange(e.target.value)}
                      value={type.input}
                    >
                      <option value="0" disabled selected>
                      {t("UserModal.SelectRole")}
                      </option>
                      <option value="1">{t("UserModal.SuperAdmin")}</option>
                      <option value="2">{t("UserModal.Admin")}</option>
                      <option value="3">{t("UserModal.Editor")}</option>
                      <option value="4">{t("UserModal.Viwer")}</option>
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
                  />
                </div>
                <div className="m-1 p-1">
                  <span className="fw-semibold ">
                    {t("viewUserModal.Role")}
                  </span>
                  <p type="text" className="form-control mt-1">
                    {" "}
                    {` ${
                      type.input === 1
                        ? "Super Administrador"
                        : type.input === 2
                        ? "Administrador"
                        : type.input == 3
                        ? "Editor"
                        : "Visualizador"
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
                        const client = clients.find((c) => c.id === clientId);
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
