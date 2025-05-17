const knex = require('../config/db');
const AnswersFormModel = require('../models/answersFormModel');
const BlockModel = require('../models/answersFormModel');

exports.createAnswer = async (req, res) => {
    try {
        const data = req.body;
    
        // Validar que los campos obligatorios estén presentes
        if (!data.block_id || !data.question_id || !data.answer) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
        }
    
        // Crear la respuesta
        const result = await AnswersFormModel.createAnswer(data);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error en createAnswer:', error);
        res.status(400).json({ message: error.message });
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
}