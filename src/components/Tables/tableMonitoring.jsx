import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
} from "@mui/material";

const ModalRegisterUser = ({ open, handleClose }) => {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Añadir Formulario</DialogTitle>
      <DialogContent dividers>
        {/* Datos de usuario */}
        <TextField fullWidth label="Nombre del formulario" margin="dense" />
        {/* <TextField fullWidth label="Segundo nombre" margin="dense" />
            <TextField fullWidth label="Apellidos" margin="dense" /> */}
        <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
          <InputLabel id="clientes-label">Clientes</InputLabel>
          <Select labelId="clientes-label" id="clientes" label="Clientes">
            <MenuItem value="">Seleccione</MenuItem>
            <MenuItem value="cliente1">Cliente 1</MenuItem>
            <MenuItem value="cliente2">Cliente 2</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>

      {/* Botones */}
      <DialogActions>
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{ backgroundColor: "#6c757d" }}
        >
          Cerrar
        </Button>
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{ backgroundColor: "#d1006c" }}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalRegisterUser;
