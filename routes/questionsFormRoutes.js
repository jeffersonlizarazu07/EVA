const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionsFormController');

router.post('/questions', questionController.createQuestions); // Crear preguntas para un bloque
router.get('/questions/block/:blockId', questionController.getQuestionsByBlockId); // Obtener preguntas por ID de bloque
router.put('/questions/block/:blockId', questionController.updateQuestionsForBlock); // Actualizar preguntas para un bloque específico
router.put("/questions/:blockId", questionController.updateQuestionsForBlock); // Actualizar preguntas para un bloque específico

module.exports = router;