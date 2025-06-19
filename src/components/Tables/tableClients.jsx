import { useState,useContext, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "../../assets/css/tabla.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  IconButton,
  Paper,
  Box,
  Grid,InputAdornment} from '@mui/material';
import {
  TurnLeft,
  Add,
  Edit,
  PowerSettingsNew,
  Search,
} from '@mui/icons-material';
import TablePagination from '@mui/material/TablePagination';

import SearchIcon from '@mui/icons-material/Search';

const TableDetalle = ({
  header,
  data,
  onCreate,
  onRemove,
  onUpdate,
  onActive,
  onView,
  modalId,
  modalId2
}) => {
  const { languageUser } = useContext(UserContext);
  useEffect(()=>{
    i18n.changeLanguage(languageUser)
  },[languageUser])

  const nav = useNavigate()
  const { t,i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  // Cambios para MUI Pagination - usar page (base 0) en lugar de currentPage (base 1)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset page to 1 on new search
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0); // Reset page to 0 cuando cambia rows per page
  };

  const capitalize = (text) => {
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const filteredData = data.filter((item) =>
    Object.values(item).some(
      (val) =>
        typeof val == "string" &&
        val.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const currentRecords = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box className="table-container">
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={6} lg={6}>
           <Box display="flex" alignItems="center" gap={1}>
            <Button 
              variant="outlined"
              size="small"
             sx={{  
              minWidth: 0,       
              width: 30,
              height: 30,
              padding: 0,
              borderRadius: '50%',        
              color: '#b62a8b',
              borderColor: '#b62a8b',    
              '&:hover': {
                borderColor: '#b62a8b',
                backgroundColor: '#b62a8b',
                color: 'white'
              }
            }} 
              onClick={() => nav("/admin")}              
            > <TurnLeft /> 
            </Button>
            <TextField
              size="small"
              placeholder={t("clientTable.Search")}
              value={searchTerm}
              onChange={handleSearch}
              className="inp-search"
              variant="outlined"
              sx={{ width: '100%',                 
                 '& .MuiOutlinedInput-root': {
                  height: '4vh',
                  '&.Mui-focused fieldset': {
                    borderColor: 'transparent', 
                  },          
                  '&.Mui-focused': {
                    boxShadow: 'none',
                  },
                },
                
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#888' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="h5"
              size="small"
              sx={{
                borderRadius: '18px',
                border: '1px solid #b62a8b',
                color: '#b62a8b',
                borderColor: '#b62a8b',    
                '&:hover': {
                  borderColor: '#b62a8b',
                  backgroundColor: '#b62a8b',
                  color: 'white'
                }
              }}
              //data-bs-target={`#${modalId}`}
              onClick={onCreate}
            >
              <Add sx={{ fontSize: '18px' }} /> {t("clientTable.newClient")}
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* tabla  */}
      <TableContainer component={Paper} elevation={0}  sx={{ maxHeight: 450, overflowY: "auto" }} > 
        <Table size="small" > 
          <TableHead>
            <TableRow>
              {header.map((item, i) => (
                <TableCell key={i} sx={{ fontSize: '1rem', textAlign: 'center', fontWeight: 'bold' }}>
                  {t(`clientTable.${item}`)}
                </TableCell>
                
              ))}
              <TableCell sx={{ fontSize: '1rem', textAlign: 'center', fontWeight: 'bold' }}>{t("clientTable.Actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRecords.map((item, idx) => (
              <TableRow key={idx}>
                {header.map((itemkey, i) => (
                  <TableCell key={i} align="center">
                    {itemkey=="state"? (item.state==1? `${t("clientTable.Active")}`:`${t("clientTable.Inactive")}`): (itemkey=="logo"? null:item[itemkey])}
                  </TableCell>
                ))}
                {item.state != 1 ? (
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center'}} gap={1}>
                      <IconButton
                        className="btn btn-rect"
                        onClick={() => onActive(item)}
                        size="small"
                      >
                        <PowerSettingsNew />
                      </IconButton>
                      <IconButton
                        onClick={() => onView(item)}
                        size="small"
                      >
                        <Search />
                      </IconButton>
                    </Box>
                  </TableCell>
                ) : (
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Box gap={1} sx={{ display: 'flex', justifyContent: 'center'}}>
                      <IconButton                        
                        onClick={() => onUpdate(item)}
                        size="small"
                        sx={{                          
                          color: '#b62a8b',
                          '&:hover': {
                            backgroundColor: '#b62a8b',
                            color: '#fff',
                          }
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => onRemove(item)}
                        size="small"
                        sx={{                          
                          color: '#b62a8b',
                          '&:hover': {
                            backgroundColor: '#b62a8b',
                            color: '#fff',
                          }
                        }}
                      >
                        <PowerSettingsNew />
                      </IconButton>
                      <IconButton
                        onClick={() => onView(item)}
                        size="small"
                        sx={{                          
                          color: '#b62a8b',
                          '&:hover': {
                            backgroundColor: '#b62a8b',
                            color: '#fff',
                          }
                        }}
                      >
                        <Search />
                      </IconButton>
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>    
      </TableContainer>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2, alignItems: 'center',  }}>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={t("clientTable.fila_pagina")}
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} ${t("clientTable.de")} ${count !== -1 ? count : `more than ${to}`}`
          }
         sx={{
            // Estilos personalizados para alinear verticalmente
            display: 'flex',
            alignItems: 'center',
            '.MuiTablePagination-toolbar': {
              alignItems: 'center', // Alinea todos los hijos verticalmente
            },
            '.MuiTablePagination-selectLabel': {
              display: 'flex',
              alignItems: 'center',
              marginBottom: 0,
            },
             '.MuiTablePagination-displayedRows': {
              display: 'flex',
              alignItems: 'center',
              marginBottom: 0,
             },
            '.MuiInputBase-root': {
              backgroundColor: '#b62a8b',
              color: 'white',
              borderRadius: '4px',
              
            }
          }}
        />
      </Box>   
    </Box>
  );
};

export default TableDetalle;
