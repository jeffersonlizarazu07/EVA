const express = require('express');
const router = express.Router();
const surveySetController = require('../controllers/surveySetController');
const authMiddleware = require('../middlewares/authMiddleware');


router.get('/surveys',authMiddleware, surveySetController.surveys);
router.get('/survey/:id',authMiddleware, surveySetController.surveyByID);
router.get('/clients/surveys', surveySetController.surveysxClients);
router.post('/surveys',authMiddleware, surveySetController.postSurvey);
router.put('/survey/:id?', authMiddleware,surveySetController.putSurvey);
router.patch('/survey/:id?', authMiddleware,surveySetController.patchSurvey);
router.delete('/survey/:id?',authMiddleware, surveySetController.deleteSurvey);
router.get('/surveyByLink',surveySetController.surveyByLink);

//ruta para obtener las preguntas de una encuesta y responder
router.get('/surveyByLink', surveySetController.surveyByLink)

//ruta para obtener las encuestas asociadas a un usuario
router.get('/surveys-user/:id?', authMiddleware, surveySetController.surveysByUser); 

//ruta para obtener las encuestas mas contestadas 
router.get('/top-surveys/:userId?', surveySetController.topSurveys);

module.exports = router;
