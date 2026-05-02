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

        let selectedAnswerIndex = "";
        if (typeof q.selected_answer === "string" || typeof q.selected_answer === "number") {
          selectedAnswerIndex = String(q.selected_answer);
        } else if (Array.isArray(q.selected_answer)) {
          selectedAnswerIndex = q.selected_answer.map(String).join(",");
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
      // ids existentes en el bloque
      const existing = await trx(this.table).where({ block_id: blockId }).select("id");
      const existingIds = existing.map(r => r.id);
      const incomingIds = questions.map(q => q.id).filter(Boolean);

      // borrar las que ya no vienen
      const toDelete = existingIds.filter(id => !incomingIds.includes(id));
      if (toDelete.length) {
        await trx(this.table).whereIn("id", toDelete).del();
      }

      
      const typeMap = {
        check_opt: 1,
        selector_opt: 2,
        textfield_s: 3,
      };

      for (const q of questions) {
        
        let selectedAnswerIndex = "";
        if (typeof q.selected_answer === "string" || typeof q.selected_answer === "number") {
          selectedAnswerIndex = String(q.selected_answer);
        } else if (Array.isArray(q.selected_answer)) {
          selectedAnswerIndex = q.selected_answer.map(String).join(",");
        }

        // --- resolver id_type_question ---
        let idType = null;

        // si viene numérico o string-numérico: úsalo
        if (q.id_type_question != null && !Number.isNaN(Number(q.id_type_question))) {
          idType = Number(q.id_type_question);
        } else {
          // si viene como clave string (selector_opt, etc): mapear
          idType = typeMap[q.id_type_question] || typeMap[q.type] || null;
        }

        if (!idType) {
          throw new Error(
            `id_type_question inválido para la pregunta "${q.question_name}". Recibido: ${q.id_type_question}`
          );
        }

        const data = {
          question_name: q.question_name || q.text || "Sin texto",
          type_error: q.type_error,                
          id_type_question: idType,                 
          select_option: q.select_option || "",
          selected_answer: selectedAnswerIndex,
          conditional: q.conditional || "NO",
          id_conditional: q.id_conditional || null,
          conditional_answer: q.conditional_answer ?? "",
          block_id: blockId,
        };

        if (q.id && existingIds.includes(q.id)) {
          await trx(this.table).where({ id: q.id }).update(data);
        } else {
          await trx(this.table).insert(data);
        }
      }

      await trx.commit();
      console.log("Preguntas actualizadas sin perder respuestas");
    } catch (error) {
      await trx.rollback();
      console.error("Error en la actualización:", error);
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
