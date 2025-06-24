const knex = require("../config/db");

class BlockModel {
  constructor() {
    this.knex = knex;
    this.table = "blocks"; // Nombre de la tabla en la base de datos
  }

  async createBlock(data) {
  if (
    data.form_id == null ||
    data.nombreBloque == null ||
    data.ponderacion == null
  ) {
    throw new Error("Faltan campos obligatorios");
  }

  // Calcular la posición automáticamente si no viene
  if (data.position == null || data.position === '' || data.position === 0) {
    const maxPos = await this.knex(this.table)
      .where({ form_id: data.form_id })
      .max("block_location as max")
      .first();

    data.position = (maxPos?.max || 0) + 1;
  }

  try {
    const [id] = await this.knex(this.table).insert({
      form_id: data.form_id,
      block_name: data.nombreBloque,
      percentage: data.ponderacion,
      block_location: data.position,
    });

    return { id, ...data };
  } catch (error) {
    throw new Error(`Error al crear el bloque: ${error.message}`);
  }
}

  async getAllBlocks() {
    try {
      return await this.knex(this.table).select("*");
    } catch (error) {
      throw new Error(`Error al obtener los bloques: ${error.message}`);
    }  
  }

  async getBlocksByFormId(formId) {
    try{
      return await this.knex(this.table)
        .where({ form_id: formId })
        .orderBy("block_location", "asc");
    }catch (error) {
      throw new Error(`Error al obtener los bloques por ID de formulario: ${error.message}`);
    }
  }

  async getBlockById(id) {
    try {
      const block = await this.knex(this.table).where({ id }).first();
      //if (!block) throw new Error("Bloque no encontrado");
      return block;
    }catch (error) {
      throw new Error(`Error al obtener el bloque por ID: ${error.message}`);
    }
  }

  async updateBlock(id, data) {
    try{
      await this.knex(this.table).where({ id }).update(data);
      return this.getBlockById(id);
    }catch (error) {
      throw new Error(`Error al actualizar el bloque: ${error.message}`);
    }
  }

  async deleteBlock(id) {
    try{
      const deleted = await this.knex(this.table).where({ id }).del();
      if (!deleted) throw new Error("No se encontró el bloque para eliminar");
      return { success: true };
    }catch (error) {
      throw new Error(`Error al eliminar el bloque: ${error.message}`);
    }
  }
}

module.exports = new BlockModel();
