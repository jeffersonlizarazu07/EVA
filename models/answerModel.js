const db = require('../config/db');

class AnswerModel {
    createAnswer(data) {
        // Solo incluir los campos que existen en tu tabla
        const validData = {
            survey_id: data.survey_id,
            answer: data.answer,  // Parece que en la base de datos se llama "answer", aunque en tu objeto lo llamas "answers"
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

}

module.exports = AnswerModel;