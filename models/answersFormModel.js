const { getDateTimeForSQL } = require("../helpers/dateHelper");

class AnswersFormModel {
  constructor() {
    this.knex = require('../config/db');
    this.table = 'answers_form';
    this.table_ = 'monitoring';
  }

  async saveMonitoringAndAnswers(data) {
    const {
      monitoringDate,
      id_user_monitor,
      id_user_agent,
      id_form,
      score,
      feedback,
      answers,
    } = data;

    const fecha = monitoringDate || getDateTimeForSQL();

    // Transacción para que todo se guarde o nada
    return await this.knex.transaction(async (trx) => {
     const monitoringId = await trx('monitoring').insert({
        date: fecha,
        score,
        feedback,
        id_user_agent,
        id_user_monitor,
        id_form,
      });

      // Insertar todas las respuestas relacionadas
      const answersToInsert = answers.map((ans) => ({
        question_id: ans.question_id,
        idUser: id_user_agent,
        answer: ans.answer_question,
        date: fecha
      }));

      await trx('answers_form').insert(answersToInsert);

      return { monitoringId, answersCount: answers.length };
    });
  }


  async createMonitoring(data) {
    // data: { date, score, feedback, id_user_agent, id_user_monitor, id_form }
    const [id] = await this.knex(this.table_).insert({
      date: data.date,
      score: data.score,
      feedback: data.feedback,
      check: 0,
      id_user_agent: data.id_user_agent,
      id_user_monitor: data.id_user_monitor,
      id_form: data.id_form,
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
      return await this.knex(this.table).where({ question_id: questionId });
    }catch(error) {
      console.error('Error al obtener respuestas por ID de pregunta:', error);
      throw new Error('No se pudieron obtener las respuestas debido a un error en el servidor.' + error.message);
    }
  }

  async updateAnswer(id, data) {
    try {
    await this.knex(this.table).where({ id }).update({
      answer: data.answer,
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