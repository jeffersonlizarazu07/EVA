import axios from 'axios';

const API_URL = 'http://localhost:3000/api/answers'; // Ruta de respuestas de formularios

class AnswersFormService {
  // Obtener todas las respuestas
  async getAllAnswers() {
    try {
      const response = await axios.get(`${API_URL}/answers`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener todas las respuestas:', error);
      throw error;
    }
  }

  // Obtener una respuesta específica por ID
  async getAnswerById(id) {
    try {
      const response = await axios.get(`${API_URL}/answers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener la respuesta con ID ${id}:`, error);
      throw error;
    }
  }

  // Obtener respuestas por ID de bloque
  async getAnswersByBlockId(blockId) {
    try {
      const response = await axios.get(`${API_URL}/answers/block/${blockId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener respuestas para el bloque ${blockId}:`, error);
      throw error;
    }
  }

  // Obtener respuestas por ID de pregunta
  async getAnswersByQuestionId(questionId) {
    try {
      const response = await axios.get(`${API_URL}/answers/question/${questionId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener respuestas para la pregunta ${questionId}:`, error);
      throw error;
    }
  }

  // Obtener respuesta por ID de pregunta y bloque
  async getAnswerByQuestionAndBlockId(questionId, blockId) {
    try {
      const response = await axios.get(`${API_URL}/answers/question/${questionId}/block/${blockId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener respuesta para pregunta ${questionId} y bloque ${blockId}:`, error);
      throw error;
    }
  }

  // Crear una nueva respuesta
  async createAnswer(answerData) {
    try {
      const response = await axios.post(`${API_URL}`, answerData);
      return response.data;
    } catch (error) {
      console.error('Error al crear la respuesta:', error);
      throw error;
    }
  }

  // Actualizar una respuesta existente
  async updateAnswer(id, answerData) {
    try {
      const response = await axios.put(`${API_URL}/answers/${id}`, answerData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar la respuesta con ID ${id}:`, error);
      throw error;
    }
  }

  // Eliminar una respuesta
  async deleteAnswer(id) {
    try {
      const response = await axios.delete(`${API_URL}/answers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar la respuesta con ID ${id}:`, error);
      throw error;
    }
  }
}

export default new AnswersFormService();