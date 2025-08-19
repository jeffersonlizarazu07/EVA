const express = require('express');
const router = express.Router();
const answersFormController = require('../controllers/answersFormController');
const authMiddleware = require('../middlewares/authMiddleware');

// obtener respuestas multiples 

router.get('/answersform/getResponseMult',authMiddleware, answersFormController.getResponseMult)

// obtener reportes filtrados
router.get('/answersform/filter/:fromId/:starDate/:endDate/:agente/:evaluador',authMiddleware,   answersFormController.getReportFilter);

// obtener clientes y informacion de los forms_set
router.get('/answersform/clients-forms', authMiddleware, answersFormController.getClientsAndForms);

// obtener monitores de los agentes 
router.get('/answersform/report-monitoring', authMiddleware, answersFormController.getReportMonitoring);

// ruta para ver monitoreo
router.get('/answersform/monitoring', authMiddleware, answersFormController.getMonitoring);

// Obtener todas las respuestas
router.get('/answersform', authMiddleware, answersFormController.getAllAnswers);

// Obtener una respuesta específica por ID
router.get('/answersform/id/:id', authMiddleware, answersFormController.getAnswerById);

// Obtener respuestas por ID de bloque
router.get('/answersform/block/:blockId', authMiddleware, answersFormController.getAnswersByBlockId);

// Obtener respuestas por ID de pregunta
router.get('/answersform/question/:questionId', authMiddleware, answersFormController.getAnswersByQuestionId);

// Obtener preguntas y respuestas por ID de bloque
router.get('/answersform/block-questions/:blockId', authMiddleware, answersFormController.getQuestionsAndAnswersByBlockId);

// Crear una nueva respuesta
router.post('/answersform', authMiddleware, answersFormController.saveMonitoringAndAnswers);

// Actualizar una respuesta existente
router.put('/answersform/:id', authMiddleware, answersFormController.updateAnswer);

// Eliminar una respuesta
router.delete('/answersform/:id', authMiddleware, answersFormController.deleteAnswer);

module.exports = router;