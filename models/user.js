const db = require('../config/db');

const User = {
    // User por email
    findByEmail: async (email) => {
        return await db('users')
            .where({ email })
            .select('id', 'firstname', 'middlename', 'lastname', 'email', 'password', 'state', 'type')
            .first();
    },
    
    // Clientes por id
    getClientIds: async (userId) => {
        return await db('user_clients')
            .join('clients', 'user_clients.idClient', 'clients.id')
            .where('user_clients.idUser', userId)
            .pluck('clients.id');
    },


     // Obtener un usuario por ID
     findById: async (id) => {
        return await db('users')
            .where({ id })
            .select('id', 'firstname', 'middlename', 'lastname', 'email', 'password', 'state', 'type')
            .first();
    },

    // Obtener todos los usuarios
    getAllUsers: async () => {
        return await db('users').select('id', 'firstname', 'middlename', 'lastname', 'email', 'state', 'type');
    },

    // Crear un nuevo usuario
    createUser: async (userData) => {
        const [newUserId] = await db('users').insert(userData);
        const newUser = await db('users').where({ id: newUserId }).first();
        return newUser;
    },
    

    // Actualizar un usuario por ID
    updateUser: async (id, userData) => {
        await db('users').where({ id }).update(userData);
        const updatedUser = await db('users').where({ id }).first();
        
        return updatedUser;
    },
    

    // Cambiar el estado de un usuario (activo/inactivo)
toggleUserState: async (id) => {
    const user = await db('users').where({ id }).select('state').first();
    if (!user) {
        return null; 
    }

    const newState = !user.state;

    await db('users').where({ id }).update({ state: newState });

    const updatedUser = await db('users').where({ id }).first();

    return updatedUser;
},


    // Eliminar un usuario por ID
    deleteUser: async (id) => {
        const user = await db('users').where({ id }).first();
        if (!user) {
            return null;
        }

        await db('users').where({ id }).del();
        return user;
    }
};

module.exports = User;
