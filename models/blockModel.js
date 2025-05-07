const knex = require('../config/db');

class BlockModel {
  constructor() {
    this.knex = knex;
    this.table = 'form_set';
  }

  async createBlock(data) {
    try {
      const [id] = await this.knex(this.table).insert({
        name: data.name,
        weight: data.weight,
        position: data.position,
        numberQuestions: data.numberQuestions,
        textQuestion: data.textQuestion,
        TypeAnswer: data.TypeAnswer,
        answersByQuestion: data.answersByQuestion, // debe venir serializado si es un array/objeto
      });

      return { id, ...data };
    } catch (error) {
      throw new Error(`Error al crear el bloque: ${error.message}`);
    }
  }

  async getAllBlocks() {
    return await this.knex(this.table).select('*');
  }

  async getBlockById(id) {
    const block = await this.knex(this.table).where({ id }).first();
    if (!block) throw new Error('Bloque no encontrado');
    return block;
  }

  async updateBlock(id, data) {
    await this.knex(this.table).where({ id }).update(data);
    return this.getBlockById(id);
  }

  async deleteBlock(id) {
    const deleted = await this.knex(this.table).where({ id }).del();
    if (!deleted) throw new Error('No se encontró el bloque para eliminar');
    return { success: true };
  }
}

module.exports = new BlockModel();
