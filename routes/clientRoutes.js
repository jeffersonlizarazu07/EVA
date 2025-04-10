// routes/clientRoutes.js
const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const upload = require('../middlewares/multerConfig');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas para clientes
router.post('/clients', authMiddleware,upload.single('logo'), clientController.createClient);  
router.get('/clients',authMiddleware, clientController.getClients);
router.get('/clients/:id', authMiddleware,clientController.getClientById);
router.put('/clients/:id', authMiddleware, upload.single('logo'), clientController.updateClient);
router.patch('/clients/:id',authMiddleware, clientController.toggleClientState);
router.delete('/clients/:id', authMiddleware,clientController.deleteClient);

module.exports = router;
