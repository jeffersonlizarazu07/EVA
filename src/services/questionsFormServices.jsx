import axios from 'axios';

const API_URL = 'http://localhost:3000/api/questions';

// Crear preguntas para un bloque
export const createQuestions = (blockId, preguntas) => {
  return axios.post(API_URL, {
    block_id: blockId,
    preguntas,
  }, { withCredentials: true });
};

// Obtener preguntas por ID de bloque
export const getQuestionsByBlockId = (blockId) => {
  return axios.get(`${API_URL}/block/${blockId}`, {
    withCredentials: true,
  });
};