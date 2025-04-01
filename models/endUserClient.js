const knex = require('../config/db');

const EndUserClient = {
    getAll: async () => {
        return await knex('enduser_clients');
    },

    getById: async (id) => {
        return await knex('enduser_clients').where({ id }).first();
    },

    create: async (data) => {
        return await knex('enduser_clients').insert(data).returning('*');
    },

    update: async (id, data) => {
        return await knex('enduser_clients').where({ id }).update(data).returning('*');
    },

    delete: async (id) => {
        return await knex('enduser_clients').where({ id }).del();
    }
};

module.exports = EndUserClient;
