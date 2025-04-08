const express = require('express');
const router = express.Router();
const AnswerController = require('../controllers/answerController'); // Importamos el controlador
const answerController = require('../controllers/answerController');

//const answerControllerInstance = new AnswerController();

// Ruta para obtener todas las respuestas
router.get('/answers', AnswerController.getAllAnswers);

// Ruta para obtener una respuesta por ID
router.get('/answers/:id', AnswerController.getAnswerById);

// Ruta para obtener los porcentajes generales de respuestas
router.get('/answers/percentages', AnswerController.percentageAnswer);

router.get('/answers/:id', AnswerController.answersByQuestion);

// Ruta para obtener los porcentajes de respuestas por tipo de pregunta
router.get('/answers/percentage/:id', AnswerController.answersByQuestionPercentage);

// Ruta para obtener los porcentajes de respuestas de una encuesta
router.get('/survey/:id/percentages', answerController.percentagesXSurvey);

// Ruta para crear una nueva respuesta
router.post('/answers', AnswerController.postAnswer);

// Ruta para actualizar una respuesta
<<<<<<< Updated upstream
router.put('/answers/:id', AnswerController.putAnswer);
=======
router.put('/answers/:id', answerController.updateAnswer);
>>>>>>> Stashed changes

// Ruta para eliminar una respuesta
router.delete('/answers/:id', AnswerController.deleteAnswer);

module.exports = router;
