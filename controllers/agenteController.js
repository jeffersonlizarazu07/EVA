const bcrypt = require('bcryptjs');
const Agent = require('../models/agentModel');

// Listar todos los agentes
const getAgents = async (req, res) => {
    try {
        const agents = await Agent.getAllAgents();
        if (agents.length === 0) {
            return res.status(404).json({ message: 'No se encontraron agentes.' });
        }
        res.status(200).json({ message: 'Agentes obtenidos correctamente', data: agents });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};

// Obtener agente por ID
const getAgentById = async (req, res) => {
    try {
        const agent = await Agent.findAgentById(req.params.id);
        if (!agent) return res.status(404).json({ message: 'Agente no encontrado.' });

        res.status(200).json({ message: 'Agente obtenido correctamente', data: agent });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};

// Crear un nuevo agente
const createAgent = async (req, res) => {
    const { firstname, middlename, lastname, email, language, password } = req.body;

    if (!firstname || !lastname || !email || !language || !password) {
        return res.status(400).json({ message: 'Faltan campos requeridos.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAgent = await Agent.createAgent({
            firstname,
            middlename,
            lastname,
            email,
            password: hashedPassword,
            type: 5,
            language,
            state: 1,
            accessToken: null,
            token_Exp: null,
            registration_date: new Date(),
            updated_at: new Date(),
            created_at: new Date()
        });

        res.status(201).json({ message: 'Agente creado correctamente', data: newAgent });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};

// Actualizar agente
const updateAgent = async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    try {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        } else {
            delete data.password;
        }

        const updated = await Agent.updateAgent(id, data);
        if (!updated) return res.status(404).json({ message: 'Agente no encontrado' });

        res.status(200).json({ message: 'Agente actualizado correctamente', data: updated });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};

// Cambiar estado de un agente
const toggleAgentState = async (req, res) => {
    const { id } = req.params;

    try {
        const updated = await Agent.toggleAgentState(id);
        if (!updated) return res.status(404).json({ message: 'Agente no encontrado' });

        res.status(200).json({ message: 'Estado actualizado correctamente', data: updated });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};

// Eliminar agente
const deleteAgent = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await Agent.deleteAgent(id);
        if (!deleted) return res.status(404).json({ message: 'Agente no encontrado' });

        res.status(200).json({ message: 'Agente eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};

module.exports = {
    getAgents,
    getAgentById,
    createAgent,
    updateAgent,
    toggleAgentState,
    deleteAgent
};
