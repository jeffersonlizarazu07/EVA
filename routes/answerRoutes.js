const express = require('express');
const router = express.Router();
const answerController = require('../controllers/answerController');

//const answerControllerInstance = new AnswerController();

// Ruta para obtener todas las respuestas
router.get('/answers', answerController.getAllAnswers);

// Ruta para obtener una respuesta por ID
router.get('/answers/:id', answerController.getAnswerById);

// Ruta para obtener los porcentajes generales de respuestas
router.get('/answers/percentages', answerController.percentageAnswer);

router.get('/answers/:id', answerController.answersByQuestion);

// Ruta para obtener los porcentajes de respuestas por tipo de pregunta
router.get('/answers/percentage/:id', answerController.answersByQuestionPercentage);

// Ruta para obtener los porcentajes de respuestas de una encuesta
router.get('/survey/:id/percentages', answerController.percentagesXSurvey);

// Ruta para crear una nueva respuesta
router.post('/answers', answerController.postAnswer);

// Ruta para actualizar una respuesta

//router.put('/answers/:id', AnswerController.putAnswer);

router.put('/answers/:id', answerController.updateAnswer);

//router.put('/answers/:id', answerController.putAnswer);


// Ruta para eliminar una respuesta
router.delete('/answers/:id', answerController.deleteAnswer);

module.exports = router;
