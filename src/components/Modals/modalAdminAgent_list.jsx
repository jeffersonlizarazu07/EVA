import Swal from "sweetalert2";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  AcceptButton,
  saveButton,
  CancelButton,
} from "../../components/buttons/acceptButton";
import { colors } from "../../style/ThemeColors";

const ModalAdmin = ({
  // Props de agent_list
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
  calFormScore,
  handleSaveBlock,
  clientError,
  setClientError,
  formError,
  setFormError,
  dateError,
  setDateError,
  selectedBlockId,
  setSelectedBlockId,
  handleNextStep,
  open,
  handleSaveMonitoring,
  feedback,
  setFeedback,
  isSavingFeedback,
}) => {
  const { purpuraEva, grisButtonEva } = colors.light;
  return (
    <Dialog
      open={open}
      onClose={formClientReset}
      maxWidth="lg"
      fullWidth
      scroll="body"
    >
      <DialogTitle>
        {monitoringStep === 2 || monitoringStep === 3 ? (
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" alignItems="center">
              <IconButton
                onClick={() => setMonitoringStep(monitoringStep === 3 ? 2 : 1)}
                sx={{ marginLeft: "-22px" }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" paddingLeft="0">
                {userName || "Nuevo Agente"}
              </Typography>
            </Box>
            <IconButton onClick={formClientReset}>
              <CloseIcon />
            </IconButton>
          </Box>
        ) : (
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">{userName || "Nuevo Agente"}</Typography>
            <IconButton onClick={formClientReset}>
              <CloseIcon />
            </IconButton>
          </Box>
        )}
      </DialogTitle>

      <DialogContent dividers>
        {monitoringStep === 1 && (
          <>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Crear una monitorización
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={clientError} disabled={loading}>
                  <InputLabel>Monitor Client</InputLabel>
                  <Select
                    value={selectedClientId || ""}
                    label="Monitor Client"
                    onChange={(e) => {
                      handleClientChange(e);
                      setClientError(false);
                    }}
                  >
                    <MenuItem value="">Seleccione un cliente</MenuItem>
                    {userClients.map((client) => (
                      <MenuItem key={client.id} value={client.id}>
                        {client.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {loading && (
                  <Box mt={1} display="flex" alignItems="center">
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                    <Typography variant="body2">Cargando...</Typography>
                  </Box>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={formError}>
                  <InputLabel>Monitorizaciones</InputLabel>
                  <Select
                    value={selectedFormId || ""}
                    label="Monitorizaciones"
                    onChange={(e) => {
                      handleFormSelect(e);
                      setFormError(false);
                    }}
                  >
                    <MenuItem value="">
                      {!selectedClientId
                        ? "Primero seleccione un cliente"
                        : loading
                        ? "Cargando formularios..."
                        : formOptions.length === 0
                        ? "No hay formularios disponibles"
                        : "Seleccionar formulario"}
                    </MenuItem>
                    {formOptions.map((form) => (
                      <MenuItem key={form.id} value={form.id}>
                        {form.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha de monitorización"
                  InputLabelProps={{ shrink: true }}
                  value={monitoringDate}
                  onChange={(e) => {
                    setMonitoringDate(e.target.value);
                    setDateError(false);
                  }}
                  error={dateError}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Evaluador"
                  value={
                    userInfo
                      ? `${userInfo.firstname || ""} ${userInfo.lastname || ""}`
                      : "Cargando..."
                  }
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            </Grid>
          </>
        )}

        {monitoringStep === 2 && (
          <Box maxHeight="65vh" overflow="auto">
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Configuración de Monitorizaciones
            </Typography>
            <Box mb={2} p={2} border={1} borderRadius={2}>
              <Typography variant="h6" align="center" gutterBottom>
                Información del Formulario
              </Typography>
              <Box display="flex" gap={1}>
                <Typography fontWeight="bold">
                  Nombre del formulario:
                </Typography>
                <Typography>
                  {callSelectedForm?.title || "Formulario no seleccionado"}.
                </Typography>
              </Box>
              <Box display="flex" gap={1}>
                <Typography fontWeight="bold">Form Score:</Typography>
                <Typography>{calFormScore()}%.</Typography>
              </Box>
              <Box display="flex" gap={1}>
                <Typography fontWeight="bold">Posible puntuación:</Typography>
                <Typography>100%.</Typography>
              </Box>
            </Box>

            <Box border={1} borderRadius={2} overflow="hidden">
              {blocksForForm.length === 0 ? (
                <Typography color="text.secondary">
                  No se ha cargado o existe error al llamar los bloques.
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
                          {block.percentage}%
                        </Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      {block.preguntas.length === 0 ? (
                        <Typography color="text.secondary">
                          Este bloque no tiene preguntas registradas.
                        </Typography>
                      ) : (
                        block.preguntas.map((pregunta, idx) => (
                          <Accordion
                            key={pregunta.id}
                            sx={{
                              border: "1.5px solid #ccc",
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
                                <Typography>
                                  {pregunta.porcentajePregunta}%
                                </Typography>
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                              {pregunta.id_type_question === 1 &&
                                (pregunta.select_option || "")
                                  .split(";")
                                  .map((opt, i) => (
                                    <FormControlLabel
                                      key={i}
                                      control={<Checkbox disabled />}
                                      label={opt}
                                    />
                                  ))}

                              {pregunta.id_type_question === 2 && (
                                <FormControl fullWidth margin="normal">
                                  <Select
                                    value={pregunta.selected_answer || ""}
                                    disabled
                                  >
                                    {(pregunta.select_option || "")
                                      .split(",")
                                      .map((opt, i) => (
                                        <MenuItem key={i} value={opt.trim()}>
                                          {opt.trim()}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                </FormControl>
                              )}

                              {pregunta.id_type_question === 3 && (
                                <TextField
                                  fullWidth
                                  disabled
                                  multiline
                                  placeholder="Respuesta abierta..."
                                  margin="normal"
                                />
                              )}

                              <FormControl fullWidth margin="normal">
                                <InputLabel>Evaluación</InputLabel>
                                <Select
                                  value={pregunta.evaluacion || ""}
                                  label="Evaluación"
                                  onChange={(e) =>
                                    handleUpdatePregunta(
                                      pregunta.id,
                                      "evaluacion",
                                      e.target.value
                                    )
                                  }
                                >
                                  <MenuItem value="">Seleccionar</MenuItem>
                                  <MenuItem value="1">✅ Buena</MenuItem>
                                  <MenuItem value="0">❌ Mala</MenuItem>
                                </Select>
                              </FormControl>
                            </AccordionDetails>
                          </Accordion>
                        ))
                      )}
                      <Box
                        display="flex"
                        justifyContent="flex-end"
                        mt={2}
                      ></Box>
                    </AccordionDetails>
                  </Accordion>
                ))
              )}
            </Box>
          </Box>
        )}

        {monitoringStep === 3 && (
          <Box>
            <Typography fontWeight="bold" sx={{ marginBottom: "10px" }}>
              Feedback
            </Typography>
            <TextField
              placeholder="Ingrese su feedback aquí"
              multiline
              fullWidth
              value={feedback} // Conectar al estado
              onChange={(e) => setFeedback(e.target.value)} // Manejar cambios
              disabled={isSavingFeedback} // Deshabilitar mientras se guarda
              sx={{
                "& .MuiInputBase-root": {
                  height: "150px",
                  width: "50%",
                  alignItems: "flex-start",
                },
                "& .MuiInputBase-inputMultiline": {
                  padding: "10px",
                  height: "100%",
                  overflow: "auto",
                },
              }}
            />
            {/* <saveButton>Guardar cambios</saveButton> */}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ gap: 1 }}>
        <CancelButton onClick={formClientReset}></CancelButton>
        <AcceptButton onClick={handleNextStep}></AcceptButton>
      </DialogActions>
    </Dialog>
  );
};

export default ModalAdmin;
