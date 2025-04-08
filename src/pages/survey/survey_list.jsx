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
const SurveyList = () => {
  // //todo Poner Tokens const {accessToken, RefreshToken} = useAuth(AuthContext)

  const url = "http://localhost:3000/api/surveys";
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

  const { accessToken, userType, userId,languageUser} = useContext(UserContext);

  useEffect(() => {
    i18n.changeLanguage(languageUser);
    getSurveys();
    getClients(userId);
    const today=new Date()
    const formattedDater = formatDate(today)
   
    const formattedDaterTomorrow = getTomorrowDate(today)
    setFormattedDate({dateToday:formattedDater,dateTomorrow:formattedDaterTomorrow});
  }, [languageUser]);


  const config = {
    withCredentials: true,
  };

  const getSurveys = async () => {
    try {
      const response = await axios.get(url, config);
      console.log("Encuestas: ", response.data);
      setSurvey(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const getClients = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/users_client/${id}`,
        config
      );
      console.log("clientes relacionados: ", response.data.data);
      setClients(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
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

  const validateDates = (dateStart, dateEnd) => {
    const start = new Date(dateStart);
    const end = new Date(dateEnd);

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
      setModalTitle("Editar encuesta");
      title.handleChange(survey?.title || "");
      setNewTitle(survey?.title || "")
      start_date.handleChange(survey?.start_date || "");
      end_date.handleChange(survey?.end_date || "");
      description.handleChange(survey?.description || "");
      link.handleChange(survey?.link || "");
      idClient.handleChange(survey?.idClient || "");
      setidToEdit(survey?.id);
    }
  };
  const validar = (id) => {
    var parametros;
    var metodo;
    const dates = validateDates();
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
  const openModalCont = (survey) => {
    /*  await getClient(survey.id) */
    setModalTitle("Información de la encuesta");
    title.handleChange(survey?.title || "");
    start_date.handleChange(survey?.start_date || "");
    end_date.handleChange(survey?.end_date || "");
    state.handleChange(survey?.state || "");
    description.handleChange(survey?.description || "");
    link.handleChange(survey?.link || "No presenta link anexado");
    idClient.handleChange(survey?.idClient || "");
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
            {survey.length > 0 && (
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
              />
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
                      readOnly
                      onChange={(e) => idClient.handleChange(e.target.value)}
                      value={idClient.input}
                      className="input-new"
                    >
                      {clients.map((client) => (
                        <option value={client.id} key={client.id}>
                          {client.client}
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
                      onChange={(e) => idClient.handleChange(e.target.value)}
                      value={idClient.input}
                      className="input-new"
                    >
                      <option value="" disabled>
                        Seleccione un cliente
                      </option>
                      {clients.map((client) => (
                        <option value={client.id} key={client.id}>
                          {client.client}
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
