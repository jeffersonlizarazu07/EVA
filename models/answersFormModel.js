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
    return await this.knex(this.table).select('*');
  }

  async getAnswerById(id) {
    return await this.knex(this.table).where({ id }).first();
  }

  async getAnswersByQuestionId(questionId) {
    return await this.knex(this.table).where({ id_question: questionId });
  }

  async updateAnswer(id, data) {
    await this.knex(this.table).where({ id }).update({
      answer_question: data.answer,
    });
    return this.getAnswerById(id);
  }

  async deleteAnswer(id) {
    return await this.knex(this.table).where({ id }).del();
  }
}

module.exports = new AnswersFormModel();
