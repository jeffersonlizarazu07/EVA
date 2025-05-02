const knex = require('../config/db');  // Traemos la configuración de Knex.js
const { answersByQuestion } = require('../controllers/answerController');

class blockModel {
    constructor(knex) {
        this.knex = knex;
        this.table = 'form_set';  // Nombre de la tabla en la base de datos
    }

    // Método para crear un bloque
    async createBlock(data) {
        try {
            // Insertamos el nuevo bloque en la base de datos
            await this.knex(this.table).insert({
                idBlock: data.idBlock || null, // ID del bloque - opcional
                name: data.name, // Nombre del bloque
                weight: data.weight, // Ponderación del bloque
                position: data.position, // Posición del bloque
                numberQuestions: data.numberQuestions, // Número de preguntas en el bloque
                textQuestion: data.textQuestion, // Texto de la pregunta del bloque
                TypeAnswer: data.TypeAnswer, // Tipo de respuesta del bloque
                answersByQuestion: data.TypeAnswersByQuestion, // Respuestas por pregunta del bloque (serializado)
            });

            // Obtenemos el id del último bloque insertado
            const [id] = await this.knex.raw('SELECT LAST_INSERT_ID() as id');

            return { id: id[0].id, ...data }; 
        } catch (error) {
            throw new Error(`Error al crear el bloque: ${error.message}`);
        }
    }
}