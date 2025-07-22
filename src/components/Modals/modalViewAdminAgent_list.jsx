import React from "react";
import {
  Modal,
  Box,
  Paper,
  Typography,
  IconButton,
  Grid,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ModalViewAdmin = ({
  open,
  onClose,
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
  userClients,
  t,
}) => {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="view-user-modal-title">
      <Box className="modalBox">
        <Paper elevation={0} sx={{ borderRadius: 2 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 3 }}>
            <Typography variant="h6" fontWeight="bold">
              {t("viewUserModal.UserDetails")}
            </Typography>
            <IconButton onClick={onClose} aria-label="close modal">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Subtitle */}
          <Box sx={{ px: 3, pb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Información detallada del perfil de agente.
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
                  value={`${firstName.input} ${middleName.input} ${lastName.input}`.trim()}
                  InputProps={{ readOnly: true }}
                  sx={{ mb: 2 }}
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
                  sx={{ mb: 2 }}
                  className="readOnlyField readOnlyField_"
                />

                <TextField
                  fullWidth
                  label={t("viewUserModal.RegisterDate")}
                  value={formatDateTimeShort(registration_date.input)}
                  InputProps={{ readOnly: true }}
                  sx={{ mb: 2 }}
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
                  sx={{ mb: 2 }}
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
                  sx={{ mb: 2 }}
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
                  value={formatDateTimeShort(last_visit_date.input)}
                  InputProps={{ readOnly: true }}
                  sx={{ mb: 2 }}
                  className="readOnlyField readOnlyField_"
                />

                <Box>
                  <Box className="textarea-box">
                    <Typography className="text-area" variant="subtitle2" gutterBottom>
                      {t("viewUserModal.Clients")}
                    </Typography>
                    {userClients.length > 0 ? (
                      <ul style={{ margin: 0, paddingLeft: 16 }}>
                        {userClients.map((client) => (
                            <li key={client.id}>{client.name}</li>
                        ))}
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
  );
};

export default ModalViewAdmin;
