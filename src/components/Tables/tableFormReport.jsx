import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { useTranslation } from "react-i18next";
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
  Grid,
  InputAdornment,
  TablePagination,
} from "@mui/material";
import {
  TurnLeft,
  Search
} from "@mui/icons-material";
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded';

const TableFormReport = ({ header, data, onUpdate, onView, modalId, modalId2 }) => {
  const { languageUser } = useContext(UserContext);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(languageUser);
  }, [languageUser, i18n]);

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = Array.isArray(data)
    ? data.filter((item) =>
        Object.values(item).some(
          (val) =>
            typeof val === "string" &&
            val.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : [];

  const currentRecords = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getHeaderLabel = (item) => {
    switch (item) {
        case"id":
            return ("ID");
        case "data":
            return ("Data");
        case "score":
            return ("Score");
        case "feedback":
            return ("Feedback");
        case "check":
            return ("Check");
        case "id_user_agent":
            return ("Agent");

        case "id_user_monitor":
            return ("Monitor");
        case "id_form":
            return ("Form ID");    
        default:
            return t("viewUserModal.State");
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
    <Box className="table-container">
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <Box display="flex" alignItems="center" gap={1}>
            
            <TextField
              size="small"
              placeholder={t("userTable.Search")}
              value={searchTerm}
              onChange={handleSearch}
              className="inp-search"
              variant="outlined"
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  height: "4vh",
                  "&.Mui-focused fieldset": {
                    borderColor: "transparent",
                  },
                  "&.Mui-focused": {
                    boxShadow: "none",
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "#888" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Grid>
      </Grid>

      <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 450, overflowY: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {header.map((item, i) => (
                <TableCell
                  key={i}
                  sx={{ fontSize: "1rem", textAlign: "center", fontWeight: "bold" }}
                >
                  {getHeaderLabel(item)}
                </TableCell>
              ))}
              {/*
              <TableCell sx={{ fontSize: "1rem", textAlign: "center", fontWeight: "bold" }}>
                {t("userTable.Actions")}
              </TableCell>
               */}
              
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRecords.map((item, idx) => (
              <TableRow key={idx}>
                {header.map((key, i) => (
                  <TableCell key={i} align="center">
                    {key === "state"
                      ? item.state === 1
                        ? t("userTable.Active")
                        : t("userTable.Inactive")
                      : key === "type"
                      ? getUserType(item.type)
                      : item[key]}
                  </TableCell>
                ))}
                {/*
                {item.state === 1 ? (
                  <TableCell align="center">
                    <Box sx={{ display: "flex", justifyContent: "center" }} gap={1}>
                      <IconButton
                        onClick={() => onUpdate(item)}
                        size="small"
                        sx={{
                          color: "#b62a8b",
                          "&:hover": {
                            backgroundColor: "#b62a8b",
                            color: "#fff",
                          },
                        }}
                      >
                        <FactCheckRoundedIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => onView(item)}
                        size="small"
                        sx={{
                          color: "#b62a8b",
                          "&:hover": {
                            backgroundColor: "#b62a8b",
                            color: "#fff",
                          },
                        }}
                      >
                        <Search />
                      </IconButton>
                    </Box>
                  </TableCell>
                ) : (
                  <TableCell align="center">
                    <Box sx={{ display: "flex", justifyContent: "center" }} gap={1}>
                      <IconButton onClick={() => onView(item)} size="small">
                        <Search />
                      </IconButton>
                    </Box>
                  </TableCell>
                )}
                */}
                
                
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2, alignItems: "center" }}>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={t("userTable.Show")}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} ${t("userTable.Registered")} ${count !== -1 ? count : `more than ${to}`}`
          }
          sx={{
            display: "flex",
            alignItems: "center",
            ".MuiTablePagination-toolbar": {
              alignItems: "center",
            },
            ".MuiTablePagination-selectLabel": {
              display: "flex",
              alignItems: "center",
              marginBottom: 0,
            },
            ".MuiTablePagination-displayedRows": {
              display: "flex",
              alignItems: "center",
              marginBottom: 0,
            },
            ".MuiInputBase-root": {
              backgroundColor: "#b62a8b",
              color: "white",
              borderRadius: "4px",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default TableFormReport;
