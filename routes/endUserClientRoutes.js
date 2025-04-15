const express = require('express');
const router = express.Router();
const endUserClientController = require('../controllers/endUserClientController');
const authMiddleware = require('../middlewares/authMiddleware');


router.get('/endUserClients',authMiddleware, endUserClientController.getEndUserClients);
router.post('/endUserClients',authMiddleware, endUserClientController.createEndUserClient);
router.put('/endUserClient/:id', authMiddleware,endUserClientController.updateEndUserClient);
router.delete('/endUserClient/:id',authMiddleware, endUserClientController.deleteEndUserClient);

module.exports = router;
