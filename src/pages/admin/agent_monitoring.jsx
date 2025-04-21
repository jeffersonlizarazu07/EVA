import { React, useEffect, useState } from "react";
import axios from "axios";
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
import SurveyBlocks from "../survey/surveyBlocks";

const AdminList = () => {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [survey, setSurvey] = useState([]);

  const navigate = useNavigate();

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    withCredentials: true,
  };

  const handleOpen = (id = null) => {
    setUserId(id);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const getForms = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/forms", config);
      setSurvey(response.data.data);  // Setea los formularios con los datos actualizados
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
    created_by_name: "Created By", // Actualizado a 'created_by_name'
    updated_date: "Updated Date",
    updated_by_name: "Updated By", // Actualizado a 'updated_by_name'
    state: "State",
    actions: "Actions",
  };

  const handleRecordsPerPageChange = (records) => {
    setRecordsPerPage(records);
    setCurrentPage(1);
  };

  const deactivateForm = (form) => {
    const url = `http://localhost:3000/api/forms`;
    const id = form.id;
    const name = form.title;
    const parametros = { state: 0 };

    Swal.fire({
      title: `¿Desactivar el formulario "${name}"?`,
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.patch(`${url}/${id}`, parametros, config);
          Swal.fire("Desactivado", `Formulario "${name}" desactivado`, "success");
          getForms(); // recargar
        } catch (error) {
          console.error("Error al desactivar:", error);
          Swal.fire("Error", `No se pudo desactivar el formulario`, "error");
        }
      }
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = ("0" + date.getDate()).slice(-2);  // Asegura que el día tenga 2 dígitos
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Los meses van de 0 a 11
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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
                                      onClick={() => handleOpen(row.id_form)} // Pasa el ID para editar
                                    >
                                      <i className="fa-solid fa-edit"></i> Editar
                                    </button>
                                  </li>
                                  <li className="text-start btn-rect">
                                    <button
                                      className="btn text-start"
                                      style={{ width: "100%" }}
                                      onClick={() => deactivateForm(row)} // Desactivar formulario
                                    >
                                      <i className="fa-solid fa-power-off"></i> <span>Deshabilitar</span>
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            ) : (
                              key === "creation_date" || key === "updated_date" ? (
                                formatDate(row[key])  // Usa la función para formatear las fechas
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
      <ModalRegisterUser open={open} handleClose={handleClose} userId={userId} />
    </div>
  );
};

export default AdminList;
