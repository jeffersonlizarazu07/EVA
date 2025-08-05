import React, { useEffect, useContext } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import {
  SingleChoiceQuestion,
  MultipleChoiceQuestion,
  MultipleChoiceQuestionEdit,
  SingleChoiceQuestionEdit,
  SelectorQuestion,
  SelectorQuestionEdit,
  MultipleChoiceQuestionEditWrapper,
} from "../../pages/survey/singleChoiceQuestion";

import {
  Textfield_s,
  SingleChoiceView,
  MultipleChoiceView,
} from "../../pages/survey/questions";
import "../../assets/css/survey.css";
import "../../assets/css/surveyBlocks.css";
import "../../assets/css/newUser.css";

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
  Autocomplete,
  Select,
  Tooltip,
  FormControl,
  InputLabel,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useTranslation } from "react-i18next";
import { UserContext } from "../../context/UserContext";

const ModalSurveyBlocks = ({
  open,
  handleModalClose,
  operation,
  title,
  descriptionText,
  questionsList,
  handleInputChange,
  singleChoiceData,
  multipleChoiceData,
  selectorData,
  handleSingleChoiceChange,
  handleMultipleChoiceChange,
  handleSelectorChange,
  isChecked,
  listConditional,
  valueConditional,
  conditionalHandleChange,
  error,
  validar,
  setReferenceBlockId,
  idToEdit,
  id_form,
  areAllFieldsCompleted,
  obtenerPorcentajeTotalBloques,
  addNewQuestion,
  questionCountInput,
  setQuestionCountInput,
  nombreInput,
  ponderacionInput,
  posicionInput,
  positionType,
  referenceBlockId,
  data,
  migrateQuestionData,
  setPositionType,
  selectError,
  handleErrorOpt,
}) => {
  const { t, i18n } = useTranslation();
  const { languageUser } = useContext(UserContext);

  useEffect(() => {
    i18n.changeLanguage(languageUser);
  }, [languageUser, i18n]);
return (
    <Modal
      open={open}
      onClose={handleModalClose}
      aria-labelledby="manage-question-modal-title"
      aria-describedby="manage-question-modal-description"
    >
      <Box className="modalBox">
        <Paper elevation={0} sx={{ borderRadius: 2 }}>
          {/* Encabezado */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 3 }}>
            <Typography variant="h6" fontWeight="bold">
              {title || "Crear Bloque de Formulario"}
            </Typography>
            <IconButton onClick={handleModalClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Cuerpo */}
          <Box sx={{ px: 3, pb: 3 }}>
            <Grid container spacing={3} maxHeight="65vh" overflow="auto">
              {/* Columna izquierda */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ mb: 3 }} gutterBottom>
                  {"Información de bloque"}
                </Typography>

                {/* Nombre del bloque */}
                <TextField
                  fullWidth
                  label="Nombre de bloque"
                  value={nombreInput.input}
                  onChange={(e) => nombreInput.handleChange(e.target.value)}
                  required
                  sx={{ mb: 2 }}
                  className="readOnlyField"
                />

                {/* Ponderación */}
                <TextField
                  fullWidth
                  label="Ponderación (0-100)"
                  type="number"
                  value={ponderacionInput.input}
                  onChange={async (e) => {
                    const value = e.target.value;

                    if (value === "") {
                      ponderacionInput.handleChange(value);
                      return;
                    }

                    const numValue = parseFloat(value);
                    if (isNaN(numValue) || numValue < 0 || numValue > 100) return;

                    const totalActual = await obtenerPorcentajeTotalBloques("1");
                    const nuevoTotal = totalActual + numValue;

                    if (nuevoTotal > 100) {
                      Toast.fire({
                        icon: "warning",
                        title: `La suma de ponderaciones no puede superar 100%. Actualmente llevas ${totalActual}%.`,
                      });
                      return;
                    }

                    ponderacionInput.handleChange(value);
                  }}
                  inputProps={{ min: 0, max: 100 }}
                  required
                  sx={{ mb: 2 }}
                  className="readOnlyField"
                />

                {/* Posición del bloque */}
                <TextField
                  fullWidth
                  label="Posición del bloque"
                  type="number"
                  value={posicionInput.input}
                  onChange={(e) => posicionInput.handleChange(e.target.value)}
                  required
                  sx={{ mb: 2 }}
                  className="readOnlyField"
                />

                {/* Select de tipo de posición */}
                <TextField
                  select
                  fullWidth
                  label="Posición"
                  value={positionType}
                  onChange={(e) => setPositionType(e.target.value.toLowerCase())}
                  sx={{ mb: 2 }}
                  className="readOnlyField"
                >
                  <MenuItem value="" disabled>
                    Seleccione posición
                  </MenuItem>
                  <MenuItem value="before"><ArrowUpwardIcon /> Antes de</MenuItem>
                  <MenuItem value="after"><ArrowDownwardIcon /> Después de</MenuItem>
                </TextField>

                {/* Select de bloque de referencia */}
                <TextField
                  select
                  fullWidth
                  label="Bloque de referencia"
                  value={referenceBlockId || ""}
                  onChange={(e) => setReferenceBlockId(e.target.value)}
                  disabled={!positionType}
                  sx={{ mb: 2 }}
                  className="readOnlyField"
                >
                  <MenuItem value="" disabled>
                    Seleccione bloque
                  </MenuItem>
                  {data.map((bloque) => (
                    <MenuItem key={bloque.id} value={bloque.id}>
                      {`Bloque ${bloque.posicion}: ${bloque.nombreBloque || "Sin nombre"}`}
                    </MenuItem>
                  ))}
                </TextField>

                {positionType && referenceBlockId && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    El bloque se colocará <strong>{positionType === "before" ? "antes del" : "después del"}</strong> bloque seleccionado y se actualizarán automáticamente las posiciones.
                  </Alert>
                )}
              </Grid>

              {/* Columna derecha */}
              <Grid item xs={12} sm={6}>
                {/* Título */}
                <Typography variant="subtitle1" sx={{ mb: 3 }} gutterBottom>
                  {"Preguntas y tipo de respuesta"}
                </Typography>

                {/* Input para cantidad de preguntas */}
                <TextField
                  type="number"
                  label="Número de preguntas"
                  value={questionCountInput}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      setQuestionCountInput(value);
                    }
                  }}
                  sx={{ mb: 2 }}
                  className="readOnlyField"
                  size="small"
                />

                {/* Botón para agregar preguntas */}
                <Button
                  variant="contained"
                  onClick={addNewQuestion}
                  sx={{ ml:2,
                    backgroundColor: '#b62a8b',
                    '&:hover': {
                      backgroundColor: '#581244'
                    }
                  }}
                >
                  + Pregunta
                </Button>

                {/* Lista de preguntas */}
                {questionsList.map((q, index) => (
                  <Box key={index} sx={{ p: 2, mb: 2, boxShadow: 2, borderRadius: 1 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2 }} gutterBottom>
                      Pregunta {index + 1}
                    </Typography>

                    {/* Texto de la pregunta */}
                    <TextField
                      fullWidth
                      label="Texto de la pregunta"
                      value={q.text || ""}
                      onChange={(e) => handleInputChange(index, "text", e.target.value)}
                      size="small"
                      sx={{ mb: 2 }}
                      className="readOnlyField"
                    />

                    {/* Tipo de error */}
                    <TextField
                      select
                      fullWidth
                      label="Tipo de error"
                      value={q.error || ""}
                      onChange={(e) => handleInputChange(index, "error", e.target.value)}
                      size="small"
                      sx={{ mb: 2 }}
                      className="readOnlyField"
                    >
                      <MenuItem value="" disabled>Seleccione error</MenuItem>
                      <MenuItem value="ecc_opt" title="Error crítico de cumplimiento">ECC</MenuItem>
                      <MenuItem value="ecuf_opt" title="Error crítico de usuario final">ECUF</MenuItem>
                      <MenuItem value="ecn_opt" title="Error crítico de negocio">ECN</MenuItem>
                    </TextField>

                    {/* Tipo de pregunta */}
                    <TextField
                      select
                      fullWidth
                      label="Tipo de pregunta"
                      value={q.type}
                      onChange={(e) => {
                        const newType = e.target.value;
                        const oldType = q.type;

                        handleInputChange(index, "type", newType);

                        if (operation === 1 && newType !== oldType) {
                          handleInputChange(index, "selectorOptions", []);
                          handleInputChange(index, "selectorSelectedOption", "");
                          handleInputChange(index, "checkboxOptions", []);
                          handleInputChange(index, "checkboxCorrectAnswers", []);
                          handleInputChange(index, "textfieldValue", "");
                        }
                      }}
                      size="small"
                      sx={{ mb: 2 }}
                      className="readOnlyField"
                    >
                      <MenuItem value="" disabled>Seleccione opción</MenuItem>
                      <MenuItem value="selector_opt">Seleccionador</MenuItem>
                      <MenuItem value="check_opt">Selección múltiple</MenuItem>
                      <MenuItem value="textfield_s">Campo de texto</MenuItem>
                    </TextField>

                    {/* Lógica para diferentes tipos de preguntas */}
                    {(operation === 1 || operation === 2) && (
                      <>
                        {q.type === "selector_opt" && (
                           <Box>
                            <SelectorQuestionEdit
                              options={q.selectorOptions || q.options || []}
                              onChange={(data) => {
                                handleInputChange(index, "selectorOptions", data.options);
                                handleInputChange(index, "selectorSelectedOption", data.selectedOption);
                              }}
                            />

                            {(q.selectorSelectedOption || q.selected_answer) && (
                              <Box sx={{ mt: 3, p: 3, bgcolor: "background.paper", border: "1px solid", borderColor: "grey.300", borderRadius: 1 }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                  Respuesta seleccionada:
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center", color: "success.main" }}>
                                  <i className="fa-solid fa-check-circle" style={{ marginRight: 8 }}></i>
                                  <Typography component="strong">
                                   {(() => { //para poner el indice de selected_answer en el texto de selectorOptions
                                    const opts = Array.isArray(q.selectorOptions) ? q.selectorOptions : typeof q.options === "string" ? q.options.split(",") : [];
                                    const idx = q.selectorSelectedOption ?? q.selected_answer;
                                    return opts[idx] || "";
                                  })()}
                                  </Typography>
                                </Box>
                              </Box>
                            )}
                          </Box>
                        )}

                        {q.type === "check_opt" && (
                          <Box>
                            <MultipleChoiceQuestionEditWrapper
                              options={q.checkboxOptions || q.options || []}
                              correctAnswers={q.checkboxCorrectAnswers || []}
                              idToEdit={q.id}
                              onChange={(data) => {
                                handleInputChange(index, "checkboxOptions", data.options);
                                handleInputChange(index, "checkboxCorrectAnswers", data.correctAnswers);
                              }}
                            />

                            {( (q.checkboxCorrectAnswers && q.checkboxCorrectAnswers.length > 0) || (q.selected_answer && q.selected_answer.length > 0) ) ? (
                              <Box sx={{ mt: 3, p: 3, bgcolor: "background.paper", border: "1px solid", borderColor: "grey.300", borderRadius: 1 }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                  Respuestas seleccionadas:
                                </Typography>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, }}>
                                  {(q.checkboxCorrectAnswers && q.checkboxCorrectAnswers.length > 0 ? q.checkboxCorrectAnswers : q.selected_answer).map((answer, i) => (
                                    <Box key={i} sx={{ display: "flex", alignItems: "center", color: "success.main" }}>
                                      <i className="fa-solid fa-check-circle" style={{ marginRight: 6 }}></i>
                                      <Typography component="span" variant="body2" fontWeight="bold">
                                        {answer}
                                      </Typography>
                                    </Box>
                                  ))}
                                </Box>
                              </Box>
                             ) : (
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
                                No hay respuestas seleccionadas.
                              </Typography>
                            )
                          }
                          </Box>
                        )}

                        {q.type === "textfield_s" && (
                          <Textfield_s
                            value={q.textfieldValue || q.selected_answer || ""}
                            onChange={(val) => {
                              handleInputChange(index, "textfieldValue", val);
                            }}
                          />
                        )}
                      </>
                    )}

                    {error && (
                      <Typography color="error" align="center" sx={{ mt: 2 }}>
                        {error}
                      </Typography>
                    )}
                  </Box>
                ))}
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
              onClick={() => validar(idToEdit, id_form)}
              disabled={!areAllFieldsCompleted()}
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
  );
};

export default ModalSurveyBlocks;