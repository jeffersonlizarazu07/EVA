const express = require('express');
const router = express.Router();
const endUserClientController = require('../controllers/endUserClientController');

router.get('/endUserClients', endUserClientController.getEndUserClients);
router.post('/endUserClients', endUserClientController.createEndUserClient);
router.put('/endUserClient/:id', endUserClientController.updateEndUserClient);
router.delete('/endUserClient/:id', endUserClientController.deleteEndUserClient);

module.exports = router;
