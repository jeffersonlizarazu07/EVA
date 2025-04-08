// routes/clientRoutes.js
const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
<<<<<<< Updated upstream
const upload = require('../middleware/multerMiddleware');  // Middleware de multer para cargar imágenes
=======
const upload = require('../middlewares/multerConfig');  
>>>>>>> Stashed changes

// Rutas para clientes
router.post('/clients', upload.single('logo'), clientController.createClient);  // Cargar logo
router.get('/clients', clientController.getClients);
router.get('/clients/:id', clientController.getClientById);
router.put('/clients/:id', clientController.updateClient);
router.patch('/clients/:id/state', clientController.toggleClientState);
router.delete('/clients/:id', clientController.deleteClient);

module.exports = router;
