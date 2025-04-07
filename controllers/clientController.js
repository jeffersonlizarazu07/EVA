// controllers/clientController.js
const ClientModel = require('../models/clientModel');
<<<<<<< Updated upstream

class ClientController {
    constructor(clientModel) {
        this.clientModel = clientModel;
=======
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
>>>>>>> Stashed changes
    }

    // Crear un nuevo cliente
    async create(req, res) {
        try {
            // Validamos que los campos necesarios están presentes
            if (!req.body.client || !req.body.state || !req.body.color_tag1 || !req.body.color_tag2) {
                return res.status(400).json({ error: 'Datos faltantes en la solicitud' });
            }

            // Si se sube un logo, lo procesamos con Multer
            let logo = null;
            if (req.file) {
                logo = req.file.path;  // La ruta del archivo que se sube
            }

            const newClientData = {
                client: req.body.client,
                state: req.body.state || 0,  // Si no se especifica, será inactivo por defecto
                color_tag1: req.body.color_tag1,
                color_tag2: req.body.color_tag2,
                logo: logo  // Se incluye el logo si fue subido
            };

            // Usamos el modelo para crear el cliente
            const newClient = await this.clientModel.create(newClientData);
            res.status(201).json({ message: 'Cliente creado exitosamente', data: newClient });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
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
