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
  const url = "http://localhost:8000/api/surveys/";
  const response = await axios.get(`${url}${id}`, config);
  setSurveyData(response.data);
};

export const getSurveyQuestions = async (id, config) => {
  const url = "http://localhost:8000/api/surveys/";
  const response = await axios.get(`${url}${id}/question`, config);
  const responseData = response.data.data;
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
            "http://localhost:8000/api/question/";
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
    if (metodo.toUpperCase() === "POST") {
      const handleCreateQuestion = async () => {
        setLoading(true);
        try {
          const url =
            "http://localhost:8000/api/question";
          const response = await axios.post(url, parametros, config);
          const responseData = response.data;
          console.log("Respuesta solicitud Post:", responseData);
          if (responseData.status) {
            setLoading(false);
            setError("");
            document.getElementById("btnClose").click();
            Toast2.fire({
              icon: "success",
              title: `${t("Pregunta añadida exitosamente.")}`,
            });
            updateSurveyQuestions();
          }
        } catch (error) {
          console.error(error);
        }
      };
      handleCreateQuestion();
    } else if (metodo.toUpperCase() === "PUT") {
      const url = `http://localhost:8000/api/question/`;
      const response = await axios.put(
        `${url}${idToEdit}`,
        parametros,
        config
      );
      const responseData = response.data;
      console.log(responseData);
      if (responseData.status) {
        Toast2.fire({
          icon: "success",
          title: `${t("Pregunta editada exitosamente.")}`,
        });
        updateSurveyQuestions();
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
