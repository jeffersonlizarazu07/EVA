const SurveySet = require('../models/surveySet');

const surveySetController = {
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
                survey_id: survey.survey_id,
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
            const id = req.params.id;

            // Verificar si el ID fue recibido correctamente
            console.log(`ID recibido: ${id}`);
            // Asegurarse de que el id es un valor válido
        if (!id || isNaN(id)) {
            return res.status(400).json({
                status: '400',
                message: 'ID no válido',
            });
        }

            //SurveySet.getById(29).then(data => console.log(data)).catch(err => console.error(err));
            const survey = await SurveySet.getById(id);
            if (!survey) {
                return res.status(404).json({ status: '404', message: 'Encuesta no encontrada' });
            }
            res.json({ status: '200', message: 'Encuesta obtenida correctamente', data: survey });
        } catch (error) {
            res.status(500).json({ status: '500', message: 'Error interno del servidor', error });
        }
    },
    
    async surveyByLink(req, res) {
        try {
            const survey = await SurveySet.getByLink(req.query.link);
            if (!survey) {
                return res.status(404).json({ status: '404', message: 'Encuesta no encontrada' });
            }
            res.json({ status: '200', message: 'Encuesta obtenida correctamente', data: survey });
        } catch (error) {
            res.status(500).json({ status: '500', message: 'Error interno del servidor', error });
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
            await SurveySet.create(data);
            res.status(201).json({ status: '201', message: 'Encuesta creada correctamente' });
        } catch (error) {
            res.status(500).json({ status: '500', message: 'Error al crear la encuesta', error });
        }
    },

    async putSurvey(req, res) {
        const { id } = req.params;  // Desestructuramos el id de los parámetros de la URL
    
        console.log(`ID recibido para actualización: ${id}`);  // Log para ver qué id estamos recibiendo
    
        try {
            // Llamamos al modelo para actualizar la encuesta
            const updated = await SurveySet.update(id, req.body);
    
            if (!updated) {
                console.log(`No se encontró encuesta con el ID: ${id}`);  // Agrega un log si no se encuentra la encuesta
                return res.status(404).json({ status: '404', message: `Encuesta con ID ${id} no encontrada` });
            }
    
            console.log(`Encuesta con ID ${id} actualizada correctamente`);  // Log de éxito
            return res.json({ status: '200', message: `Encuesta con ID ${id} actualizada correctamente` });
        } catch (error) {
            console.error(`Error al actualizar la encuesta con ID ${id}: ${error.message}`);  // Agregar el ID al log de error
            console.error(error.stack);  // Muestra el stack trace para depuración más detallada
    
            return res.status(500).json({ 
                status: '500', 
                message: 'Error al actualizar la encuesta',
                error: error.message || error  // Asegúrate de enviar detalles sobre el error en la respuesta
            });
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
