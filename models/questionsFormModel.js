const knex = require("../config/db");

class questionsFormModel {
  constructor() {
    this.knex = knex;
    this.table = "questions_form";
  }

  async createQuestionsForBlock(blockId, questions) {
    const typeMap = {
      check_opt: 1,
      selector_opt: 2,
      textfield_s: 3,
      // radio_opt: 4,
      // yes_no: 5,
    };

    const dataToInsert = questions.map((q) => ({
      question_name: q.question_name || q.text || "Sin texto",
      id_type_question: typeMap[q.id_type_question] || typeMap[q.type] || null,
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

    await this.knex(this.table).insert(dataToInsert);

    // Recuperar los IDs insertados
    const insertedQuestions = await this.knex(this.table)
      .select("id")
      .where({ block_id: blockId })
      .orderBy("id");

    const ids = insertedQuestions.map((q) => q.id);
    console.log("IDs insertados:", ids);
    return ids;
  }

  async updateQuestionsForBlock(blockId, questions) {
    console.log("Actualizando preguntas para bloque:", blockId);
    console.log("Preguntas recibidas:", questions);

    // Iniciar transacción para asegurar consistencia
    const trx = await this.knex.transaction();

    try {
      // 1. Eliminar preguntas existentes del bloque
      await trx(this.table).where({ block_id: blockId }).del();
      console.log("Preguntas anteriores eliminadas");

      // 2. Si hay nuevas preguntas, insertarlas
      if (questions && questions.length > 0) {
        const typeMap = {
          check_opt: 1,
          selector_opt: 2,
          textfield_s: 3,
        };

        const dataToInsert = questions.map((q) => ({
          question_name: q.question_name || q.text || "Sin texto",
          id_type_question:
            typeMap[q.id_type_question] || typeMap[q.type] || null,
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

        console.log("Datos a insertar:", dataToInsert);
        await trx(this.table).insert(dataToInsert);
        console.log("Nuevas preguntas insertadas");
      }

      // Confirmar transacción
      await trx.commit();
      console.log("Actualización de preguntas completada exitosamente");
    } catch (error) {
      // Revertir cambios si hay error
      await trx.rollback();
      console.error("Error en la actualización, transacción revertida:", error);
      throw error;
    }
  }

  async getQuestionsByBlockId(blockId) {
    return await this.knex(this.table)
      .where({ block_id: blockId })
      .orderBy("id");
  }
}

module.exports = new questionsFormModel();
