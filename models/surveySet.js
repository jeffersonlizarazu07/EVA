const db = require("../config/db"); // Importa la conexión a la base de datos

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
      
       

    create: async (data) =>{
        //db('survey_set').insert(data),
        try {
            const [id] = await db('survey_set').insert(data);
            return id;
        } catch (error) {
            console.error('Error al crear la encuesta:', error);
            throw error; // Lanza el error para que pueda ser manejado por el controlador
        }
    }, 

    update: async (id, data) => {
        try{
            const updatedRows = await db('survey_set').where({ id }).update(data);
            //sino se actualzo información 
            if (updatedRows === 0) {
                throw new Error(`No se encontró la encuesta con ID ${id}`);
            }
            return { success: true, message: 'Encuesta actualizada correctamente' }
        }catch (error) {
            console.error('Error al actualizar la encuesta:', error);
            return { success: false, message: 'Error al actualizar la encuesta', error: error.message };
        }
    },

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
    },

    getTopSurveys: async (id) => {
        try {
        //     const result = await db('survey_set as s')
        //     .join('answers as a', 's.id', 'a.survey_id')
        //     .join('questions as q', 'a.question_id', 'q.id')
        //     .join('user_clients as uc', 's.idClient', 'uc.idClient')
        //     .where('uc.idUser', id)
        //     .groupBy('s.id', 's.title', 's.link')
        //     .select(
        //       's.id as survey_id',
        //       's.title',
        //       's.link',
        //       db.raw(`CEIL(COUNT(a.id) * 1.0 / NULLIF(COUNT(DISTINCT CASE WHEN q.conditional = 'no' THEN a.question_id END), 0)) AS encuestas_enviadas`)
        //     )
        //     .orderBy('encuestas_enviadas', 'desc')
        //     .limit(5);
          
        //   return result;
        const surveyCompletions = db('answers as a')
        .select('q.survey_id', 'a.date')
        .join('questions as q', 'a.question_id', 'q.id')
        .whereExists(function () {
            this.select(1)
            .from('user_clients as uc')
            .where('uc.idUser', id)
            .andWhere('uc.idClient', db('survey_set').select('idClient').where('id', db.ref('q.survey_id')).limit(1));
        })
        .groupBy('q.survey_id', 'a.date')
        .as('sc');

        const result = await db('survey_set as s')
        .select(
            's.id',
            's.title',
            's.link',
            db.raw('COUNT(DISTINCT sc.date) as encuestas_enviadas')
        )
        .leftJoin(surveyCompletions, 's.id', 'sc.survey_id')
        .join('user_clients as uc', function () {
            this.on('s.idClient', '=', 'uc.idClient')
            .andOn('uc.idUser', '=', db.raw('?', [id]));
        })
        .groupBy('s.id', 's.title', 's.link')
        .orderBy([
            { column: 'encuestas_enviadas', order: 'desc' },
            { column: 's.id', order: 'asc' }
        ])
        .limit(5);
        
        return result;

        } catch (error) {
          console.error('Error al obtener el top de encuestas:', error );
          throw error;
        }            
    },

    //lo de chezet
    copySurvey: async (idOriginalSurvey, link) => {
        if (!idOriginalSurvey || !link) { 
            return { status: false, message: "Faltan parámetros requeridos en la petición." };
        }
    
        try {
            // Obtener la encuesta original
            const getSurveyToCopy = await this.getById(idOriginalSurvey);
            if (!getSurveyToCopy) {
                return { status: false, message: "La encuesta original no existe." };
            }
    
            console.log("Encuesta original obtenida:", getSurveyToCopy);
    
            // Crear la nueva encuesta sin duplicar ID ni link
            delete getSurveyToCopy.id;
            delete getSurveyToCopy.link;
    
            const addSurvey = await this.create({
                title: getSurveyToCopy.title,
                start_date: getSurveyToCopy.start_date,
                end_date: getSurveyToCopy.end_date,
                description: getSurveyToCopy.description,
                link: link,
                type: getSurveyToCopy.type,
                idClient: getSurveyToCopy.idClient,
                state: getSurveyToCopy.state,
            });
    
            if (!addSurvey) {
                return { status: false, message: "Error al crear la encuesta duplicada." };
            }
    
            console.log("Encuesta duplicada creada:", addSurvey);
    
            // traemos las preguntas de la encuesta original y las vinculamos a la nueva encuesta
            const questionsToAttach = await this.getQuestionsBySurveyId(idOriginalSurvey);
            if (!questionsToAttach || questionsToAttach.length === 0) {
                console.log("No se encontraron preguntas en la encuesta original.");
            } else {
                console.log("Preguntas que se asociarán a la encuesta duplicada:", questionsToAttach);
            }
    
            // Retornamos la encuesta duplicada junto con las preguntas originales
            return { 
                status: true, 
                message: "Encuesta duplicada exitosamente con preguntas originales asociadas.", 
                data: { ...addSurvey, questions: questionsToAttach }
            };
    
        } catch (err) { 
            console.error("Error inesperado en el servidor:", err);
            return { status: false, message: "Error inesperado en el servidor.", error: err };
        }
    }

   
};

module.exports = SurveySet;
