const knex = require('../config/db'); // Aquí importa la configuración de Knex.js

class AnswerModel {
    constructor(knex) {
        this.knex = knex;
        this.table = 'answers';  // Nombre de la tabla de respuestas
    }

    // Método para obtener todas las respuestas
    async getAllAnswers() {
        try {
            console.log('obteniendo respueas de answers') //debugg
            const answers = await this.knex(this.table).select('*');
            console.log('respuestas obtenidas', answers) // debugg
            return answers;
        } catch (error) {
            console.error(`Error al obtener las respuestas: ${error.message}`);
            throw error;
        }
    }


    // metodo para obtener porcentajes 
    // Obtener todas las respuestas con los detalles de las preguntas
    async getAnswersWithQuestions() {
        return knex('answers')
            .join('questions', 'questions.id', '=', 'answers.question_id')
            .select('answers.*', 'questions.type');
    }

    // Método para obtener una respuesta por su ID
    async getAnswerById(id) {
        try {
            const answer = await this.knex(this.table).where('id', id).first();
            return answer;
        } catch (error) {
            console.error(`Error al obtener la respuesta con ID ${id}: ${error.message}`);
            throw error;
        }
    }

    // Método para obtener respuestas por ID de pregunta (question_id)
    async getAnswersByQuestionId(questionId) {
        try {
            const answers = await this.knex(this.table)
                .where('question_id', questionId)  // Filtra las respuestas por question_id
                .select('*');  // Selecciona todas las columnas de la tabla de respuestas
            
            return answers;  // Devuelve las respuestas encontradas
        } catch (error) {
            console.error(`Error al obtener las respuestas para la pregunta con ID ${questionId}: ${error.message}`);
            throw error;  // Lanza el error para ser capturado por el controlador
        }
    }

     // Método para obtener las respuestas de una pregunta específica por ID
     async getAnswersWithQuestionDetails(questionId) {
        try {
            // Obtenemos las respuestas relacionadas con la pregunta mediante un JOIN con la tabla 'questions'
            const answers = await this.knex(this.table)
                .join('questions as q', 'q.id', '=', 'answers.question_id') // Realiza el JOIN
                .select('answers.*', 'q.type', 'q.question') // Seleccionamos las columnas necesarias
                .where('q.id', questionId); // Filtramos por el ID de la pregunta

            return answers;
        } catch (error) {
            console.error(`Error al obtener respuestas de la pregunta con ID ${questionId}: ${error.message}`);
            throw error; // Lanza el error para manejarlo en el controlador
        }
    }







    // Método para obtener las respuestas por encuesta con fechas y tipo de pregunta
    async getAnswersBySurvey(id, startDate, endDate) {
        try {
            console.log('Consultando respuestas para la encuesta con ID:', id);
            console.log('Fecha de inicio:', startDate, 'Fecha de fin:', endDate);
            
            const answers = await this.knex('answers')
                .join('questions as q1', 'q1.id', '=', 'answers.question_id')
                .join('survey_sets', 'survey_sets.id', '=', 'q1.survey_id')
                .select('answers.*', 'q1.type', 'q1.question')
                .where('survey_sets.id', id)
                .whereBetween('answers.created_at', [startDate, endDate])
                .orderByRaw('CAST(answers.answer AS UNSIGNED) ASC');

            console.log('Respuestas obtenidas:', answers);
            return answers;
        } catch (error) {
            console.error(`Error al obtener respuestas para la encuesta ${id}:`, error.message);
            throw error;
        }
    }

    // Función para calcular el porcentaje
    calculatePercentage(collection, total) {
        console.log(`Calculando porcentaje para ${collection.length} respuestas de un total de ${total}`);
        return total > 0 ? (collection.length / total) * 100 : 0;
    }

    // Método para agrupar respuestas por tipo y calcular el porcentaje
    groupAnswersByType(answers, type, question) {
        console.log(`Agrupando respuestas por tipo: ${type} y pregunta: ${question}`);
        
        const groupAnswers = answers.filter(answer => answer.type === type && answer.question === question);
        const total = groupAnswers.length;

        const groupedPercentages = groupAnswers.reduce((acc, answer) => {
            const key = answer.answer;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        // Convertir los conteos a porcentajes
        for (const key in groupedPercentages) {
            groupedPercentages[key] = this.calculatePercentage([groupedPercentages[key]], total);
        }

        console.log(`Porcentajes para el tipo ${type}:`, groupedPercentages);
        return groupedPercentages;
    }






    

   
    // Método para insertar respuestas
    async createAnswer(answerData) {
        try {
            // Insertar los datos en la tabla 'answers' y devolver el registro insertado
            const [newAnswer] = await this.knex(this.table).insert(answerData).returning('*');
            return newAnswer;
        } catch (error) {
            console.error(`Error al insertar la respuesta: ${error.message}`);
            throw error;
        }
    }

    // Método para actualizar una respuesta
    async updateAnswer(id, data) {
        try {
            const updated = await this.knex(this.table).where('id', id).update(data);
            return updated;
        } catch (error) {
            console.error(`Error al actualizar la respuesta con ID ${id}: ${error.message}`);
            throw error;
        }
    }

    // Método para eliminar una respuesta
    async deleteAnswer(id) {
        try {
            const deleted = await this.knex(this.table).where('id', id).del();
            return deleted;
        } catch (error) {
            console.error(`Error al eliminar la respuesta con ID ${id}: ${error.message}`);
            throw error;
        }
    }
}

module.exports = AnswerModel;
