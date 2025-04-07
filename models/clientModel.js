// models/clientModel.js
const knex = require('../config/db');  // Traemos la configuración de Knex.js


class ClientModel {
    constructor(knex) {
        this.knex = knex;
        this.table = 'clients';  // Nombre de la tabla
    }

    // Método para crear un cliente
    async create(data) {
        try {
            // Inserción de datos en la tabla `clients`
            const [id] = await this.knex(this.table).insert({
                client: data.client,
                state: data.state,
                color_tag1: data.color_tag1,
                color_tag2: data.color_tag2,
                logo: data.logo,  // El logo también se inserta si está presente
            }).returning('id');

            // Devolvemos el cliente con el id generado
            return { id, ...data };
        } catch (error) {
            throw new Error(`Error al crear el cliente: ${error.message}`);
        }
    }
}

module.exports = ClientModel;
