const express = require('express');
const router = express.Router();
const userClientController = require('../controllers/userClientController');
const authMiddleware = require('../middlewares/authMiddleware'); // Para manejar autenticación

router.get('/user_clients', authMiddleware, userClientController.userClients);
router.get('/user_client/:id', authMiddleware, userClientController.userClientByID);
router.post('/user_clients', authMiddleware, userClientController.postUserClient);
router.put('/user_clients/:idUser', authMiddleware, userClientController.putUserClient);
router.delete('/user_client/:id', authMiddleware, userClientController.deleteUserClient);

module.exports = router;