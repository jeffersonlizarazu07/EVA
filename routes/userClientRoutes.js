const express = require('express');
const router = express.Router();
const userClientController = require('../controllers/userClientController');
const authMiddleware = require('../middlewares/authMiddleware'); 

router.get('/users_client', authMiddleware, userClientController.userClients);
router.get('/users_client/:id', authMiddleware, userClientController.userClientByID);
router.post('/users_client', authMiddleware, userClientController.postUserClient);
router.put('/users_client/:idUser', authMiddleware, userClientController.putUserClient);
router.delete('/users_client/:id', authMiddleware, userClientController.deleteUserClient);

module.exports = router;