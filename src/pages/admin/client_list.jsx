import axios from "axios";
import Swal from "sweetalert2";
import { useState, useEffect, useContext } from "react";
import HeaderLT1 from "../../components/header/headerLT1";
import TableDetalle from "../../components/Tables/tableClients";
import useInput from "../../components/hooks/useInput";
import { UserContext } from "../../context/UserContext";
import { Toast, smallAlertDelete } from "../../assets/js/alertConfig";
import { useTranslation } from "react-i18next";
import { SketchPicker } from "react-color";
import "../../assets/css/newUser.css";
import placeholderImg from "../../assets/img/placeholder-image.png";
import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  Grid,
  Divider,
  Chip,
  Stack
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  Edit as EditIcon,
  Add as AddIcon
} from '@mui/icons-material';

export default function Client_list() {
  const [operation, setOperation] = useState([1]); // Estado para saber si estoy creando (1) o editando (2)
  const [idToEdit, setidToEdit] = useState(null);  // Guarda el ID del cliente que se está editando
  const [logoEdit, setLogoToEdit] = useState("");  // Guarda el logo actual del cliente a editar
  const [title, setTitle] = useState();  // Título del modal que se muestra (crear/editar)
  const selectedKeys = ["id", "client", "state"];  // Campos seleccionados en la tabla (solo ciertos campos)
  const [data, setData] = useState([]);  // Datos de los clientes traídos de la API
  const [selectedFile, setSelectedFile] = useState(null);  // Archivo del logo que selecciona el usuario
  const [displayColorPicker, setDisplayColorPicker] = useState(false);  // Mostrar u ocultar el picker de color principal
  const [displayColorPicker2, setDisplayColorPicker2] = useState(false);  // Mostrar u ocultar el picker de color secundario
  const [error, setError] = useState("");  // Mostrar error en validación
  const [colors1, setColors1] = useState("#FFFFFF");  // Color principal del cliente
  const [colors2, setColors2] = useState("#FFFFFF");  // Color secundario del cliente
  const [previewUrl, setPreviewUrl] = useState(null);// Vista previa del logo cargado
  const [showColorPicker, setShowColorPicker] = useState(false);  // Mostrar/Ocultar el color picker 1
  const [showColorPicker2, setShowColorPicker2] = useState(false);   // Mostrar/Ocultar el color picker 2
  const { t, i18n } = useTranslation();   // Hook para traducciones
  const url = "http://localhost:3000/api/clients"; // URL base de la API para clientes
  const CLIENTS_BASE_URL = "http://localhost:3000/clientes";

  // Estados para los modales MUI
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);

  // Estados del formulario
  const client = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });
  const logo = useInput({ defaultValue: "", validate: "" });
  const estado = useInput({ defaultValue: "", validate: /^[0-1]+$/ });

  const [openColorModal, setOpenColorModal] = useState(false);
  const [openColorModal2, setOpenColorModal2] = useState(false);


  const handleOpenColor1 = () => setOpenColorModal(true);
  const handleCloseColor1 = () => setOpenColorModal(false);

  const handleOpenColor2 = () => setOpenColorModal2(true);
  const handleCloseColor2 = () => setOpenColorModal2(false);

  const { accessToken, languageUser } = useContext(UserContext); // Trae el token y el idioma desde el contexto del usuario logueado

  useEffect(() => {// Efecto que se ejecuta al montar o cuando cambia el idioma del usuario
    fetchData(); // Trae todos los clientes
    i18n.changeLanguage(languageUser); // Cambia el idioma
  }, [languageUser]); // Dependencia del idioma

   // Función para manejar el cierre del modal MUI
  const handleModalClose = () => {
    setOpenCreateModal(false);
    resetForm();
    fetchData();
  };

  const handleViewModalClose = () => {
    setOpenViewModal(false);
  };

  // Configuración para enviar formularios con archivos y cookies
  const config = {
    withCredentials: true,
    "Content-Type": "multipart/form-data",
  };

  // Función para obtener los datos de clientes desde la API
  const fetchData = async () => {
    try {
      const response = await axios.get(url, config);
      console.log(response.data.data);
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Abre el modal y carga los datos del cliente seleccionado
  const openModalCont = (clientData) => {
    client.handleChange(clientData?.client || "");
    estado.handleChange(clientData?.state || "");
    logo.handleChange(clientData?.logo || "");
    setColors1(clientData?.color_tag1 || "");
    setColors2(clientData?.color_tag2 || "");
    setOpenViewModal(true);
  };

  // Activa un cliente (estado = 1)
  const activation = (clientData) => {
    const url = `http://localhost:3000/api/clients`;
    const id = clientData.id;
    const name = clientData.client;
    console.log(name);
    const parametros = {
      state: 1,
    };

    smallAlertDelete
      .fire({
        icon: "warning",
        toast: false,
        title: "Habilitar cliente",
        text: `${t("alertActivate.InitialPhrase")} ${name} ${t(
          "alertActivate.FinalPhrase"
        )}`,
        showCancelButton: true,
        confirmButtonText: `${t("alertActivate.Confirm")}`,
        cancelButtonText: `${t("alertActivate.Cancel")}`,
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
            await axios.patch(`${url}/${id}`, parametros, config);

            Toast.fire({
              icon: "success",
              title: `${t("alertActivate.InitialPhrase")} ${clientData.client} ${t(
                "alertActivate.SuccessAlert"
              )}`,
            });
          } catch (error) {
            Toast.fire({
              icon: "error",
              title: `${t("alertActivate.InitialPhrase")} ${clientData.client}${t(
                "alertActivate.ErrorAlert"
              )} `,
            });
            console.error(error);
          }
        }
        fetchData(); // Recarga los datos después de activar
      });
  };

  // Desactiva un cliente (estado = 0)
  const deactivation = (clientData) => {
    const url = `http://localhost:3000/api/clients`;
    const id = clientData.id;
    const name = clientData.client;
    const parametros = {
      state: 0,
    };

    smallAlertDelete
      .fire({
        icon: "warning",
        toast: false,
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
            await axios.patch(`${url}/${id}`, parametros, config);
            Toast.fire({
              icon: "success",
              title: `${t("alertDeactivate.InitialPhrase")} ${clientData.client} ${t(
                "alertDeactivate.SuccessAlert"
              )}`,
            });
            fetchData(); // Recarga los datos después de desactivar
          } catch (error) {
            Toast.fire({
              icon: "error",
              title: `${t("alertDeactivate.InitialPhrase")} ${clientData.client} ${t(
                "alertDeactivate.ErrorAlert"
              )}`,
            });
            console.error(error);
          }
        }
        fetchData(); // Se vuelve a llamar por si no se confirma pero igual refrescamos
      });
  };

  // Manejo del cambio de archivo (solo acepta JPEG y PNG)
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    // Verifica el tipo de archivo
    if (
      selectedFile &&
      (selectedFile.type === "image/jpeg" || selectedFile.type === "image/png")
    ) {
      setSelectedFile(selectedFile);

      if (selectedFile) {
        console.log("Si se subio un archivo");
      }

      // Si está en modo editar, oculta la imagen original
      const logoOriginal = document.getElementById("logoToEditOriginal");
       if (operation === 2 && logoOriginal) {
        logoOriginal.style.display = "none";
      }

      // Si está en modo editar, oculta la imagen original
      // operation === 2
      //   ? (document.getElementById("logoToEditOriginal").style.display = "none")
      //   : null;

      // Crea una vista previa del archivo subido
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else if(selectedFile) {
      // Si el archivo no es válido
      console.log("Por favor selecciona un archivo JPEG o PNG.");
      // Si el archivo no es válido pero existe
      setError("Por favor selecciona un archivo JPEG o PNG.");
      Toast.fire({
        icon: "error",
        title: "Por favor selecciona un archivo JPEG o PNG.",
      });
      // Limpiar el input para que se pueda seleccionar otro archivo
      e.target.value = "";
    }
  };

  const handleImgError = (e) => {
    e.target.onerror = null;
    e.target.src = placeholderImg;
  };

  const handleColor1Change = (color) => {
    setColors1(color.hex);
    console.log(colors1);
  };

  const handleColor2Change = (color) => {
    setColors2(color.hex);
    console.log(colors2);
  };

  const openModal = (op, clientData) => {
    setOperation(op);
    setError("");
    if (op == 1) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setColors1("#FFFFFF");
      setColors2("#FFFFFF");
      setTitle(t("clientModal.NewClient"));
      client.handleChange("");
      logo.handleChange("");
      setLogoToEdit("");
      setidToEdit(null); //ID se resetea
    } else if (op == 2) {
      setSelectedFile(null); // Añadir esta línea para limpiar cualquier archivo seleccionado previo
      setPreviewUrl(null); // Añadir esta línea para limpiar la vista previa
      setTitle(t("clientModal.EditClient"));
      client.handleChange(clientData?.client || "");
      setLogoToEdit(clientData?.logo || "");
      setidToEdit(clientData?.id);
      setColors1(clientData?.color_tag1 || "");
      setColors2(clientData?.color_tag2 || "");
      console.log(idToEdit);
    }
    setOpenCreateModal(true);
  };

  const validar = async () => {
    // Usamos el ID del estado, no recibimos uno como parámetro
  const id = idToEdit;
  
  const urlpost = `http://localhost:3000/api/clients`; // URL para crear cliente
  const formData = new FormData();
  console.log("Archivo seleccionado:", selectedFile);
  console.log("Cliente:", client.input);
  console.log("Color 1:", colors1);
  console.log("Color 2:", colors2);
  console.log("Operación:", operation);
  console.log("ID a editar:", id);

  // Si hay un archivo, se agrega al FormData
  selectedFile ? formData.append("logo", selectedFile) : null;

  // Agrega los demás campos del formulario al FormData
  formData.append("client", client.input);
  formData.append("color_tag1", colors1);
  formData.append("color_tag2", colors2);
  formData.append("state", 1);

  if (!client.input.trim()) {
  setError("El nombre del cliente es necesario");
  Toast.fire({
    icon: "error",
    title: "El nombre del cliente es necesario",
  });
  return;
}

  const newClientName = client.input.trim().toLowerCase();

  // Verificamos si estamos en modo creación (1) o edición (2)
  if (operation === 1) {
    // Aquí se crea un nuevo cliente
    try {
      const clientExists = data.some(item => item.client.trim().toLowerCase() === newClientName);
      if (clientExists) {
        setError("El nombre del cliente ya existe");
        Toast.fire({
          icon: "error",
          title: t("clientModal.DuplicatedUser"),
        });
        return;
      }
      
      if (!selectedFile) {
        setError("Debes seleccionar un logo");
        Toast.fire({
          icon: "error",
          title: "Debes seleccionar un logo",
        });
        return;
    }
      
      const response = await axios.post(`${urlpost}`, formData, {
        withCredentials: true,
      });
      console.log("Respuesta del servidor (CREAR):", response.data);

      if (response.data.status) {
        resetForm();
        fetchData();
        handleModalClose();

        Toast.fire({
          icon: "success",
          title: `${client.input} ${t("alertCreateEdit.SuccessAlert")}`,
        });
      }
    } catch (error) {
      console.error("Error subiendo el archivo:", error);
    }
  } else if (operation === 2 && id) {

     const clientExists = data.some(item => item.client.trim().toLowerCase() === newClientName && item.id !== id);
      if (clientExists) {
        setError("El nombre del cliente ya existe");
        Toast.fire({
          icon: "error",
          title: t("clientModal.DuplicatedUser"),
        });
        return;
      }
    // Aquí se realiza una actualización del cliente con PUT
    const urlput = `http://localhost:3000/api/clients/${id}`;
    console.log("URL de actualización:", urlput);

    try {
      const response = await axios.put(urlput, formData, {
        "Content-Type": "multipart/form-data",
        withCredentials: true,
      });
      
      console.log("Respuesta del servidor (EDITAR):", response);
      
      if (!response.data.status) {
        alert("No se realizó la edición del cliente");
        handleModalClose();
        console.log(response.data);
      } else {
        Toast.fire({
          icon: "success",
          title: t('alertCreateEdit.el_cliente') + ` ${client.input}` + t('alertCreateEdit.editado_exitsosamente'),
        });
        resetForm();
        fetchData();
        handleModalClose();

      }
    } catch (error) {
      console.error("Error actualizando el cliente:", error);
    }
  } else {
    console.error("Operación no válida o ID faltante para edición");
  }
  };

