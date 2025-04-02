const express = require('express');
const router = express.Router();
const surveySetController = require('../controllers/surveySetController');

router.get('/surveys', surveySetController.surveys);
router.get('/survey/:id', surveySetController.surveyByID);
router.get('/clients/surveys', surveySetController.surveysxClients);
router.post('/surveys', surveySetController.postSurvey);
router.put('/survey/:id', surveySetController.putSurvey);
router.patch('/survey/:id', surveySetController.patchSurvey);
router.delete('/survey/:id', surveySetController.deleteSurvey);

module.exports = router;
