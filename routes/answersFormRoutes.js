const express = require('express');
const router = express.Router();
const answersFormController = require('../controllers/answersFormController');

// Obtener todas las respuestas
router.get('/', answersFormController.getAllAnswers);

// Obtener una respuesta específica por ID
router.get('/:id', answersFormController.getAnswerById);

// Obtener respuestas por ID de bloque
router.get('/block/:blockId', answersFormController.getAnswersByBlockId);

// Obtener respuestas por ID de pregunta
router.get('/question/:questionId', answersFormController.getAnswersByQuestionId);

// Obtener respuesta por ID de pregunta y bloque
router.get('/block/full/:blockId', answersFormController.getQuestionsAndAnswersByBlockId);

// Crear una nueva respuesta
router.post('/', answersFormController.createAnswer);

// Actualizar una respuesta existente
router.put('/:id', answersFormController.updateAnswer);

// Eliminar una respuesta
router.delete('/:id', answersFormController.deleteAnswer);

module.exports = router;