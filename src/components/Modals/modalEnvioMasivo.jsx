import React, { useState, useContext } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { UserContext } from "../../context/UserContext";
import { Toast } from "../../assets/js/alertConfig";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  TextField,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress
} from "@mui/material";
import {
  Close as CloseIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
  Send as SendIcon,
  PersonAdd as PersonAddIcon,
  Groups as GroupsIcon
} from "@mui/icons-material";

const ModalEnvioMasivo = ({ survey, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    link: ""
  });
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const { accessToken } = useContext(UserContext);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
  
    const validExtensions = ['.xlsx', '.xls', '.ods', '.csv'];
    const fileExtension = selectedFile.name.slice(selectedFile.name.lastIndexOf('.')).toLowerCase();
  
    if (!validExtensions.includes(fileExtension)) {
      Toast.fire({
        icon: "error",
        title: "Formato no válido. Use .xlsx, .xls, .ods o .csv"
      });
      return;
    }
  
    setFile(selectedFile);
    setFileName(selectedFile.name);
  };


  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const sendIndividual = async () => {
    if (!formData.name || !formData.email || !formData.link) {
      Toast.fire({
        icon: "error",
        title: "Todos los campos son requeridos"
      });
      return;
    }

    if (!validateEmail(formData.email)) {
      Toast.fire({
        icon: "error",
        title: "Por favor ingrese un email válido"
      });
      return;
    }

    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true
      };

      const payload = {
        users: [{
          name: formData.name,
          email: formData.email,
          link: formData.link
        }]
      };

      await axios.post("http://localhost:3000/api/enviar-correos", payload, config);
      
      Toast.fire({
        icon: "success",
        title: "Encuesta enviada correctamente"
      });
      
      onClose();
    } catch (error) {
      console.error("Error al enviar:", error);
      Toast.fire({
        icon: "error",
        title: "Error al enviar la encuesta"
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMassive = async () => {
    if (!file) {
      Toast.fire({ icon: "error", title: "Debe seleccionar un archivo" });
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 1 });

        if (jsonData.length === 0 || jsonData[0].length < 3) {
          throw new Error("El archivo no tiene datos válidos o faltan columnas");
        }

        const users = jsonData.map((row, index) => {
          if (!row[0] || !row[1] || !row[2]) {
            throw new Error(`Fila ${index + 2}: Datos incompletos`);
          }

          return {
            name: row[0].toString().trim(),
            email: row[1].toString().trim(),
            link: row[2].toString().trim()
          };
        });

        const emails = new Set();
        const duplicates = [];
        
        users.forEach((user, index) => {
          if (emails.has(user.email)) {
            duplicates.push(index + 2);
          } else {
            emails.add(user.email);
          }
        });

        if (duplicates.length > 0) {
          throw new Error(`Emails duplicados en filas: ${duplicates.join(", ")}`);
        }

        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        };

        await axios.post(
          "http://localhost:3000/api/enviar-correos",
          { users },
          config
        );

        Toast.fire({
          icon: "success",
          title: `Enviados ${users.length} correos exitosamente!`
        });

        onClose();

      } catch (error) {
        console.error("Error completo:", error);
        Toast.fire({
          icon: "error",
          title: error.message || "Error procesando el archivo"
        });
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      Toast.fire({
        icon: "error",
        title: "Error al leer el archivo"
      });
      setLoading(false);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      components={{
        Backdrop: (props) => <div {...props} style={{ backgroundColor: 'transparent' }} />
      }}
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 24,
          margin: 2,
          position: 'relative'
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold">
          Enviar Encuesta
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
          value={activeTab}
          onChange={handleTabChange} 
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              color: '#b62a8b', // Texto morado en estado normal
              '&.Mui-selected': {
                color: '#b62a8b', // Texto morado oscuro cuando está seleccionado
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#b62a8b', // Línea inferior morada
            }
          }}
          >
            <Tab 
              label="Enviar a un usuario" 
              icon={<PersonAddIcon />} 
              iconPosition="start"
              sx={{ minHeight: 48 }}
            />
            <Tab 
              label="Envío masivo" 
              icon={<GroupsIcon />} 
              iconPosition="start"
              sx={{ minHeight: 48 }}
            />
          </Tabs>
        </Box>

        <Box sx={{ pt: 3 }}>
          {activeTab === 0 && (
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Enviar encuesta a un usuario
              </Typography>
              
              <TextField
                label="Nombre"
                variant="outlined"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#b62a8b',  // Borde morado   , // Borde morado al enfocar
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#b62a8b', // Label morado al enfocar
                  }
                }}
              />
              
              <TextField
                label="Email"
                variant="outlined"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#b62a8b',  // Borde morado   , // Borde morado al enfocar
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#b62a8b', // Label morado al enfocar
                  }
                }}
              />
              
              <TextField
                label="Link de la encuesta"
                variant="outlined"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                fullWidth
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#b62a8b',  // Borde morado   , // Borde morado al enfocar
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#b62a8b', // Label morado al enfocar
                  }
                }}
              />
            </Box>
          )}

          {activeTab === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Envío masivo de encuesta
              </Typography>
              
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}                
                href="/ejemplo.ods"
                sx={{ alignSelf: 'flex-start',
                           
                    color: '#b62a8b',       // Texto morado
                    borderColor: '#b62a8b',  // Borde morado
                    '&:hover': {
                      borderColor: '#b62a8b', // Borde morado oscuro al hover
                      backgroundColor: 'rgba(156, 39, 176, 0.04)' // Fondo muy transparente al hover
                    }
                  
                }}
              >
                Descargar plantilla
              </Button>
              
              <TextField
                variant="outlined"
                value={fileName}
                placeholder="Seleccione archivo"
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        component="label"
                        variant="contained"
                        startIcon={<UploadIcon />}
                        sx={{
                          backgroundColor: '#b62a8b', // Fondo morado
                          '&:hover': {
                            backgroundColor: '#581244'
                          }
                        }}
                      >
                        Cargar archivo
                        <input
                          type="file"
                          id="fileInput"
                          hidden
                          accept=".xlsx, .xls, .ods, .csv"
                          onChange={handleFileChange}
                        />
                      </Button>
                    </InputAdornment>
                  ),
                  sx: {
                    '&.Mui-focused fieldset': {
                      borderColor: '#b62a8b !important', // Borde morado al enfocar
                    },
                    '&:hover fieldset': {
                      borderColor: '#b62a8b !important', // Borde morado claro al hover
                    }
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#b62a8b', // Borde morado normal
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#b62a8b', // Color del placeholder
                  }
                }}
                fullWidth
              />
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{            
            color: '#b62a8b',       // Texto morado
            borderColor: '#b62a8b',  // Borde morado
            '&:hover': {
              borderColor: '#b62a8b', // Borde morado oscuro al hover
              backgroundColor: 'rgba(156, 39, 176, 0.04)' // Fondo muy transparente al hover
            }
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={activeTab === 0 ? sendIndividual : sendMassive}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
          disabled={loading}
          sx={{
            backgroundColor: '#b62a8b', // Color morado estándar de MUI
            '&:hover': {
              backgroundColor: '#581244', // Morado más oscuro al hover
            }
          }}
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalEnvioMasivo;