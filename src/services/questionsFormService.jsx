import axios from "axios";

const API_URL = "http://localhost:3000/api/questions";

// Crear preguntas para un bloque
export const createQuestions = async (blockId, preguntas) => {
  try {
    console.log("Preguntas enviadas:", preguntas);
    const response = await axios.post(
      `${API_URL}`,
      {
        block_id: blockId,
        preguntas,
      },
      { withCredentials: true }
    );

    const questionIds = response.data.questionIds;

    if (!Array.isArray(questionIds)) {
      throw new Error("No se recibieron los IDs de las preguntas.");
    }

    return questionIds;
  } catch (error) {
    console.error("Error al crear preguntas:", error);
    throw error;
  }
};

// Obtener preguntas por ID de bloque
export const getQuestionsByBlockId = (blockId) => {
  return axios.get(`${API_URL}/block/${blockId}`, {
    withCredentials: true,
  });
};

export const updateQuestions = async (blockId, preguntas) => {
  try {
    return await axios.put(
      `http://localhost:3000/api/questions/${blockId}`,
      { preguntas },
      { withCredentials: true }
    );
  } catch (error) {
    console.error("Error al actualizar preguntas:", error);
    throw error;
  }
};
