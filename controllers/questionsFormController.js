const QuestionModel = require("../models/questionsFormModel");
const QuestionFormsDTO = require("../dtos/questionFormsDTO") 

const createQuestions = async (req, res) => {

  const validateQuestionsForm = await QuestionFormsDTO.validateQuestionForm(req.body);
  if(!validateQuestionsForm.status){
    return res.status(400).json(validateQuestionsForm);
  }

  try {
    console.log("Preguntas recibidas:", req.body);
    const { block_id, preguntas } = req.body;

    if (!block_id || !Array.isArray(preguntas)) {
      return res.status(400).json({ message: "Datos inválidos" });
    }

    const ids = await QuestionModel.createQuestionsForBlock(
      block_id,
      preguntas
    );

    console.log("🟢 IDs generados de preguntas:", ids);
    return res.status(201).json({ questionIds: ids });
  } catch (error) {
    console.error("Error al guardar preguntas:", error);
    return res.status(500).json({ message: "Error al guardar preguntas" });
  }
};

const updateQuestionsForBlock = async (req, res) => {
  
  // const idValidation = QuestionFormsDTO.validarId(req.params.blockId);
  // if (!idValidation.status) {
  //   return res.status(400).json(idValidation);
  // }

  // const validateQuestionsForm = await QuestionFormsDTO.validateQuestionForm(req.body);
  // if(!validateQuestionsForm.status){
  //   return res.status(400).json(validateQuestionsForm);
  // }

  const { blockId } = req.params;
  const { preguntas } = req.body;

  if (!blockId || !Array.isArray(preguntas)) {
    return res.status(400).json({ message: "Datos inválidos" });
  }

  try {
    await QuestionModel.updateQuestionsForBlock(blockId, preguntas);
    res.status(200).json({ message: "Preguntas actualizadas correctamente" });
  } catch (error) {
    console.error("Error al actualizar preguntas:", error);
    res.status(500).json({ message: "Error al actualizar preguntas" });
  }
};

const getQuestionsByBlockId = async (req, res) => {
  const idValidation = QuestionFormsDTO.validarId(req.params.blockId);
  if (!idValidation.status) {
    return res.status(400).json(idValidation);
  }

  try {
    const questions = await QuestionModel.getQuestionsByBlockId(
      req.params.blockId
    );
    res.status(200).json({ data: questions });
  } catch (error) {
    console.error("Error al obtener preguntas:", error);
    res.status(500).json({ message: "Error al obtener preguntas" });
  }
};

module.exports = {
  createQuestions,
  updateQuestionsForBlock,
  getQuestionsByBlockId,
};
