const express = require('express');
const router = express.Router();
const answersFormController = require('../controllers/answersFormController');


// ruta para ver monitoreo
router.get('/answersform/monitoring', answersFormController.getMonitoring);

// Obtener todas las respuestas
router.get('/answersform', answersFormController.getAllAnswers);

// Obtener una respuesta específica por ID
router.get('/answersform/id/:id', answersFormController.getAnswerById);

// Obtener respuestas por ID de bloque
router.get('/answersform/block/:blockId', answersFormController.getAnswersByBlockId);

// Obtener respuestas por ID de pregunta
router.get('/answersform/question/:questionId', answersFormController.getAnswersByQuestionId);

// Obtener preguntas y respuestas por ID de bloque
router.get('/answersform/block-questions/:blockId', answersFormController.getQuestionsAndAnswersByBlockId);

// Crear una nueva respuesta
router.post('/answersform', answersFormController.saveMonitoringAndAnswers);

// Actualizar una respuesta existente
router.put('/answersform/:id', answersFormController.updateAnswer);

// Eliminar una respuesta
router.delete('/answersform/:id', answersFormController.deleteAnswer);

module.exports = router;