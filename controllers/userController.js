const bcrypt = require('bcryptjs'); // Importo bcryptjs para poder encriptar las contraseñas de los usuarios
const UserDTO = require('../dtos/userDTO'); // Importo el DTO de usuario para validar los datos de entrada

// Importo el modelo de usuario para acceder a las funciones que interactúan con la base de datos
const User = require('../models/user');

// Controlador para obtener todos los usuarios registrados
const getUsers = async (req, res) => {
    try {
        // Llamo al modelo para obtener todos los usuarios
        const users = await User.getAllUsers();

        // Si no hay usuarios registrados, devuelvo un 404
        if (users.length === 0) {
            return res.status(404).json({ message: 'No se encontraron usuarios.' });
        }

        // Envío los usuarios con un mensaje de éxito
        res.status(200).json({
            status: '200',
            message: 'Usuarios obtenidos correctamente',
            data: users
        });
    } catch (error) {
        // Capturo errores del servidor y los envío como respuesta
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

// Controlador para obtener un usuario por su ID
const getUserById = async (req, res) => {

    const validarId = UserDTO.validarId(req.params.id);

    if(!validarId.status){
        return res.status(400).json(validarId);
    }

    const { id } = req.params; // Tomo el ID desde los parámetros de la ruta
    try {
        // Busco el usuario por ID
        const user = await User.findById(id);

        // Si no existe, devuelvo 404
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Si lo encuentra, lo devuelvo con un mensaje de éxito
        res.status(200).json({
            status: '200',
            message: 'Usuario obtenido correctamente',
            data: user
        });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

// Controlador para crear un nuevo usuario
const createUser = async (req, res) => {
    
    const validacionUsurio = UserDTO.validateCreateUser(req.body);
    if(!validacionUsurio.status){
        return res.status(400).json(validacionUsurio);
    }
    
    const { firstname, middlename, lastname, email, type, language, password } = req.body;

    try {
        // Encripto la contraseña antes de guardarla en la base de datos
        const hashedPassword = await bcrypt.hash(password, 10);

        // Construyo el objeto del nuevo usuario
        const newUser = await User.createUser({
            firstname,
            middlename,
            lastname,
            email,
            type,
            language,
            password: hashedPassword,
            state: 1, // Estado activo por defecto
            //accessToken: null,
            //token_Exp: null,
            registration_date: new Date(),
            last_visit_date: null,
            updated_at: new Date(),
            //created_at: new Date()
        });

        // Devuelvo el nuevo usuario creado
        res.status(201).json({
            status: '201',
            message: 'Usuario creado correctamente',
            data: newUser
        });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

// Controlador para actualizar los datos de un usuario
const updateUser = async (req, res) => {
    const validacionUsurio = UserDTO.validateCreateUser(req.body);
    
    if(!validacionUsurio.status){
        return res.status(400).json(validacionUsurio);
    }

    const validarId = UserDTO.validarId(req.params.id);

    if(!validarId.status){
        return res.status(400).json(validarId);
    }

    const { id } = req.params;
    const userData = req.body;

    // Si el usuario envía una nueva contraseña, la encripto
    if (userData.password && userData.password.trim() !== "") {
        try {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            userData.password = hashedPassword;
        } catch (error) {
            return res.status(500).json({ message: 'Error al encriptar la contraseña', error: error.message });
        }
    } else {
        // Si no hay contraseña nueva, la elimino del objeto para que no se actualice
        delete userData.password;
    }

    // Limpio el campo de idioma si está presente
    if (userData.language) {
        userData.language = userData.language.trim();
    } else {
        delete userData.language;
    }

    try {
        // Llamo al modelo para actualizar el usuario
        const updatedUser = await User.updateUser(id, userData);

        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        res.status(200).json({
            status: '200',
            message: 'Usuario actualizado correctamente',
            data: updatedUser
        });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

// Controlador para cambiar el estado de un usuario (activo/inactivo)
const toggleUserState = async (req, res) => {
    const validarId = UserDTO.validarId(req.params.id);

    if(!validarId.status){
        return res.status(400).json(validarId);
    }

    const { id } = req.params;
    try {
        const updatedUser = await User.toggleUserState(id);
        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        res.status(200).json({
            status: '200',
            message: 'Estado del usuario actualizado correctamente',
            data: updatedUser
        });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

// Controlador para eliminar un usuario
const deleteUser = async (req, res) => {
    const validarId = UserDTO.validarId(req.params.id);

    if(!validarId.status){
        return res.status(400).json(validarId);
    }
    
    const { id } = req.params;
    try {
        const deletedUser = await User.deleteUser(id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        res.status(200).json({
            status: '200',
            message: 'Usuario eliminado correctamente'
        });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

const getClientByUserId = async (req, res) => {
    const { id } = req.params; // Tomo el ID desde los parámetros de la ruta
    try {
        // Busco el usuario por ID
        const user = await User.getClientIds(id);   
        return res.status(200).json({
            status: true,
            message: 'Clientes obtenidos correctamente',
            data: user
        });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};
// Exporto todos los controladores para poder usarlos en las rutas
module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    toggleUserState,
    deleteUser,
    getClientByUserId
};
