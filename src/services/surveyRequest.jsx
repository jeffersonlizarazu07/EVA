import { apiClient } from "../utils/axiosConfig";
import { smallAlertDelete, Toast, Toast2 } from "../assets/js/alertConfig";

export const getSurveys = async (urlSurveys, config) => {
    try {
      const response = await apiClient.get(urlSurveys.replace('http://localhost:3000/api',''), config);
      console.log("*ñññ*",response.data)
      return response.data.data.length;
    } catch (error) {
      console.error("Error fetching surveys:", error);
    }
  };

export const getSurvey = async (id, config, setSurveyData) => {
  try{
    const response = await apiClient.get(`/survey/${id}`, config);
    console.log("*** response completa", response.data);
    setSurveyData(response.data);
  }catch(error){
    console.log('error: ',error)
  }
};

export const getSurveyQuestions = async (id, config) => {
  const response = await apiClient.get(`/surveys/${id}/question`, config);
  const responseData = response.data.data;
  console.log("Preguntas de la encuesta:", responseData);

  return responseData;
};

export const deleteQuestion = async (
  questiondetails,
  config,
  updateSurveyQuestions,
  t
) => {
  const questiontext = questiondetails.question;
  const idquestion = questiondetails.id;

  smallAlertDelete
    .fire({
      title: t("alertDelete.titulo_eliminar"),
      icon: "warning",
      toast: false,
      text: (t("alertDelete.texto_eliminar")) +`"${questiontext}"`, 
      showCancelButton: true,
      confirmButtonText: `${t("alertDeactivate.Confirm")}`,
      cancelButtonText: `${t("alertDeactivate.Cancel")}`,
      confirmButtonColor: "#b62a8b",
      customClass :{
        actions: 'swal2-actions-center ', 
        icon: 'icono-personalizado',
        title: 'titulo-pequeno',
      },
    })
    .then(async (result) => {
      if (result.isConfirmed) {
        try {
          const url =
            "http://localhost:3000/api/question/";
          const { data } = await apiClient.delete(`${url}${idquestion}`, config);
          if (data.status) {
            Toast.fire({
              icon: "success",
              title: (t("alertDelete.la_pregunta")) + ` ${questiontext}` + t("alertDelete.ha_sido_eliminada"),
            });
            updateSurveyQuestions();
          }
        } catch (error) {
          alert("error", "Error al eliminar pregunta");
          console.error(error);
        }
      }
    });
};

export const sendData = async (
  metodo,
  parametros,
  config,
  idToEdit,
  setLoading,
  setError,
  updateSurveyQuestions,
  t
) => {
  try {
    setLoading(true);
    if (metodo.toUpperCase() === "POST") {
      const url = `/question`;
      const response = await apiClient.post(url, parametros, config);
      if (response.data.status) {
        setLoading(false);
        setError("");
        Toast2.fire({
          icon: "success",
          title: `${t("alerts.añadir_pregunta")}`,
        });
        updateSurveyQuestions();
      } else {
        throw new Error(response.data.message || "Error desconocido");
      }
    } else if (metodo.toUpperCase() === "PUT") {
      const url = `/question/`;
      const response = await apiClient.put(`${url}${idToEdit}`, parametros, config);
      if (response.data.status) {
        Toast2.fire({
          icon: "success",
          title: `${t("alertEdit.pregunta_editada")}`,
        });
        updateSurveyQuestions();
      } else {
        throw new Error(response.data.message || "Error desconocido");
      }
    }
  } catch (error) {
    console.error("Error:", error);
    setError(error.message || "Ha ocurrido un error.");
    setLoading(false);
    // Aquí puedes agregar un mensaje más claro para el usuario
    alert("Hubo un problema con el servidor. Intenta nuevamente más tarde.");
  }
};
