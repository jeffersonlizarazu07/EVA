const knex = require("../config/db");

class questionsFormModel {
  constructor() {
    this.knex = knex;
    this.table = "questions_form";
  }

  async createQuestionsForBlock(blockId, questions) {
    const typeMap = {
      radio_opt: 1,
      selector_opt: 2,
      textfield_s: 3,
    };

    const dataToInsert = questions.map((q) => ({
      question_name: q.text || "Sin texto",
      id_type_question: typeMap[q.type] || null,
      conditional: q.conditional || "NO",
      id_conditional: q.id_conditional || null,
      conditional_answer: q.conditional_answer ?? "",
      select_option:
        q.select_option ||
        (Array.isArray(q.options)
          ? q.options
              .map((opt) => (typeof opt === "object" ? opt.text : opt))
              .join(",")
          : ""),
      block_id: blockId,
    }));

    console.log("Insertando preguntas:", dataToInsert);

    await this.knex(this.table).insert(dataToInsert); // Insertamos sin esperar IDs

    // 🔍 Recuperamos los IDs insertados filtrando por block_id
    const insertedQuestions = await this.knex(this.table)
      .select("id")
      .where({ block_id: blockId })
      .orderBy("id");

    const ids = insertedQuestions.map((q) => q.id);

    console.log("✅ IDs insertados:", ids);
    return ids;
  }

  async updateQuestionsForBlock(blockId, questions) {
    await this.knex(this.table).where({ block_id: blockId }).del();
    await this.createQuestionsForBlock(blockId, questions); // Reutilizamos la lógica
  }

  async getQuestionsByBlockId(blockId) {
    return await this.knex(this.table)
      .where({ block_id: blockId })
      .orderBy("id");
  }
}

module.exports = new questionsFormModel();
