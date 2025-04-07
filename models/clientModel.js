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
            const [id] = await this.knex(this.table).insert({
                client: data.client,
                state: data.state,
                color_tag1: data.color_tag1,
                color_tag2: data.color_tag2,
                logo: data.logo,  // El logo también se inserta si está presente
            }).returning('id');

            return { id, ...data };  // Devuelve el cliente con el id generado
        } catch (error) {
            throw new Error(`Error al crear el cliente: ${error.message}`);
        }
    }

    // Método para obtener todos los clientes
    async getAll() {
        try {
            return await this.knex(this.table).select('*');
        } catch (error) {
            throw new Error(`Error al obtener los clientes.: ${error.message}`);
        }
    }

    // Método para obtener un cliente por su ID
    async getById(id) {
        try {
            const client = await this.knex(this.table).where('id', id).first();
            return client;
        } catch (error) {
            throw new Error(`Error al obtener el cliente: ${error.message}`);
        }
    }

    // Método para actualizar un cliente
    async update(id, data) {
        try {
            await this.knex(this.table).where('id', id).update(data);
            return { id, ...data };
        } catch (error) {
            throw new Error(`Error al actualizar el cliente: ${error.message}`);
        }
    }

    // Método para eliminar un cliente
    async delete(id) {
        try {
            await this.knex(this.table).where('id', id).del();
        } catch (error) {
            throw new Error(`Error al eliminar el cliente: ${error.message}`);
        }
    }

    // Método para cambiar el estado del cliente
    async toggleState(id) {
        try {
            const client = await this.getById(id);
            const newState = client.state === 1 ? 0 : 1;  // Cambiar entre 1 y 0
            await this.update(id, { state: newState });
            return { id, state: newState };
        } catch (error) {
            throw new Error(`Error al cambiar el estado del cliente: ${error.message}`);
        }
    }
}

module.exports = ClientModel;
