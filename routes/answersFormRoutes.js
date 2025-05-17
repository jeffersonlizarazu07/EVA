const express = require('express');
const router = express.Router();
const answersFormController = require('../controllers/answersFormController');

// Respuestas de las preguntas de un bloque

router.get('/block/:blockId', answersFormController.getAnswersByBlockId);
router.get('/question/:questionId', answersFormController.getAnswersByQuestionId);
router.get('/question/:questionId/block/:blockId', answersFormController.getAnswersByQuestionAndBlockId);

router.post('/', answersFormController.createAnswer);
router.put('/:id', answersFormController.updateAnswer);
router.delete('/:id', answersFormController.deleteAnswer);
