const knex = require('../config/db');

class AnswersFormModel {
  constructor() {
    this.knex = knex;
    this.table = 'answers'; // Nombre de la tabla en la base de datos
  }

  async createAnswer(data) {
    if (!data.block_id || !data.question_id || !data.answer) {
      throw new Error('Faltan campos obligatorios');
    }

    try {
      const [id] = await this.knex(this.table).insert({
        block_id: data.block_id,
        question_id: data.question_id,
        answer: data.answer,
      });

      return { id, ...data };
    } catch (error) {
      throw new Error(`Error al crear la respuesta: ${error.message}`);
    }
  }

    async getAnswersByBlockId(blockId) {
        return await this.knex(this.table)
        .where({ block_id: blockId })
        .orderBy('question_id', 'asc');
    }
}