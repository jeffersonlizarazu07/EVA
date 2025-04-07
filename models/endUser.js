const db = require('../config/db');

const EndUser = {
    getAll: () => db('end_users'),
    
    getById: (id) => db('end_users').where({ id }).first(),
    
    create: (data) => db('end_users').insert(data).returning('*'),
    
    update: (id, data) => db('end_users').where({ id }).update(data).returning('*'),
    
    toggleState: (id) => db('end_users')
        .where({ id })
        .update({ state: db.raw('NOT state') })
        .returning('*'),
    
    delete: (id) => db('end_users').where({ id }).del()
};

module.exports = EndUser;
