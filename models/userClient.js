const db = require('../config/db');

const UserClient = {
    getAll: () => db('user_clients').select('*'),

    getByUserId: (idUser) => {
        return db('user_clients')
            .where({ idUser })
            .leftJoin('clients', 'user_clients.idClient', 'clients.id')
            .leftJoin('users', 'user_clients.idUser', 'users.id')
            .select('user_clients.*', 'clients.client as clientName', 'users.id as userId');
    },

    create: (associations) => {
        return db('user_clients').insert(
            associations.map(assoc => ({
                idUser: assoc.idUser,
                idClient: assoc.clientId
            }))
        );
    }, 

    updateByUserId: (idUser, clientIds) => {
        return db.transaction(async trx => {
            await trx('user_clients').where({ idUser }).del();
            return trx('user_clients').insert(
                clientIds.map(clientId => ({ idUser, idClient: clientId }))
            );
        });
    },

    deleteById: (id) => db('user_clients').where({ id }).del()
};

module.exports = UserClient;