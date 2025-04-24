import { useState, useEffect, useContext } from "react";
import HeaderLT1 from "../../components/header/headerLT1.jsx";
import HeaderLT2 from "../../components/header/headerLT2.jsx";
import useInput from "../../components/hooks/useInput.jsx";
import TableMonitoring from "../../components/Tables/tableMonitoring_.jsx";
import { UserContext } from "../../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { smallAlertDelete, Toast, Toast2 } from "../../assets/js/alertConfig.js";
import { useTranslation } from "react-i18next";
import { formatDate, getTomorrowDate } from "../../utils/dateUtils.jsx";
import Cookies from "js-cookie"; // si no lo has importado ya

const FormList = () => {
  const url = "http://localhost:3000/api/forms";
  const headers = ["Title", "Start_date", "End_date", "state"];
  const [operation, setOperation] = useState([1]);
  const [idToEdit, setidToEdit] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  const [forms, setForms] = useState(null);
  const [clients, setClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [formattedDate, setFormattedDate] = useState({});
  const title = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });
  const description = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });
  const state = useInput({ defaultValue: "", validate: /^[0-2 ]*$/ });
  const idClient = useInput({ defaultValue: "", validate: /^[1-4]+$/ });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const { userType, userId, languageUser } = useContext(UserContext);
  const accessToken = Cookies.get('accessToken');

  useEffect(() => {
    getForms();
    const today = new Date();
    const formattedDater = formatDate(today);
    const formattedDaterTomorrow = getTomorrowDate(today);
    setFormattedDate({
      dateToday: formattedDater,
      dateTomorrow: formattedDaterTomorrow,
    });
  }, []);

  useEffect(() => {
    if (userId && accessToken) {
      getClients(userId);
    }
  }, [userId, accessToken]);

  useEffect(() => {
    i18n.changeLanguage(languageUser);
  }, [languageUser]);

  const getForms = async () => {
    try {
      const response = await axios.get(url, {
        headers: {},
        withCredentials: true,
      });
      setForms(response.data.data);  // Cambié 'survey' por 'forms'
      console.log("Formularios cargados:", response.data.data);
    } catch (error) {
      console.error("Error al obtener formularios:", error);
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
      const response = await axios.get(`http://localhost:3000/api/users_client/${id}`, authConfig);
      console.log("Clientes relacionados: ", response.data);
      setClients(response.data.data);
    } catch (error) {
      console.error("❌ Error al obtener clientes:", error);
      if (error.response) {
        console.error("Detalles del error:", error.response.data);
      }
    }
  };

  const deactivateForm = (form) => {
    const url = `http://localhost:3000/api/form`;
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
          await axios.patch(`${url}/${id}`, parametros);
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

    const handleSave = async () => {
      const token = Cookies.get("accessToken");
      const userId = Cookies.get("userId");
    
      if (!formName || !description || !selectedClient) {
        // Muestra un error en forma de Toast cuando los campos están vacíos
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
          title: "Todos los campos son obligatorios",
        });
    
        return;
      }
    
      const formData = {
        title: formName,
        description,
        idClient: selectedClient,
        creation_date: new Date().toISOString().slice(0, 19).replace("T", " "),
        created_by: userId,
        updated_date: new Date().toISOString().slice(0, 19).replace("T", " "),
        updated_by: userId,
        state: 1,
      };
    
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
    
      try {
        const response = await axios.post(
          "http://localhost:3000/api/forms",
          formData,
          config
        );
        console.log("✅ Formulario creado:", response.data);
    
        // Muestra un Toast de éxito cuando el formulario se crea correctamente
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
          title: "Formulario creado correctamente",
        });
    
        handleClose();
      } catch (error) {
        console.error("❌ Error al guardar el formulario:", error.response || error.message);
    
        // Muestra un Toast de error si ocurre un fallo al guardar el formulario
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
          title: "Error al guardar el formulario",
        });
      }
    };

  const openModal = (op, form) => {
    setOperation(op);
    if (op === 1) {
      setModalTitle("Añadir formulario");
      title.handleChange("");
      description.handleChange("");
      setNewTitle("");
    } else if (op === 2) {
      setModalTitle("Editar formulario");
      title.handleChange(form?.title || "");
      setNewTitle(form?.title || "");
      description.handleChange(form?.description || "");
      setidToEdit(form?.id);
    }
  };

  const openModalCont = (form) => {
    setModalTitle("Información del formulario");
    title.handleChange(form?.title || "");
    description.handleChange(form?.description || "");
    state.handleChange(form?.state || "");
  };

  const openForm = (form) => {
    navigate(`/view_form/${form.id}`); // Cambio a la ruta de formulario
  };
  

  console.log(userId, accessToken); // Verifica si estos valores están correctos
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  console.log(indexOfFirstRecord, indexOfLastRecord); // Verifica que los índices sean correctos
  
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
          {forms.length > 0 && (
  <TableMonitoring
    header={headers}
    data={forms} 
    onCreate={() => openModal(1)}
    onUpdate={(payload) => openModal(2, payload)}
    modalId={"modalForms"}
    onRemove={(item) => deactivateForm(item)}
  />
)}

          </div>
          </div>
          </div>
      </div>
      <div id="modalForm" className="modal fade" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered modal-lg">
    <div className="modal-content">
      <div className="modal-header">
        <label className="h5">Añadir Formulario</label>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="close"
          onClick={() => {
            setFormName("");  // Limpiar el estado
            setDescription("");  // Limpiar el estado
            setSelectedClient("");  // Limpiar el estado
          }}
        ></button>
      </div>
      <div className="modal-body">
        {/* Campo de Nombre del formulario */}
        <div className="row">
          <div className="col-8 mb-3">
            <label id="labelAnimation">
              <input
                placeholder=" "
                className="input-new"
                type="text"
                name="title"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}  // Actualizar formName
              />
              <span className="labelName">Nombre del Formulario</span>
            </label>
          </div>
        </div>

        {/* Selección de Cliente */}
        <div className="row">
          <div className="col-8 mb-3">
            <label id="labelAnimation">
              <select
                onChange={(e) => setSelectedClient(e.target.value)}  // Actualizar selectedClient
                value={selectedClient}
                className="input-new"
              >
                <option value="" disabled>
                  Seleccione un cliente
                </option>
                {clients.map((client) => (
                  <option value={client.id} key={client.id}>
                    {client.clientName}
                  </option>
                ))}
              </select>
              <span className="labelName">Cliente</span>
            </label>
          </div>
        </div>

        {/* Campo de Descripción */}
        <div className="row mt-3">
          <div className="col mb-3">
            <label id="labelAnimation">
              <textarea
                className="input-new"
                placeholder="Descripción"
                type="text-area"
                name="descripcion"
                value={description}
                onChange={(e) => setDescription(e.target.value)}  // Actualizar description
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
          onClick={() => {
            setFormName("");  // Limpiar el estado al cerrar
            setDescription("");  // Limpiar el estado al cerrar
            setSelectedClient("");  // Limpiar el estado al cerrar
          }}
        >
          Cerrar
        </button>
        <button
          id="saveButton"
          onClick={handleSave}  // Llamar a la función de guardar
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

export default FormList;
