const express = require('express');
const router = express.Router();
const blockController = require('../controllers/blockController');
const authMiddleware = require('../middlewares/authMiddleware');

// Crear un nuevo bloque
router.post('/blocks', authMiddleware, blockController.createBlock);

// Obtener todos los bloques
router.get('/blocks', authMiddleware, blockController.getAllBlocks);

// Obtener bloques por ID de formulario
router.get('/blocks/form/:formId?', authMiddleware, blockController.getBlocksByFormId);

// Obtener un bloque por ID
router.get('/blocks/:id?', authMiddleware, blockController.getBlockById);

// Actualizar un bloque por ID
router.put('/blocks/:id?', authMiddleware, blockController.updateBlock);

// Eliminar un bloque por ID
router.delete('/blocks/:id?', authMiddleware, blockController.deleteBlock);

module.exports = router;