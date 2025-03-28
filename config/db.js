require('dotenv').config();
const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    pool: { min: 0, max: 10},

});

// Conexión
knex.raw('SELECT 1')
    .then(() => {
        console.log('Conectado a la base de datos correctamente');
    })
    .catch((err) => {
        console.log('Error al conectar a la base de datos', err.message);
        process.exit(1);
        })

module.exports = knex;        