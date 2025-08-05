const knex = require("../config/db");

class questionsFormModel {
  constructor() {
    this.knex = knex;
    this.table = "questions_form";
  }

  async createQuestionsForBlock(blockId, questions) {
    try {
      const typeMap = {
        check_opt: 1,
        selector_opt: 2,
        textfield_s: 3,
      };

      const dataToInsert = questions.map((q) => {
        // Obtener opciones desde select_option o array options
        const options = Array.isArray(q.options)
          ? q.options.map((opt) => (typeof opt === "object" ? opt.text : opt))
          : typeof q.select_option === "string"
            ? q.select_option.split(",").map((opt) => opt.trim())
            : [];

        const selected = q.selected_answer;
        let selectedAnswerIndex = "";

        if (Array.isArray(selected)) {
          selectedAnswerIndex = selected
            .map((ans) => options.indexOf(ans))
            .filter((idx) => idx !== -1)
            .join(",");
        } else if (typeof selected === "string") {
          const selectedArray = selected.split(",").map((s) => s.trim());
          selectedAnswerIndex = selectedArray
            .map((ans) => options.indexOf(ans))
            .filter((idx) => idx !== -1)
            .join(",");
        }

        return {
          question_name: q.question_name || q.text || "Sin texto",
          type_error: q.type_error,
          id_type_question: typeMap[q.id_type_question] || typeMap[q.type] || null,
          select_option: options.join(","), // Guardamos ya limpio
          selected_answer: selectedAnswerIndex,
          conditional: q.conditional || "NO",
          id_conditional: q.id_conditional || null,
          conditional_answer: q.conditional_answer ?? "",
          block_id: blockId,
        };
      });

      console.log("Insertando preguntas:", dataToInsert);

      await this.knex(this.table).insert(dataToInsert);

      const insertedQuestions = await this.knex(this.table)
        .select("id")
        .where({ block_id: blockId })
        .orderBy("id");

      const ids = insertedQuestions.map((q) => q.id);
      console.log("IDs insertados:", ids);
      return ids;
    } catch (error) {
      console.error("Error al crear la respuesta:", error);
      throw new Error(
        "No se pudo crear la respuesta debido a un error en el servidor. " + error.message
      );
    }
  }

  async updateQuestionsForBlock(blockId, questions) {
    const trx = await this.knex.transaction();

    try {
      await trx(this.table).where({ block_id: blockId }).del();

      if (questions && questions.length > 0) {
        const typeMap = {
          check_opt: 1,
          selector_opt: 2,
          textfield_s: 3,
        };

        const dataToInsert = questions.map((q) => {
          // Obtener las opciones desde select_option (vienen como string)
          const options = typeof q.select_option === "string"
            ? q.select_option.split(",")
            : [];

          const selected = q.selected_answer;
          let selectedAnswerIndex = "";

          if (Array.isArray(selected)) {
            // Este caso es raro si selected_answer viene como string
            selectedAnswerIndex = selected
              .map((ans) => options.indexOf(ans))
              .filter((idx) => idx !== -1)
              .join(",");
          } else if (typeof selected === "string") {
            const selectedArray = selected.split(",").map((s) => s.trim());

            selectedAnswerIndex = selectedArray
              .map((ans) => options.indexOf(ans))
              .filter((idx) => idx !== -1)
              .join(",");
          }

          return {
            question_name: q.question_name || q.text || "Sin texto",
            type_error: q.type_error,
            id_type_question: typeMap[q.id_type_question] || typeMap[q.type] || null,
            select_option: q.select_option || "",
            selected_answer: selectedAnswerIndex,
            conditional: q.conditional || "NO",
            id_conditional: q.id_conditional || null,
            conditional_answer: q.conditional_answer ?? "",
            block_id: blockId,
          };
        });

        console.log("Datos a insertar:", dataToInsert);
        await trx(this.table).insert(dataToInsert);
        console.log("Nuevas preguntas insertadas");
      }

      await trx.commit();
      console.log("Actualización de preguntas completada exitosamente");
    } catch (error) {
      await trx.rollback();
      console.error("Error en la actualización, transacción revertida:", error);
      throw error;
    }
  }

  async getQuestionsByBlockId(blockId) {
    try {
      return await this.knex(this.table)
        .where({ block_id: blockId })
        .orderBy("id");
    } catch (error) {
      throw new Error(
        `Error al obtener preguntas por ID de bloque: ${error.message}`
      );
    }
  }
}

module.exports = new questionsFormModel();
