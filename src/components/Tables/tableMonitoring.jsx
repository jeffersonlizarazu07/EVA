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

const ModalRegisterUser = ({ open, handleClose, formId }) => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [formName, setFormName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const obtenerClientes = async () => {
      if (open) {
        const token = Cookies.get("accessToken");
        const userId = Cookies.get("userId");

        if (!token || !userId) {
          console.error("❌ Token o userId no encontrado en cookies");
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        };

        try {
          const response = await axios.get(
            `http://localhost:3000/api/users_client/${userId}`,
            config
          );
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
      // Muestra un error en forma de Toast cuando los campos están vacíos
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
  
      Toast.fire({
        icon: "error",
        title: "Todos los campos son obligatorios",
      });
  
      return;
    }
  
    const formData = {
      title: formName,
      description,
      idClient: selectedClient,
      creation_date: new Date().toISOString().slice(0, 19).replace("T", " "),
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
      const response = await axios.post(
        "http://localhost:3000/api/forms",
        formData,
        config
      );
      console.log("✅ Formulario creado:", response.data);
  
      // Muestra un Toast de éxito cuando el formulario se crea correctamente
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
  
      Toast.fire({
        icon: "success",
        title: "Formulario creado correctamente",
      });
  
      handleClose();
    } catch (error) {
      console.error("❌ Error al guardar el formulario:", error.response || error.message);
  
      // Muestra un Toast de error si ocurre un fallo al guardar el formulario
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
  
      Toast.fire({
        icon: "error",
        title: "Error al guardar el formulario",
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
          onChange={(e) => setFormName(e.target.value)}
          sx={{
            borderRadius: "8px", // Borde redondeado
            //padding: "8px", // Menos padding
            marginBottom: "10px", // Espacio abajo
          }}
        />

        <FormControl
          fullWidth
          margin="dense"
          sx={{
            borderRadius: "8px", // Borde redondeado
            padding: "8px", // Menos padding
            marginBottom: "10px", // Espacio abajo
          }}
        >
          <InputLabel id="clientes-label">Clientes</InputLabel>
          <Select
            labelId="clientes-label"
            id="clientes"
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            label="Clientes"
            sx={{
              borderRadius: "8px", // Borde redondeado
              padding: "8px", // Menos padding
            }}
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
          sx={{
            borderRadius: "8px", // Borde redondeado
            padding: "8px", // Menos padding
            marginBottom: "10px", // Espacio abajo
          }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{
            backgroundColor: "#6c757d",
            borderRadius: "8px", // Borde redondeado
            padding: "6px 12px", // Menos padding
          }}
        >
          Cerrar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            backgroundColor: "#d1006c",
            borderRadius: "8px", // Borde redondeado
            padding: "6px 12px", // Menos padding
          }}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalRegisterUser;
