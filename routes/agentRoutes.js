const express = require('express');
const router = express.Router();
const agenteController = require('../controllers/agenteController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/agent',authMiddleware, agenteController.getAgents);
router.get('/agent/:id',authMiddleware, agenteController.getAgentById);
router.post('/agent',authMiddleware, agenteController.createAgent);
router.put('/agent/:id',authMiddleware, agenteController.updateAgent);
router.patch('/agent/:id',authMiddleware, agenteController.toggleAgentState);
router.delete('/agent/:id', authMiddleware,agenteController.deleteAgent);

module.exports = router;
