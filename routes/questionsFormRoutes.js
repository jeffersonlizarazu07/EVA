const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionsFormController');

router.post('/', questionController.createQuestions);
router.get('/block/:blockId', questionController.getQuestionsByBlockId);
router.put('/block/:blockId', questionController.updateQuestionsForBlock);
router.put("/:blockId", questionController.updateQuestionsForBlock);

module.exports = router;