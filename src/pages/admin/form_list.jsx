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
import { useTranslation } from "react-i18next";

// Función para formatear las fechas
const formatDate = (dateString) => {
  // Check if dateString is null, undefined, or "No actualizada"
  if (!dateString || dateString === "No actualizada" || dateString === "NULL") {
    return "No actualizada";
  }

  // Create Date object and check if it's valid
  const date = new Date(dateString);
  if (isNaN(date.getTime() || " ")) {
    return "No actualizada";
  }

  // Proceed with your formatting logic for valid dates
  // Ajustar manualmente para UTC-5 (restando 5 horas)
  const utcMinus5 = new Date(date.getTime() - 5 * 60 * 60 * 1000);

  // Formatear cada componente de la fecha con dos dígitos
  const day = ("0" + utcMinus5.getDate()).slice(-2);
  const month = ("0" + (utcMinus5.getMonth() + 1)).slice(-2);
  const year = utcMinus5.getFullYear();

  const hours = ("0" + utcMinus5.getHours()).slice(-2);
  const minutes = ("0" + utcMinus5.getMinutes()).slice(-2);
  const seconds = ("0" + utcMinus5.getSeconds()).slice(-2);

  // Devolver en formato dd/mm/yyyy hh:mm:ss
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const FormList = () => {
  const headersArray = [
    "id",
    "title",
    "description",
    "client_name",
    "creation_date",
    "created_by_name",
    "updated_date",
    "updated_by_name",
    "state",
  ];

  const { userType, languageUser } = useContext(UserContext);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const accessToken = Cookies.get("accessToken");
  const userId = Cookies.get("userId");

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
      const response = await axios.get(
        "http://localhost:3000/api/forms",
        config
      );
      setForms(response.data.data);
    } catch (error) {
      console.error("Error al obtener formularios:", error);
    }
    setLoading(false);
  };

  const getClients = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/clients", config);
      setClients(res.data.data);
    } catch (err) {
      console.error("Error cargando clientes", err);
    }
  };

  const openForm = (form) => {
    navigate(`/survey_blocks/${form.id}`, { state: { form } });
  };

  const activateForm = async (form) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/form/${form.id}`,
        { state: 1 },
        config
      );
      Toast.fire({
        icon: "success",
        title: `${form.title}${t("alertActivate.SuccessAlert")}`,
      });
      getForms();
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: `${form.title}${t("alertActivate.ErrorAlert")}`,
      });
      console.error("Error al activar formulario:", error);
    }
  };

  const deactivateForm = async (form) => {
    smallAlertDelete.fire({
  icon: "warning",
  title: '',
  html: `<p style="text-align:center;">El formulario <strong>${form.title}</strong> será deshabilitado.<br>¿Desea continuar?</p>`,
  showCancelButton: true,
  confirmButtonText: "Confirmar",
  cancelButtonText: "Cancelar",
  confirmButtonColor: "#b62a8b",
  customClass: {
    popup: 'my-swal-popup',
    actions: 'swal2-actions-center',
    icon: 'swal2-icon-center', // Asegura que el icono esté centrado
    title: 'swal2-title-center', // Centra el título si lo deseas
  },
  didOpen: () => {
    // Alineamos el ícono y el texto
    const icon = document.querySelector('.swal2-icon');
    const title = document.querySelector('.swal2-title');
    if (icon && title) {
      icon.style.marginRight = '10px'; // Espacio entre el ícono y el título
    }
  },
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
              title: `${form.title}${t("alertDeactivate.SuccessAlert")}`,
            });
            getForms();
          } catch (error) {
            Toast.fire({
              icon: "error",
              title: `${form.title}${t("alertDeactivate.ErrorAlert")}`,
            });
            console.error("Error al desactivar formulario:", error);
          }
        }
      });
  };

  const openModal = (mode, form = null) => {
    if (mode === "create") {
      setModalTitle(t("formModal.NewForm"));
      setIdToEdit(null);
      title.handleChange("");
      description.handleChange("");
      state.handleChange("1");
      idClient.handleChange("");
    } else if (mode === "edit" && form) {
      setModalTitle(t("formModal.EditClient"));
      setIdToEdit(form.id);
      title.handleChange(form.title || "");
      description.handleChange(form.description || "");
      state.handleChange(String(form.state) || "1");
      idClient.handleChange(form.idClient || "");
    }
    setModalOpen(true);
  };
  // console.log("idClient.input:", idClient.input);

  const closeModal = () => {
    setModalOpen(false);
    setIdToEdit(null);
  };

  const saveForm = async () => {
    if (!title.input || !idClient.input) {
      alert(t("alerts.fillRequiredFields")); // Aquí también podrías traducir el mensaje de alerta
      return;
    }

    const now = new Date().toISOString().slice(0, 19).replace("T", " ");

    const dataToSend = {
      title: title.input,
      description: description.input,
      state: parseInt(state.input),
      idClient: parseInt(idClient.input),
    };

    if (idToEdit) {
      // Solo datos de actualización
      dataToSend.updated_date = now;
      dataToSend.updated_by = userId;
    } else {
      // Solo datos de creación
      dataToSend.creation_date = now;
      dataToSend.created_by = userId;
    }

    try {
      if (idToEdit) {
        await axios.put(
          `http://localhost:3000/api/form/${idToEdit}`,
          dataToSend,
          config
        );
      } else {
        await axios.post("http://localhost:3000/api/forms", dataToSend, config);
      }
      Toast.fire({
        icon: "success",
        title: title.input + t("alertCreateEdit.SuccessAlert"),
      });
      getForms();
      closeModal();
    } catch (error) {
      console.error("Error guardando formulario:", error);
      Toast.fire({ icon: "error", title: t("alertCreateEdit.ErrorAlert") });
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
                  data={forms.map((form) => ({
                    ...form,
                    creation_date: formatDate(form.creation_date), // Aquí aplicamos el formato
                    updated_date: formatDate(form.updated_date), // Aquí aplicamos el formato
                  }))}
                  onView={openForm}
                  onActive={activateForm}
                  onRemove={deactivateForm}
                  onCreate={() => openModal("create")}
                  onUpdate={(form) => openModal("edit", form)}
                />
              ) : (
                <div className="text-center py-5">
                  <h4>No existen formularios disponibles</h4>
                  <button
                    data-bs-toggle="modal"
                    data-bs-target="#modalFormList"
                    className="btn btn-primary mt-3"
                    onClick={() => openModal("create")}
                  >
                    Crear nuevo formulario
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          aria-modal="true"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <label className="h5">{modalTitle}</label>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body ">
                {/* Título y Cliente */}
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
                      <span className="labelName">{t("formModal.title")}</span>
                    </label>
                  </div>
                  <div className="col-4 mb-3">
                    <label id="labelAnimation">
                      <select
                        className="input-new"
                        value={idClient.input}
                        onChange={(e) => idClient.handleChange(e.target.value)}
                      >
                        <option value="" disabled>
                          Seleccione un cliente
                        </option>
                        {clients.map((client) => (
                          <option key={client.id} value={client.id}>
                            {client.client}
                          </option>
                        ))}
                      </select>
                      <span className="labelName">
                        {t("formModal.client_name")}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Descripción */}
                <div className="row mt-2">
                  <div className="col mb-3">
                    <label id="labelAnimation">
                      <textarea
                        placeholder={t("formModal.description")}
                        className="input-new"
                        name="description"
                        value={description.input}
                        onChange={(e) =>
                          description.handleChange(e.target.value)
                        }
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
                  onClick={closeModal}
                >
                  {t("formModal.Close")}
                </button>
                <button
                  id="saveButton"
                  onClick={saveForm}
                  className="btn btn-primary"
                >
                  {t("formModal.Save")}
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
