const knex = require('../config/db');
const BlockModel = require('../models/blockModel');
const QuestionModel = require('../models/questionsFormModel');
const BlockDTO = require('../dtos/blockDTO');

// Crear bloque
exports.createBlock = async (req, res) => {
  
  const validarBlock = await BlockDTO.validateBlock(req.body);        
  if(!validarBlock.status){
    return res.status(400).json(validarBlock);
  }

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

// Obtener todos los bloques
exports.getAllBlocks = async (req, res) => {
  try {
    const blocks = await BlockModel.getAllBlocks();
    res.json(blocks);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener bloques', error: error.message });
  }
};

// Obtener bloques por el ID del formulario
exports.getBlocksByFormId = async (req, res) => {
  
  const idValidation = BlockDTO.validarId(req.params.formId);
  if (!idValidation.status) {
    return res.status(400).json(idValidation);
  }

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

// Obtener un bloque por ID
exports.getBlockById = async (req, res) => {
   const idValidation = BlockDTO.validarId(req.params.id);
  if (!idValidation.status) {
    return res.status(400).json(idValidation);
  }

  try {
    const block = await BlockModel.getBlockById(req.params.id);
    res.json(block);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Actualizar un bloque por ID
exports.updateBlock = async (req, res) => {
  
  const validarBlock = await BlockDTO.validateBlockUpdate(req.body);        
  if(!validarBlock.status){
    return res.status(400).json(validarBlock);
  }

  const idValidation = BlockDTO.validarId(req.params.id);
  if (!idValidation.status) {
    return res.status(400).json(idValidation);
  }

  try {
    const updatedBlock = await BlockModel.updateBlock(req.params.id, req.body);
    res.json({ message: 'Bloque actualizado', data: updatedBlock });
  } catch (error) {
    console.error("Error en updateBlock:", error);
    res.status(500).json({ message: 'Error al actualizar bloque', error: error.message });
  }
};

// Eliminar un bloque por id
exports.deleteBlock = async (req, res) => {

   const idValidation = BlockDTO.validarId(req.params.id);
  if (!idValidation.status) {
    return res.status(400).json(idValidation);
  }

  try {
    const result = await BlockModel.deleteBlock(req.params.id);
    res.json({ message: 'Bloque eliminado', ...result });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar bloque', error: error.message });
  }
};
