import { React, useEffect, useState } from "react";
import { Modal, Box, Button, Typography, CircularProgress, Dialog, DialogContent } from "@mui/material";
import { styled } from "@mui/system";
import HeaderLT1 from "../../components/header/headerLT1";
import ModalRegisterUser from "../../components/Tables/tableMonitoring";
import Loading from "../layout/loading";
import Swal from "sweetalert2";
import "../../assets/css/agent_monitoring.css";

const AdminList = () => {
  const [open, setOpen] = useState(false);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

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
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleRecordsPerPageChange = (num) => setRecordsPerPage(num); // Actualiza registros por página

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

  const staticData = [
    { id_form: 1, form_name: "Formulario A", client: "Cliente 1", created_at: "2023-01-01", created_by: "Admin", state: "Activo", updated_at: "2023-01-10", updated_by: "Admin" },
    { id_form: 2, form_name: "Formulario B", client: "Cliente 2", created_at: "2023-02-01", created_by: "Editor", state: "Inactivo", updated_at: "2023-02-10", updated_by: "Editor" },
    { id_form: 3, form_name: "Formulario C", client: "Cliente 3", created_at: "2023-03-01", created_by: "Viewer", state: "Activo", updated_at: "2023-03-10", updated_by: "Viewer" },
  ];


  return (
    <div className="App">
        <div id="body">
          <HeaderLT1 />
          <div className="row">
            <div className="col-12">
              <div className="container">
                <div className="row">
                  <div className="col-6">
                    <input className="form-control" placeholder="Buscar" type="text" />
                  </div>
                  <div className="col-6 text-end">
                    <button className="btn btn-primary" onClick={handleOpen}>
                      <i className="fa fa-plus"></i> Nuevo usuario
                    </button>
                  </div>
                </div>

                <div className="table-container">
                  <table className="table table-hover">
                    <thead>
                      <tr className="table-light">
                        {Object.values(columnTitles).map((title, index) => (
                          <th key={index} className="text-center">{title}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {staticData.map((row, rowIndex) => (
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
                                      <button className="btn btn-rect">
                                        <i className="fa-solid fa-circle-question"></i> <span>Ver preguntas</span>
                                      </button>
                                    </li>
                                    <li className="text-start btn-rect">
                                      <button className="btn text-start" style={{ width: "100%" }}>
                                        <i className="fa-solid fa-edit"></i> Editar
                                      </button>
                                    </li>
                                    <li className="text-start btn-rect">
                                      <button className="btn text-start" style={{ width: "100%" }}>
                                        <i className="fa-solid fa-power-off"></i> <span>Deshabilitar</span>
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
                </div>

                {/* Selector de registros en la parte inferior izquierda */}
                <div className="row mt-3">
                  <div className="col-6 d-flex justify-content-start record-selector">
                    <label>
                      Mostrar{" "}
                      <button
                        className="dropdown-toggle inp-search"
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
                      </ul>{" "}
                      registros
                    </label>
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



// import { useState } from "react";
// import "../../assets/css/tabla.css";

// const Agent_Monitoring = ({
//   header = [],
//   data,
//   onCreate,
//   onRemove,
//   onUpdate,
//   onView,
//   onActive,
//   modalId,
//   modalId2,
// }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [recordsPerPage, setRecordsPerPage] = useState(25);

//   const handleSearch = (event) => {
//     setSearchTerm(event.target.value);
//     setCurrentPage(1); // Reset page to 1 on new search
//   };

//   const handleRecordsPerPageChange = (records) => {
//     setRecordsPerPage(records);
//     setCurrentPage(1); // Reset page to 1 on new records per page
//   };

//   const capitalize = (text) => {
//     return text.replace(/\b\w/g, (char) => char.toUpperCase());
//   };

//   const filteredData = (data || []).filter((item) =>
//     Object.values(item).some(
//       (val) =>
//         typeof val === "string" &&
//         val.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//   );

//   // Definir currentRecords para la paginación
//   const indexOfLastRecord = currentPage * recordsPerPage;
//   const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
//   const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);

//   return (
//     <div>
//       <div className="table-container table-responsive" id="table">
//       <div className="row d-flex mb-3">
//           <div className="col-6 col-sm-6 col-md-6 col-lg-6">
//             <input
//               className="w-50 inp-search"
//               placeholder="Buscar"
//               value={searchTerm}
//               onChange={handleSearch}
//             />
//           </div>
//           <div className="d-grid col-6 col-sm-6 col-md-6 col-lg-6 justify-content-end">
//             <button
//               className="btn btn-block btn-sm btn-default btn-flat fw-bold acces-tabla m-2"
//               data-bs-toggle="modal"
//               data-bs-target={`#${modalId}`}
//               onClick={onCreate}
//             >
//               <i className="fa fa-plus"></i> Agregar Nuevo Usuario
//             </button>
//           </div>
//         </div>
//         <table className="table table-hover" id="tableDefault">
//           <thead>
//             <tr className="table-light tr-table">
//               {header.map((item, i) => (
//                 <th key={i} className="col text-center">
//                   {capitalize(item)}
//                 </th>
//               ))}
//               <th className="col text-center">Acciones</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentRecords.map((item, idx) =>
//               item.type !== 1 && item.type !== 2 ? (
//                 <tr key={idx}>
//                   {header.map((key, i) => (
//                     <td key={i}>
//                       {key == "estado"
//                         ? item.estado == 1
//                           ? "Activo"
//                           : "Inactivo"
//                         : key == "type"
//                         ? item.type == 1
//                           ? "SuperAdmin"
//                           : item.type == 2
//                           ? "Administrador"
//                           : item.type == 3
//                           ? "Editor"
//                           : "Visualizador"
//                         : item[key]}
//                     </td>
//                   ))}
//                   {item.estado == 1 ? (
//                     <td>
//                       <div className="row">
//                         <div className="col">
//                           <button
//                             className="btn btn-rect"
//                             data-bs-toggle="modal"
//                             data-bs-target={`#${modalId}`}
//                             onClick={() => onUpdate(item)}
//                           >
//                             <i className="fa-solid fa-edit"></i>
//                           </button>
//                           <button
//                             className="btn btn-rect"
//                             onClick={() => onRemove(item)}
//                           >
//                             <i className="fa-solid fa-power-off"></i>
//                           </button>
//                           <button
//                             className="btn btn-rect"
//                             data-bs-toggle="modal"
//                             data-bs-target={`#${modalId2}`}
//                             onClick={() => onView(item)}
//                           >
//                             <i className="fa-solid fa-search"></i>
//                           </button>
//                         </div>
//                       </div>
//                     </td>
//                   ) : (
//                     <td>
//                       <div className="row">
//                         <div className="col">
//                           <button
//                             className="btn btn-rect"
//                             onClick={() => onActive(item)}
//                           >
//                             <i className="fa-solid fa-power-off"></i>
//                           </button>
//                           <button
//                             className="btn btn-rect"
//                             data-bs-toggle="modal"
//                             data-bs-target={`#${modalId2}`}
//                             onClick={() => onView(item)}
//                           >
//                             <i className="fa-solid fa-search"></i>
//                           </button>
//                         </div>
//                       </div>
//                     </td>
//                   )}
//                 </tr>
//               ) : null
//             )}
//           </tbody>
//         </table>
//         <div className="row d-flex ps-5 pe-5 mt-3">
//           <div className="col-6 col-sm-6 col-md-6 col-lg-6">
//             <label>
//               Mostrar
//               <button
//                 className="dropdown-toggle inp-search"
//                 type="button"
//                 data-bs-toggle="dropdown"
//                 aria-expanded="false"
//               >
//                 {recordsPerPage}
//               </button>
//               <ul className="dropdown-menu">
//                 {[25, 50, 75].map((num) => (
//                   <li key={num}>
//                     <a
//                       className="dropdown-item"
//                       href="#"
//                       onClick={() => handleRecordsPerPageChange(num)}
//                     >
//                       {num}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//               registros
//             </label>
//           </div>
//           <div className="d-grid col-6 col-sm-6 col-md-6 col-lg-6 justify-content-end">
//             <div
//               className="btn-group"
//               role="group"
//               aria-label="Basic outlined example"
//             >
//               <button
//                 type="button"
//                 className="btn"
//                 onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//               >
//                 &lt;
//               </button>
//               <label className="btn" htmlFor="btncheck2">
//                 {currentPage}
//               </label>
//               <button
//                 type="button"
//                 className="btn"
//                 onClick={() =>
//                   setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//                 }
//               >
//                 &gt;
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Agent_Monitoring;
