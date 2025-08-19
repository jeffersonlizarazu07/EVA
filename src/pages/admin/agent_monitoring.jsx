import { React, useEffect, useState } from "react";
import { apiClient } from "../../utils/axiosConfig";
import {
  Modal,
  Box,
  Button,
  Typography,
  CircularProgress,
  Dialog,
  DialogContent,
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import HeaderLT1 from "../../components/header/headerLT1";
import ModalRegisterUser from "../../components/Tables/tableMonitoring";
import Loading from "../layout/loading";
import Swal from "sweetalert2";
import "../../assets/css/agent_monitoring.css";
import { smallAlertDelete } from "../../assets/js/alertConfig";
import { useTranslations } from "../../components/hooks/useTranslations";

const AdminList = () => {
  const [open, setOpen] = useState(false);
  const [formId, setFormId] = useState(null);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [survey, setSurvey] = useState([]);
  const { t } = useTranslations();
  const navigate = useNavigate();

  const handleOpen = (id = null) => {
    setFormId(id);
    setOpen(true);
  };  

  const handleClose = () => setOpen(false);

  const getForms = async () => {
    try {
      const response = await apiClient.get("/forms");
      setSurvey(response.data.data);
      console.log("Formularios cargados:", response.data.data);
    } catch (error) {
      console.error("Error al obtener formularios:", error);
      if (error.response) {
        console.error("Detalles del error:", error.response.data);
      }
    }
  };  

  useEffect(() => {
    const loadPage = async () => {
      Swal.fire({
        title: "Cargando formularios...",
        didOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
      });

      try {
        await getForms();
      } catch (error) {
        Swal.fire("Error", "No se pudieron cargar los formularios", "error");
      } finally {
        Swal.close();
        setLoading(false);
      }
    };

    loadPage();
  }, []);

  if (loading) {
    return <Loading />;
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const filteredData = survey.filter((row) => {
    const parsedSearchTerm = parseInt(searchTerm, 10);
    if (!isNaN(parsedSearchTerm)) {
      return row.id === parsedSearchTerm;
    }
    return Object.values(row).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const columnTitles = {
    id: "ID",
    title: "Form Name",
    description: "Description",
    client_name: "Client",
    creation_date: "Creation Date",
    created_by_name: "Created By",
    updated_date: "Updated Date",
    updated_by_name: "Updated By",
    state: "State",
    actions: "Actions",
  };

  const handleRecordsPerPageChange = (records) => {
    setRecordsPerPage(records);
    setCurrentPage(1);
  };

  const deactivateForm = (form) => {
    const id = form.id;
    const name = form.title;
    const parametros = { state: 0 };
  
    smallAlertDelete.fire({
      text: `${t("alertDeactivate.InitialPhrase")}${name} ${t(
        "alertDeactivate.FinalPhrase"
      )}`,
      showCancelButton: true,
      confirmButtonText: `${t("alertDeactivate.Confirm")}`,
      cancelButtonText: `${t("alertDeactivate.Cancel")}`,
    })   
    .then(async (result) => {
      if (result.isConfirmed) {
        try {
          await apiClient.patch(`/form/${id}`, parametros);
  
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
            title: `Formulario "${name}" cambio de estado`,
          });
  
          getForms(); // recargar
        } catch (error) {
          console.error("Error al desactivar:", error);
  
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
            title: `No se pudo desactivar el formulario`,
          });
        }
      }
    });
  };  
  
  const formatDate = (dateString) => { 
    const date = new Date(dateString);
    
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);
  
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="App">
      <div id="body">
        <HeaderLT1 />
        <div className="row">
          <div className="col-12">
            <div className="container">
              <div className="table-container">
                <div className="row">
                  <div className="col-6">
                    <input
                      className="form-control"
                      placeholder="Buscar"
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="col-6 text-end">
                    <button className="btn btn-primary" onClick={() => handleOpen()}>
                      <i className="fa fa-plus"></i> Formulario
                    </button>
                  </div>
                </div>
                
                <table className="table table-hover">
                  <thead>
                    <tr className="table-light">
                      {Object.values(columnTitles).map((title, index) => (
                        <th key={index} className="text-center">
                          {title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {Object.keys(columnTitles).map((key, colIndex) => (
                          <td key={colIndex} className="text-center">
                            {key === "actions" ? (
                              <div className="dropdown dropup">
                                <button
                                  className="btn-rect btn-dropdown"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <div className="dropdown-toggle">
                                    <i className="fa-solid fa-ellipsis-vertical"></i>
                                  </div>
                                </button>
                                <ul className="dropdown-menu p-0">
                                  <li className="text-start btn-rect">
                                    <button
                                      className="btn btn-rect"
                                      onClick={() => navigate(`/survey_blocks/${row.id_form}`)}
                                    >
                                      <i className="fa-solid fa-circle-question"></i> <span>Ver bloques</span>
                                    </button>
                                  </li>
                                  <li className="text-start btn-rect">
                                    <button
                                      className="btn text-start"
                                      style={{ width: "100%" }}
                                      onClick={() => handleOpen(row.id_form)}
                                    >
                                      <i className="fa-solid fa-edit"></i> Editar
                                    </button>
                                  </li>
                                  <li className="text-start btn-rect">
                                    <button
                                      className="btn text-start"
                                      style={{ width: "100%" }}
                                      onClick={() => deactivateForm(row)}
                                    >
                                      <i className="fa-solid fa-power-off"></i> <span>Deshabilitar</span>
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            ) : (
                              key === "creation_date" || key === "updated_date" ? (
                                formatDate(row[key])
                              ) : (
                                row[key]
                              )
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Selector de registros en la parte inferior izquierda */}
                <div className="row mt-3">
                  <div className="col-12 d-flex justify-content-between align-items-center">
                    {/* Selector de registros */}
                    <div className="record-selector d-flex align-items-center">
                      <label className="me-2">Mostrar</label>
                      <div className="dropdown">
                        <button
                          className="btn btn-outline-secondary dropdown-toggle"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {recordsPerPage}
                        </button>
                        <ul className="dropdown-menu">
                          {[10, 25, 50].map((num) => (
                            <li key={num}>
                              <a
                                className="dropdown-item"
                                href="#"
                                onClick={() => handleRecordsPerPageChange(num)}
                              >
                                {num}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <label className="ms-2">registros</label>
                    </div>

                    {/* Paginador */}
                    <div className="page-selector btn-group" role="group">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                      >
                        &lt;
                      </button>
                      <span className="btn btn-outline-secondary">
                        {currentPage}
                      </span>
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                      >
                        &gt;
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalRegisterUser open={open} handleClose={handleClose}/>
    </div>
  );
};

export default AdminList;