const express = require('express');
const router = express.Router();
const monitoringController = require('../controllers/monitoringController');
const authMiddleware = require('../middlewares/authMiddleware')

router.post('/monitoring/', authMiddleware, monitoringController.create);  // Guardar monitorización
router.get('/monitoring/', authMiddleware, monitoringController.getAll); // Obtener monitorizaciones
router.get('/monitoring/user/:userId/form/:formId', authMiddleware, monitoringController.getMonitoringByUserAndForm); //Obtener monitorización del formulario en caso de que exista
router.get('/monitoring/user/:userId', authMiddleware, monitoringController.getByUserId); // Obtener monitorizaciones por usuario

router.get('/monitoring/users/general/:agenteParam/:evaluadorParam', authMiddleware,  monitoringController.getByUserGeneral); // Obtener monitorizaciones generales por usuario

router.get('/monitoring/:monitoringId/details', authMiddleware, monitoringController.getMonitoringDetails); //Obtener monitorización detallada
router.get('/monitoring/:id', authMiddleware, monitoringController.getById); // Obtener monitorizaciones por ID
router.put('/monitoting/:id', authMiddleware, monitoringController.update); // Actualización de monitorización
router.put('/monitoring/:id', authMiddleware, monitoringController.updateFeedback); // Actualización de feedback
router.put('/monitoring/:id/check', authMiddleware, monitoringController.updateCheck); // Actualizar check del agente 
router.delete('/monitoring/:id', authMiddleware, monitoringController.delete); // Eliminar monitorización

module.exports = router;