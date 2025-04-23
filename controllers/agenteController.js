const bcrypt = require('bcryptjs'); // Uso bcrypt para encriptar contraseñas de manera segura
const Agent = require('../models/agentModel'); // Importo el modelo Agent que se encarga de interactuar con la base de datos

// Obtener la lista de todos los agentes
const getAgents = async (req, res) => {
    try {
        const clientIds = req.user.clients_id;

        if (!clientIds || clientIds.length === 0) {
            return res.status(403).json({ message: 'No tienes clientes asociados.' });
        }

        // Solo traigo agentes relacionados a estos clientes
        const agents = await Agent.getAllAgents(clientIds);

        if (agents.length === 0) {
            return res.status(404).json({ message: 'No se encontraron agentes asociados a tus clientes.' });
        }

        res.status(200).json({ message: 'Agentes obtenidos correctamente', data: agents });

    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};

// Obtener los datos de un agente por su ID
const getAgentById = async (req, res) => {
    try {
        // Uso el ID que viene por params para buscar el agente
        const agent = await Agent.findAgentById(req.params.id);
        if (!agent) return res.status(404).json({ message: 'Agente no encontrado.' });

        // Respondo con los datos del agente encontrado
        res.status(200).json({ message: 'Agente obtenido correctamente', data: agent });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};



// Exporto todos los métodos para usarlos en las rutas
module.exports = {
    getAgents,
    getAgentById,
};
