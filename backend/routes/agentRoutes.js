const express = require('express');
const router = express.Router();
const agenteController = require('../controllers/agenteController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/agent',authMiddleware, agenteController.getAgents); // ALL CLIENTS
router.get('/users/agents/admin', authMiddleware, agenteController.getAgentsByAdmin); // Traer agentes por según admin
router.get('/agent/:id?',authMiddleware, agenteController.getAgentById); //clientes por id

module.exports = router;
