const db = require('../config/db'); // Importa la conexión a la base de datos

const SurveySet = {
    getAll: async () => {
        try {
            const result = await db('survey_sets').select('*');
            return result;
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            throw new Error('Error al obtener las encuestas: ' + error.message);
        }
    },

    getById: (id) => db('survey_sets').where({ id }).first(),

    getByLink: (link) => {
        return db('survey_set')
            .join('clients', 'clients.id', '=', 'survey_set.idClient')
            .where('survey_set.link', link)
            .select('survey_set.*', 'clients.logo', 'clients.color_tag1', 'clients.color_tag2')
            .first();
    },

    getByClients: (clientIdsArray) => {
        return db('survey_set')
            .whereIn('idClient', clientIdsArray)
            .select('*');
    },

    create: (data) => db('survey_sets').insert(data),

    update: (id, data) => db('survey_sets').where({ id }).update(data),

    toggleState: (id) => {
        return db('survey_set')
            .where({ id })
            .first()
            .then(survey => {
                if (!survey) return null;
                return db('survey_set').where({ id }).update({ state: !survey.state });
            });
    },

    delete: (id) => db('survey_sets').where({ id }).del()
};

module.exports = SurveySet;
