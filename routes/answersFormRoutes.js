const express = require('express');
const router = express.Router();
const answersFormController = require('../controllers/answersFormController');

// obtener respuestas multiples 

router.get('/answersform/getResponseMult', answersFormController.getResponseMult)

// obtener reportes filtrados
router.get('/answersform/filter/:fromId/:starDate/:endDate', answersFormController.getReportFilter);

// obtener clientes y informacion de los forms_set
router.get('/answersform/clients-forms', answersFormController.getClientsAndForms);

// obtener monitores de los agentes 
router.get('/answersform/report-monitoring', answersFormController.getReportMonitoring);

// ruta para ver monitoreo
router.get('/answersform/monitoring', answersFormController.getMonitoring);

// Obtener todas las respuestas
router.get('/answersform', answersFormController.getAllAnswers);

// Obtener una respuesta específica por ID
router.get('/answersform/id/:id', answersFormController.getAnswerById);

// Obtener respuestas por ID de bloque
router.get('/answersform/block/:blockId', answersFormController.getAnswersByBlockId);

// Obtener respuestas por ID de pregunta
router.get('/answersform/question/:questionId', answersFormController.getAnswersByQuestionId);

// Obtener preguntas y respuestas por ID de bloque
router.get('/answersform/block-questions/:blockId', answersFormController.getQuestionsAndAnswersByBlockId);

// Crear una nueva respuesta
router.post('/answersform', answersFormController.createAnswer);

// Crear el monitoreo de las respuestas
router.post('/answersform/monitoring', answersFormController.createMonitoring);

// Actualizar una respuesta existente
router.put('/answersform/:id', answersFormController.updateAnswer);

// Eliminar una respuesta
router.delete('/answersform/:id', answersFormController.deleteAnswer);

module.exports = router;