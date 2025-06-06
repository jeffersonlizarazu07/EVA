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
import { useTranslation } from "react-i18next";
import { useTranslateBackendMessage } from "../helper/helper";
import { use } from "react";

const ModalEnvioMasivo = ({ survey, onClose }) => {
  const translateBackendMessage = useTranslateBackendMessage();
  const translateSuccess = useTranslateBackendMessage();

  const { t, i18n } = useTranslation();

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
    e.target.value = null;
    if (!selectedFile) return;
  
    const validExtensions = ['.xlsx', '.xls', '.ods', '.csv'];
    const fileExtension = selectedFile.name.slice(selectedFile.name.lastIndexOf('.')).toLowerCase();
  
    if (!validExtensions.includes(fileExtension)) {
      Toast.fire({
        icon: "error",
        title: t("alerts.formato_no_valido")
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
        title: t("alerts.todos_los_campos_obligatorios")
      });
      resetForm();
      return;
    }

    if (!validateEmail(formData.email)) {
      Toast.fire({
        icon: "error",
        title: t("alerts.email_invalido")
      });
      resetForm();
      return;
    }

    if (!validateUrl(formData.link)) {
      Toast.fire({
        icon: "error",
        title: t("alerts.url_invalida")
      });
      resetForm();
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

      const response = await axios.post("http://localhost:3000/api/enviar-correos", payload, config);

      const { mensaje, errores } = response.data;
      
      if (errores && errores.length > 0) {
        //const erroresTexto = errores.map(e => `${e.email}: ${e.error}`).join('\n');
        const erroresTraducidos =  errores.map(e =>  `${e.email}: ${translateBackendMessage(e.error)}`
        ).join('\n');        
        Toast.fire({
          icon: "warning",
          title: `${translateSuccess(mensaje)}\n` + t("alerts.errores") + `:\n${erroresTraducidos}`,
          didOpen: (toast) => {
          toast.style.width = '350%'; // Ajusta a tu preferencia
          }  
        });
      } else {
        Toast.fire({
          icon: "success",
          title: translateSuccess(mensaje)
        });
      }

    resetForm();
    onClose();
    } catch (error) {
      console.error("Error al enviar:", error);
      Toast.fire({
        icon: "error",
        title: t("alerts.error_enviar_encuesta")
      });
      resetForm();
    } finally {
      setLoading(false);
    }
  };

  const sendMassive = async () => {
    if (!file) {
      Toast.fire({ icon: "error", title:t("alerts.debe_seleccionar_archivo") });
      resetForm();
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
  
        // Obtener el rango real de datos
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
        // Filtrar filas vacías
        const filteredData = jsonData.filter(row => row.some(cell => cell !== undefined && cell !== null && cell !== ''));
  
        if (filteredData.length <= 1) { // 1 porque el encabezado cuenta como fila
          throw new Error("El archivo no tiene datos válidos");
        }
  
        // Omitir encabezados si existen
        const dataRows = filteredData.length > 1 ? filteredData.slice(1) : filteredData;
  
        const users = [];
        const emails = new Set();
        const duplicates = [];
        const missingDataRows = [];
        
        dataRows.forEach((row, index) => {
          const excelRowNumber = index + 2; // +2 porque: +1 para convertir de 0-based a 1-based, y +1 para saltar encabezado
          
          // Verificar si la fila tiene datos faltantes
          if (!row[0] || !row[1] || !row[2]) {
            missingDataRows.push(excelRowNumber);
            return; // Saltar esta fila
          }
  
          const link = row[2].toString().trim();
          if (!validateUrl(link)) {
            throw new Error(`Fila ${excelRowNumber}: URL no válida`);
          }
  
          const email = row[1].toString().trim();
          if (emails.has(email)) {
            duplicates.push(excelRowNumber);
            return; // Saltar esta fila
          }
  
          emails.add(email);
          
          users.push({
            name: row[0].toString().trim(),
            email: email,
            link: link
          });
        });
  
        if (missingDataRows.length > 0) {
          throw new Error(`Datos incompletos en filas: ${missingDataRows.join(", ")}`);
        }
  
        if (duplicates.length > 0) {
          throw new Error(`Emails duplicados en filas: ${duplicates.join(", ")}`);
        }
  
        if (users.length === 0) {
          throw new Error("No hay usuarios válidos para enviar");
        }
  
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        };
  
        const response = await axios.post(
          "http://localhost:3000/api/enviar-correos",
          { users },
          config
        );

        const { mensaje, errores } = response.data;
        if (errores && errores.length > 0) {
        const erroresTraducidos =  errores.map(e =>  `${e.email}: ${translateBackendMessage(e.error)}`).join('\n');  
        //const erroresTexto = errores.map(e => `• ${e.email}: ${e.error}`).join('\n');
        Toast.fire({
          icon: "warning",
          title: `${translateSuccess(mensaje)}\n` + t("alerts.errores") + `:\n${erroresTraducidos}`,
         // title: `${mensaje}\n`+ t("alerts.errores") + `:\n${erroresTexto}`
         timer: 10000, 
        });
        } else {
          Toast.fire({
            icon: "success",
            title: translateSuccess(mensaje)
          });
        }
        resetForm();
        onClose();
      } catch (error) {
        console.error("Error completo:", error);
        Toast.fire({
          icon: "error",
          title: error.message || "Error procesando el archivo"
        });
        resetForm();
      } finally {
        setLoading(false);
      }
    };
  
    reader.onerror = () => {
      Toast.fire({
        icon: "error",
        title: t("alerts.error_leer_archivo")
      });
      resetForm();
      setLoading(false);
    };
  
    reader.readAsArrayBuffer(file);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      link: ""
    });
    setFile(null);
    setFileName("");
    // Limpiar el input de archivo en el DOM
    const fileInput = document.getElementById('fileInput');
    if (fileInput) fileInput.value = '';
  };

  const validateUrl = (url) => {
    try {
      new URL(url); // Intenta crear un objeto URL
      return true; // Si no lanza error, es una URL válida
    } catch (e) {
      return false; // Si lanza error, no es válida
    }
  };

  return (
    <Dialog
      open={true}
      onClose={() => {
        resetForm();
        onClose();
      }}
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
         {t("envioMasivo.enviar_encuesta")}
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
              label={t("envioMasivo.enviar_usuario")} 
              icon={<PersonAddIcon />} 
              iconPosition="start"
              sx={{ minHeight: 48 }}
            />
            <Tab 
              label={t("envioMasivo.envio_masivo")}
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
                {t("envioMasivo.enviar_encuesta_titulo")}
              </Typography>
              
              <TextField
                label={t("envioMasivo.nombre")}
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
                label={t("envioMasivo.email")}
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
                label={t("envioMasivo.link_encuesta")}
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
                {t("envioMasivo.envio_masivo_titulo")}
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
                {t("envioMasivo.descargar_plantilla")}
              </Button>
              
              <TextField
                variant="outlined"
                value={fileName}
                placeholder={t("envioMasivo.selecciona_archivo")}
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
                        {t("envioMasivo.subir_archivo")}
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
          {t("buttons.cancelar")}
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
          {loading ? t("envioMasivo.enviando")+"..." : t("buttons.enviar")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalEnvioMasivo;