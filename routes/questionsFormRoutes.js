const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionsFormController');

router.post('/', questionController.createQuestions); // Crear preguntas para un bloque
router.get('/block/:blockId', questionController.getQuestionsByBlockId); // Obtener preguntas por ID de bloque
router.put('/block/:blockId', questionController.updateQuestionsForBlock); // Actualizar preguntas para un bloque específico
router.put("/:blockId", questionController.updateQuestionsForBlock); // Actualizar preguntas para un bloque específico

module.exports = router;