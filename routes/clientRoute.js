const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const upload = require('../middleware/multerConfig');  // Importamos el middleware de Multer

// Ruta para crear un cliente, pasando por el middleware de Multer
router.post('/clients', upload.single('logo'), clientController.create);

module.exports = router;