//  función para resetear el formulario
const resetForm = () => {
  setColors1("#FFFFFF");
  setColors2("#FFFFFF");
  setSelectedFile(null);
  setPreviewUrl(null);
  setError("");
  setidToEdit(null);
  client.handleChange("");
  logo.handleChange("");
  setLogoToEdit("");

    // Resetear el input de archivo para permitir seleccionar el mismo archivo de nuevo
  const fileInput = document.getElementById("imagenLogo");
  if (fileInput) {
    fileInput.value = "";
  }
  fetchData();
};

  const handleClose = () => {
    setDisplayColorPicker(false);
  };
  const handle2Close = () => {
    setDisplayColorPicker2(false);
  };
  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };
  const handle2Click = () => {
    setDisplayColorPicker2(!displayColorPicker);
  };

  const triggerFileInput = () => {
    document.getElementById("imagenLogo").click();
  };

  const styles = {
    color: {
      width: "36px",
      height: "24px",
      borderRadius: "2px",
      background: `${colors1}`,
      border: "1px solid  gray",
    },

    swatch: {
      background: "#fff",
      borderRadius: "1px",
      cursor: "pointer",
    },
    popover: {
      position: "absolute",
      zIndex: "2",
    },
    cover: {
      position: "fixed",
      top: "0px",
      right: "0px",
      bottom: "0px",
      left: "0px",
    },
  };
  const styles2 = {
    color: {
      width: "36px",
      height: "24px",
      borderRadius: "2px",
      background: `${colors2}`,
      border: "1px solid gray",
    },
    swatch: {
      background: "#fff",
      borderRadius: "1px",

      cursor: "pointer",
    },
    popover: {
      position: "absolute",
      zIndex: "2",
    },
    cover: {
      position: "fixed",
      top: "0px",
      right: "0px",
      bottom: "0px",
      left: "0px",
    },
  };
  return (
    <Box className="App" sx={{ overflow: "hidden" }}>
      <Box id="body">
        <HeaderLT1 />
        <Box
          sx={{ alignItems: "stretch", flexWrap: "nowrap", padding: 0, display : "flex" }}
        >
          {/* <SidebarLT1 /> */}
          <Box className="container" mt={0}>
            {data.length > 0 && (
              <TableDetalle
                header={selectedKeys}
                data={data}
                onCreate={() => openModal(1)}
                onRemove={(item) => deactivation(item)}
                onUpdate={(payload) => openModal(2, payload)}
                onView={(payload) => openModalCont(payload)}
                onActive={(payload) => activation(payload)}
              />
            )}
          </Box>
        </Box>
      </Box>

      {/* Modal de visualización */}
      <Modal
        open={openViewModal}
        onClose={handleViewModalClose}
        aria-labelledby="view-client-modal-title"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 500 },
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            p: 0,
            outline: 'none'
          }}
        >
          <Paper elevation={0} sx={{ borderRadius: 2 }}>
            {/* Header */}
            <Box sx={{  display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
              <Typography variant="h5" component="h2" fontWeight="bold">
                {t("clientViewModal.Client")}
              </Typography>
              <IconButton onClick={handleViewModalClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
            
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ px: 3, mb: 2 }}
            >
              {t("clientViewModal.ClientInfo")}
            </Typography>

            {/* Body */}
            <Box sx={{ px: 3, pb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Box
                        component="img"
                        src={`${CLIENTS_BASE_URL}/${logo.input || ''}`}
                        alt="Logo"
                        onError={handleImgError}
                        sx={{
                          width: 100,
                          height: 100,
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1
                        }}
                      />
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={8}>
                  <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                    <Typography variant="h5" fontWeight="600" gutterBottom>
                      {client.input}
                    </Typography>
                    <Chip
                      label={estado.input == 1 ? t("clientTable.Active") : t("clientTable.Inactive")}
                      color={estado.input == 1 ? "success" : "default"}
                      variant="outlined"
                    />
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1" fontWeight="500">
                  {t("clientTable.selectedColor")}:
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Box
                    sx={{
                      width: 36,
                      height: 24,
                      backgroundColor: colors1,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 0.5,
                      cursor: 'pointer'
                    }}
                    //onClick={handleClick}
                  />
                  <Box
                    sx={{
                      width: 36,
                      height: 24,
                      backgroundColor: colors2,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 0.5,
                      cursor: 'pointer'
                    }}
                    //onClick={handle2Click}
                  />
                </Stack>
              </Box>

              {displayColorPicker && (
                <Box sx={styles.popover}>
                  <Box sx={styles.cover} onClick={handleClose} />
                  <Box sx={{ background: colors1, width: 50, height: 50, mt: 1 }} />
                </Box>
              )}

              {displayColorPicker2 && (
                <Box sx={styles2.popover}>
                  <Box sx={styles2.cover} onClick={handle2Close} />
                  <Box sx={{ background: colors2, width: 50, height: 50, mt: 1 }} />
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      </Modal>

      {/* Modal de Crear/Editar con MUI */}
      <Modal
        open={openCreateModal}
        onClose={handleModalClose}
        aria-labelledby="create-client-modal-title"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 650 },
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            p: 0,
            outline: 'none',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}
        >
          <Paper elevation={0} sx={{ borderRadius: 2 }}>
            {/* Header */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              p: 3, 
              pb: 2 
            }}>
              <Typography variant="h5" component="h2" fontWeight="bold">
                {title}
              </Typography>
              <IconButton onClick={handleModalClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Body */}
            <Box sx={{ px: 3, pb: 3 }}>
              <Grid container spacing={3}>
                {/* Sección de Logo */}
                <Grid item xs={12} sm={5}>
                  <Box sx={{  textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 250  }}>
                    {logoEdit && operation === 2 && !selectedFile ? (
                      <Box
                        component="img"
                        src={`${CLIENTS_BASE_URL}/${logoEdit || ''}`}
                        alt="Logo"
                        onError={handleImgError}
                        sx={{
                          width: 150,
                          height: 150,
                          border: '2px dashed',
                          borderColor: 'divider',
                          borderRadius: 2,
                          mb: 2
                        }}
                      />
                    ) : null}
                    
                    {selectedFile && previewUrl ? (
                      <Box
                        component="img"
                        src={previewUrl}
                        alt="Logo Preview"
                        sx={{
                          width: 150,
                          height: 150,
                          objectFit: 'contain',
                          border: '2px solid',
                          borderColor: 'primary.main',
                          borderRadius: 2,
                          mb: 2
                        }}
                      />
                    ) : null}

                    {!selectedFile && !logoEdit && (
                      <Box
                        sx={{
                          width: 150,
                          height: 150,
                          border: '2px dashed',
                          borderColor: 'divider',
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                          backgroundColor: 'grey.50'
                        }}
                      >
                        <CloudUploadIcon sx={{ fontSize: 40, color: 'grey.400' }} />
                      </Box>
                    )}

                    <Button
                      variant="contained"
                      startIcon={<CloudUploadIcon />}
                      onClick={triggerFileInput}
                      // sx={{ mb: 1 }}
                      sx={{
                        mb: 1,
                        backgroundColor: '#b62a8b', // Color morado estándar de MUI
                        '&:hover': {
                          backgroundColor: '#581244', // Morado más oscuro al hover
                        }
                      }}    
                    >
                      {operation === 2 ?  t("clientModal.editLogo") :t("clientModal.newLogo")}
                    </Button>
                    
                    <input
                      type="file"
                      id="imagenLogo"
                      accept=".jpg, .jpeg, .png"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                  </Box>
                </Grid>

                {/* Sección de Datos */}
                <Grid item xs={12} sm={7}>
                  <TextField
                    fullWidth
                    label={t("clientModal.ClientName")}
                    variant="outlined"
                    value={client.input}
                    className="readOnlyField"
                    onChange={(e) => client.handleChange(e.target.value)}
                    sx={{ mb: 3 }}
                    error={!!error && error.includes("nombre")}
                  />

                  <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                    {t("clientModal.selectColor")}
                  </Typography>

                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">
                          {t("clientModal.color1")}
                        </Typography>
                        <Box
                          sx={{
                            width: 36,
                            height: 24,
                            backgroundColor: colors1,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 0.5,
                            cursor: 'pointer'
                          }}
                          //onClick={handleClick}
                          onClick={handleOpenColor1}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">
                          {t("clientModal.color2")}
                        </Typography>
                        <Box
                          sx={{
                            width: 36,
                            height: 24,
                            backgroundColor: colors2,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 0.5,
                            cursor: 'pointer'
                          }}
                          onClick={handleOpenColor2}
                          //onClick={handle2Click}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              {displayColorPicker && (
                <Box sx={{ position: 'relative', mt: 2 }}>
                  <Box sx={styles.cover} onClick={handleClose} />
                  <Box sx={{ position: 'absolute', zIndex: 1000 }}>
                    <SketchPicker
                      color={colors1}
                      onChange={handleColor1Change}
                    />
                  </Box>
                </Box>
              )}

              {displayColorPicker2 && (
                <Box sx={{ position: 'relative', mt: 2 }}>
                  <Box sx={styles2.cover} onClick={handle2Close} />
                  <Box sx={{ position: 'absolute', zIndex: 1000 }}>
                    <SketchPicker
                      color={colors2}
                      onChange={handleColor2Change}
                    />
                  </Box>
                </Box>
              )}

              {error && (
                <Typography color="error" variant="body2" textAlign="center" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
            </Box>

            {/* Footer */}
            <Divider />
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: 2, 
              p: 3 
            }}>
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
                onClick={validar}
                 sx={{
                  backgroundColor: '#b62a8b', // Color morado estándar de MUI
                  '&:hover': {
                    backgroundColor: '#581244', // Morado más oscuro al hover
                  }
                }}                
              >
                {t("clientModal.Save")}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Modal>
      {/* modal para color 1 */}
      <Modal
        open={openColorModal}
        onClose={handleCloseColor1}
        aria-labelledby="color-picker-modal-1"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            p: 2,
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <SketchPicker
            color={colors1}
            onChange={handleColor1Change}
          />
        </Box>
      </Modal>

      {/* modal para color 2 */}
      <Modal
        open={openColorModal2}
        onClose={handleCloseColor2}
        aria-labelledby="color-picker-modal-2"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            p: 2,
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <SketchPicker
            color={colors2}
            onChange={handleColor2Change}
          />
        </Box>
        
      </Modal>
    </Box>
  );
}
