import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";

const ModalRegisterUser = ({ open, handleClose, userId }) => {
  const [clients, setClients] = useState([]); // Lista de clientes obtenida de la API
  const [selectedClient, setSelectedClient] = useState(""); // Cliente seleccionado
  const [formName, setFormName] = useState(""); // Nombre del formulario
  const [description, setDescription] = useState(""); // Descripción del formulario

  useEffect(() => {
    const obtenerClientes = async () => {
      if (open && userId) {
        console.log("👤 ID del usuario recibido en Modal:", userId);

        const token = Cookies.get("accessToken");
        if (!token) {
          console.error("❌ Token no encontrado en cookies");
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        };

        try {
          const response = await axios.get(`http://localhost:3000/api/users_client/${userId}`, config);

          console.log("📦 Respuesta completa:", response); // Verifica cómo es la respuesta

          // Asegúrate de acceder correctamente a la propiedad `data` de la respuesta
          if (response.data && response.data.data) {
            console.log("📦 Datos de clientes:", response.data.data); // Verifica los datos
            setClients(response.data.data); // Establece los clientes en el estado
          } else {
            console.warn("❌ No se encontraron clientes o la estructura de la respuesta no es la esperada");
            setClients([]); // Si no hay datos, asegurarse de que la lista quede vacía
          }
        } catch (error) {
          console.error("❌ Error al obtener clientes:", error.response || error.message);
          setClients([]); // Si hay error, también limpiar los clientes
        }
      }
    };

    obtenerClientes();
  }, [open, userId]); // Dependencia de `open` y `userId` para cargar los datos

  const handleSave = () => {
    // Verifica los valores antes de guardar
    const formData = {
      formName,
      description,
      selectedClient,
    };
    console.log("📤 Datos del formulario a guardar:", formData);
    handleClose(); // Cierra el modal después de guardar
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Añadir Formulario</DialogTitle>
      <DialogContent dividers>
        <TextField
          fullWidth
          label="Nombre del formulario"
          margin="dense"
          value={formName}
          onChange={(e) => setFormName(e.target.value)} // Actualiza el estado de `formName`
        />

        <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
          <InputLabel id="clientes-label">Clientes</InputLabel>
          <Select
            labelId="clientes-label"
            id="clientes"
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)} // Actualiza el estado de `selectedClient`
            label="Clientes"
          >
            <MenuItem value="">Seleccione</MenuItem>
            {clients.length > 0 ? (
              clients.map((client) => (
                <MenuItem key={client.idClient} value={client.idClient}>
                  {client.clientName}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled value="">
                No hay clientes disponibles
              </MenuItem>
            )}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Descripción"
          margin="dense"
          multiline
          rows={4}
          sx={{ mt: 2 }}
          value={description}
          onChange={(e) => setDescription(e.target.value)} // Actualiza el estado de `description`
        />
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{ backgroundColor: "#6c757d" }}
        >
          Cerrar
        </Button>
        <Button
          onClick={handleSave}
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