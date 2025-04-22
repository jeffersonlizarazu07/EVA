const db = require('../config/db');

const Agent = {
    getAllAgents: async () => {
        return await db('users')
            .where({ type: 5 })
            .select('id', 'firstname', 'middlename', 'lastname', 'email', 'state', 'type', 'created_at', 'last_visit_date', 'language');
    },
    getAgentById: async (id) => {
        return await db('users')
            .where({ id, type: 5 })
            .first();
    },

    createAgent: async (agentData) => {
        const [newAgentId] = await db('users').insert(agentData);
        return await db('users').where({ id: newAgentId }).first();
    },

    updateAgent: async (id, data) => {
        data.updated_at = new Date();
        await db('users').where({ id, type: 5 }).update(data);
        return await db('users').where({ id }).first();
    },

    toggleAgentState: async (id) => {
        const agent = await db('users').where({ id, type: 5 }).first();
        if (!agent) return null;
    
        const newState = !agent.state;
        await db('users').where({ id }).update({ state: newState });
    
        return await db('users').where({ id }).first();
    },

    deleteAgent: async (id) => {
        const agent = await db('users').where({ id, type: 5 }).first();
        if (!agent) return null;
    
        await db('users').where({ id }).del();
        return agent;
    }
};

module.exports = Agent;
