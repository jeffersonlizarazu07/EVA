const BlockModel = require('../models/blockModel');

exports.createBlock = async (req, res) => {
  console.log("📥 Datos recibidos en backend:", req.body);
  try {
    const data = req.body;

    const formattedData = {
      form_id: data.form_id || data.survey_idt, // por si llega con nombre incorrecto
      nombreBloque: data.nombreBloque,
      ponderacion: data.ponderacion,
      position: data.posicion || data.position, // soporte para nombre alternativo
    };

    const result = await BlockModel.createBlock(formattedData);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error en createBlock:", error);
    res.status(400).json({ message: error.message });
  }
};

exports.getBlocksByFormId = async (req, res) => {
  const { formId } = req.params;
  try {
    const blocks = await BlockModel.getBlocksByFormId(formId);
    res.json({ data: blocks });
  } catch (error) {
    console.error("Error al obtener bloques por formId:", error);
    res.status(500).json({ message: "Error al obtener bloques por formulario" });
  }
};

exports.getAllBlocks = async (req, res) => {
  try {
    const blocks = await BlockModel.getAllBlocks();
    res.json(blocks);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener bloques', error: error.message });
  }
};

exports.getBlockById = async (req, res) => {
  try {
    const block = await BlockModel.getBlockById(req.params.id);
    res.json(block);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.updateBlock = async (req, res) => {
  try {
    const updatedBlock = await BlockModel.updateBlock(req.params.id, req.body);
    res.json({ message: 'Bloque actualizado', data: updatedBlock });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar bloque', error: error.message });
  }
};

exports.deleteBlock = async (req, res) => {
  try {
    const result = await BlockModel.deleteBlock(req.params.id);
    res.json({ message: 'Bloque eliminado', ...result });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar bloque', error: error.message });
  }
};
