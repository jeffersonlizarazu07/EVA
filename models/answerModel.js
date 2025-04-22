const db = require('../config/db');
class AnswerModel {
    createAnswer(data) {  // crear la respuesta que envian desde el link 
        const validData = {
            survey_id: data.survey_id,
            answer: data.answer,  
            question_id: data.question_id,
            date: data.date || new Date().toISOString()
        };
        
        return db('answers').insert(validData);
    }
    async getAll() {
        try {
            const answers = await db('answers').select('*');
            return answers;  // Retorna todas las respuestas
        } catch (error) {
            console.error('Error en getAll:', error.message);
            throw error;
        }
    }

    async getById(id) {
        try {
            const answer = await db('answers').where({ id }).first();
            return answer;  // Retorna la respuesta por ID
        } catch (error) {
            console.error('Error en getById:', error.message);
            throw error;
        }
    }

    async update(id, data) {
        try {
            const answer = await db('answers')
                .where({ id }) // Encuentra la fila que corresponde con el id
                .update(data); // Actualiza los valores que se pasan en 'data'
    
            return answer; // Devuelve el resultado de la actualización (número de filas afectadas)
        } catch (error) {
            throw new Error('Error updating answer: ' + error.message);

        }
    }

    async delete(id) {
        try {
            // Intentamos eliminar la respuesta con el id específico
            const result = await db('answers')
                .where({ id })  // Encontramos la fila que corresponde al id
                .del(); // Eliminamos la fila
    
            return result;  // Devuelve el número de filas eliminadas (0 si no se encuentra ninguna fila)
        } catch (error) {
            throw new Error('Error eliminando la respuesta: ' + error.message);
        }
    }

    // Obtener respuestas por encuesta y fechas
    async getAnswersBySurvey(surveyId, startDate, endDate) {
        try {
            const answers = await db('answers')
                .join('questions', 'answers.question_id', '=', 'questions.id')  // Hacemos el join con 'questions'
                .where('answers.survey_id', surveyId)
                .andWhere('answers.date', '>=', startDate)
                .andWhere('answers.date', '<=', endDate)
                .select('answers.question_id', 'questions.type', 'answers.answer');  // Seleccionamos 'type' de 'questions'
    
            return answers;
        } catch (error) {
            console.error('Error en getAnswersBySurvey:', error.message);
            throw error;
        }
    }
    
    // Agrupar respuestas por tipo (por ejemplo, rango de 0 a 10, sí/no, etc.)
    groupAnswersByType(answers, answerType, questionId) {
        try {
            //console.log(`Filtrando respuestas para la pregunta ID: ${questionId}, tipo de respuesta: ${answerType}`);
            const grouped = answers.filter(answer => answer.question_id === questionId);
            
            //cconsole.log('Respuestas agrupadas:', grouped);
    
            // Si no hay respuestas, retornamos un objeto vacío
            if (grouped.length === 0) {
                return {};
            }
    
            const result = grouped.reduce((acc, answer) => {
                const value = answer.answer;
    
                //console.log('Valor de respuesta:', value); // Verifica cada valor de respuesta
    
                if (!acc[value]) {
                    acc[value] = 0;
                }
                acc[value]++;
                return acc;
            }, {});
    
            //console.log('Respuestas contadas:', result);
    
            const totalResponses = grouped.length;
            const percentageResult = {};
            for (const [key, count] of Object.entries(result)) {
                percentageResult[key] = ((count / totalResponses) * 100).toFixed(2);
            }
    
            //console.log('Resultado de porcentajes:', percentageResult);
            return percentageResult;
        } catch (error) {
            console.error('Error en groupAnswersByType:', error.message);
            throw error;
        }
    }
}

module.exports = AnswerModel;