import React, { useEffect, useContext } from "react";
import Swal from "sweetalert2";
import {
  Modal,
  Box,
  Paper,
  Typography,
  IconButton,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Divider,
  Button,
  Autocomplete
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTranslation } from "react-i18next";
import { UserContext } from "../../context/UserContext";

const ModalAdmin = ({
  monitoringStep,
  setMonitoringStep,
  formClientReset,
  userName,
  loading,
  selectedFormId,
  handleFormSelect,
  selectedClientId,
  userClients,
  handleClientChange,
  formOptions,
  callSelectedForm,
  blocksForForm,
  userInfo,
  monitoringDate,
  setMonitoringDate,
  blocksWithPer,
  setBlocksWithPer,
  calBlocksPercentage,
  handleUpdatePregunta,
  validarRespuesta,
  handleUpdatePreguntaMultiple,
  calFormScore,
  clientError,
  setClientError,
  formError,
  setFormError,
  dateError,
  setDateError,
  feedbackError,
  erroresPorPregunta,
  selectedBlockId,
  setSelectedBlockId,
  handleNextStep,
  open,
  feedback,
  setFeedback,
}) => {
  const { t, i18n } = useTranslation();
  const { languageUser } = useContext(UserContext);

  useEffect(() => {
    i18n.changeLanguage(languageUser);
  }, [languageUser, i18n]);

  return (
    <Modal open={open} onClose={formClientReset} aria-labelledby="modal-admin-title">
      <Box className="modalBox">
        <Paper elevation={0} sx={{ borderRadius: 2 }}>
          {/* Encabezado */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 3 }}>
            {monitoringStep === 2 || monitoringStep === 3 ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  onClick={() =>
                    setMonitoringStep(monitoringStep === 2 ? 1 : 2)
                  }
                  sx={{ mr: 1 }}
                  size="large"
                >
                  <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6" fontWeight="bold">
                  {userName}
                </Typography>
              </Box>
            ) : (
              <Typography variant="h6" fontWeight="bold">
                {userName}
              </Typography>
            )}

            <IconButton onClick={formClientReset} size="large">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Cuerpo */}
          <Box sx={{ px: 3, pb: 3 }}>
            {monitoringStep === 1 && (
              <>
                <Typography variant="subtitle1" sx={{ mb: 3 }} gutterBottom>
                  {t("monitoringModal.NewMonitoring")}
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      fullWidth
                      label={t("monitoringModal.AgentClient")}
                      value={selectedClientId || ""}
                      onChange={(e) => {
                        handleClientChange(e);
                        setClientError(false);
                      }}
                      error={clientError}
                      disabled={loading}
                      sx={{ mb: 2 }}
                      className="readOnlyField"
                    >
                      <MenuItem value="">{t("vistaEncuestas.seleccionar_opcion")}</MenuItem>
                      {userClients.map((client) => (
                        <MenuItem key={client.id} value={client.id}>
                          {client.name}
                        </MenuItem>
                      ))}
                    </TextField>

                    {loading && (
                      <Box mt={1} display="flex" alignItems="center">
                        <CircularProgress size={16} sx={{ mr: 1 }} />
                        <Typography variant="body2">{t("monitoringModal.Loading")}</Typography>
                      </Box>
                    )}
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      fullWidth
                      label={t("monitoringModal.formMonitoring")}
                      value={selectedFormId || ""}
                      onChange={(e) => {
                        handleFormSelect(e);
                        setFormError(false);
                      }}
                      error={formError}
                      sx={{ mb: 2 }}
                      className="readOnlyField"
                    >
                      <MenuItem value="">
                        {!selectedClientId
                          ? t("monitoringModal.SelectClient")
                          : loading
                          ? t("monitoringModal.Loading")
                          : formOptions.length === 0
                          ? t("monitoringModal.ErrorForms")
                          : t("vistaEncuestas.seleccionar_opcion")}
                      </MenuItem>
                      {formOptions.map((form) => (
                        <MenuItem key={form.id} value={form.id}>
                          {form.title}
                        </MenuItem>
                      ))}
                    </TextField>

                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="datetime-local"
                      label={t("monitoringModal.DatetimeMonitoring")}
                      InputLabelProps={{ shrink: true }}
                      value={monitoringDate}
                      onChange={(e) => {
                        setMonitoringDate(e.target.value);
                        setDateError(false);
                      }}
                      error={dateError}
                      sx={{ mb: 2 }}
                      className="readOnlyField"
                    />

                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t("monitoringModal.AdminMonitoring")}
                      value={
                        userInfo
                          ? `${userInfo.firstname || ""} ${userInfo.lastname || ""}`
                          : t("monitoringModal.Loading")
                      }
                      InputProps={{ readOnly: true }}
                      sx={{ mb: 2 }}
                      className="readOnlyField"
                    />
                  </Grid>
                </Grid>
              </>
            )}

            {monitoringStep === 2 && (
              <Box maxHeight="65vh" overflow="auto">
                <Typography variant="subtitle1" sx={{ mb: 3 }} gutterBottom>
                  {t("monitoringModal.ConfigMonitoring")}
                </Typography>

                <Box mb={2} p={2} border={1} borderColor="#e0e0e0" borderRadius={2} >
                  <Typography variant="subtitle1" sx={{ mb: 3 }} fontWeight="bold" align="center" gutterBottom>
                    {t("monitoringModal.InfoForm")}
                  </Typography>
                  <Box display="flex" gap={1}>
                    <Typography variant="subtitle1" fontWeight="bold">{t("monitoringModal.NameForm")}:</Typography>
                    <Typography>
                      {callSelectedForm?.title}.
                    </Typography>
                  </Box>
                  <Box display="flex" gap={1}>
                    <Typography fontWeight="bold">{t("monitoringModal.FormScore")}:</Typography>
                    <Typography>{calFormScore()}%.</Typography>
                  </Box>
                  <Box display="flex" gap={1}>
                    <Typography fontWeight="bold">{t("monitoringModal.Punctuation")}:</Typography>
                    <Typography>100%.</Typography>
                  </Box>
                </Box>

                <Box mb={2} border={1} borderColor="#e0e0e0" borderRadius={2} overflow="hidden">
                  {blocksForForm.length === 0 ? (
                    <Typography color="text.secondary">
                      {t("monitoringModal.ErrorBlocks")}
                    </Typography>
                  ) : (
                    blocksWithPer.map((block) => (
                      <Accordion
                        key={block.id}
                        expanded={selectedBlockId === block.id}
                        onChange={() =>
                          setSelectedBlockId((prev) =>
                            prev === block.id ? null : block.id
                          )
                        }
                      >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Box
                            flex={1}
                            display="flex"
                            justifyContent="space-between"
                          >
                            <Typography fontWeight="bold">
                              {block.block_name}
                            </Typography>
                            <Typography fontWeight="bold">
                              {block.porcentajeBloque}%
                            </Typography>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          {block.preguntas.length === 0 ? (
                            <Typography color="text.secondary">
                              {t("monitoringModal.ErrorBlocks")}
                            </Typography>
                          ) : (
                            block.preguntas.map((pregunta) => (
                              <Accordion
                                key={pregunta.id}
                                sx={{
                                  border: "1.5px solid #e0e0e0",
                                  borderRadius: "8px",
                                  boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                                  mb: 1,
                                }}
                              >
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                  <Box
                                    flex={1}
                                    display="flex"
                                    justifyContent="space-between"
                                  >
                                    <Typography>
                                      {pregunta.question_name}
                                    </Typography>
                                  </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                  {pregunta.id_type_question === 1 && (
                                    <Autocomplete
                                      multiple
                                      options={pregunta.select_option.split(",").map((opt) => opt.trim())}
                                      value={pregunta.seleccionMultiple || []}
                                      onChange={(e, selectedOptions) => {
                                        handleUpdatePregunta(pregunta.id, "seleccionMultiple", selectedOptions);
                                      }}
                                      renderOption={(props, option, { selected }) => (
                                        <li {...props} key={option}>
                                          <Checkbox checked={selected} style={{ marginRight: 8 }} />
                                          {option}
                                        </li>
                                      )}
                                      renderInput={(params) => (
                                        <TextField {...params} 
                                          label={t("monitoringModal.Evaluation")}
                                          placeholder={t("vistaEncuestas.seleccionar_opcion")}
                                          error={!!erroresPorPregunta[pregunta.id]}
                                        />
                                      )}
                                      sx={{ mb: 2 }}
                                      className="readOnlyField"
                                    />
                                  )}

                                  {pregunta.id_type_question === 2 && (
                                    <TextField
                                      select
                                      fullWidth
                                      error={!!erroresPorPregunta[pregunta.id]}
                                      label={t("monitoringModal.Evaluation")}
                                      value={pregunta.respuestaSeleccionada || ""}
                                      onChange={(e) => {
                                        const seleccion = e.target.value;
                                        handleUpdatePregunta(pregunta.id, "respuestaSeleccionada", seleccion);
                                      }}
                                      sx={{ mb: 2 }}
                                      className="readOnlyField"
                                    >
                                      
                                      <MenuItem value="">{t("vistaEncuestas.seleccionar_opcion")}</MenuItem>
                                      {pregunta.select_option.split(",").map((option, index) => (
                                        <MenuItem key={index} value={index.toString()}>
                                          {option.trim()}
                                        </MenuItem>
                                      ))}
                                    </TextField>
                                  )}

                                  {pregunta.id_type_question === 3 && (
                                    <Box>
                                      <TextField
                                        placeholder={t("monitoringModal.EnterTextArea")}
                                        multiline
                                        fullWidth
                                        error={!!erroresPorPregunta[pregunta.id]}
                                        value={pregunta.textoRespuesta || ""}
                                        onChange={(e) => handleUpdatePregunta(pregunta.id, "textoRespuesta", e.target.value)}
                                        className="readOnlyField"
                                        sx={{
                                          "& .MuiInputBase-root": {
                                            height: "90px",
                                            alignItems: "flex-start",
                                          },
                                          "& .MuiInputBase-inputMultiline": {
                                            padding: "10px",
                                            height: "100%",
                                            overflow: "auto",
                                          },
                                        }}
                                      />
                                    </Box>
                                  )}
                                </AccordionDetails>
                              </Accordion>
                            ))
                          )}
                        </AccordionDetails>
                      </Accordion>
                    ))
                  )}
                </Box>
              </Box>
            )}

            {monitoringStep === 3 && (
              <Box>
                <Typography fontWeight="bold" sx={{ mb: 2 }}>
                  {t("Feedback")}
                </Typography>
                <TextField
                  placeholder={t("monitoringModal.EnterFeedback")}
                  multiline
                  fullWidth
                  className="readOnlyField"
                  value={feedback}
                  error={feedbackError}
                  helperText={feedbackError}
                  onChange={(e) => setFeedback(e.target.value)}
                  sx={{
                    "& .MuiInputBase-root": {
                      height: "150px",
                      alignItems: "flex-start",
                    },
                    "& .MuiInputBase-inputMultiline": {
                      padding: "10px",
                      height: "100%",
                      overflow: "auto",
                    },
                  }}
                />
              </Box>
            )}
          </Box>

          {/* Footer */}
          <Divider />
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              p: 3,
              borderTop: "1px solid #ddd",
            }}
          >
            <Button
              variant="outlined"
              onClick={formClientReset}
              sx={{
                color: "#b62a8b",
                borderColor: "#b62a8b",
                "&:hover": {
                  borderColor: "#b62a8b",
                  backgroundColor: "rgba(156, 39, 176, 0.04)",
                },
              }}
            >
              {t("clientModal.Close")}
            </Button>
            <Button
              variant="contained"
              onClick={handleNextStep}
              sx={{
                backgroundColor: "#b62a8b",
                "&:hover": {
                  backgroundColor: "#581244",
                },
              }}
            >
              {t("UserModal.Save")}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Modal>
  );
};

export default ModalAdmin;
