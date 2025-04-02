const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

router.get('/questions', questionController.questions);
router.get('/question/:id', questionController.questionByID);
router.get('/survey/:id/question', questionController.questionsxSurvey);
router.post('/question', questionController.postQuestion);
router.put('/question/:id', questionController.putQuestion);
router.delete('/question/:id', questionController.deleteQuestion);

module.exports = router;
