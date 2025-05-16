const knex = require("../config/db");

class BlockModel {
  constructor() {
    this.knex = knex;
    this.table = "blocks"; // Nombre de la tabla en la base de datos
  }

  async createBlock(data) {
    if (
      !data.form_id ||
      !data.nombreBloque ||
      !data.ponderacion ||
      !data.position
    ) {
      throw new Error("Faltan campos obligatorios");
    }
    try {
      const [id] = await this.knex(this.table).insert({
        form_id: data.form_id,
        block_name: data.nombreBloque,
        percentage: data.ponderacion,
        block_location: data.position,
        // Campos adicionales
        // question: data.question || null,
        // preguntas: JSON.stringify(data.preguntas || []),
        // select_option: data.select_option || "",
        // selected_answer: data.selected_answer || "",
        // type: data.type || "",
        // conditional: data.conditional || "NO",
        // survey_id: data.survey_id || null,
        // frm_option: data.frm_option || "",
        // id_conditional: data.id_conditional || null,
        // conditional_answer: data.conditional_answer || "",
      });

      return { id, ...data };
    } catch (error) {
      throw new Error(`Error al crear el bloque: ${error.message}`);
    }
  }

  async getAllBlocks() {
    return await this.knex(this.table).select("*");
  }

  async getBlocksByFormId(formId) {
    return await this.knex(this.table)
      .where({ form_id: formId })
      .orderBy("block_location", "asc");
  }

  async getBlockById(id) {
    const block = await this.knex(this.table).where({ id }).first();
    if (!block) throw new Error("Bloque no encontrado");
    return block;
  }

  async updateBlock(id, data) {
    await this.knex(this.table).where({ id }).update(data);
    return this.getBlockById(id);
  }

  async deleteBlock(id) {
    const deleted = await this.knex(this.table).where({ id }).del();
    if (!deleted) throw new Error("No se encontró el bloque para eliminar");
    return { success: true };
  }
}

module.exports = new BlockModel();
