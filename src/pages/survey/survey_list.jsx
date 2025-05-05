import { useState, useEffect, useContext } from "react";
import SidebarLT1 from "../../components/aside/sidebarLT1";
import HeaderLT1 from "../../components/header/headerLT1";
import SidebarLT2 from "../../components/aside/sidebarLT2";
import HeaderLT2 from "../../components/header/headerLT2";
import useInput from "../../components/hooks/useInput";
import TableSurvey from "../../components/Tables/tableSurvey";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { smallAlertDelete, Toast, Toast2 } from "../../assets/js/alertConfig";
import { generateRandomLink } from "../../components/survey/encrypt";
import { useTranslation } from "react-i18next";
import { formatDate,getTomorrowDate } from "../../utils/dateUtils.jsx";
import Cookies from "js-cookie"; // si no lo has importado ya

import ModalEnvioMasivo from "../../components/Modals/modalEnvioMasivo";

const SurveyList = () => {
  // //todo Poner Tokens const {accessToken, RefreshToken} = useAuth(AuthContext)

  // En el estado del componente añade:
  const [showEnvioModal, setShowEnvioModal] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  //const url = "http://localhost:3000/api/surveys";
  const headers = ["Title", "Start_date", "End_date", "state"];
  const [operation, setOperation] = useState([1]);
  const [idToEdit, setidToEdit] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  const [survey, setSurvey] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [endDate, setEndDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [errorFechas, setErrorFechas] = useState(false);
  const [errorFechasMessage, setErrorFechasMessage] = useState("");
  const [newTitle, setNewTitle]=useState("")
  const [formattedDate,setFormattedDate]=useState({})
  const title = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });
  const start_date = useInput({
    defaultValue: "",
    validate: /^\d{4}-\d{2}-\d{2}$/,
  });
  const end_date = useInput({
    defaultValue: "",
    validate: /^\d{4}-\d{2}-\d{2}$/,
  });
  const description = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });
  const link = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });
  const state = useInput({ defaultValue: "", validate: /^[0-2 ]*$/ });
  const idClient = useInput({ defaultValue: "", validate: /^[1-4]+$/ });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const { userType, userId, languageUser } = useContext(UserContext);
  const accessToken = Cookies.get('accessToken');

  useEffect(() => {
    getSurveys();
    const today = new Date();
    const formattedDater = formatDate(today);
    const formattedDaterTomorrow = getTomorrowDate(today);
    setFormattedDate({
      dateToday: formattedDater,
      dateTomorrow: formattedDaterTomorrow,
    });
  }, [userId]);
  

  useEffect(() => {
    console.log("******",clients);
    if (userId && accessToken) {
      getClients(userId);
    }
  }, [userId, accessToken]);
  

  useEffect(() => {
    i18n.changeLanguage(languageUser);
  }, [languageUser]);
  

  const config = {
    headers: {
    },
    withCredentials: true,
  };
  

  const getSurveys = async () => {
    try {
      //const response = await axios.get(url, config);
      const response = await axios.get(`http://localhost:3000/api/surveys-user/${userId}`, config);
      console.log("Encuestas: ", response.data);
      setSurvey(response.data.data); // <-- ¡aquí está el fix!
    } catch (error) {
      console.error("Error al obtener encuestas:", error);
      if (error.response) {
        console.error("Detalles del error:", error.response.data);
      }
    }
  };
  
  const getClients = async (id) => {
    const token = accessToken || Cookies.get("accessToken");
  
    if (!token) {
      console.warn("⚠️ Token no disponible aún.");
      return;
    }
  
    try {
      const authConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };
      console.log("-------------------ID del usuario:", id);
      const response = await axios.get(`http://localhost:3000/api/users_client/${id}`, authConfig);
  
      console.log("Respuesta de la API:", response.data);
  
      if (response.data && response.data.data) {
        // Si la respuesta tiene los datos en `data`, se actualiza el estado
        setClients(response.data.data);
      } else {
        console.warn("No se encontraron clientes en la respuesta.");
      }
    } catch (error) {
      console.error("❌ Error al obtener clientes:", error);
      if (error.response) {
        console.error("Detalles del error:", error.response.data);
      }
    }
  };

  const activeSurvey = (survey) => {
    const url = `http://localhost:3000/api/survey`;
    const id = survey.id;
    const name = survey.title;
    const parametros = {
      state: 1,
    };
    smallAlertDelete
      .fire({
        text: `El usuario ${name} se activara.`,
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.patch(`${url}/${id}`, parametros, {
              withCredentials: true,
            });

            Toast.fire({
              icon: "success",
              title: `La encuesta ${survey.title} se ha activado exitosamente`,
            });

            // getSurveys();
          } catch (error) {
            Toast.fire({
              icon: "error",
              title: `La encuesta ${survey.title} no ha sido activada`,
            });
            console.error(error);
          }
        }
        getSurveys();
      });
  };

  const deactivateSurvey = (survey) => {
    const url = `http://localhost:3000/api/survey`;
    const id = survey.id;
    const name = survey.title;
    const parametros = {
      state: 0,
    };

    smallAlertDelete
      .fire({
        text: `La encuesta ${name} se eliminará de forma permanente.`,
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.patch(`${url}/${id}`, parametros, config);
            Toast.fire({
              icon: "success",
              title: `La encuesta ${survey.title} se ha activado exitosamente`,
            });
          } catch (error) {
            alert("error", "Error al eliminar");
            console.error(error);
          }
        }
        getSurveys();
      });
  };

  const parseLocalDate = (dateString) => {
    if (!dateString || typeof dateString !== "string") {
      console.warn("se recibio un valor invalido:", dateString);
      return null;
    }  
    const [year, month, day] = dateString.split("-");
    return new Date(year, month - 1, day); // Recuerda: month es 0-indexed
  };

  const validateDates = (dateStart, dateEnd) => {
    
    if (!dateStart || !dateEnd) {
      console.warn("Una o ambas fechas no están definidas:", dateStart, dateEnd);
      return false;
    }

    const start = parseLocalDate(dateStart);
    const end = parseLocalDate(dateEnd);
    const today = new Date();

    //  Validar antes de usar setHours
    if (!start || !end) {
      setErrorFechas(true);
      setErrorFechasMessage("Fechas inválidas.");
      return false;
    }
    
    // Normaliza TODAS las fechas a medianoche
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    //validar que la fecha de inicio no sea menor a la fecha actual
    if (start < today)  {
      setErrorFechas(true);
      setErrorFechasMessage("La fecha de inicio no puede ser anterior al día de hoy")
      document.getElementById("saveButton").disabled = true;
      return false;
    }

    if (end < start) {
      setErrorFechas(true);
      setErrorFechasMessage("La fecha de inicio no puede ser posterior a la fecha de fin")
      document.getElementById("saveButton").disabled = true;
      return false;
    } 
    setErrorFechas(false);
    document.getElementById("saveButton").disabled = false;
    return true;
  };

  useEffect(() => {
    validateDates(start_date.input, end_date.input);
  }, [start_date.input, end_date.input]);

  const formatDateForInput = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return date.toISOString().split('T')[0];
  };
  

  const openModal = (op, survey) => {
    setOperation(op);  
    if (op == 1) {
      setModalTitle("Añadir encuesta");
      title.handleChange("");
      start_date.handleChange("");
      end_date.handleChange("");
      description.handleChange("");
      link.handleChange("");
      idClient.handleChange("");
    } else if (op == 2) {
      console.log("esto es survey",survey)
      setModalTitle("Editar encuesta");
      title.handleChange(survey?.title || "");
      setNewTitle(survey?.title || "");
      start_date.handleChange(formatDateForInput(survey?.start_date));
      end_date.handleChange(formatDateForInput(survey?.end_date));
      description.handleChange(survey?.description || "");
      link.handleChange(survey?.link || "");
      console.log("----**idClient", survey.idClient);
      idClient.handleChange(survey?.idClient || "");
      setidToEdit(survey?.id);
    }
  };
  
  const validar = (id) => {
    var parametros;
    var metodo;
    const dates = validateDates();

    console.log("idCliente se envia", idClient.input);

    if (
      title.input.trim() == "" ||
      start_date.input.trim() == "" ||
      end_date.input.trim() == "" ||
      description.input.trim() == ""
    ) {
      alert("Campos mal diligenciados");
    } else {
      if (operation == 1) {
        const link = generateRandomLink(title.input, idClient.input);
        console.log(link);
        parametros = {
          title: title.input,
          start_date: start_date.input,
          end_date: end_date.input,
          description: description.input,
          idClient: idClient.input,
          link: link,
          type: "survey",
          state: 1,
        };
        console.log("datos del link a crear:", parametros);
        metodo = "post";
      } else if (operation == 2) {
        const titleExists = survey.some(item => item.title === title.input  );

        
        parametros = {
          title: title.input == newTitle && titleExists? undefined: title.input,
          start_date: start_date.input,
          end_date: end_date.input,
          description: description.input,
          idClient: idClient.input,
          link: link.input,
          type: "survey",
        };
        metodo = "put";
      }
      sendData(metodo, parametros, id);
    }
  };
  const sendData = async (metodo, parametros) => {
    try {
      if (metodo.toUpperCase() == "POST") {
        const handleCreateSurvey = async () => {
          setLoading(true);
          try {
            const response = await axios.post(
              "http://localhost:3000/api/surveys",
              parametros,
              config
            );
            const responseData = response.data;
            console.log("Respuesta solicitud Post:", responseData);
            if (responseData.status) {
              getSurveys();
              document.getElementById("btnCerrarModalCrear").click();
              Toast.fire({
                icon: "success",
                title: `Encuesta creada exitosamente.`,
              });
            }
          } catch (error) {
            console.error(error);
          } finally {
            setLoading(false);
          }
        };

        handleCreateSurvey();
      } else if (metodo.toUpperCase() == "PUT") {
        const url = `http://localhost:3000/api/survey`;
        const response = await axios.put(
          `${url}/${idToEdit}`,
          parametros,
          config
        );
        if (response.status === 200) {
          document.getElementById("btnCerrarModalCrear").click();
          Toast.fire({
            icon: "success",
            title: `Encuesta editada exitosamente.`,
          });
        }
        getSurveys();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const openModalCont =  async (survey) => {
     /* await getClient(survey.id)  */
     setModalTitle("Información de la encuesta");
     title.handleChange(survey?.title || "");
     start_date.handleChange(survey?.start_date || "");
     end_date.handleChange(survey?.end_date || "");
     state.handleChange(survey?.state || "");
     description.handleChange(survey?.description || "");
     link.handleChange(survey?.link || "No presenta link anexado");
     idClient.handleChange(survey?.idClient || "");
  };

  const openModalBulk = (survey)  => {
    setSelectedSurvey(survey);
    setShowEnvioModal(true);
  };

  const duplicateSurvey = (survey) => {
    console.log(survey);
    smallAlertDelete
      .fire({
        text: `La encuesta ${survey.title} se duplicará.`,
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const link = generateRandomLink(survey.title, survey.idClient);
          const randomLink = link + Math.floor(Math.random() * 100) + 1;
          const DataToDuplicate = {
            description: survey.description,
            start_date: formattedDate.dateToday,
            end_date: formattedDate.dateTomorrow,
            idClient: survey.idClient,
            state: survey.state,
            title: `${survey.title} copia`,
            type: survey.type,
            link: randomLink,
          };
          sendData("post", DataToDuplicate);
          getSurveys();
        }
      });
  };
  

  const openSurvey = (survey) => {
    console.log('catching survey', survey)
    navigate(`/view_survey/${survey.id}`);
  };

  const copyLink = (survey) => {
    const { link } = survey;
    navigator.clipboard.writeText(link);
    Toast.fire({
      icon: "success",
      title: `Link copiado al portapapeles`,
    });
  }

  console.log("encuestas a mostrar:", survey);
  console.log("Valor de start_date.input en el render:", start_date.input);

  return (
    <div className="App">
      <div id="body">
        {userType == "1" || userType == "2" ? <HeaderLT1 /> : <HeaderLT2 />}
     <div className="row m-0">
      <div className="col-1 d-flex  align-items-center mx-auto p-0">
          {/* {userType == "1" || userType == "2" ? <SidebarLT1 /> : <SidebarLT2 />} */}
          </div>
          <div className="w-100 d-flex justify-content-center px-2">
          <div className="w-100 px-3" style={{ maxWidth: "97%" }}>
            {survey.length > 0 ? (
              <TableSurvey
                header={headers}
                data={survey}
                onCreate={() => openModal(1)}
                onUpdate={(payload) => openModal(2, payload)}
                modalId={"modalSurvey"}
                modalId2={"modalViewSurvey"}
                onView={(payload) => openModalCont(payload)}
                onCheck={(payload) => openSurvey(payload)}
                onRemove={(item) => deactivateSurvey(item)}
                onActive={(payload) => activeSurvey(payload)}
                onDuplicate={(item) => duplicateSurvey(item)}
                onCopyLink={(item)=> copyLink(item)}
                onBulkEmail={(payload)=> openModalBulk(payload)}
              />
            ) : (
              <div className="text-center py-5">
                <h4>No hay encuestas disponibles</h4>
                <button 
                  data-bs-toggle="modal"
                  data-bs-target="#modalSurvey"
                  className="btn btn-primary mt-3"
                  onClick={() => openModal(1)}
                >
                  Crear nueva encuesta
                </button>
              </div>
            )}
          </div>
          </div>
          </div>
      </div>
     <div id="modalViewSurvey" className="modal fade" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <label className="h5">{modalTitle}</label>
              <button
                id="btnCerrar"
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="close"
              ></button>
            </div>
            <div className="modal-body ">
              <div className="row">
                <div className="col-8 mb-3">
                  <label id="labelAnimation">
                    <input
                      placeholder=" "
                      className="input-new"
                      type="text"
                      name="title"
                      value={title.input}
                      readOnly
                    />
                    <span className="labelName">Titulo</span>
                  </label>
                </div>
                <div className="col-4 mb-3">
                  <label id="labelAnimation">
                  <select
                    onChange={(e) => {
                      console.log("***--lo que se manda--***",e.target.value);
                      idClient.handleChange(e.target.value)}}
                    value={idClient.input}
                    className="input-new"
                    disabled={clients.length === 0} // Deshabilitar si no hay clientes
                  >
                    <option value="" disabled>
                      Seleccione un cliente
                    </option>
                    {clients.length > 0 ? (
                      clients.map((client) => (
                        <option value={client.idClient} key={client.id}>
                          {client.clientName}
                        </option>
                      ))
                    ) : (
                      <option disabled>Cargando clientes...</option> 
                    )}
                  </select>

                    <span className="labelName">Cliente</span>
                  </label>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col mb-3">
                  <label id="labelAnimation">
                    <input
                      className="input-new"
                      placeholder=" "
                      type="date"
                      name="start_date"
                      value={start_date.input}
                      min={formatDateForInput(new Date())}
                      onChange={(e) => {
                        console.log("-----Valor seleccionado:}}}", e.target.value)
                        start_date.handleChange(e.target.value);
                        validateDates(e.target.value, end_date.input);
                      }}
                    />
                    <span className="labelName">Fecha de inicio:</span>
                  </label>
                </div>
                <div className="col mb-3">
                  <label id="labelAnimation">
                    <input
                      className="input-new"
                      placeholder=" "
                      type="date"
                      name="end_date"
                      value={end_date.input}
                      onChange={(e) => {
                        end_date.handleChange(e.target.value);
                        validateDates(start_date.input, e.target.value);
                      }}
                    />
                    <span className="labelName">Fecha de finalización:</span>
                  </label>
                </div>
              </div>
              {errorFechas && (
                <p className="text-danger">
                  La fecha de fin no puede ser anterior a la fecha de inicio
                </p>
              )}
              <div className="row">
                <div className="col mb-3 ">
                  <span>Descripción</span>
                  <label id="labelAnimation">
                    <textarea
                      className="input-new "
                      placeholder="Descripción"
                      type="text-area"
                      name="descripcion"
                      value={description.input}
                      readOnly
                    />
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                id="btnCerrar"
                className="btn-primary btn"
                data-bs-dismiss="modal"
                onClick={() => setSelectedClients([])}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div> 
 {showEnvioModal && (
  <ModalEnvioMasivo 
    survey={selectedSurvey} 
    onClose={() => setShowEnvioModal(false)} 
  />
)}
      <div id="modalSurvey" className="modal fade" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <label className="h5">{modalTitle}</label>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="close"
                onClick={() => setSelectedClients([])}
              ></button>
            </div>
            <div className="modal-body ">
              <div className="row">
                <div className="col-8 mb-3">
                  <label id="labelAnimation">
                    <input
                      placeholder=" "
                      className="input-new"
                      type="text"
                      name="title"
                      value={title.input}
                      onChange={(e) => title.handleChange(e.target.value)}
                    />
                    <span className="labelName">Titulo</span>
                  </label>
                </div>
                <div className="col-4 mb-3">
                  <label id="labelAnimation">
                    <select
                      onChange={(e) =>{ 
                        console.log("***--lo que se manda--***",e.target.value);
                        idClient.handleChange(e.target.value)}}
                      value={idClient.input}
                      className="input-new"
                    >
                      <option value="" disabled>
                        Seleccione un cliente
                      </option>
                      {clients.map((client) => (
                        <option value={client.idClient} key={client.id}>
                          {client.clientName}
                        </option>
                      ))}
                    </select>
                    <span className="labelName">Cliente</span>
                  </label>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col mb-3">
                  <label id="labelAnimation">
                    <input
                      className="input-new"
                      placeholder=" "
                      type="date"
                      name="start_date"
                      value={start_date.input}
                      onChange={(e) => {
                        start_date.handleChange(e.target.value);
                        validateDates(e.target.value, end_date.input);
                      }}
                    />
                    <span className="labelName">Fecha de inicio:</span>
                  </label>
                </div>
                <div className="col mb-3">
                  <label id="labelAnimation">
                    <input
                      className="input-new"
                      placeholder=" "
                      type="date"
                      name="end_date"
                      value={end_date.input}
                      onChange={(e) => {
                        end_date.handleChange(e.target.value);
                        validateDates(start_date.input, e.target.value);
                      }}
                    />
                    <span className="labelName">Fecha de finalización:</span>
                  </label>
                </div>
              </div>
              {errorFechas && (
                <p className="text-danger">
                  {errorFechasMessage}
                </p>
              )}
              <div className="row mt-3">
                <div className="col mb-3 ">
                  <label id="labelAnimation">
                    <textarea
                      className="input-new "
                      placeholder="Descripción"
                      type="text-area"
                      name="descripcion"
                      value={description.input}
                      onChange={(e) => description.handleChange(e.target.value)}
                    />
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                id="btnCerrarModalCrear"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => setSelectedClients([])}
              >
                Cerrar
              </button>
              <button
                id="saveButton"
                onClick={() => validar(idToEdit)}
                className="btn-primary btn"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyList;
