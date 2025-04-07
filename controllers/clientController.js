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
}

module.exports = new ClientController(new ClientModel());
