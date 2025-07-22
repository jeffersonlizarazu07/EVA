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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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
      
      <Box sx={{ width: "100%" }}>
        <DialogTitle>Datos del monitoreo</DialogTitle>
        <DialogContent dividers>
          {/* Tipología */}
          <Box
            mb={2}
            sx={{
              fullWidth: "100%",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h6">Tipología</Typography>
            <Grid container justifyContent="space-between" alignItems="center">
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
            <Typography variant="h6">FCR</Typography>
            <Grid container justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Puntuación: 0.00 | Media ponderada: N/A
              </Typography>
            </Grid>
            <Divider sx={{ my: 1 }} />
          </Box>

          {/* Relacionamiento 1 */}
          <Box
            mb={2}
            sx={{ borderBottom: "1px solid", borderColor: "divider" }}
          >
            <Typography variant="h6">Relacionamiento 1</Typography>
            <Typography variant="body2" sx={{ ml: 2 }}>
              1. Asistir de forma oportuna dentro del tiempo establecido. (INC)
            </Typography>
            <Grid container justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Puntuación: 5.00 | Media ponderada: 100.00
              </Typography>
              <Chip label="Correcto" color="success" />
            </Grid>
            <Divider sx={{ my: 1 }} />
          </Box>

          {/* Relacionamiento 2 */}
          <Box
            mb={2}
            sx={{ borderBottom: "1px solid", borderColor: "divider" }}
          >
            <Typography variant="h6">Relacionamiento 2</Typography>
            <Typography variant="body2" sx={{ ml: 2 }}>
              1. Bienvenida y presentación clara. (INC)
            </Typography>
            <Grid container justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Puntuación: 5.00 | Media ponderada: 100.00
              </Typography>
              <Chip label="Correcto" color="success" />
            </Grid>
            <Divider sx={{ my: 1 }} />
          </Box>

          {/* Validación Información */}
          <Box
            mb={2}
            sx={{ borderBottom: "1px solid", borderColor: "divider" }}
          >
            <Typography variant="h6">Validación Información</Typography>
            <Typography variant="body2" sx={{ ml: 2 }}>
              1. Todas las preguntas correctamente. (INC)
            </Typography>
            <Grid container justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Puntuación: 0.00 | Media ponderada: 0.00
              </Typography>
              <Chip label="Incorrecto" color="error" />
            </Grid>
            <Divider sx={{ my: 1 }} />
          </Box>

          {/* Habilidades blandas */}
          <Box
            mb={2}
            sx={{ borderBottom: "1px solid", borderColor: "divider" }}
          >
            <Typography variant="h6">Habilidades blandas 1</Typography>
            <Typography variant="body2" sx={{ ml: 2 }}>
              1. Manejar información clara y lenguaje adecuado. (INC)
            </Typography>
            <Grid container justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Puntuación: 5.00 | Media ponderada: 100.00
              </Typography>
              <Chip label="Correcto" color="success" />
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
