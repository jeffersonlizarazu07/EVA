const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const authMiddleware = require('../middlewares/authMiddleware');


router.get('/questions',authMiddleware, questionController.questions);
router.get('/question/:id', authMiddleware,questionController.questionByID);
router.get('/surveys/:id/question',authMiddleware, questionController.questionsxSurvey);
router.post('/question',authMiddleware, questionController.postQuestion);
router.put('/question/:id',authMiddleware, questionController.putQuestion);
router.delete('/question/:id',authMiddleware, questionController.deleteQuestion);


module.exports = router;
