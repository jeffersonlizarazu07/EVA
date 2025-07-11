const express = require('express');
const router = express.Router();
const blockController = require('../controllers/blockController');

// Crear un nuevo bloque
router.post('/blocks', blockController.createBlock);

// Obtener todos los bloques
router.get('/blocks', blockController.getAllBlocks);

// Obtener bloques por ID de formulario
router.get('/blocks/form/:formId?', blockController.getBlocksByFormId);

// Obtener un bloque por ID
router.get('/blocks/:id?', blockController.getBlockById);

// Actualizar un bloque por ID
router.put('/blocks/:id?', blockController.updateBlock);

// Eliminar un bloque por ID
router.delete('/blocks/:id?', blockController.deleteBlock);

module.exports = router;