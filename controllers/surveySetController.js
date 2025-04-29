const SurveySet = require('../models/surveySet');
const Question = require('../models/question');


const surveySetController = {
   /* async surveys(req, res) {
        try {
            const surveys = await SurveySet.getAll();
            if (surveys.length === 0) {
                return res.status(404).json({ status: '404', message: 'No se encontraron encuestas' });
            }
            res.json({ status: '200', message: 'Encuestas obtenidas correctamente', data: surveys });
        } catch (error) {
            res.status(500).json({ status: '500', message: 'Error interno del servidor', error });
        }
    },*/

    async surveys(req, res) {
        try {
            console.log('Iniciando la consulta de encuestas...');
            const surveys = await SurveySet.getAll();
            console.log('Encuestas obtenidas:', surveys);
    
            if (surveys.length === 0) {
                return res.status(404).json({ status: '404', message: 'No se encontraron encuestas' });
            }
    
            // Transformar las fechas y otros posibles valores antes de enviarlos
            const formattedSurveys = surveys.map(survey => ({
                id: survey.id,
                title: survey.title,
                start_date: survey.start_date === '0000-00-00' ? null : survey.start_date,  // Convertir fechas inválidas a null
                end_date: survey.end_date === '0000-00-00' ? null : survey.end_date,  // Lo mismo para end_date
                description: survey.description,
                link: survey.link,
                type: survey.type,
                idClient: survey.idClient,
                state: survey.state
            }));
    
            res.json({
                status: '200',
                message: 'Encuestas obtenidas correctamente',
                data: formattedSurveys,
            });
    
        } catch (error) {
            console.error('Error interno en la consulta de encuestas:', error); // Detalles del error
            res.status(500).json({ status: '500', message: 'Error interno del servidor', error: error.message });
        }
    },

    async surveyByID(req, res) {
        try {
            // Imprimir el ID recibido para verificar que es correcto
            console.log('Recibiendo solicitud para obtener encuesta con ID:', req.params.id);
    
            const id = req.params.id;  // Asegúrate de que el ID se pase desde los parámetros de la solicitud
            console.log('ID de encuesta:', id);
    
            const survey = await SurveySet.getById(id);
    
            // Verificar si la encuesta fue encontrada
            if (!survey) {
                console.log('Encuesta no encontrada con ID:', id);  // Si no se encuentra la encuesta, imprime el ID
                return res.status(404).json({ status: '404', message: 'Encuesta no encontrada' });
            }
    
            // Si la encuesta fue encontrada, imprimir los datos
            console.log('Encuesta encontrada:', survey);
    
            // Responder con los datos de la encuesta
            res.json({ status: '200', message: 'Encuesta obtenida correctamente', data: survey });
    
        } catch (error) {
            // Si hay un error en la ejecución, imprimirlo
            console.error('Error al obtener la encuesta:', error);
            res.status(500).json({ status: '500', message: 'Error interno del servidor', error });
        }
    },
    
    async surveyByLink(req, res) {
        try {
            console.log('Parámetro del link recibido:', req.query);
        
            const { link } = req.query;
        
            if (!link) {
                return res.status(400).json({ status: '400', message: 'Falta el parámetro "link"' });
            }
        
            // Decodificar el link de base64 a un objeto JSON
            const decodedLink = Buffer.from(link, 'base64').toString('utf-8');
            console.log('Link decodificado:', decodedLink);
        
            const linkData = JSON.parse(decodedLink); 
            console.log('Datos del link:', linkData);
        
            const { name, clientId } = linkData;
        
            // Asegurarse de que los valores necesarios estén presentes
            if (!name || !clientId) {
                return res.status(400).json({ status: '400', message: 'Faltan parámetros en el link decodificado' });
            }
        
            // Verificar que los parámetros se pasen correctamente a la consulta
            console.log('Buscando encuesta con título:', name, 'y ID de cliente:', clientId);
        
            // Realizamos la consulta utilizando el título y el ID del cliente
            const survey = await SurveySet.getByLink(name, clientId); // Pasamos los parámetros correctamente
            console.log('Encuesta encontrada para el link:', survey);
        
            if (!survey) {
                return res.status(404).json({ status: '404', message: 'Encuesta no encontrada' });
            }
        
            // Nueva parte: Obtener las preguntas de la encuesta
            // Asegúrate de tener una ruta o función para obtener preguntas asociadas a la encuesta
            const question = await Question.getBySurvey(survey.id);  // Llamada a la función que obtiene las preguntas asociadas a esta encuesta
            console.log('Preguntas de la encuesta:', question);
        
            // Ahora devolvemos tanto la encuesta como las preguntas
            res.json({
                status: '200',
                message: 'Encuesta obtenida correctamente',
                data: {
                    survey_set: survey,  // Información de la encuesta
                    question: question  // Preguntas asociadas
                }
            });
    
            console.log('Encuesta y preguntas enviadas correctamente');
        } catch (error) {
            console.error('Error en surveyByLink:', error);
            res.status(500).json({ status: '500', message: 'Error interno del servidor', error: error.message });
        }
    },
    
    
    
    
    
    
    

    async surveysxClients(req, res) {
        try {
            const clientIds = req.query.clientIds ? req.query.clientIds.split(',').map(Number) : [];
            if (!clientIds.length) {
                return res.status(400).json({ status: '400', message: 'Parámetro clientIds es requerido.' });
            }
            const surveys = await SurveySet.getByClients(clientIds);
            if (surveys.length === 0) {
                return res.status(404).json({ status: '404', message: 'No se encontraron encuestas para los clientes proporcionados' });
            }
            res.json({ status: '200', message: 'Encuestas obtenidas correctamente', data: surveys });
        } catch (error) {
            res.status(500).json({ status: '500', message: 'Error interno del servidor', error });
        }
    },

    async postSurvey(req, res) {
        try {
            const data = req.body;
            console.log('datos recibidos',data)
            await SurveySet.create(data);
            res.status(201).json({ status: '201', message: 'Encuesta creada correctamente' });
            console.log('encuesta creada exitosamente')
        } catch (error) {
            res.status(500).json({ status: '500', message: 'Error al crear la encuesta', error });
            console.log('error al crear la enceesta,', error,error)
        }
    },

    async putSurvey(req, res) {
        try {
            const updated = await SurveySet.update(req.params.id, req.body);
            if (!updated) {
                return res.status(404).json({ status: '404', message: 'Encuesta no encontrada' });
            }
            res.json({ status: '200', message: 'Encuesta actualizada correctamente' });
        } catch (error) {
            res.status(500).json({ status: '500', message: 'Error al actualizar la encuesta', error });
        }
    },

    async patchSurvey(req, res) {
        try {
            const updated = await SurveySet.toggleState(req.params.id);
            if (!updated) {
                return res.status(404).json({ status: '404', message: 'Encuesta no encontrada' });
            }
            res.json({ status: '200', message: 'Estado de la encuesta actualizado correctamente' });
        } catch (error) {
            res.status(500).json({ status: '500', message: 'Error al cambiar el estado', error });
        }
    },

    async deleteSurvey(req, res) {
        try {
            const deleted = await SurveySet.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({ status: '404', message: 'Encuesta no encontrada' });
            }
            res.json({ status: '200', message: 'Encuesta eliminada correctamente' });
        } catch (error) {
            res.status(500).json({ status: '500', message: 'Error al eliminar la encuesta', error });
        }
    }
};

module.exports = surveySetController;