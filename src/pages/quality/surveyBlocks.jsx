import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import HeaderLT1 from "../../components/header/headerLT1";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import { useParams } from "react-router-dom";
import {
  smallAlertDelete,
  loadingAlert,
  Toast2,
  Toast,
} from "../../assets/js/alertConfig";
import { useTranslation } from "react-i18next";
import {
  sendData,
  deleteQuestion,
  getSurvey,
  getSurveyQuestions,
} from "../../services/surveyRequest";
import "../../assets/css/survey.css";
import {
  Yes_no,
  Textfield_s,
  SingleChoiceView,
  MultipleChoiceView,
} from "../survey/questions";
import "../../assets/css/surveyBlocks.css";
import "../../components/Modals/modalSurveyBlocks";
import { ModalSurveyBlocks } from "../../components/Modals/modalSurveyBlocks";

export default function SurveyBlocks() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [surveyData, setSurveyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { t, i18n } = useTranslation();
  const { accessToken, languageUser } = useContext(UserContext);

  /* Estado de listas de preguntas del botón + Pregunta */
  const [questionsList, setQuestionsList] = useState([
    {
      text: "",
      type: "",
      options: [],
      correctAnswers: [],
    },
  ]);

  // Estados de bloques

  //Id bloque creado
  const [bloques, setBloques] = useState([]);

  // Paginador
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(3); // Número de bloques por página
  const [searchTerm, setSearchTerm] = useState(""); // Para filtrado
  const [staticData, setStaticData] = useState([]); // Copia de los datos para filtrado
  const blockRefs = useRef([]);

  // Estados para manejo de posicionamiento relativo de bloques
  const [positionType, setPositionType] = useState(""); // 'before' o 'after'
  const [referenceBlockId, setReferenceBlockId] = useState(""); // ID del bloque de referencia

  // Abrir modal
  const [modalProps, setModalProps] = useState({ isOpen: false, mode: 1, bloque: null });


  /* ***********************************************************************************************************/
  /* Component Logic*/
  /* ***********************************************************************************************************/

  useEffect(() => {
    i18n.changeLanguage(languageUser);
    getSurvey(id, config, setSurveyData);
    updateSurveyQuestions();
  }, [id, languageUser]);

  useEffect(() => {
    setStaticData([...data]);
  }, [data]);

  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const updateSurveyQuestions = () => {
    getSurveyQuestions(id, config)
      .then(setData)
      .catch((error) => {
        console.error("Error al obtener las preguntas de la encuesta", error);
      });
  };

  // Agregar función para manejar edición
  const onUpdate = (bloque) => {
    setModalProps({ isOpen: true, mode: 2, bloque });
    const preguntasBloque = bloque.preguntas || [];

    const bloqueConPreguntas = {
      ...bloque,
      preguntas: preguntasBloque,
    };
    openModal(2, id, bloqueConPreguntas);
    // Abrir modal después de configurar la data
    document.getElementById("modalManageQuestion").classList.add("show");
    document.getElementById("modalManageQuestion").style.display = "block";
  };

  // Paginador bloques

  const filteredData = useMemo(() => {
    return staticData.filter((row) => {
      if (!searchTerm) return true;

      const parsedSearchTerm = parseInt(searchTerm, 10);

      if (!isNaN(parsedSearchTerm) && row.id) {
        return row.id === parsedSearchTerm;
      }

      return Object.values(row).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [staticData, searchTerm]);

  // Calcular el total de páginas
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  // Datos paginados para mostrar en la vista actual
  const paginatedData = useMemo(() => {
    return filteredData.slice(
      (currentPage - 1) * recordsPerPage,
      currentPage * recordsPerPage
    );
  }, [filteredData, currentPage, recordsPerPage]);

  // Posición de bloques

  const calBlockPosition = () => {
    // Si no hay selección relativa, usar la posición por defecto (última posición + 1)
    if (!positionType || !referenceBlockId) {
      const posiciones = data.map((bloque) => parseInt(bloque.posicion));
      return posiciones.length > 0 ? Math.max(...posiciones) + 1 : 1;
    }

    // Encontrar el bloque de referencia
    const bloqueReferencia = data.find(
      (bloque) => bloque.id == referenceBlockId
    );
    if (!bloqueReferencia) return 1;

    const posicionReferencia = parseInt(bloqueReferencia.posicion);
    const nuevosDatos = [...data]; // Clonar el array para no mutar el original directamente

    // Calcular nueva posición basada en el tipo de posicionamiento
    const nuevaPosicion =
      positionType === "before" ? posicionReferencia : posicionReferencia + 1;

    // Actualizar posiciones de los bloques afectados
    nuevosDatos.forEach((bloque) => {
      const posBloque = parseInt(bloque.posicion);
      if (positionType === "before" && posBloque >= posicionReferencia) {
        bloque.posicion = posBloque + 1;
      } else if (positionType === "after" && posBloque > posicionReferencia) {
        bloque.posicion = posBloque + 1;
      }
    });

    // Actualizar el estado y el localStorage con los bloques reordenados
    setData(nuevosDatos);
    localStorage.setItem("bloquesGuardados", JSON.stringify(nuevosDatos));

    return nuevaPosicion;
  };

  return (
    <div className="App">
      <div id="body">
        <HeaderLT1 />
        <section
          style={{ alignItems: "stretch", flexWrap: "nowrap", padding: 0 }}
        >
          <div className="container mt-0">
            <div className="row">
              <div className="col-md-12">
                <div className="card p-4 borderEVA bg-light">
                  <div className="text-center">
                    <h3>Información</h3>
                  </div>
                  <div className="card-body p-0 py-2">
                    <div className="container-fluid">
                      <div className="row d-flex align-items-center">
                        <div className="col-6">
                          <h5>Información del Formulario</h5>
                          <p className="fs-6">Descripción</p>
                        </div>
                        <div className="col-6 text-end">
                          <p className="fs-6">Fecha inicio / Fecha fin</p>
                          <p className="fs-6">Cantidad de muestras:</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-12 mt-3">
                <div className="card p-4 card-outline card-success borderEVA bg-light">
                  <div>
                    <h3 className="text-center">Preguntas</h3>
                    <div className="card-tools ms-4">
                      <button
                        className="btn fw-bold btn-sm acces-tabla"
                        onClick={() => setModalProps({ isOpen: true, mode: 1, bloque: null })}
                        data-bs-toggle="modal"
                        data-bs-target="#modalManageQuestion"
                      >
                        + Crear Bloque
                      </button>
                    </div>
                  </div>

                  <div className="card-body ui-sorteable">
                    {paginatedData.map((bloque, index) => (
                      <div
                        key={index}
                        ref={(el) => (blockRefs.current[index] = el)}
                        className="shadowbox5 p-3 m-3"
                      >
                        <div className="d-flex justify-content-between mb-2 w-100">
                          <div className="w-100 ps-2">
                            <div className="d-flex justify-content-between align-items-start">
                              <h3 className="mb-3 ms-2">
                                {bloque.nombreBloque || "Bloque sin nombre"}
                              </h3>
                              <span className="text-muted block-weighting me-3">
                                {`${bloque.ponderacion}%` ||
                                  ("0" && bloque.ponderacion > 0)}
                              </span>
                            </div>

                            {/* Se agregan las preguntas a la vista principal */}

                            <div className="mt-2 d-flex flex-column align-items-center">
                              {bloque.preguntas.map((preg, idx) => (
                                <div
                                  key={idx}
                                  className="shadowbox5 p-3 mb-3"
                                  style={{ width: "100%" }}
                                >
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div className="w-100">
                                      <p className="mb-1 mb-3 text-center fs-4">
                                        <strong className="questionRender">
                                          Pregunta {idx + 1}:
                                        </strong>{" "}
                                        {preg.text || "Sin texto"}
                                      </p>

                                      {preg.type === "radio_opt" && (
                                        <div className="d-flex flex-column align-items-center">
                                          <SingleChoiceView
                                            options={preg.select_option}
                                            correctOption={preg.selected_answer}
                                          />
                                        </div>
                                      )}

                                      {preg.type === "check_opt" && (
                                        <div className="d-flex flex-column align-items-center">
                                          <MultipleChoiceView
                                            options={preg.select_option}
                                            correctOption={preg.selected_answer}
                                          />
                                        </div>
                                      )}

                                      {preg.type === "selector_opt" && (
                                        <div className="mb-1">
                                          <label className="form-label">
                                            <strong>
                                              Selecciona una opción:
                                            </strong>
                                          </label>
                                          <select className="form-select">
                                            {(preg.select_option || "")
                                              .split(",")
                                              .map((opt, idx) => {
                                                const optionText = opt.trim();
                                                return (
                                                  <option
                                                    key={idx}
                                                    value={optionText}
                                                    selected={
                                                      optionText ===
                                                      preg.selected_answer
                                                    }
                                                  >
                                                    {optionText}
                                                  </option>
                                                );
                                              })}
                                          </select>
                                        </div>
                                      )}

                                      {preg.type === "textfield_s" && (
                                        <Textfield_s
                                          value={preg.answer || ""}
                                          readOnly
                                        />
                                      )}
                                      {preg.type === "yes_no" && (
                                        <Yes_no
                                          value={preg.answer || ""}
                                          readOnly
                                        />
                                      )}

                                      <div className="text-end me-3">
                                        {preg.conditional === "SI" && (
                                          <i
                                            className="fa-solid fa-question text-primary"
                                            data-bs-toggle="tooltip"
                                            data-bs-placement="top"
                                            data-bs-custom-class="custom-tooltip"
                                            data-bs-title="Esta pregunta es condicional."
                                          ></i>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}

                              <div className="d-flex">
                                <div
                                  className="page-selector btn-group"
                                  role="group"
                                >
                                  <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() =>
                                      setCurrentPage((prev) =>
                                        Math.max(prev - 1, 1)
                                      )
                                    }
                                    disabled={currentPage === 1}
                                  >
                                    &lt;
                                  </button>
                                  <span className="btn btn-outline-secondary">
                                    {currentPage || 1}
                                  </span>
                                  <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() =>
                                      setCurrentPage((prev) =>
                                        Math.min(prev + 1, totalPages)
                                      )
                                    }
                                    disabled={
                                      currentPage === totalPages ||
                                      totalPages === 0
                                    }
                                  >
                                    &gt;
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Menú de acciones (editar/eliminar) */}
                          <div className="dropdown">
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
                            <ul className="dropdown-menu dropdown-menu-end p-0">
                              <li className="text-start btn-rect">
                                <button
                                  className="btn text-start"
                                  style={{ width: "100%" }}
                                  data-bs-toggle="modal"
                                  onClick={() => onUpdate(bloque)}
                                >
                                  <i className="fa-solid fa-edit"></i> Editar
                                </button>
                              </li>
                              <li className="text-start btn-rect">
                                <button
                                  className="btn text-start"
                                  style={{ width: "100%" }}
                                  onClick={() => onBulkEmail(bloque)}
                                >
                                  <i className="fa-solid fa-trash"></i>{" "}
                                  <span>Eliminar</span>
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <ModalSurveyBlocks
          mode={modalProps.mode}
          isOpen={modalProps.isOpen}
          bloqueData={modalProps.bloque}
          surveyId={id}
          data={data}
          setData={setData}
          positionType={positionType}
          referenceBlockId={referenceBlockId}
          updateSurveyQuestions={updateSurveyQuestions}
          onClose={() => setModalProps({ isOpen: false, mode: 1, bloque: null })}
      />
    </div>
  );
}
