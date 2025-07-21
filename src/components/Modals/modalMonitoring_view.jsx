import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Grid,
  Box,
} from "@mui/material";

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
      <DialogTitle>Resumen de Monitorización</DialogTitle>
      <Grid item xs={2}>
        <DialogContent dividers>
          {data.map((item, index) => (
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
                  <Grid item xs={6} sm={8} key={index}>
                    <Typography variant="body2" sx={{ paddingTop: "5px" }}>
                      {" "}
                      {item[key] ?? "Campo no disponible"}{" "}
                    </Typography>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          ))}
        </DialogContent>
      </Grid>
      <Box>
        <DialogTitle>Datos del monitoreo</DialogTitle>
        <DialogContent></DialogContent>
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
