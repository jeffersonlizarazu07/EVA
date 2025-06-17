import { useState } from "react";
import Swal from "sweetalert2";

const modalAdmin = ({
  // Props de agent_list
  monitoringStep,
  setMonitoringStep,
  formClientReset,
  userName,
  loading,
  selectedFormId,
  handleFormSelect,
  selectedClientId,
  userClients,
  handleClientChange,
  formOptions,
  callSelectedForm,
  blocksForForm,
  userInfo,
  monitoringDate,
  setMonitoringDate,
}) => {
  const [clientError, setClientError] = useState(false); // Validación visual si el select de cliente se encuentra vacio al confrmar
  const [formError, setFormError] = useState(false); // Validación visual si formulario se encuentra vacio al confirmar
  const [dateError, setDateError] = useState(false); // Validación visual si no se asignó una fecha de monitorización al confirmar

  // Validar los campos de la primer vista (Cliente, formulario y fecha de monitorización)
  const handleNextStep = () => {
    const isClientValid = selectedClientId !== "";
    const isFormValid = selectedFormId !== "";
    const isDateValid = monitoringDate !== "";

    // Actualizar visualmente errores
    setClientError(!isClientValid);
    setFormError(!isFormValid);
    setDateError(!isDateValid);

    if (!isClientValid || !isFormValid || !isDateValid) {
      Swal.fire({
        icon: "warning",
        title: "Faltan campos obligatorios",
        text: "Debes completar cliente, formulario y fecha para continuar.",
      });
      return;
    }

    setMonitoringStep(2);
  };

  return (
    <div id="modalAdmin" className="modal fade">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
        <div className="modal-content">
          <div className="modal-header justify-content-center pb-1">
            {/* Encabezado principal con botón de volver y nombre */}
            {monitoringStep === 2 ? (
              <div className="w-100 d-flex justify-content-between align-items-center pb-1">
                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-sm btn-default btn-flat fw-bold acces-tabla me-2"
                    onClick={() => setMonitoringStep(1)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-arrow-90deg-left"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1.146 4.854a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H12.5A2.5 2.5 0 0 1 15 6.5v8a.5.5 0 0 1-1 0v-8A1.5 1.5 0 0 0 12.5 5H2.707l3.147 3.146a.5.5 0 1 1-.708.708z"
                      />
                    </svg>
                  </button>
                  <label className="h5 mb-0">
                    {userName || "Nuevo Agente"}
                  </label>
                </div>

                {/* Botón cerrar modal */}
                <button
                  type="button"
                  className="btn-close mb-2"
                  data-bs-dismiss="modal"
                  aria-label="close"
                  onClick={formClientReset}
                ></button>
              </div>
            ) : (
              <div className="w-100 d-flex justify-content-between align-items-center">
                <label className="h5 mb-2">{userName || "Nuevo Agente"}</label>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="close"
                  onClick={formClientReset}
                ></button>
              </div>
            )}
          </div>

          <div className="modal-body">
            {/*Primer vista del modal de monitorización*/}
            {monitoringStep === 1 && (
              <>
                <h4 className="fw-bold mb-4">Crear una monitorización</h4>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Monitor Client</label>
                    <select
                      className={`form-select ${
                        clientError ? "is-invalid" : ""
                      }`}
                      value={selectedClientId || ""}
                      onChange={(e) => {
                        handleClientChange(e);
                        setClientError(false);
                      }}
                      disabled={loading}
                    >
                      <option value="">Seleccione un cliente</option>
                      {userClients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                    {loading && (
                      <small className="text-info">
                        <i className="fas fa-spinner fa-spin"></i> Cargando...
                      </small>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      Monitorizaciones <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-select ${formError ? "is-invalid" : ""}`}
                      value={selectedFormId || ""}
                      onChange={(e) => {
                        handleFormSelect(e);
                        setFormError(false);
                      }}
                    >
                      <option value="">
                        {!selectedClientId
                          ? "Primero seleccione un cliente"
                          : loading
                          ? "Cargando formularios..."
                          : formOptions.length === 0
                          ? "No hay formularios disponibles"
                          : "Seleccionar formulario"}
                      </option>
                      {formOptions.map((form) => (
                        <option key={form.id} value={form.id}>
                          {form.title}
                        </option>
                      ))}
                    </select>

                    {/* Mensajes de estado */}
                    {selectedClientId &&
                      !loading &&
                      formOptions.length === 0 && (
                        <small className="text-warning d-block mt-1">
                          <i className="fas fa-exclamation-triangle"></i>
                          No hay formularios disponibles para este cliente
                        </small>
                      )}

                    {selectedClientId && formOptions.length > 0 && (
                      <small className="text-success d-block mt-1"></small>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      Fecha de monitorización{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className={`form-control ms-0 ${
                        dateError ? "is-invalid" : ""
                      }`}
                      value={monitoringDate}
                      onChange={(e) => {
                        setMonitoringDate(e.target.value);
                        setDateError(false);
                      }}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      Evaluador <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control ms-0"
                      value={
                        userInfo
                          ? `${userInfo.firstname || ""} ${
                              userInfo.lastname || ""
                            }`
                          : "Cargando..."
                      }
                      readOnly
                    ></input>
                  </div>
                </div>
              </>
            )}
            {/* Segunda vista del modal de monitorización */}
            {monitoringStep === 2 ? (
              <div
                className="col-12"
                style={{
                  maxHeight: "65vh",
                  overflowY: "auto",
                  scrollbarWidth: "none",
                }}
              >
                <h5 className="fw-bold mb-4 mt-0">
                  Configuración de Monitorizaciones
                </h5>
                <div className="shadowbox5 p-3">
                  <h4 className="text-center mb-3">
                    Información del Formulario
                  </h4>

                  <div className="infoForm d-flex align-items-center">
                    <p className="fw-bold mb-0 me-2">Nombre del formulario:</p>
                    <label className="mb-0">
                      {callSelectedForm?.title || "Formulario no seleccionado"}
                    </label>
                  </div>

                  <p className=" fw-bold m-0">Form Score:</p>

                  <div className="d-flex align-items-center">
                    <p className="fw-bold mb-0">Posible puntuación:</p>
                    <label className="m-0 p-0 ms-1">100%.</label>
                  </div>
                </div>

                <div className="shadowbox5 mb-4 mt-3 ms-0 ps-0 align-items-center">
                  <h4 className="text-center mt-3">Información del Bloque</h4>

                  {blocksForForm.length === 0 ? (
                    <p>
                      No se ha cargado o existe error al llamar los bloques.
                    </p>
                  ) : (
                    blocksForForm.map((block) => (
                      <div key={block.id} className="mb-4 pb-3">
                        <div className="w-100 border-bottom ps-3 mb-3">
                          <div className="d-flex mb-2">
                            <p className="fw-bold p-0 m-0">
                              Nombre del bloque:
                            </p>
                            <label className="ms-1">{block.block_name}.</label>
                          </div>

                          <div className="d-flex mb-3">
                            <p className="fw-bold mb-0">Puntuación:</p>
                            <label className="ms-1">
                              {block.percentage || "No existe puntuación"}.
                            </label>
                          </div>
                        </div>

                        {/* Preguntas */}
                        <div className="ms-3 mt-3">
                          {block.preguntas.length === 0 ? (
                            <p className="text-muted">
                              Este bloque no tiene preguntas registradas.
                            </p>
                          ) : (
                            <div
                              className="accordion me-3"
                              id={`accordionPreguntas-${block.id}`}
                            >
                              {block.preguntas.map((pregunta, idx) => (
                                <div
                                  className="accordion-item"
                                  key={pregunta.id}
                                >
                                  <h2
                                    className="accordion-header"
                                    id={`heading-${block.id}-${idx}`}
                                  >
                                    <button
                                      className="accordion-button collapsed"
                                      type="button"
                                      data-bs-toggle="collapse"
                                      data-bs-target={`#collapse-${block.id}-${idx}`}
                                      aria-expanded="false"
                                      aria-controls={`collapse-${block.id}-${idx}`}
                                    >
                                      {pregunta.question_name}
                                    </button>
                                  </h2>
                                  <div
                                    id={`collapse-${block.id}-${idx}`}
                                    className="accordion-collapse collapse"
                                    aria-labelledby={`heading-${block.id}-${idx}`}
                                    data-bs-parent={`#accordionPreguntas-${block.id}`}
                                  >
                                    <div className="accordion-body">
                                      {/* Render dinámico por tipo */}
                                      {pregunta.id_type_question === 1 && (
                                        <div>
                                          {(pregunta.select_option || "")
                                            .split(";")
                                            .map((opt, i) => (
                                              <div
                                                className="form-check"
                                                key={i}
                                              >
                                                <input
                                                  className="form-check-input"
                                                  type="checkbox"
                                                />
                                                <label className="form-check-label">
                                                  {opt}
                                                </label>
                                              </div>
                                            ))}
                                        </div>
                                      )}

                                      {pregunta.id_type_question === 2 && (
                                        <select
                                          className="form-select"
                                          value={pregunta.selected_answer || ""}
                                          disabled
                                        >
                                          {(pregunta.select_option || "")
                                            .split(",")
                                            .map((opt, i) => (
                                              <option
                                                key={i}
                                                value={opt.trim()}
                                              >
                                                {opt.trim()}
                                              </option>
                                            ))}
                                        </select>
                                      )}

                                      {pregunta.id_type_question === 3 && (
                                        <textarea
                                          className="form-control"
                                          placeholder="Respuesta abierta..."
                                          disabled
                                        />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : null}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              id="btnCerrar"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={formClientReset}
            >
              Cancelar
            </button>
            <button onClick={handleNextStep} className="btn btn-primary">
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default modalAdmin;
