const express = require('express');
const router = express.Router();
const monitoringController = require('../controllers/monitoringController');
const authMiddleware = require('../middlewares/authMiddleware')

router.post('/monitoring/', authMiddleware, monitoringController.create);
router.get('/monitoring/', authMiddleware, monitoringController.getAll);
router.get('/monitoring/:id', authMiddleware, monitoringController.getById);
router.put('/monitoting/:id', authMiddleware, monitoringController.update);
router.delete('/monitoring/:id', authMiddleware, monitoringController.remove);

module.exports = router;