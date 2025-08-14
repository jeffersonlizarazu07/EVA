const db = require('../config/db');
const {getDateTimeForSQL} = require('../helpers/dateHelper');
class AnswerModel {
    async createAnswer(data) {
        
        console.log('---------Datos recibidos en createAnswer:', data);
        console.log("********************")
        // Función para formatear la fecha correctamente para MySQL
        const formatDateForMySQL = (date) => {
            return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
        };

        const fecha = getDateTimeForSQL(); // Genera la fecha actual
        
        try {
            const insertedAnswers = [];

            // Recorre el array de respuestas
            for (const answerData of data) {
              
              const validData = {
                //survey_id: answerData.survey_id,
                answer: answerData.answer,
                question_id: answerData.question_id,
                date: fecha
              };
        
              // Realiza la inserción y obtén el ID del registro insertado
              const [insertedId] = await db('answers').insert(validData);
              
              const insertedAnswer = { 
                id: insertedId, 
                ...validData 
                };
                
                insertedAnswers.push(insertedAnswer);

              console.log('---------Respuesta insertada correctamente');
            }

            return { success: true, message: 'Respuestas creadas correctamente', insertedAnswers };

          } catch (error) {
            console.error('Error al crear las respuestas:', error);
            return { success: false, message: 'Error al crear las respuestas', error: error.message };
          }
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

    // obtener respuestas por pregunta
    async getAnswersBySurveyScore(){
        try {
            return await db('answers')
            .select('survey_set.link','survey_set.title','questions.select_option','questions.selected_answer','questions.survey_id','answers.question_id', 'questions.type', 'answers.answer', 'questions.question')
            .join('questions', 'answers.question_id', '=', 'questions.id')
            .join('survey_set', 'questions.survey_id', '=', 'survey_set.id');

        } catch (error) {
            console.error('Error en getAnswersBySurveyScore:', error.message);
            throw error;
        }
    }

    // Obtener respuestas por encuesta y fechas
    async getAnswersBySurvey(surveyId, startDate, endDate) {
        try {
            console.log('fecha fin: ',endDate)
            // const answers = await db('answers')
            //     .join('questions', 'answers.question_id', '=', 'questions.id')  // Hacemos el join con 'questions'
            //     .where('answers.survey_id', surveyId)
            //     .andWhere('answers.date', '>=', startDate)
            //     .andWhere('answers.date', '<=', endDate)
            //     .select('answers.question_id', 'questions.type', 'answers.answer');  // Seleccionamos 'type' de 'questions'
            const endDatePlusOneDay = new Date(endDate);
            endDatePlusOneDay.setDate(endDatePlusOneDay.getDate() + 1);
            const formattedEndDate = endDatePlusOneDay.toISOString().split('T')[0];
            console.log('fecha fin +1: ',formattedEndDate)
            const answers = await db('answers')
                .join('questions', 'answers.question_id', '=', 'questions.id')
                .where('questions.survey_id', surveyId)
            .andWhere(db.raw('DATE(answers.date) >= ?', [startDate]))
            .andWhere(db.raw('DATE(answers.date) <= ?', [endDate]))
                .select('answers.question_id', 'questions.type', 'answers.answer', 'questions.question');
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