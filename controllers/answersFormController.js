const knex = require('../config/db');
const AnswersFormModel = require('../models/answersFormModel');

exports.createAnswer = async (req, res) => {
  try {
    const { question_id, answer_question } = req.body;

    console.log("🟡 Respuesta recibida en backend:", req.body);

    if (!question_id || !answer_question) {
      console.log("🔴 Faltan campos");
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const result = await AnswersFormModel.createAnswer({ question_id, answer_question });

    console.log("🟢 Respuesta guardada en DB:", result);

    res.status(201).json(result);
  } catch (error) {
    console.error('❌ Error en createAnswer:', error);
    res.status(500).json({ message: 'Error al guardar la respuesta' });
  }
};
exports.getAllAnswers = async (req, res) => {
    try {
        const answers = await AnswersFormModel.getAllAnswers();
        res.json(answers);
    } catch (error) {
        console.error('Error al obtener todas las respuestas:', error.message);
        res.status(500).json({ message: 'Error al obtener respuestas' });
    }
};

exports.getAnswerById = async (req, res) => {
    const { id } = req.params;
    try {
        const answer = await AnswersFormModel.getAnswerById(id);
        
        if (!answer) {
            return res.status(404).json({ message: 'Respuesta no encontrada' });
        }
        
        res.json(answer);
    } catch (error) {
        console.error('Error al obtener respuesta por ID:', error.message);
        res.status(500).json({ message: 'Error al obtener respuesta' });
    }
}

exports.getAnswersByBlockId = async (req, res) => {
    const { blockId } = req.params;
    try {
        const answers = await AnswersFormModel.getAnswersByBlockId(blockId);
        res.json(answers);
    } catch (error) {
        console.error('Error al obtener respuestas por bloque:', error.message, error.stack);
        res.status(500).json({ message: 'Error al obtener respuestas' });
    }
};

exports.getAnswersByQuestionId = async (req, res) => {
    const { questionId } = req.params;
    try {
        const answers = await AnswersFormModel.getAnswersByQuestionId(questionId);
        res.json(answers);
    } catch (error) {
        console.error('Error al obtener respuestas por pregunta:', error.message);
        res.status(500).json({ message: 'Error al obtener respuestas' });
    }
};

exports.getAnswersByQuestionAndBlockId = async (req, res) => {
    const { questionId, blockId } = req.params;
    try {
        const answer = await AnswersFormModel.getAnswersByQuestionAndBlockId(questionId, blockId);
        if (!answer) {
            return res.status(404).json({ message: 'Respuesta no encontrada' });
        }
        res.json(answer);
    } catch (error) {
        console.error('Error al obtener respuesta específica:', error.message);
        res.status(500).json({ message: 'Error al obtener respuesta' });
    }
};

exports.updateAnswer = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    
    try {
        // Verificar si la respuesta existe
        const existingAnswers = await knex('answers').where({ id }).first();
        
        if (!existingAnswers) {
            return res.status(404).json({ message: 'Respuesta no encontrada' });
        }
        
        // Actualizar la respuesta
        const updatedAnswer = await AnswersFormModel.updateAnswer(id, data);
        res.json(updatedAnswer);
    } catch (error) {
        console.error('Error al actualizar respuesta:', error.message);
        res.status(500).json({ message: 'Error al actualizar respuesta' });
    }
};

exports.deleteAnswer = async (req, res) => {
    const { id } = req.params;
    
    try {
        const deleted = await AnswersFormModel.deleteAnswer(id);
        
        if (!deleted) {
            return res.status(404).json({ message: 'Respuesta no encontrada' });
        }
        
        res.json({ message: 'Respuesta eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar respuesta:', error.message);
        res.status(500).json({ message: 'Error al eliminar respuesta' });
    }
};