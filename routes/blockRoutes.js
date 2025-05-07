const express = require('express');
const router = express.Router();
const blockController = require('../controllers/blockController');

// Crear un nuevo bloque
router.post('/', blockController.createBlock);

// Obtener todos los bloques
router.get('/form', blockController.getAllBlocks);

// Obtener un bloque por ID
router.get('/form/:id', blockController.getBlockById);

// Actualizar un bloque por ID
router.put('/form/:id', blockController.updateBlock);

// Eliminar un bloque por ID
router.delete('/form/:id', blockController.deleteBlock);

router.get("/ping", (req, res) => {
    res.status(200).json({ message: "pong" });
  });

module.exports = router;