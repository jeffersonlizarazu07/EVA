import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Button,
  Grid,
  Box,
  Chip,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getMonitorinStructure } from "../../services/agent_listService";
import { FeedbackButton, SaveButton } from "../../components/buttons/buttons";
import { saveFeedback } from "../../services/agent_listService";

const ModalMonitoringView = ({
  open,
  closeModal,
  data,
  t,
  fetchMonitoring,
}) => {
  const [monitoringDetails, setMonitoringDetails] = useState([]); // Trae la data detallada del monitoreo
  const [openModalFeed, setOpenModalFeed] = useState(false); // Manejo del modal de feedback
  const [feedback, setFeedback] = useState(""); // Captura el input del comentario a guardar
  const [feedbackDisabled, setFeedbackDisabled] = useState(false); // Manejo del botón de comentario

  useEffect(() => {
    if (!data?.id) return; //Evitar errores si no hay data al cargar

    async function fetchMonitoringDetails() {
      try {
        console.log("ID de monitoreo:", data.id);

        const result = await getMonitorinStructure(data.id); // Usa el ID de la fila seleccionada en la tabla
        console.log("Estructura recibida:", result);
        setMonitoringDetails(result.details);
      } catch (error) {
        console.error("Error al traer los detalles:", error);
      }
    }

    fetchMonitoringDetails();
  }, [data?.id]); // Trae la data cada vez que cambie el ID

  if (!open) return null; //No renderiza nada si el modal no está abierto

  console.log("Data recibida en el modal:", data);

  const openModalFeedback = () => setOpenModalFeed(true); // Abre el modal del feedback

  const closeModalFeedback = () => setOpenModalFeed(false); // Cierra el mddal del feedback

  const feedbackValidate = () => {
    return !data.feedback || data.feedback.trim() === ""; // Si el feedback viene vació se habilita el botón para realizar feedback
  };

  // Guardar feedback en el modal de visualizaciones de los monitoreos
  const handleSaveFeedback = async () => {
    try {
      if (feedback.trim() === "") {
        alert("No es posible guardar el comentario vacío");
        return;
      }
      await saveFeedback(data.id, feedback);
      await fetchMonitoring();
      alert("Comentario guardado correctamente");
      closeModalFeedback();
      setFeedbackDisabled(true);
    } catch (err) {
      console.error("Error al guardar comentario");
      throw err;
    }
  };

  const header = [
    "id",
    "form_title",
    "client_name",
    "monitoring_date",
    "score",
    "evaluator_name",
    // "feedback",
  ];

  const getHeaderLabel = (item) => {
    switch (item) {
      case "id":
        return "Identificador de la Monitorización";
      case "form_title":
        return "Monitorizaciones";
      case "client_name":
        return "Cliente";
      case "evaluator_name":
        return "Evaluador";
      case "monitoring_date":
        return "Fecha de monitorización";
      case "":
        return "Posible puntuación";
      case "score":
        return "Score";
      //   case "feedback":
      //     return "Comentarios";
      default:
        return item;
    }
  };

  const getUserType = (type) => {
    switch (type) {
      case 1:
        return t("userTable.SuperAdmin");
      case 2:
        return t("userTable.Admin");
      case 3:
        return t("userTable.Editor");
      default:
        return t("userTable.Viwer");
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={closeModal}
        maxWidth="xl"
        fullWidth
        disableAutoFocus
        scroll="paper"
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <DialogTitle sx={{ m: 0, p: 2 }}>
            Resumen de Monitorización
          </DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <FeedbackButton
              onClick={openModalFeedback}
              disabled={!feedbackValidate() || feedbackDisabled}
            />
            <IconButton onClick={closeModal} size="large" sx={{ mr: 0 }}>
              <CloseIcon sx={{ fontSize: 30 }} />
            </IconButton>
          </Box>
        </Box>

        <Grid
          item
          xs={12}
          sx={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <DialogContent
            dividers
            sx={{
              backgroundColor: "#f5f7fa",
              borderRadius: 2,
              padding: 2,
              maxWidth: 1320,
              width: "100%",
              margin: "0 auto",
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                paddingTop: 1,
                paddingLeft: 1,
              }}
            >
              <Grid
                container
                sx={{
                  width: "100%",
                  maxWidth: 1250,
                }}
              >
                {header.map((key, i) => (
                  <Grid
                    container
                    key={i}
                    spacing={1}
                    sx={{
                      backgroundColor: i % 2 === 0 ? "#ffffff" : "#eef3fb",
                      paddingY: 1,
                      borderBottom: "1px solid #d6d6d6ff",
                    }}
                  >
                    <Grid item xs={6} sm={6}>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        sx={{
                          paddingLeft: "10px",
                          fontSize: 18,
                          color: "#2c3e50",
                        }}
                      >
                        {getHeaderLabel(key)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={6}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: 16,
                          color: "#555",
                          wordBreak: "break-word", // Evita desbordes
                          whiteSpace: "normal",
                        }}
                      >
                        {data[key] ?? "Campo no disponible"}
                      </Typography>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </DialogContent>
        </Grid>

        <Box>
          <DialogTitle>Datos del monitoreo</DialogTitle>
          <DialogContent dividers>
            {/* Feedback */}
            <Box
              sx={{
                border: "1px solid #ccc",
                borderRadius: 2,
                padding: 2,
                backgroundColor: "#fafafa",
                marginBottom: "2.1rem",
              }}
            >
              {/* Título principal */}
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ paddingBottom: "10px" }}
              >
                Comentario
              </Typography>

              {/* Comentario principal */}
              <Typography
                variant="body2"
                sx={{
                  color: "green",
                  whiteSpace: "pre-line",
                  marginBottom: 2,
                  borderRadius: "2px",
                  border: "ButtonText",
                }}
              >
                {data.feedback}
              </Typography>

              {/* Pie de página */}
              <Grid container justifyContent="space-between">
                <Typography
                  variant="caption"
                  sx={{ display: "block", lineHeight: 1.2 }}
                >
                  Creado por:
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ display: "block", lineHeight: 1.2 }}
                >
                  Creado: {data.monitoring_date}
                </Typography>
              </Grid>
              <Typography
                variant="caption"
                sx={{ display: "block", lineHeight: 1.2 }}
              >
                Enviado acuse de recibo:
              </Typography>
            </Box>

            {/* Bloques de los formularios con su estructura */}
            {monitoringDetails?.map((block) => (
              <Box
                key={block.block_id}
                mb={2}
                sx={{
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  paddingBottom: "1.25rem",
                }}
              >
                {/* Fila superior con título y puntuación + chip */}
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="flex-start"
                  spacing={2}
                >
                  {/* Título */}
                  <Grid item xs={12} sm={8}>
                    <Typography variant="h6">{block.block_name}</Typography>
                  </Grid>

                  {/* Columna derecha: puntuación + chip */}
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: { xs: "flex-start", sm: "flex-end" },
                      gap: 1,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Puntuación: 5.00 | Media ponderada: 100.00
                    </Typography>
                  </Grid>
                </Grid>

                {/* Preguntas */}
                <Box mt={1}>
                  {block.questions?.map((question) => (
                    <Box
                      key={question.question_id}
                      sx={{
                        ml: 2,
                        mb: 2,
                      }}
                    >
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography variant="body2">
                          {question.question_name}
                        </Typography>
                        {question.select_option &&
                          (question.correct_answer ? (
                            <Chip label="Correcto" color="success" />
                          ) : (
                            <Chip label="Incorrecto" color="error" />
                          ))}
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        {question.select_option || question.answer}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </DialogContent>
        </Box>
        <DialogActions>
          <Button onClick={closeModal} color="secondary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openModalFeed}
        onClose={closeModalFeedback}
        fullWidth
        maxWidth="sm"
      >
        <Box sx={{ pt: 2, px: 3, pb: 1, position: "relative" }}>
          {/* Botón cerrar */}
          <IconButton
            onClick={closeModalFeedback}
            size="large"
            sx={{
              position: "absolute",
              top: 4,
              right: 4,
              zIndex: 1,
              fontSize: 30,
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          {/* Título */}
          <Typography fontWeight="bold" sx={{ mb: 2 }}>
            {t("Feedback")}
          </Typography>
          {/* Campo de texto */}
          <TextField
            placeholder={t("monitoringModal.EnterFeedback")}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            multiline
            fullWidth
            className="readOnlyField"
            sx={{
              "& .MuiInputBase-root": {
                height: "150px",
                alignItems: "flex-start",
                padding: "10px",
                marginBottom: "10px",
              },
              "& .MuiInputBase-inputMultiline": {
                padding: 0,
                height: "100%",
                overflow: "auto",
              },
            }}
          />
          {/* Botón guardar */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "8px",
            }}
          >
            <SaveButton onClick={handleSaveFeedback} />
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default ModalMonitoringView;
