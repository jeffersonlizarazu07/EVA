const db = require('../config/db');

const Question = {
    getAll: () => db('questions').select('*'),

    getById: (id) => db('questions').where({ id }).first(),

    getBySurvey: (surveyId) => db('questions').where({ survey_id: surveyId }).select('*'),

    create: (data) => db('questions').insert(data).returning('*'),

    update: (id, data) => db('questions').where({ id }).update(data).returning('*'),

    delete: (id) => db('questions').where({ id }).del()
};

module.exports = Question;
