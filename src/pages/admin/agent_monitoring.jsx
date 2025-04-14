import { React, useEffect, useState } from "react";
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
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  /* Ver Bloques*/
  const [showSurveyView, setShowSurveyView] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPage = async () => {
      Swal.fire({
        title: "Cargando...",
        didOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));
      Swal.close();
      setLoading(false);
    };

    loadPage();
  }, []);

  if (loading) {
    return <Loading />;
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset page to 1 on new search
  };

  const staticData = [
    {
      id_form: 1,
      form_name: "Formulario A",
      client: "Cliente 1",
      created_at: "2023-01-01",
      created_by: "Admin",
      state: "Activo",
      updated_at: "2023-01-10",
      updated_by: "Admin",
    },
    {
      id_form: 2,
      form_name: "Formulario B",
      client: "Cliente 2",
      created_at: "2023-02-01",
      created_by: "Editor",
      state: "Inactivo",
      updated_at: "2023-02-10",
      updated_by: "Editor",
    },
    {
      id_form: 3,
      form_name: "Formulario C",
      client: "Cliente 3",
      created_at: "2023-03-01",
      created_by: "Viewer",
      state: "Activo",
      updated_at: "2023-03-10",
      updated_by: "Viewer",
    },
  ];

  const filteredData = staticData.filter((row) => {
    const parsedSearchTerm = parseInt(searchTerm, 10);

    if (!isNaN(parsedSearchTerm)) {
      return row.id_form === parsedSearchTerm;
    }
    return Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const columnTitles = {
    id_form: "Form ID",
    form_name: "Form Name",
    client: "Client",
    created_at: "Creation Date",
    created_by: "Created By",
    state: "State",
    updated_at: "Updated Date",
    updated_by: "Updated By",
    actions: "Actions",
  };

  const handleRecordsPerPageChange = (records) => {
    setRecordsPerPage(records);
    setCurrentPage(1); // Reset page to 1 on new records per page
  };

  return (
    <div className="App">
      <div id="body">
        <HeaderLT1 />
        <div className="row">
          <div className="col-12">
            <div className="container">
              <div className="table-container" >
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
                    <button className="btn btn-primary" onClick={handleOpen}>
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
                                    <button className="btn btn-rect" onClick={() => navigate((`/survey_blocks/${row.id_form}`))}>
                                      <i className="fa-solid fa-circle-question"></i>{" "}
                                      <span>Ver bloques</span>
                                    </button>
                                  </li>
                                  <li className="text-start btn-rect">
                                    <button
                                      className="btn text-start"
                                      style={{ width: "100%" }}
                                    >
                                      <i className="fa-solid fa-edit"></i>{" "}
                                      Editar
                                    </button>
                                  </li>
                                  <li className="text-start btn-rect">
                                    <button
                                      className="btn text-start"
                                      style={{ width: "100%" }}
                                    >
                                      <i className="fa-solid fa-power-off"></i>{" "}
                                      <span>Deshabilitar</span>
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            ) : (
                              row[key]
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
      <ModalRegisterUser open={open} handleClose={handleClose} />
    </div>
  );
};

export default AdminList;