const express = require('express');
const router = express.Router();
const surveySetController = require('../controllers/surveySetController');
const authMiddleware = require('../middlewares/authMiddleware');


router.get('/surveys',authMiddleware, surveySetController.surveys);
router.get('/survey/:id',authMiddleware, surveySetController.surveyByID);
router.get('/clients/surveys',authMiddleware, surveySetController.surveysxClients);
router.post('/surveys',authMiddleware, surveySetController.postSurvey);
router.put('/survey/:id', authMiddleware,surveySetController.putSurvey);
router.patch('/survey/:id', authMiddleware,surveySetController.patchSurvey);
router.delete('/survey/:id',authMiddleware, surveySetController.deleteSurvey);

//ruta para obtener las preguntas de una encuesta
router.get('/surveyByLink', authMiddleware, surveySetController.surveyByLink)
             

module.exports = router;
