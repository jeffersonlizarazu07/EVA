const express = require('express');
const router = express.Router();
const blockController = require('../controllers/form.controller');

// Crear un nuevo bloque
router.post('/form', blockController.createBlock);
router.post('/form', createBlock);
router.get('/form', getAllBlocks);
router.get('/form/:id', getBlockById);
router.put('/form/:id', updateBlock);
router.delete('/form/:id', deleteBlock);
module.exports = router;