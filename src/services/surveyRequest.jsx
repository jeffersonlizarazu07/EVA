import axios from "axios";
import { smallAlertDelete, Toast, Toast2 } from "../assets/js/alertConfig";

export const getSurveys = async (urlSurveys, config) => {
    try {
      const response = await axios.get(urlSurveys, config);
      console.log(response.data)
      return response.data.data.length;
    } catch (error) {
      console.error("Error fetching surveys:", error);
    }
  };

export const getSurvey = async (id, config, setSurveyData) => {
  try{
    const url = "http://localhost:3000/api/survey/";
    const response = await axios.get(`${url}${id}`, config);
    console.log("*** response completa", response.data);
    setSurveyData(response.data);
  }catch(error){
    console.log('error: ',e)
  }
 
};

export const getSurveyQuestions = async (id, config) => {
  const url = "http://localhost:3000/api/surveys/";
  const response = await axios.get(`${url}${id}/question`, config);
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
      text: `${t("alertDeactivate.InitialPhrase")}${questiontext} ${t(
        "alertDeactivate.FinalPhrase"
      )}`,
      showCancelButton: true,
      confirmButtonText: `${t("alertDeactivate.Confirm")}`,
      cancelButtonText: `${t("alertDeactivate.Cancel")}`,
    })
    .then(async (result) => {
      if (result.isConfirmed) {
        try {
          const url =
            "http://localhost:3000/api/question/";
          const { data } = await axios.delete(`${url}${idquestion}`, config);
          if (data.status) {
            Toast.fire({
              icon: "success",
              title: `${t("la pregunta")} ${questiontext} ${t(
                "ha sido eliminada."
              )}`,
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
      const url = "http://localhost:3000/api/question";
      const response = await axios.post(url, parametros, config);
      if (response.data.status) {
        setLoading(false);
        setError("");
        Toast2.fire({
          icon: "success",
          title: `${t("Pregunta añadida exitosamente.")}`,
        });
        updateSurveyQuestions();
      } else {
        throw new Error(response.data.message || "Error desconocido");
      }
    } else if (metodo.toUpperCase() === "PUT") {
      const url = `http://localhost:3000/api/question/`;
      const response = await axios.put(`${url}${idToEdit}`, parametros, config);
      if (response.data.status) {
        Toast2.fire({
          icon: "success",
          title: `${t("Pregunta editada exitosamente.")}`,
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
