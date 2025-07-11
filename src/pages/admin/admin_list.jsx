import { useState, useEffect, useContext } from "react";
import "../../assets/css/newUser.css";
import TableAdmin from "../../components/Tables/tableAdmin";
import Swal from "sweetalert2";
import axios from "axios";
import HeaderLT1 from "../../components/header/headerLT1";
import useInput from "../../components/hooks/useInput";
import { UserContext } from "../../context/UserContext";
import { Toast, smallAlertDelete } from "../../assets/js/alertConfig";
import { useTranslation } from "react-i18next";
import {
  Modal,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  IconButton,
  Divider,
  MenuItem,
  Checkbox,
  Autocomplete
} from '@mui/material';

import {Close as CloseIcon, CloudUpload as CloudUploadIcon, Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import { use } from "react";

const AdminList = () => {
  //ocultar o mostrar los modales
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);

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
  const [selectedClients, setSelectedClients] = useState([]); // Clientes seleccionados para un admin

  // exportar solo agente
  const [agenteExport, setAgenteExport] = useState([]);

  // Traducción e idioma desde el contexto global del usuario
  const { t, i18n } = useTranslation();
  const { accessToken, languageUser, setClients, userId, clients } = useContext(UserContext);

  // Se ejecuta cuando cambia el idioma del usuario o se monta el componente

 
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    // Formateo de la fecha (YYYY-MM-DD)
    const formattedDater = `${year}-${month < 10 ? "0" + month : month}-${ day < 10 ? "0" + day : day }`;

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

  useEffect(() => {
    const agentes = admins
      .filter((admin) => admin.type === 4)
      .map((admin) => admin.firstname);

    setAgenteExport(agentes);
    console.log("Agentes export:", agentes);
  }, [admins]);


 
  
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
      const response = await axios.get("http://localhost:3000/api/users", {
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

    const nombre = rest.firstname;

    if (metodo.toUpperCase() === "PUT") {
      if (!password || password.trim() === "") {
        delete rest.password;
      } else {
        rest.password = password;
      }

      try {
        const respuesta = await axios.put(`${urlUsers}/${idToEdit}`, rest, config);

        if (respuesta.status >= 200 && respuesta.status < 300) {
          const envioC = await sendClients(respuesta.data.data.id, 2);

          if (envioC.success) {
            if (idToEdit == userId) {
              try {
                const response = await axios.get(
                  `http://localhost:3000/api/users/${userId}/clients`,
                  config
                );
                if (response.status === 200) {
                  setClients(response.data.data);
                }
              } catch (error) {
                console.error("Error fetching user clients:", error);
              }
            }

            Toast.fire({
              icon: "success",
              title: `${nombre}${t("alertCreateEdit.SuccessAlert")}`,
            });
            setOpenCreateModal(false);
            getAdmins();
          } else {
            Toast.fire({
              icon: "error",
              title: `Usuario actualizado, pero error al asignar clientes: ${envioC.error}`,
            });
            // No cerrar modal en este caso si lo prefieres
            getAdmins();
          }
        }
      } catch (error) {
        let errorMessage = `${nombre} - ${t("alertCreateEdit.ErrorAlert")}`;
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        Toast.fire({
          icon: "error",
          title: errorMessage,
        });
      }
    }

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

        if (respuesta.status >= 200 && respuesta.status < 300) {
          const envioC = await sendClients(respuesta.data.data.id, 1);

          if (envioC.success) {
            Toast.fire({
              icon: "success",
              title: `${nombre}${t("alertCreateEdit.SuccessAlert")}`,
            });
            setOpenCreateModal(false);
            getAdmins();
          } else {
            Toast.fire({
              icon: "error",
              title: `Usuario creado, pero error al asignar clientes: ${envioC.error}`,
            });
            getAdmins();
          }
        }
      } catch (error) {
        let errorMessage = `${nombre} - ${t("alertCreateEdit.ErrorAlert")}`;
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

  const sendClients = async (id, metodo) => {
    try{      
    if (metodo == 1) {
      const parametros = selectedClients.map((client) => ({
        idUser: id,
        clientId: client,
      }));
      
        const respuesta = await axios.post(
          `${urlUsersClients}`,
          parametros,
          config
        );
        console.log("Response: ", respuesta);
        if (respuesta.status >= 200 && respuesta.status < 300) {
          return { success: true, data: respuesta.data };
        }
    } else if (metodo == 2) {
      const parametros = {
        clientIds: selectedClients.map((client) => client),
      };      
        const respuesta = await axios.put(
          `${urlUsersClients}/${id}`,
          parametros,
          config
        );
        if (respuesta.status >= 200 && respuesta.status < 300) {
        return { success: true, data: respuesta.data };
      }      
    }
    }catch (error) {
      console.error("Error: ", error);
      // Obtener mensaje de error del servidor
      let errorMessage = "Error al asignar clientes al usuario";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      
      return { 
        success: false, 
        error: errorMessage,
        status: error.response ? error.response.status : 500
      };
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
  // Manejo cerrar modal
  const handleModalClose = () => {
    setOpenCreateModal(false);
    setOpenViewModal(false);
    setSelectedClients([]);  // Limpia selección si quieres
  };

  // Función abrir modal
  const openModal = (op, admin) => {
    setSelectedClients([]);
    setOperation(op);
    if (op === 1) {
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
    } else if (op === 2) {
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

    // Aquí abrir el modal
    setOpenCreateModal(true);
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

    // Aquí abres el modal de MUI y defines que la operación sea "ver"
    setOperation(3);          // 3 = Ver info user
    setOpenViewModal(true); // abrir modal
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
    <Box className="App" sx={{ overflow: "hidden" }}>
      <Box id="body">
        {loading && <p>Cargando...</p>}
        <HeaderLT1 />
        <Box sx={{ alignItems: "stretch", flexWrap: "nowrap", padding: 0, display : "flex" }}>
          {/* <SidebarLT1 /> */}
          <Box className="container" mt={0}>
            {admins.length > 0 && (
              <TableAdmin
                header={selectedKeys}
                data={admins}
                onCreate={() => openModal(1)}
                onRemove={(item) => deactivateUser(item)}
                onUpdate={(payload) => openModal(2, payload)}
                onView={(payload) => openModalCont(payload)}
                onActive={(payload) => activeUser(payload)}
              />
            )}
          </Box>
        </Box>
      </Box>

      {/*Modal de crear/editar*/}
      <Modal
        open={openCreateModal}
        onClose={handleModalClose}
        aria-labelledby="user-modal-title"
      >
        <Box className="modalBox">
          <Paper elevation={0} sx={{ borderRadius: 2 }}>
            {/* Encabezado */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                {title}
              </Typography>
              <IconButton onClick={handleModalClose}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Cuerpo */}
            <Box sx={{ px: 3, pb: 3 }}>
              <Grid container spacing={3}>
                {/* Columna izquierda */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" sx={{ mb: 3 }} gutterBottom>
                    {t("UserModal.UserData")}
                  </Typography>

                  <TextField
                    fullWidth
                    label={t("UserModal.FirstName")}
                    value={firstName.input}
                    onChange={(e) => firstName.handleChange(e.target.value)}
                    sx={{ mb: 2 }}
                    className="readOnlyField"
                  />
                  <TextField
                    fullWidth
                    label={t("UserModal.MiddleName")}
                    value={middleName.input}
                    onChange={(e) => middleName.handleChange(e.target.value)}
                    sx={{ mb: 2 }}
                    className="readOnlyField"
                  />
                  <TextField
                    fullWidth
                    label={t("UserModal.LastName")}
                    value={lastName.input}
                    onChange={(e) => lastName.handleChange(e.target.value)}
                    sx={{ mb: 2 }}
                    className="readOnlyField"
                  />
                  <Autocomplete
                    multiple
                    options={listClients}
                    disableCloseOnSelect
                    getOptionLabel={(option) => option.client}
                    onChange={onChange}
                    value={listClients.filter(client => selectedClients.includes(client.id))}
                    renderOption={(props, option, { selected }) => (
                      <li {...props} key={option.id}>
                        <Checkbox checked={selected} style={{ marginRight: 8 }} />
                        {option.client}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField {...params} label={t("viewUserModal.Clients")} placeholder={t("viewUserModal.Clients")} />
                    )}
                    sx={{ mb: 2 }}
                    className="readOnlyField"
                  />
                </Grid>

                {/* Columna derecha */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" sx={{ mb: 3 }} gutterBottom>
                    {t("UserModal.AdminData")}
                  </Typography>

                  <TextField
                    fullWidth
                    label={t("UserModal.Email")}
                    value={email.input}
                    onChange={(e) => email.handleChange(e.target.value)}
                    sx={{ mb: 2 }}
                    className="readOnlyField"
                  />
                  <TextField
                    fullWidth
                    label={t("UserModal.Password")}
                    type="password"
                    value={password.value}
                    onChange={(e) => password.handleChange(e.target.value)}
                    placeholder={t("headerlt.Leave_this_blank_if_you_dont_want_to_change_the_password")}
                    sx={{ mb: 2, '& input::placeholder': {
                        fontSize: '0.75rem',
                        opacity: 1,
                        color: 'gray',
                      }
                    }}
                    className="readOnlyField"
                  />
                  <TextField
                    fullWidth
                    label={t("UserModal.ConfirmPassword")}
                    type="password"
                    value={cPassword.value}
                    onChange={(e) => cPassword.handleChange(e.target.value)}
                    placeholder={t("headerlt.Leave_this_blank_if_you_dont_want_to_change_the_password")}
                    sx={{ mb: 2, '& input::placeholder': {
                        fontSize: '0.75rem',
                        opacity: 1,
                        color: 'gray',
                      }
                    }}
                    className="readOnlyField"
                  />
                  <TextField
                    select
                    fullWidth
                    label={t("UserModal.Type")}
                    value={type.input}
                    onChange={(e) => type.handleChange(e.target.value)}
                    sx={{ mb: 2 }}
                    className="readOnlyField"
                  >
                    <MenuItem value="0" disabled>{t("UserModal.SelectRole")}</MenuItem>
                    <MenuItem value="1">{t("UserModal.SuperAdmin")}</MenuItem>
                    <MenuItem value="2">{t("UserModal.Admin")}</MenuItem>
                    <MenuItem value="3">{t("UserModal.Editor")}</MenuItem>
                    <MenuItem value="4">{t("UserModal.Viwer")}</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </Box>

            {/* Footer */}
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, p: 3 }}>
              <Button
                variant="outlined"
                onClick={handleModalClose}
                sx={{            
                  color: '#b62a8b',       // Texto morado
                  borderColor: '#b62a8b',  // Borde morado
                  '&:hover': {
                    borderColor: '#b62a8b', // Borde morado oscuro al hover
                    backgroundColor: 'rgba(156, 39, 176, 0.04)' // Fondo muy transparente al hover
                  }
                }}
              >
                {t("clientModal.Close")}
              </Button>
              <Button
                variant="contained"
                onClick={() => validar(idToEdit)}
                sx={{
                  backgroundColor: '#b62a8b',
                  '&:hover': {
                    backgroundColor: '#581244'
                  }
                }}
              >
                {t("UserModal.Save")}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Modal>

      {/*Modal de visualización*/}
      <Modal
        open={openViewModal}  // operation=3 es ver
        onClose={handleModalClose}
        aria-labelledby="view-user-modal-title"
      >
        <Box className="modalBox">
          <Paper elevation={0} sx={{ borderRadius: 2 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                {t("viewUserModal.UserDetails")}
              </Typography>
              <IconButton onClick={handleModalClose}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Subtitle */}
            <Box sx={{ px: 3, pb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Información detallada del perfil de usuario.
              </Typography>
            </Box>

            {/* Body */}
            <Box sx={{ px: 3, pb: 3, mb: 2 }}>
              <Grid container spacing={3}>
                {/* Left column */}
                <Grid item xs={12} sm={6}>

                  <TextField
                    fullWidth
                    label={t("viewUserModal.Name")}
                    value={`${firstName.input} ${middleName.input} ${lastName.input}`}
                    InputProps={{ readOnly: true }}
                    sx={{ mb: 2}}
                    className="readOnlyField readOnlyField_"
                  />

                  <TextField
                    fullWidth
                    label={t("viewUserModal.State")}
                    value={
                      state.input === 1
                        ? t("clientTable.Active")
                        : t("clientTable.Inactive")
                    }
                    InputProps={{ readOnly: true }}
                    sx={{mb: 2 }}
                    className="readOnlyField readOnlyField_"
                  />

                  <TextField
                    fullWidth
                    label={t("viewUserModal.RegisterDate")}
                    value={formatDate(registration_date.input)}
                    InputProps={{ readOnly: true }}
                    sx={{ mb: 2}}
                    className="readOnlyField readOnlyField_"
                  />

                  <TextField
                    fullWidth
                    label={t("viewUserModal.Language")}
                    value={
                      language.input === "es"
                        ? t("headerlt.Spanish")
                        : language.input === "en"
                        ? t("headerlt.English")
                        : language.input === "it"
                        ? t("headerlt.Italian")
                        : t("headerlt.Portuguese")
                    }
                    InputProps={{ readOnly: true }}
                    sx={{ mb: 2}}
                    className="readOnlyField readOnlyField_"
                  />
                </Grid>

                {/* Right column */}
                <Grid item xs={12} sm={6}>

                  <TextField
                    fullWidth
                    label={t("viewUserModal.Email")}
                    value={email.input}
                    InputProps={{ readOnly: true }}
                    sx={{ mb: 2}}
                    className="readOnlyField readOnlyField_"
                  />

                  <TextField
                    fullWidth
                    label={t("viewUserModal.Role")}
                    value={
                      type.input === 1
                        ? "Super Administrador"
                        : type.input === 2
                        ? "Administrador"
                        : type.input === 3
                        ? "Editor"
                        : "Agente"
                    }
                    InputProps={{ readOnly: true }}
                    sx={{ mb: 2}}
                    className="readOnlyField readOnlyField_"
                  />

                  <TextField
                    fullWidth
                    label={t("viewUserModal.LastVisit")}
                    value={formatDate(last_visit_date.input)}
                    InputProps={{ readOnly: true }}
                    sx={{ mb: 2}}
                    className="readOnlyField readOnlyField_"
                  />

                  <Box>
                    <Box className="textarea-box">
                      <Typography className="text-area" variant="subtitle2" gutterBottom>
                        {t("viewUserModal.Clients")}
                      </Typography>
                      {selectedClients.length > 0 ? (
                        <ul style={{ margin: 0, paddingLeft: 16 }}>
                          {selectedClients.map((clientId) => {
                            const client = listClients.find((c) => c.id === clientId);
                            return client ? (
                              <li key={client.id}>{client.client}</li>
                            ) : null;
                          })}
                        </ul>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ m: 1 }}>
                          {t("viewUserModal.NotClients")}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Box>
      </Modal>
    </Box>
  );
};

export default AdminList;
