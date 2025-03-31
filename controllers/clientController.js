const ClientModel = require('../models/clientModel');

class ClientController {
    constructor(clientModel) {
        this.clientModel = clientModel;
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
