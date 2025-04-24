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
import Swal from "sweetalert2";
//import { getForms } from '../../pages/admin/agent_monitoring'; 

const ModalRegisterUser = ({ open, handleClose, userId }) => {
  const [clients, setClients] = useState([]); // Lista de clientes obtenida de la API
  const [selectedClient, setSelectedClient] = useState(""); // Cliente seleccionado
  const [formName, setFormName] = useState(""); // Nombre del formulario
  const [description, setDescription] = useState(""); // Descripción del formulario

  useEffect(() => {
    const obtenerClientes = async () => {
      if (open) {
        const token = Cookies.get("accessToken");
        const userId = Cookies.get("userId");
  
        if (!token || !userId) {
          console.error("❌ Token o userId no encontrado en cookies");
          return;
        }
  
        //console.log("👤 ID del usuario desde cookies:", userId);
  
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        };
  
        try {
          const response = await axios.get(`http://localhost:3000/api/users_client/${userId}`, config);
          if (response.data && response.data.data) {
            setClients(response.data.data);
          } else {
            setClients([]);
          }
        } catch (error) {
          console.error("❌ Error al obtener clientes:", error.response || error.message);
          setClients([]);
        }
      }
    };
  
    obtenerClientes();
  }, [open]);
  
  const handleSave = async () => {
    const token = Cookies.get("accessToken");
    const userId = Cookies.get("userId");
  
    if (!formName || !description || !selectedClient) {
      Swal.fire({
        title: "Error",
        text: "Todos los campos son obligatorios",
        icon: "error",
        confirmButtonText: "Cerrar"
      });
      return;
    }
  
    const formData = {
      title: formName,
      description,
      idClient: selectedClient,
      creation_date: new Date().toISOString().slice(0, 19).replace("T", " "), // formato 'YYYY-MM-DD HH:MM:SS'
      created_by: userId,
      updated_date: new Date().toISOString().slice(0, 19).replace("T", " "),
      updated_by: userId,
      state: 1,
    };
  
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };
  
    try {
      const response = await axios.post("http://localhost:3000/api/forms", formData, config);
      console.log("✅ Formulario creado:", response.data);
      Swal.fire({
        title: "Formulario creado",
        text: "Formulario creado correctamente",
        icon: "success",
        confirmButtonText: "Cerrar"
      });
      handleClose();
    } catch (error) {
      console.error("❌ Error al guardar el formulario:", error.response || error.message);
      Swal.fire({
        title: "Error",
        text: "Error al guardar el formulario",
        icon: "error",
        confirmButtonText: "Cerrar"
      });
    }
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