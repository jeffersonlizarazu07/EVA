const express = require('express');
const router = express.Router();
const blockController = require('../controllers/blockController');

// Crear un nuevo bloque
router.post('/', blockController.createBlock);

// Obtener todos los bloques
router.get('/', blockController.getAllBlocks);

// Obtener bloques por ID de formulario
router.get('/form/:formId', blockController.getBlocksByFormId);

// Obtener un bloque por ID
router.get('/:id', blockController.getBlockById);

// Actualizar un bloque por ID
router.put('/:id', blockController.updateBlock);

// Eliminar un bloque por ID
router.delete('/:id', blockController.deleteBlock);

module.exports = router;