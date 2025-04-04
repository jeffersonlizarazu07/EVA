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
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Añadir Formulario</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {/* Datos de usuario */}
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Nombre del formulario" margin="dense" />
            {/* <TextField fullWidth label="Segundo nombre" margin="dense" />
            <TextField fullWidth label="Apellidos" margin="dense" /> */}
            <FormControl fullWidth margin="dense">
              <InputLabel>Clientes</InputLabel>
              <Select>
                <MenuItem value="">Seleccione</MenuItem>
                <MenuItem value="cliente1">Cliente 1</MenuItem>
                <MenuItem value="cliente2">Cliente 2</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Datos administrativos */}

          <Grid item xs={12} md={6}>
            {/* <Typography variant="h6">Datos administrativos</Typography>
            <TextField fullWidth label="E-mail" type="email" margin="dense" />
            <TextField fullWidth label="Contraseña" type="password" margin="dense" />
            <TextField fullWidth label="Confirmar contraseña" type="password" margin="dense" />
            <Typography variant="caption">
              Deje esto en blanco si no desea cambiar la contraseña.
            </Typography>
            <FormControl fullWidth margin="dense">
              <InputLabel>Tipo</InputLabel>
              <Select>
                <MenuItem value="">Seleccione un rol</MenuItem>
                <MenuItem value="admin">Administrador</MenuItem>
                <MenuItem value="editor">Editor</MenuItem>
              </Select>
            </FormControl> */}

            <div class="mb-3">
              <label for="comentarios" class="form-label">
                <h4>Descripción</h4>
              </label>
              <textarea
                class="form-control"
                id="comentarios"
                name="comentarios"
                placeholder="Descripción"
                rows="3"
                cols="50" 
                height="38px"
              ></textarea>
            </div>
          </Grid>
        </Grid>
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


// import { useContext, useEffect } from "react";
// import "../../assets/css/tabla.css";
// import { UserContext } from "../../context/UserContext";
// import { useTranslation } from "react-i18next";

// const TableMonitoring = ({ header }) => {
//   const { languageUser } = useContext(UserContext);
//   const { t, i18n } = useTranslation();

//   useEffect(() => {
//     i18n.changeLanguage(languageUser);
//   }, [languageUser]);

//   // Títulos de las columnas en español de manera estática
//   const columnTitles = {
//     id_form: "ID Formulario",
//     form_name: "Nombre del Formulario",
//     client: "Cliente",
//     created_at: "Fecha de Creación",
//     created_by: "Creado por",
//     state: "Estado",
//     updated_at: "Fecha de Actualización",
//     updated_by: "Actualizado por",
//     actions: "Acciones",
//   };

//   return (
//     <div>
//       <div className="table-container table-responsive" id="table">
//         <table className="table table-hover" id="tableDefault">
//           <thead>
//             <tr className="table-light tr-table">
//               {header.map((item, i) => (
//                 <th key={i} className="col text-center">
//                   {columnTitles[item] || item}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td className="text-center">Dato 1</td>
//               <td className="text-center">Dato 2</td>
//               <td className="text-center">Dato 3</td>
//               <td className="text-center">Dato 4</td>
//               <td className="text-center">Dato 5</td>
//             </tr>
//             <tr>
//               <td className="text-center">Dato 6</td>
//               <td className="text-center">Dato 7</td>
//               <td className="text-center">Dato 8</td>
//               <td className="text-center">Dato 9</td>
//               <td className="text-center">Dato 10</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default TableMonitoring;
