const express = require('express');
const router = express.Router();
const AnswerController = require('../controllers/answerController'); // Importamos el controlador
const answerController = require('../controllers/answerController');

const authMiddleware = require('../middlewares/authMiddleware');
//const answerControllerInstance = new AnswerController();

// Ruta para obtener todas las respuestas
router.get('/answers',authMiddleware, AnswerController.getAllAnswers);

// Ruta para obtener una respuesta por ID
router.get('/answers/:id', authMiddleware, AnswerController.getAnswerById);

// Ruta para obtener los porcentajes generales de respuestas
router.get('/answers/percentages',authMiddleware, AnswerController.percentageAnswer);

router.get('/answers/:id', authMiddleware, AnswerController.answersByQuestion);

// Ruta para obtener los porcentajes de respuestas por tipo de pregunta
router.get('/answers/percentage/:id',authMiddleware,  AnswerController.answersByQuestionPercentage);

// Ruta para obtener los porcentajes de respuestas de una encuesta

router.get('/answers/survey/:id/percentage', answerController.percentagesXSurvey);


// Ruta para crear una nueva respuesta
router.post('/answers',authMiddleware, AnswerController.postAnswer);

// Ruta para actualizar una respuesta

//router.put('/answers/:id', AnswerController.putAnswer);

router.put('/answers/:id', authMiddleware, answerController.updateAnswer);

//router.put('/answers/:id', answerController.putAnswer);


// Ruta para eliminar una respuesta
router.delete('/answers/:id',authMiddleware, AnswerController.deleteAnswer);

module.exports = router;
