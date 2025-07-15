const express = require('express');
const router = express.Router();
const monitoringController = require('../controllers/monitoringController');
const authMiddleware = require('../middlewares/authMiddleware')

router.post('/monitoring/', authMiddleware, monitoringController.create);  // Guardar monitorización
router.get('/monitoring/', authMiddleware, monitoringController.getAll); // Obtener monitorizaciones
router.get('/monitoring/user/:userId/form/:formId', monitoringController.getMonitoringByUserAndForm); //Obtener monitorización del formulario en caso de que exista
router.get('/monitoring/user/:userId', monitoringController.getByUserId); // Obtener monitorizaciones por usuario
router.get('/monitoring/:id', authMiddleware, monitoringController.getById); // Obtener monitorizaciones por ID
router.put('/monitoting/:id', authMiddleware, monitoringController.update); // Actualización de monitorización
router.put('/monitoring/:id', authMiddleware, monitoringController.updateFeedback); // Actualización de feedback
router.delete('/monitoring/:id', authMiddleware, monitoringController.delete); // Eliminar monitorización

module.exports = router;