const SurveySet = require('../models/surveySet');

const surveySetController = {
    async surveys(req, res) {
        try {
            const surveys = await SurveySet.getAll();
            if (surveys.length === 0) {
                return res.status(404).json({ status: '404', message: 'No se encontraron encuestas' });
            }
            res.json({ status: '200', message: 'Encuestas obtenidas correctamente', data: surveys });
        } catch (error) {
            res.status(500).json({ status: '500', message: 'Error interno del servidor', error });
        }
    },

    async surveyByID(req, res) {
        try {
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
