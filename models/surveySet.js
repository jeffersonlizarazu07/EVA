const db = require('../config/db'); // Importa la conexión a la base de datos

const SurveySet = {

    getAll: () => db('survey_set').select('*'),

    getById:async (id) =>{
       
        try {
            const result = await db('survey_set').where({ id }).first();
            console.log('Resultado completo:', result);
            //convierte la fecha a formato YYYY-MM-DD
            if(result){
                result.start_date = result.start_date.toISOString().split('T')[0];
                result.end_date = result.end_date.toISOString().split('T')[0];    
            }
            return result;
        } catch (error) {
            console.error('Error al obtener la encuesta:', error);
            throw error; // Lanza el error para que pueda ser manejado por el controlador
        }
    },
    // getByLink: (name, clientId) => {
    //     const query = db('survey_set')
    //         .join('clients', 'clients.id', '=', 'survey_set.idClient')
    //         .where('survey_set.title', name)
    //         .andWhere('survey_set.idClient', clientId)
    //         .select('survey_set.*', 'clients.logo', 'clients.color_tag1', 'clients.color_tag2')
    //         .first();
    
    //     // Log para ver la consulta SQL generada
    //     console.log(query.toString()); // Imprime la consulta SQL generada
    
    //     return query;
    // },

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


    delete: (id) => db('survey_set').where({ id }).del(),

    getSurveysByUser : async (id) => {
        try{
            const result = await db('survey_set')
            .select('survey_Set.*')
            .join('clients', 'survey_Set.idClient', 'clients.id')
            .join('user_clients', 'clients.id', 'user_clients.idClient')
            .join('users', 'user_clients.idUser', 'users.id')
            .where('users.id', id);

             // Formatear las fechas para que solo muestren YYYY-MM-DD
            const formattedResult = result.map(row => ({
                id: row.id,
                title: row.title,
                start_date: row.start_date?.toISOString().split('T')[0],
                end_date: row.end_date?.toISOString().split('T')[0],
                description: row.description,
                link: row.link,
                type: row.type,
                idClient: row.idClient,
                state: row.state
            }));

            return formattedResult;
        }catch (error) {
            console.error('Error al obtener las encuestas del usuario:', error);
            throw error; // Lanza el error para que pueda ser manejado por el controlador
        }
    }

};

module.exports = SurveySet;
