const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionsFormController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/questions', authMiddleware, questionController.createQuestions); // Crear preguntas para un bloque
router.get('/questions/block/:blockId', authMiddleware, questionController.getQuestionsByBlockId); // Obtener preguntas por ID de bloque
router.put('/questions/block/:blockId', authMiddleware, questionController.updateQuestionsForBlock); // Actualizar preguntas para un bloque específico
router.put("/questions/:blockId", authMiddleware, questionController.updateQuestionsForBlock); // Actualizar preguntas para un bloque específico

module.exports = router;