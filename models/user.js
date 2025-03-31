const db = require('../config/db');

const User = {
    findByEmail: async (email) => {
        return await db('users')
            .where({ email })
            .select('id', 'firstname', 'middlename', 'lastname', 'email', 'password', 'state', 'type')
            .first();
    },
    
    getClientIds: async (userId) => {
        return await db('user_clients')
            .join('clients', 'user_clients.idClient', 'clients.id')
            .where('user_clients.idUser', userId)
            .pluck('clients.id');
    }
};

module.exports = User;
