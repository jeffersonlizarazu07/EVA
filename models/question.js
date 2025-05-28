const db = require('../config/db');

const  Question = {
    getAll: () => db('questions').select('*'),

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

    getBySurvey: (surveyId) => db('questions').where({ survey_id: surveyId }).select('*'),

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

    update: (id, data) => db('questions').where({ id }).update(data).returning('*'),

    delete: (id) => db('questions').where({ id }).del(),

    updateConditionalId : async (id, id_conditional) => {
        console.log('Id que llega', id);
        console.log('Id conditional:', id_conditional);
        return db('questions')
        .where({ id })
        .update({ id_conditional });
    }



};

module.exports = Question;
