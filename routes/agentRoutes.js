const express = require('express');
const router = express.Router();
const agenteController = require('../controllers/agenteController');
const authMiddleware = require('../middlewares/authMiddleware');

// ALL CLIENTS
router.post('/agent',authMiddleware, agenteController.getAgents);

//clientes por id
router.get('/agent/:id',authMiddleware, agenteController.getAgentById);


module.exports = router;
