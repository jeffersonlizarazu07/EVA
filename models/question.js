const db = require('../config/db');

const  Question = {
    getAll: async () =>{
        try {
            const res = await db('questions').select('*')
            return res;
        }catch (error) {
            console.error("Error al eliminar el formulario:", error);
            throw new Error("No se pudo eliminar el formulario debido a un error en el servidor." + error.message);
        }
    },

    // getById: (id) => db('questions').where({ id }).first(),
    getById : async (id) => {
        try {
            const question = await db('questions').where({ id }).first();
            return question;
        } catch (error) {
            console.error('Error al obtener la pregunta por ID:', error);
            throw new Error('No se pudo obtener la pregunta.');
        }
    },

    getBySurvey: async (surveyId) => {
        try {
            const res = await db('questions').where({ survey_id: surveyId }).select('*')
            return res;
        }catch (error) {
            console.error("Error al eliminar el formulario:", error);
            throw new Error("No se pudo eliminar el formulario debido a un error en el servidor." + error.message);
        }
    },

    // create: (data) => db('questions').insert(data).returning('*'),
    create: async (data) => {
        try {
            const [id] = await db('questions').insert(data);
            return { id, ...data };
        } catch (error) {
            console.error('Error inserting question:', error);
            throw error;
        }
    },

    // update: (id, data) => db('questions').where({ id }).update(data).returning('*'),
    update: async (id, data) => {
        try {
            await db('questions').where({ id }).update(data);
            const updated = await db('questions').where({ id }).first();
            return updated;
        } catch (error) {
            console.error('Error updating question:', error);
            throw error; // O manejarlo como necesites
        }
    },

    delete: async (id) =>{
        try {
            const res = await db('questions').where({ id }).del()
            return res;
        }catch (error) {
            console.error("Error al eliminar el formulario:", error);
            throw new Error("No se pudo eliminar el formulario debido a un error en el servidor." + error.message);
        }
    }, 

    updateConditionalId : async (id, id_conditional) => {
        try{
            console.log('Id que llega', id);
            console.log('Id conditional:', id_conditional);
            return await db('questions')
                .where({ id })
                .update({ id_conditional });
        }catch (error) {
            console.error("Error al eliminar el formulario:", error);
            throw new Error("No se pudo eliminar el formulario debido a un error en el servidor." + error.message);
        }
    }



};

module.exports = Question;
