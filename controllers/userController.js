const bcrypt = require('bcryptjs');
const User = require('../models/user');

const getUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers();
        if (users.length === 0) {
            return res.status(404).json({ message: 'No se encontraron usuarios.' });
        }
        res.status(200).json({
            status: '200',
            message: 'Usuarios obtenidos correctamente',
            data: users
        });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        res.status(200).json({
            status: '200',
            message: 'Usuario obtenido correctamente',
            data: user
        });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

const createUser = async (req, res) => {
    const { firstname, middlename, lastname, email, type, language, password } = req.body;

    // Validación de datos
    if (!firstname || !lastname || !email || !type || !language || !password) {
        return res.status(400).json({ message: 'Faltan campos requeridos.' });
    }

    try {
        // Encriptar la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear nuevo usuario 
        const newUser = await User.createUser({
            firstname,
            middlename,
            lastname,
            email,
            type,
            language,
            password: hashedPassword,
            state: 1,
            accessToken: null,
            token_Exp: null,  
            registration_date: new Date(),  
            last_visit_date: null,         
            updated_at: new Date(),
            created_at: new Date()
        });

        res.status(201).json({
            status: '201',
            message: 'Usuario creado correctamente',
            data: newUser
        });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};


const updateUser = async (req, res) => {
    const { id } = req.params;
    const userData = req.body;

    if (userData.password && userData.password.trim() !== "") {
        try {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            userData.password = hashedPassword;
        } catch (error) {
            return res.status(500).json({ message: 'Error al encriptar la contraseña', error: error.message });
        }
    } else {
        delete userData.password;
    }
 
     if (userData.language) {
        userData.language = userData.language.trim();
    } else {
        delete userData.language; 
    }

    try {
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

const toggleUserState = async (req, res) => {
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

const deleteUser = async (req, res) => {
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

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    toggleUserState,
    deleteUser
};
