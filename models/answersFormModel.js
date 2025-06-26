class AnswersFormModel {
  constructor() {
    this.knex = require('../config/db');
    this.table = 'answers'; // tu tabla
  }

  async createAnswer(data) {
    
  const [id] = await this.knex(this.table).insert({
    question_id: data.question_id,
    answer_question: data.answer_question,
  });
  return { id, ...data };
}

  async getAllAnswers() {
    try {
      return await this.knex(this.table).select('*');
    } catch (error) {
      console.error('Error al obtener las respuestas:', error);
      throw new Error('No se pudieron obtener las respuestas debido a un error en el servidor.' + error.message);
    }
  }

  async getAnswerById(id) {
    try {
      if (!id) {
        throw new Error('ID de respuesta no proporcionado');
      }
      return await this.knex(this.table).where({ id }).first();
    }catch (error) {
      console.error('Error al obtener la respuesta por ID:', error);
      throw new Error('No se pudo obtener la respuesta debido a un error en el servidor.' + error.message);
    } 
    
  }

  async getAnswersByQuestionId(questionId) {
    try {
      return await this.knex(this.table).where({ id_question: questionId });
    }catch(error) {
      console.error('Error al obtener respuestas por ID de pregunta:', error);
      throw new Error('No se pudieron obtener las respuestas debido a un error en el servidor.' + error.message);
    }
  }

  async updateAnswer(id, data) {
    try {
    await this.knex(this.table).where({ id }).update({
      answer_question: data.answer,
    });
      return this.getAnswerById(id);
    } catch (error) {
      console.error('Error al actualizar la respuesta:', error);
      throw new Error('No se pudo actualizar la respuesta debido a un error en el servidor.' + error.message);
    }
  }

  async deleteAnswer(id) {
    try {
      return await this.knex(this.table).where({ id }).del();
    } catch (error) {
      console.error('Error al eliminar la respuesta:', error);
      throw new Error('No se pudo eliminar la respuesta debido a un error en el servidor.' + error.message);
    }
  }
}

module.exports = new AnswersFormModel();