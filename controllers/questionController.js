const Question = require('../models/question');

const questionController = {
    async questions(req, res) {
        try {
            const questions = await Question.getAll();
            if (!questions.length) {
                return res.status(204).json({ status: 204, message: 'No se encontraron preguntas' });
            }
            res.json({ status: 200, message: 'Preguntas obtenidas exitosamente', questions });
        } catch (error) {
            res.status(500).json({ status: 500, message: 'Error interno del servidor', error });
        }
    },

    async questionByID(req, res) {
        try {
            const question = await Question.getById(req.params.id);
            if (!question) {
                return res.status(404).json({ status: 404, message: 'La pregunta no fue encontrada' });
            }
            res.json({ status: 200, message: 'Pregunta obtenida exitosamente', question });
        } catch (error) {
            res.status(500).json({ status: 500, message: 'Error interno del servidor', error });
        }
    },

    async questionsxSurvey(req, res) {
        try {
            const questions = await Question.getBySurvey(req.params.id);
            if (!questions.length) {
                return res.status(204).json({ status: 204, message: 'No se encontraron preguntas para la encuesta' });
            }
            res.json({ status: 200, message: 'Preguntas obtenidas correctamente', data: questions });
        } catch (error) {
            res.status(500).json({ status: 500, message: 'Error interno del servidor', error });
        }
    },

    async postQuestion(req, res) {
        try {
            const newQuestion = await Question.create(req.body);
            res.status(201).json({ status: 201, message: 'Pregunta creada exitosamente', question: newQuestion });
        } catch (error) {
            res.status(500).json({ status: 500, message: 'Error al crear la pregunta', error });
        }
    },

    async putQuestion(req, res) {
        try {
            const updatedQuestion = await Question.update(req.params.id, req.body);
            if (!updatedQuestion.length) {
                return res.status(404).json({ status: 404, message: 'La pregunta no existe' });
            }
            res.json({ status: 200, message: 'Pregunta actualizada exitosamente', question: updatedQuestion });
        } catch (error) {
            res.status(500).json({ status: 500, message: 'Error al actualizar la pregunta', error });
        }
    },

    async deleteQuestion(req, res) {
        try {
            const deleted = await Question.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({ status: 404, message: 'La pregunta no existe' });
            }
            res.json({ status: 200, message: 'Pregunta eliminada exitosamente' });
        } catch (error) {
            res.status(500).json({ status: 500, message: 'Error al eliminar la pregunta', error });
        }
    }
};

module.exports = questionController;
