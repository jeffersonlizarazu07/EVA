const EndUserClient = require('../models/endUserClient');

const getEndUserClients = async (req, res) => {
    try {
        const endUserClients = await EndUserClient.getAll();
        if (!endUserClients.length) {
            return res.status(404).json({
                status: 404,
                message: 'No hay clientes asociados a este usuario'
            });
        }
        res.status(200).json({
            status: 200,
            message: 'Clientes asociados obtenidos correctamente',
            data: endUserClients
        });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error en el servidor', error });
    }
};

const createEndUserClient = async (req, res) => {
    try {
        const { idEndUser, idClient } = req.body;

        if (!idEndUser || !idClient) {
            return res.status(400).json({ status: 400, message: 'Faltan datos obligatorios.' });
        }

        const newEndUserClient = await EndUserClient.create({ idEndUser, idClient });

        res.status(201).json({
            status: 201,
            message: 'Cliente asociado correctamente',
            data: newEndUserClient
        });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error en el servidor', error });
    }
};

const updateEndUserClient = async (req, res) => {
    try {
        const { id } = req.params;
        const { idEndUser, idClient } = req.body;

        const endUserClient = await EndUserClient.getById(id);
        if (!endUserClient) {
            return res.status(404).json({ status: 404, message: 'Asociación no encontrada.' });
        }

        const updatedEndUserClient = await EndUserClient.update(id, { idEndUser, idClient });

        res.status(200).json({
            status: 200,
            message: 'Asociación editada correctamente',
            data: updatedEndUserClient
        });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error en el servidor', error });
    }
};

const deleteEndUserClient = async (req, res) => {
    try {
        const { id } = req.params;

        const endUserClient = await EndUserClient.getById(id);
        if (!endUserClient) {
            return res.status(404).json({ status: 404, message: 'Asociación no encontrada.' });
        }

        await EndUserClient.delete(id);

        res.status(200).json({ status: 200, message: 'Asociación eliminada correctamente.' });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error en el servidor', error });
    }
};

module.exports = {
    getEndUserClients,
    createEndUserClient,
    updateEndUserClient,
    deleteEndUserClient
};
