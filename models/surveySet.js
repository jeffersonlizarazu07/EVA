const db = require('../config/db'); // Importa la conexión a la base de datos

const SurveySet = {
    getAll: () => db('survey_set').select('*'),

    getById: (id) => db('survey_set').where({ id }).first(),

    getByLink: (name, clientId) => {
        const query = db('survey_set')
            .join('clients', 'clients.id', '=', 'survey_set.idClient')
            .where('survey_set.title', name)
            .andWhere('survey_set.idClient', clientId)
            .select('survey_set.*', 'clients.logo', 'clients.color_tag1', 'clients.color_tag2')
            .first();
    
        // Log para ver la consulta SQL generada
        console.log(query.toString()); // Imprime la consulta SQL generada
    
        return query;
    },
    
    
    

    getByClients: (clientIdsArray) => {
        return db('survey_set')
            .whereIn('idClient', clientIdsArray)
            .select('*');
    },

    create: (data) => db('survey_set').insert(data),

    update: (id, data) => db('survey_set').where({ id }).update(data),

    toggleState: (id) => {
        return db('survey_set')
            .where({ id })
            .first()
            .then(survey => {
                if (!survey) return null;
                return db('survey_set').where({ id }).update({ state: !survey.state });
            });
    },

    delete: (id) => db('survey_set').where({ id }).del()
};

module.exports = SurveySet;
