// controllers/clientController.js
const ClientModel = require('../models/clientModel');
const path = require('path');
const fs = require('fs');
const knex = require('../config/db');
const clientModel = new ClientModel(knex);


// Método para crear un cliente
const createClient = async (req, res) => {
    try {
        const { client, state, color_tag1, color_tag2 } = req.body;
        console.log('Datos recibidos para crear el cliente:', { client, state, color_tag1, color_tag2 });
        console.log('Archivo recibido (logo):', req.file);

        if (!client || !state || !color_tag1 || !color_tag2) {
            return res.status(400).json({ message: 'Faltan datos requeridos' });
        }

        // Si hay una imagen, obtenemos su nombre
        let logo = req.file ? req.file.filename : null;

        // Crear cliente en la base de datos
        const newClient = await clientModel.create({
            client,
            state,
            color_tag1,
            color_tag2,
            logo
        });

        return res.status(201).json({
            message: 'Cliente creado correctamente',
            data: newClient
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Obtener todos los clientes
const getClients = async (req, res) => {
    try {
        const clients = await clientModel.getAll();
        console.log('Clientes obtenidos:', clients);
        if (clients.length === 0) {
            return res.status(404).json({ message: 'No se encontraron clientes' });
        }
        return res.status(200).json({ data: clients });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Obtener un cliente por ID
const getClientById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('cliente enconytrado', id)
        const client = await clientModel.getById(id);
        if (!client) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        return res.status(200).json({ data: client });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Actualizar cliente
const updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('id recibiedo para actualizar la informacion del cliente', id);
                const { client, state, color_tag1, color_tag2 } = req.body;
                console.log('Datos recibidos para actualizar el cliente:', { client, state, color_tag1, color_tag2 });

        if (!client && !state && !color_tag1 && !color_tag2) {
            return res.status(400).json({ message: 'No hay datos para actualizar' });
        }

        const updatedClient = await clientModel.update(id, { client, state, color_tag1, color_tag2 });

        return res.status(200).json({
            message: 'Cliente actualizado correctamente',
            data: updatedClient
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Cambiar el estado del cliente
const toggleClientState = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('id recibido para actualizar el esatdo del cliente', id);
        const updatedClient = await clientModel.toggleState(id);

        return res.status(200).json({
            message: 'Estado del cliente actualizado correctamente',
            data: updatedClient
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Eliminar cliente
const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('id recibido para eliminar un cliente', id);
        const client = await clientModel.getById(id);

        if (!client) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        // Eliminar el logo si existe
        if (client.logo) {
            const logoPath = path.join('C:/xampp/htdocs/tpco_transversal_EvaFe-main/public/clientes', client.logo);
            if (fs.existsSync(logoPath)) {
                fs.unlinkSync(logoPath);  // Eliminar archivo de imagen
            }
        }

        await clientModel.delete(id);

        return res.status(200).json({ message: 'Cliente eliminado correctamente' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createClient,
    getClients,
    getClientById,
    updateClient,
    toggleClientState,
    deleteClient
};