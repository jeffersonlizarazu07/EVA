import { useState, useEffect, useContext } from "react";
import HeaderLT1 from "../../components/header/headerLT1";
import HeaderLT2 from "../../components/header/headerLT2";
import useInput from "../../components/hooks/useInput";
import TableForms from "../../components/Tables/tableForm.jsx";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { smallAlertDelete, Toast } from "../../assets/js/alertConfig";
import Cookies from "js-cookie";
import { useTranslation } from 'react-i18next';

const FormList = () => {
  const headersArray = [
    "id", "title", "description", "client_name",
    "creation_date", "created_by_name", "updated_date",
    "updated_by_name", "state"
  ];

  const headers = {
    id: "ID",
    title: "Form Name",
    description: "Description",
    client_name: "Client",
    creation_date: "Creation Date",
    created_by_name: "Created By",
    updated_date: "Updated Date",
    updated_by_name: "Updated By",
    state: "State"
  };

  const { userType, languageUser } = useContext(UserContext);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const accessToken = Cookies.get('accessToken');

  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [idToEdit, setIdToEdit] = useState(null);

  // Inputs
  const title = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });
  const description = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });
  const state = useInput({ defaultValue: "1", validate: /^[0-2]$/ });
  const idClient = useInput({ defaultValue: "", validate: /^[0-9]+$/ });

  // Clientes de ejemplo o traídos de API
  const [clients, setClients] = useState([]);

  useEffect(() => {
    i18n.changeLanguage(languageUser);
    getForms();
    getClients();
  }, [languageUser]);

  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    withCredentials: true,
  };

  const getForms = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/forms", config);
      setForms(response.data.data);
    } catch (error) {
      console.error("Error al obtener formularios:", error);
    }
    setLoading(false);
  };

  const getClients = async () => {
    // Aquí deberías traer los clientes desde tu API
    try {
      const res = await axios.get("http://localhost:3000/api/clients", config);
      setClients(res.data.data);
    } catch (err) {
      console.error("Error cargando clientes", err);
    }
  };

  const openForm = (form) => {
    navigate(`/view_form/${form.id}`);
  };

  const deactivateForm = async (form) => {
    smallAlertDelete
      .fire({
        text: `El formulario "${form.title}" se eliminará de forma permanente.`,
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.patch(
              `http://localhost:3000/api/form/${form.id}`,
              { state: 0 },
              config
            );
            Toast.fire({
              icon: "success",
              title: `Formulario "${form.title}" desactivado.`,
            });
            getForms();
          } catch (error) {
            console.error("Error al desactivar formulario:", error);
          }
        }
      });
  };

  const openModal = (mode, form = null) => {
    if (mode === "create") {
      setModalTitle("Crear Formulario");
      setIdToEdit(null);
      title.handleChange("");
      description.handleChange("");
      state.handleChange("1");
      idClient.handleChange("");
    } else if (mode === "edit" && form) {
      setModalTitle("Editar Formulario");
      setIdToEdit(form.id);
      title.handleChange(form.title || "");
      description.handleChange(form.description || "");
      state.handleChange(String(form.state) || "1");
      idClient.handleChange(form.idClient || "");
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setIdToEdit(null);
  };

  const saveForm = async () => {
    // Aquí va la validación simple
    if (!title.input || !idClient.input) {
      alert("Por favor llena todos los campos obligatorios");
      return;
    }

    const dataToSend = {
      title: title.input,
      description: description.input,
      state: parseInt(state.input),
      idClient: parseInt(idClient.input),
    };

    try {
      if (idToEdit) {
        // Editar
        await axios.put(
          `http://localhost:3000/api/form/${idToEdit}`,
          dataToSend,
          config
        );
        Toast.fire({ icon: "success", title: "Formulario actualizado." });
      } else {
        // Crear
        await axios.post("http://localhost:3000/api/forms", dataToSend, config);
        Toast.fire({ icon: "success", title: "Formulario creado." });
      }
      getForms();
      closeModal();
    } catch (error) {
      console.error("Error guardando formulario:", error);
      Toast.fire({ icon: "error", title: "Error guardando formulario." });
    }
  };

  return (
    <div className="App">
      <div id="body">
        {userType == "1" || userType == "2" ? <HeaderLT1 /> : <HeaderLT2 />}
        <div className="row m-0">
          <div className="w-100 d-flex justify-content-center px-2">
            <div className="w-100 px-3" style={{ maxWidth: "97%" }}>
              {loading ? (
                <p>Cargando...</p>
              ) : forms.length > 0 ? (
                <TableForms
                  header={headersArray}
                  headerLabels={headers}
                  data={forms}
                  onView={openForm}
                  onRemove={deactivateForm}
                  onCreate={() => openModal("create")}
                  onUpdate={(form) => openModal("edit", form)}
                />
              ) : (
                <p>No hay formularios disponibles.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal fade show d-block" tabIndex="-1" aria-modal="true" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modalTitle}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-8">
                    <label className="form-label">Título</label>
                    <input
                      type="text"
                      className="form-control"
                      value={title.input}
                      onChange={(e) => title.handleChange(e.target.value)}
                      placeholder="Título del formulario"
                    />
                  </div>
                  <div className="col-4">
                    <label className="form-label">Cliente</label>
                    <select
                      className="form-select"
                      value={idClient.input}
                      onChange={(e) => idClient.handleChange(e.target.value)}
                    >
                      <option value="">Seleccione un cliente</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.client}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    value={description.input}
                    onChange={(e) => description.handleChange(e.target.value)}
                    placeholder="Descripción del formulario"
                    rows={3}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Estado</label>
                  <select
                    className="form-select"
                    value={state.input}
                    onChange={(e) => state.handleChange(e.target.value)}
                  >
                    <option value="1">Activo</option>
                    <option value="0">Inactivo</option>
                    <option value="2">Archivado</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={saveForm}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormList;
