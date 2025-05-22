const knex = require('../config/db');
const BlockModel = require('../models/blockModel');
const QuestionModel = require('../models/questionsFormModel');

exports.createBlock = async (req, res) => {
  console.log("Datos recibidos en backend:", req.body);
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

exports.getAllBlocks = async (req, res) => {
  try {
    const blocks = await BlockModel.getAllBlocks();
    res.json(blocks);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener bloques', error: error.message });
  }
};

exports.getBlocksByFormId = async (req, res) => {
  const { formId } = req.params;
  try {
    const blocks = await BlockModel.getBlocksByFormId(formId);

    // Enriquecer cada bloque con sus preguntas
    const enrichedBlocks = await Promise.all(
      blocks.map(async (block) => {
        const preguntas = await QuestionModel.getQuestionsByBlockId(block.id);
        return {
          ...block,
          preguntas, // se agrega el array
        };
      })
    );

    res.json({ data: enrichedBlocks });
  } catch (error) {
    console.error("Error al obtener bloques con preguntas:", error.message, error.stack);
    res.status(500).json({ message: "Error al obtener bloques" });
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
    console.log("Datos recibidos para actualizar:", req.body);
    const updatedBlock = await BlockModel.updateBlock(req.params.id, req.body);
    res.json({ message: 'Bloque actualizado', data: updatedBlock });
  } catch (error) {
    console.error("Error en updateBlock:", error);
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

