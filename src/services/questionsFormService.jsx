import { apiClient } from "../utils/axiosConfig";

const API_URL = "/questions";

// Crear preguntas para un bloque
export const createQuestions = async (blockId, preguntas) => {
  try {
    console.log("Preguntas enviadas:", preguntas);
    const response = await apiClient.post(
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
  return apiClient.get(`${API_URL}/block/${blockId}`, {
    withCredentials: true,
  });
};

export const updateQuestions = async (blockId, preguntas) => {
  try {
    return await apiClient.put(
      `/questions/${blockId}`,
      { preguntas },
      { withCredentials: true }
    );
  } catch (error) {
    console.error("Error al actualizar preguntas:", error);
    throw error;
  }
};
