const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Obtener todos los usuarios
router.get('/users', authMiddleware, userController.getUsers);

// Obtener un usuario por ID
router.get('/users/:id?', authMiddleware, userController.getUserById);

// Crear un nuevo usuario
router.post('/users', authMiddleware, userController.createUser);

// Actualizar un usuario por ID
router.put('/users/:id?', authMiddleware, userController.updateUser);

// Cambiar el estado de un usuario 
router.patch('/users/:id?', authMiddleware, userController.toggleUserState);

// Eliminar un usuario por ID
router.delete('/users/:id?', authMiddleware, userController.deleteUser);

//ruta para obtener los clientes asociados a un usuario
router.get('/users/:id/clients', authMiddleware, userController.getClientByUserId);

module.exports = router;
