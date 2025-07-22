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

const ModalMonitoringView = ({ open, closeModal, data }) => {
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
      {/* <IconButton size="large">
        <CloseIcon />
      </IconButton> */}

      <DialogTitle>Resumen de Monitorización</DialogTitle>
      <Grid item xs={2}>
        <DialogContent dividers>
          <Grid container spacing={1}>
            {header.map((key, i) => (
              <Grid container key={i} spacing={1}>
                {/* Columna 1: Etiqueta */}
                <Grid item xs={6} sm={4}>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ paddingTop: "5px", paddingLeft: "10px" }}
                  >
                    {getHeaderLabel(key)}
                  </Typography>
                </Grid>

                {/* Columna 2: Valor */}
                <Grid item xs={6} sm={8}>
                  <Typography variant="body2" sx={{ paddingTop: "5px" }}>
                    {" "}
                    {data[key] ?? "Campo no disponible"}{" "}
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
          <Box>
            <Typography
              variant="h6"
              sx={{ borderBottom: "2px solid", borderColor: "divider" }}
            >
              Form Feedback Summary
            </Typography>
            <Typography fontSize={14} sx={{marginBottom: "10px"}}>Feedback Summary Comment</Typography>
            <Typography sx={{ boxShadow: 2, marginBottom: "10px", minHeight: "90px", paddingLeft: "5px"}}>
              Aquí se mostrará el comentario.
            </Typography>
          </Box>

          {/* Tipología */}
          <Box
            mb={2}
            sx={{
              fullWidth: "100%",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Grid container justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Tipología</Typography>
              <Typography variant="body2" color="text.secondary">
                Puntuación: 0.00 | Media ponderada: N/A
              </Typography>
            </Grid>
            <Divider sx={{ my: 1 }} />
          </Box>

          {/* FCR */}
          <Box
            mb={2}
            sx={{ borderBottom: "1px solid", borderColor: "divider" }}
          >
            <Grid container justifyContent="space-between" alignItems="center">
              <Typography variant="h6">FCR</Typography>
              <Typography variant="body2" color="text.secondary">
                Puntuación: 0.00 | Media ponderada: N/A
              </Typography>
            </Grid>
            <Divider sx={{ my: 1 }} />
          </Box>

          {/* Relacionamiento 1 */}
          <Box
            mb={2}
            sx={{
              borderBottom: "1px solid",
              borderColor: "divider",
              paddingBottom: "1.25rem",
            }}
          >
            <Grid
              container
              justifyContent="space-between"
              alignItems="flex-start"
              spacing={2}
              wrap="wrap"
            >
              {/* Título */}
              <Grid item xs={12} sm="auto">
                <Typography variant="h6">Relacionamiento 1</Typography>
              </Grid>

              {/* Puntuación y ponderación */}
              <Grid item xs={12} sm="auto">
                <Typography variant="body2" color="text.secondary">
                  Puntuación: 5.00 | Media ponderada: 100.00
                </Typography>
              </Grid>

              {/* Descripción */}
              <Grid item xs={12} sm={8}>
                <Typography variant="body2" sx={{ ml: 2 }}>
                  1. Asistir de forma oportuna dentro del tiempo establecido.
                  (INC)
                </Typography>
              </Grid>

              {/* Chip alineado derecha */}
              <Grid
                item
                xs={12}
                sm="auto"
                sx={{
                  display: "flex",
                  justifyContent: { xs: "flex-start", sm: "flex-end" },
                  width: "100%",
                }}
              >
                <Chip label="Correcto" color="success" />
              </Grid>
            </Grid>
          </Box>

          {/* Relacionamiento 2 */}
          <Box
            mb={2}
            sx={{ borderBottom: "1px solid", borderColor: "divider" }}
          >
            <Grid
              container
              justifyContent="space-between"
              alignItems="flex-start"
              spacing={2}
              wrap="wrap"
            >
              <Grid item xs={12} sm="auto">
                <Typography variant="h6">Relacionamiento 2</Typography>
              </Grid>
              <Grid item xs={12} sm="auto">
                <Typography variant="body2" color="text.secondary">
                  Puntuación: 5.00 | Media ponderada: 100.00
                </Typography>
              </Grid>
              <Grid item xs={12} sm="8">
                <Typography variant="body2" sx={{ ml: 2 }}>
                  1. Bienvenida y presentación clara. (INC)
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm="auto"
                sx={{
                  display: "flex",
                  justifyContent: { xs: "flex-start", sm: "flex-end" },
                  width: "100%",
                }}
              >
                <Chip label="Correcto" color="success" />
              </Grid>
            </Grid>
            <Divider sx={{ my: 1 }} />
          </Box>

          {/* Validación Información */}
          <Box
            mb={2}
            sx={{ borderBottom: "1px solid", borderColor: "divider" }}
          >
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item xs={12} sm="auto">
                <Typography variant="h6">Validación Información</Typography>
              </Grid>
              <Grid item xs={12} sm="auto" sx={{ paddingBottom: "30px" }}>
                <Typography variant="body2" color="text.secondary">
                  Puntuación: 0.00 | Media ponderada: 0.00
                </Typography>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography variant="body2" sx={{ ml: 2 }}>
                  1. Todas las preguntas correctamente. (INC)
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm="auto"
                sx={{
                  display: "flex",
                  justifyContent: { xs: "flex-start", sm: "flex-end" },
                  width: "100%",
                }}
              >
                <Chip label="Incorrecto" color="error" />
              </Grid>
            </Grid>
            <Divider sx={{ my: 1 }} />
          </Box>

          {/* Habilidades blandas */}
          <Box
            mb={2}
            sx={{ borderBottom: "1px solid", borderColor: "divider" }}
          >
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item xs={12} sm="auto">
                <Typography variant="h6">Habilidades blandas 1</Typography>
              </Grid>
              <Grid item xs={12} sm="auto" sx={{ paddingBottom: "40px" }}>
                <Typography variant="body2" sx={{ ml: 2 }}>
                  1. Manejar información clara y lenguaje adecuado. (INC)
                </Typography>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography variant="body2" color="text.secondary">
                  Puntuación: 5.00 | Media ponderada: 100.00
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm="auto"
                sx={{
                  display: "flex",
                  justifyContent: { xs: "flex-start", sm: "flex-end" },
                  width: "100%",
                }}
              >
                <Chip label="Correcto" color="success" />
              </Grid>
            </Grid>
            <Divider sx={{ my: 1 }} />
          </Box>
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
