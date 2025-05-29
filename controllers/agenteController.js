const bcrypt = require('bcryptjs'); // Uso bcrypt para encriptar contraseñas de manera segura
const Agent = require('../models/agentModel'); // Importo el modelo Agent que se encarga de interactuar con la base de datos
const AgentDTO = require('../dtos/agentDTO');

// Obtener la lista de todos los agentes
const getAgents = async (req, res) => {
    try {
        console.log("reqbody",req.body);
        const validateAgent = await AgentDTO.validateAgent(req.body);
        
        if(!validateAgent.status){
            return res.status(400).json(validateAgent);
        }

        const {clients} = req.body; // Obtengo los IDs de los clientes desde el cuerpo de la solicitud

        const clientsArray = clients.split(','); // Divido la cadena de IDs en un array
        //console.log("reqbody",req.body); // Para depuración, imprimo el cuerpo de la solicitud
        // if (!clientsArray || clientsArray.length === 0) {
        //     return res.status(403).json({ message: 'No tienes clientes asociados.' });
        // }

        // Solo traigo agentes relacionados a estos clientes
        const agents = await Agent.getAllAgents(clientsArray);

        if (agents.length === 0) {
            return res.status(404).json({ message: 'No se encontraron agentes asociados a tus clientes.' });
        }

        console.log("agents", agents); // Para depuración, imprimo los agentes encontrados
        res.status(200).json({ message: 'Agentes obtenidos correctamente', data: agents });

    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};

// Obtener los datos de un agente por su ID
const getAgentById = async (req, res) => {
    
    const validarId = AgentDTO.validarId(req.params.id);

    if(!validarId.status){
        return res.status(400).json(validarId);
    }
    try {
        // Uso el ID que viene por params para buscar el agente
        const agent = await Agent.getAgentById(req.params.id);
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
