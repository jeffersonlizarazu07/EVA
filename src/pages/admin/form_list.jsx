import { useState, useEffect, useContext } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import HeaderLT1 from "../../components/header/headerLT1";
import HeaderLT2 from "../../components/header/headerLT2";
import TableForms from "../../components/Tables/tableForm.jsx";
import useInput from "../../components/hooks/useInput";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import Cookies from "js-cookie";
import { smallAlertDelete, Toast } from "../../assets/js/alertConfig";

const formatDateTime = (dateString) => {
  if (!dateString || dateString === "No actualizada" || dateString === "NULL") return "No actualizada";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "No actualizada";
  const utcMinus5 = new Date(date.getTime() - 5 * 60 * 60 * 1000);
  const day = ("0" + utcMinus5.getDate()).slice(-2);
  const month = ("0" + (utcMinus5.getMonth() + 1)).slice(-2);
  const year = utcMinus5.getFullYear();
  const hours = ("0" + utcMinus5.getHours()).slice(-2);
  const minutes = ("0" + utcMinus5.getMinutes()).slice(-2);
  const seconds = ("0" + utcMinus5.getSeconds()).slice(-2);
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const FormList = () => {
  const headersArray = [
    "id", "title", "description", "client_name",
    "creation_date", "created_by_name", "updated_date",
    "updated_by_name", "state",
  ];

  const { userType, languageUser } = useContext(UserContext);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const accessToken = Cookies.get("accessToken");
  const userId = Cookies.get("userId");

  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [idToEdit, setIdToEdit] = useState(null);
  const [clients, setClients] = useState([]);

  const title = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });
  const description = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });
  const state = useInput({ defaultValue: "1", validate: /^[0-2]$/ });
  const idClient = useInput({ defaultValue: "", validate: /^[0-9]+$/ });

  useEffect(() => {
    i18n.changeLanguage(languageUser);
    getForms();
    getClients();
  }, [languageUser]);

  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
    withCredentials: true,
  };

  const getForms = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/forms", config);
      console.log("Response data:", response.data.data.length);
      setForms(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error("Error al obtener formularios:", error);
    } finally {
      setLoading(false);
    }
  };

  const getClients = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/clients", config);
      setClients(res.data.data || []);
    } catch (err) {
      console.error("Error cargando clientes", err);
    }
  };

  const openForm = (form) => {
    navigate(`/survey_blocks/${form.id}`);
  };

  const activateForm = async (form) => {
    try {
      await axios.patch(`http://localhost:3000/api/form/${form.id}`, { state: 1 }, config);
      Toast.fire({ icon: "success", title: `${form.title} ${t("alertActivate.SuccessAlert")}` });
      getForms();
    } catch (error) {
      Toast.fire({ icon: "error", title: `${form.title} ${t("alertActivate.ErrorAlert")}` });
      console.error("Error al activar formulario:", error);
    }
  };

  const deactivateForm = async (form) => {
    smallAlertDelete.fire({
      icon: "warning",
      html: `<p style="text-align:center;">El formulario <strong>${form.title}</strong> será deshabilitado.<br>¿Desea continuar?</p>`,
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#b62a8b",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.patch(`http://localhost:3000/api/form/${form.id}`, { state: 0 }, config);
          Toast.fire({ icon: "success", title: `${form.title} ${t("alertDeactivate.SuccessAlert")}` });
          getForms();
        } catch (error) {
          Toast.fire({ icon: "error", title: `${form.title} ${t("alertDeactivate.ErrorAlert")}` });
          console.error("Error al desactivar formulario:", error);
        }
      }
    });
  };

  const openModal = (mode, form = null) => {
    setModalTitle(mode === "create" ? t("formModal.NewForm") : t("formModal.EditClient"));
    setIdToEdit(form?.id || null);
    title.handleChange(form?.title || "");
    description.handleChange(form?.description || "");
    state.handleChange("1");
    idClient.handleChange(form?.idClient || "");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setIdToEdit(null);
  };

  const saveForm = async () => {
    if (!title.input || !idClient.input) {
      alert(t("alerts.fillRequiredFields"));
      return;
    }
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");
    const dataToSend = {
      title: title.input,
      description: description.input,
      state: parseInt(state.input),
      idClient: parseInt(idClient.input),
      ...(idToEdit
        ? { updated_date: now, updated_by: userId }
        : { creation_date: now, created_by: userId }),
    };
    try {
      if (idToEdit) {
        await axios.put(`http://localhost:3000/api/form/${idToEdit}`, dataToSend, config);
      } else {
        await axios.post("http://localhost:3000/api/forms", dataToSend, config);
      }
      Toast.fire({ icon: "success", title: `${title.input} ${t("alertCreateEdit.SuccessAlert")}` });
      getForms();
      closeModal();
    } catch (error) {
      console.error("Error guardando formulario:", error);
      Toast.fire({ icon: "error", title: t("alertCreateEdit.ErrorAlert") });
    }
  };
  return (
    <>
      <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh" }}>
        {userType === "1" ? <HeaderLT1 /> : <HeaderLT2 />}

        <Box sx={{ px: 3, py: 4 }}>
          <Paper elevation={2} sx={{ borderRadius: 3, px: 3, py: 4 }}>
            {loading ? (
              <Box textAlign="center" py={4}>
                <CircularProgress sx={{ color: "#b62a8b" }} />
                <Typography mt={2}>Cargando formularios...</Typography>
              </Box>
            ) : forms.length > 0 ? (
              <TableForms
                header={headersArray}
                data={forms.map((form) => ({
                  ...form,
                  creation_date: formatDateTime(form.creation_date),
                  updated_date: formatDateTime(form.updated_date),
                }))}
                onView={openForm}
                onActive={activateForm}
                onRemove={deactivateForm}
                onCreate={() => openModal("create")}
                onUpdate={(form) => openModal("edit", form)}
              />
            ) : (
              <Box textAlign="center" py={5}>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  No existen formularios disponibles.
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#b62a8b",
                    color: "#fff",
                    fontWeight: "bold",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#a02179" },
                  }}
                  onClick={() => openModal("create")}
                >
                  Crear nuevo formulario
                </Button>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>

      {/* Modal para crear / editar formulario */}
      <Dialog
        open={modalOpen}
        onClose={closeModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            border: "2px solid #b62a8b",
            backgroundColor: "#fff",
            boxShadow: "0px 8px 28px rgba(0, 0, 0, 0.3)",
            px: 2,
            py: 1,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#f8ecf5",
            pb: 0,
          }}
        >
          <Typography variant="h6" fontWeight="bold" color="#b62a8b">
            {modalTitle}
          </Typography>
          <IconButton onClick={closeModal} sx={{ color: "#b62a8b" }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={3}>
            {/* Título */}
            <TextField
              label={t("formModal.title")}
              value={title.input}
              onChange={(e) => title.handleChange(e.target.value)}
              fullWidth
              variant="outlined"
              sx={{
                  borderRadius: 2,
                  "& .MuiSelect-select": {
                    color: "#b62a8b",
                    fontWeight: "bold",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#b62a8b",
                  },
                  "& svg": {
                    color: "#b62a8b",
                  },
                }}
            />

            {/* Cliente */}
            <FormControl fullWidth>
              <InputLabel sx={{ color: "#b62a8b", fontWeight: "bold" }}>
                {t("formModal.client_name")}
              </InputLabel>
              <Select
                label={t("formModal.client_name")}
                value={idClient.input}
                onChange={(e) => idClient.handleChange(e.target.value)}
                sx={{
                  borderRadius: 2,
                  "& .MuiSelect-select": {
                    color: "#b62a8b",
                    fontWeight: "bold",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#b62a8b",
                  },
                  "& svg": {
                    color: "#b62a8b",
                  },
                }}
              >
                <MenuItem value="" disabled>
                  Seleccione un cliente
                </MenuItem>
                {clients.map((client) => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.client}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Descripción */}
            <TextField
              label={t("formModal.description")}
              multiline
              rows={3}
              value={description.input}
              onChange={(e) => description.handleChange(e.target.value)}
              variant="outlined"
              fullWidth
              sx={{
                  borderRadius: 2,
                  "& .MuiSelect-select": {
                    color: "#b62a8b",
                    fontWeight: "bold",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#b62a8b",
                  },
                  "& svg": {
                    color: "#b62a8b",
                  },
                }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "flex-end", pt: 2, pb: 1 }}>
          <Button
            onClick={closeModal}
            variant="outlined"
            sx={{
              borderRadius: 4,
              border: "2px solid #b62a8b",
              color: "#b62a8b",
              textTransform: "none",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#f3e0f1" },
            }}
          >
            {t("formModal.Close")}
          </Button>
          <Button
            onClick={saveForm}
            variant="contained"
            sx={{
              ml: 2,
              borderRadius: 4,
              backgroundColor: "#b62a8b",
              color: "#fff",
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": { backgroundColor: "#a02179" },
            }}
          >
            {t("formModal.Save")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FormList;
