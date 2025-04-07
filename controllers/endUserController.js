const EndUser = require('../models/endUser');

const endUsers = async (req, res) => {
    try {
        const users = await EndUser.getAll();
        if (users.length === 0) {
            return res.status(404).json({ status: 404, message: 'No se encontraron usuarios' });
        }
        res.status(200).json({ status: 200, message: 'Usuarios obtenidos exitosamente', data: users });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error interno del servidor', error: error.message });
    }
};

const endUserByID = async (req, res) => {
    try {
        const user = await EndUser.getById(req.params.id);
        if (!user) {
            return res.status(404).json({ status: 404, message: `No se encontró el usuario con el id ${req.params.id}` });
        }
        res.status(200).json({ status: 200, message: 'Usuario obtenido exitosamente', data: user });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error interno del servidor', error: error.message });
    }
};

const postEndUser = async (req, res) => {
    try {
        const { firstname, middlename, lastname, email, state } = req.body;
        if (!firstname || !lastname || !email) {
            return res.status(400).json({ status: 400, message: 'Los campos firstname, lastname y email son obligatorios' });
        }

        const newUser = await EndUser.create({ firstname, middlename, lastname, email, state });
        res.status(201).json({ status: 201, message: 'Usuario creado exitosamente', data: newUser });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error interno del servidor', error: error.message });
    }
};

const putEndUser = async (req, res) => {
    try {
        const user = await EndUser.getById(req.params.id);
        if (!user) {
            return res.status(404).json({ status: 404, message: `El usuario con el id ${req.params.id} no existe` });
        }

        const updatedUser = await EndUser.update(req.params.id, req.body);
        res.status(200).json({ status: 200, message: 'Usuario actualizado exitosamente', data: updatedUser });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error interno del servidor', error: error.message });
    }
};

const patchEndUser = async (req, res) => {
    try {
        const user = await EndUser.getById(req.params.id);
        if (!user) {
            return res.status(404).json({ status: 404, message: `El usuario con el id ${req.params.id} no existe` });
        }

        const updatedUser = await EndUser.toggleState(req.params.id);
        res.status(200).json({ status: 200, message: 'Estado del usuario actualizado exitosamente', data: updatedUser });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error interno del servidor', error: error.message });
    }
};

const deleteEndUser = async (req, res) => {
    try {
        const user = await EndUser.getById(req.params.id);
        if (!user) {
            return res.status(404).json({ status: 404, message: `El usuario con el id ${req.params.id} no existe` });
        }

        await EndUser.delete(req.params.id);
        res.status(200).json({ status: 200, message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error interno del servidor', error: error.message });
    }
};

module.exports = {
    endUsers,
    endUserByID,
    postEndUser,
    putEndUser,
    patchEndUser,
    deleteEndUser
};
