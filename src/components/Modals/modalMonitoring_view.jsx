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
  Divider,
  Chip,
  TextareaAutosize,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import shadows from "@mui/material/styles/shadows";
import { getMonitorinStructure } from "../../services/agent_listService";
import { AcceptButton } from "../buttons/buttons";

const ModalMonitoringView = ({ open, closeModal, data }) => {
  const [monitoringDetails, setMonitoringDetails] = useState([]);

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
    <Dialog
      open={open}
      onClose={closeModal}
      maxWidth="xl"
      fullWidth
      disableAutoFocus
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <DialogTitle sx={{ m: 0, p: 2 }}>Resumen de Monitorización</DialogTitle>
        <AcceptButton>Feedback</AcceptButton>
        <IconButton onClick={closeModal} size="large" sx={{ mr: 0 }}>
          <CloseIcon sx={{ fontSize: 30 }} />
        </IconButton>
      </Box>

      <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
        <DialogContent
          dividers
          sx={{
            backgroundColor: "#f5f7fa",
            borderRadius: 2,
            padding: 2,
          }}
        >
          <Grid container spacing={1} sx={{ width: "100%" }}>
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
                    sx={{ fontSize: 16, color: "#555" }}
                  >
                    {data[key] ?? "Campo no disponible"}
                  </Typography>
                </Grid>
              </Grid>
            ))}
          </Grid>
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
                    gap: 1, // espacio entre puntuación y chip
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
                  <Box key={question.question_id} sx={{ ml: 2, mb: 2 }}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body2">
                        {question.question_name}
                      </Typography>
                      <Chip label="Correcto" color="success" />
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
  );
};

export default ModalMonitoringView;
