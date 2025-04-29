

const AnswerModel = require('../models/answerModel');
const { createAnswer } =  require('../models/answerModel')
const answerModel = new AnswerModel();  // Importamos el modelo
const db = require('../config/db');
//const { check, validationResult } = require('express-validator');
const { body, validationResult } = require('express-validator');
const { check } = require('express-validator');


class AnswerController {

    // Obtiene todas las respuestas
    async  getAllAnswers(req, res) {
        try {
            // Llamamos al método getAll del modelo para obtener todas las respuestas
            const answers = await answerModel.getAll();
            // Enviamos la respuesta con los datos obtenidos
            res.status(200).json({
                success: true,
                data: answers
            });
        } catch (error) {
            console.error('Error al obtener respuestas:', error.message);
            res.status(500).json({
                success: false,
                message: 'Hubo un error al obtener las respuestas'
            });
        }
    }
    


    // Función para calcular el porcentaje
    calculatePercentage(collection, total) {
        return total > 0 ? (collection.length / total) * 100 : 0;
    }

    // Función para agrupar las respuestas por tipo de pregunta
    groupAnswersByType(answers, type) {
        const groupAnswers = answers.filter(answer => answer.type === type);
        const total = groupAnswers.length;

        // Agrupar las respuestas por cada tipo de respuesta y calcular el porcentaje
        const groupedPercentages = groupAnswers.reduce((acc, answer) => {
            const key = answer.answer;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        // Convertir los conteos a porcentajes
        for (const key in groupedPercentages) {
            groupedPercentages[key] = this.calculatePercentage([groupedPercentages[key]], total); // Usamos `this` para acceder a calculatePercentage
        }

        return groupedPercentages;
    }

    // Controlador para obtener los porcentajes de respuestas
    async percentageAnswer(req, res) {
        try {
            const answers = await AnswerModel.getAnswersWithQuestions(); /// AQUIIII models

            // Calcular porcentajes por tipo de pregunta
            const percentageZeroToTen = this.groupAnswersByType(answers, 'range_zerototen');
            const percentageYesNo = this.groupAnswersByType(answers, 'yes_no');
            const percentageRangeDifficulty = this.groupAnswersByType(answers, 'range_difficulty');
            const percentageOneToFive = this.groupAnswersByType(answers, 'range_onetofive');

            const response = {
                status: 200,
                message: 'Porcentaje de respuestas obtenido correctamente.',
                data: {}
            };

            if (Object.keys(percentageZeroToTen).length > 0) {
                response.data.range_zerototen = percentageZeroToTen;
            }
            if (Object.keys(percentageYesNo).length > 0) {
                response.data.yes_no = percentageYesNo;
            }
            if (Object.keys(percentageRangeDifficulty).length > 0) {
                response.data.range_difficulty = percentageRangeDifficulty;
            }
            if (Object.keys(percentageOneToFive).length > 0) {
                response.data.range_onetofive = percentageOneToFive;
            }

            res.status(200).json(response);
        } catch (error) {
            console.error('Error al obtener los porcentajes de las respuestas:', error.message);
            res.status(500).json({
                status: 500,
                message: 'Hubo un error al obtener los porcentajes de las respuestas.'
            });
        }
    }

    // Obtiene una respuesta por ID
    async getAnswerById(req, res) {
        const { id } = req.params;
        console.log(`id recibido: ${id}`);
        try {
            const answer = await answerModel.getById(id);
            if (!answer) {
                console.log('respuest encontrada', answer)
                return res.status(404).json({ status: 404, message: `La respuesta con el ID: ${id} no fue encontrada.` });
            }
            return res.status(200).json({ status: 200, message: "Respuesta obtenida correctamente.", data: answer });
        } catch (error) {
            console.error(`Error en getAnswerById: ${error.message}`);
            return res.status(500).json({ status: 500, message: "Error al obtener la respuesta." });
        }
    }

    // Método para obtener respuestas por ID de pregunta
        async answersByQuestion(req, res) {
            const { id } = req.params;  // Obtiene el 'id' de la URL
            console.log(`ID recibido del front: ${id}. Se hará la consulta para question_id.`);

            // Validar si el ID es un número válido
            if (isNaN(id)) {
                return res.status(400).json({
                    status: 400,
                    message: "El ID de la pregunta debe ser un número válido."
                });
            }

            try {
                // Llama al modelo para obtener las respuestas relacionadas con la pregunta
                const answers = await AnswerModel.getAnswersByQuestionId(id);
                console.log('Respuestas obtenidas:', answers);

                if (!answers || answers.length === 0) {
                    return res.status(404).json({
                        status: 404,
                        message: `No hay respuestas para la pregunta con ID: ${id}.`
                    });
                }

                return res.status(200).json({
                    status: 200,
                    message: "Respuestas obtenidas correctamente.",
                    data: answers
                });
            } catch (error) {
                console.error(`Error al obtener respuestas para la pregunta con ID ${id}: ${error.message}`);

                return res.status(500).json({
                    status: 500,
                    message: "Error al obtener las respuestas.",
                    error: error.message
                });
            }
        }

        // Método para obtener los porcentajes de respuestas por tipo de pregunta
    async answersByQuestionPercentage(req, res) {
        const { id } = req.params;  // Obtiene el ID de la pregunta desde los parámetros de la URL
        console.log(`ID de la pregunta recibido: ${id}`); // Log del ID recibido

        try {
            // Obtiene las respuestas para la pregunta con el ID proporcionado
            console.log('Obteniendo respuestas para la pregunta...');
            const answers = await AnswerModel.getAnswersWithQuestionDetails(id);
            console.log(`Respuestas obtenidas: ${JSON.stringify(answers)}`); // Log de las respuestas obtenidas

            // Si no se encuentran respuestas, devuelve un mensaje de error
            if (answers.length === 0) {
                console.log(`No se encontraron respuestas para la pregunta con ID: ${id}`); // Log si no hay respuestas
                return res.status(404).json({
                    status: 404,
                    message: `No hay respuestas para la pregunta con el ID: ${id}.`
                });
            }

            // Función para calcular el porcentaje de un conjunto de respuestas
            const calculatePercentage = (collection, total) => {
                const percentage = total > 0 ? (collection.length / total) * 100 : 0;  // Evita dividir por cero
                console.log(`Porcentaje calculado: ${percentage}% para ${collection.length} respuestas de ${total} total`); // Log del porcentaje
                return percentage;
            };

            // Función para agrupar las respuestas por tipo y calcular el porcentaje para cada tipo
            const groupAnswersByType = (type) => {
                // Filtra las respuestas por el tipo de pregunta
                const groupedAnswers = answers.filter(answer => answer.type === type);
                const total = groupedAnswers.length;

                console.log(`Agrupando respuestas de tipo ${type}...`); // Log de agrupación
                console.log(`Total de respuestas para el tipo ${type}: ${total}`); // Log del total por tipo

                // Agrupa las respuestas por el valor de 'answer' y calcula el porcentaje
                const result = groupedAnswers.reduce((acc, answer) => {
                    acc[answer.answer] = (acc[answer.answer] || 0) + 1;  // Contar las respuestas por cada valor
                    return acc;
                }, {});

                // Calcula el porcentaje para cada valor de respuesta
                for (const key in result) {
                    result[key] = calculatePercentage([result[key]], total); // Llama a la función para calcular el porcentaje
                }

                console.log(`Resultado agrupado para el tipo ${type}: ${JSON.stringify(result)}`); // Log de las respuestas agrupadas
                return result;
            };

            // Calcula los porcentajes para diferentes tipos de preguntas
            console.log('Calculando porcentajes para los tipos de preguntas...');
            const percentageZeroToTen = groupAnswersByType('range_zerototen');
            const percentageYesNo = groupAnswersByType('yes_no');
            const percentageRangeDifficulty = groupAnswersByType('range_difficulty');
            const percentageOneToFive = groupAnswersByType('range_onetofive');

            // Prepara la respuesta final
            let response = {
                status: 200,
                message: 'Porcentaje de respuestas obtenido correctamente.',
                data: {}
            };

            let percentages = {};

            if (Object.keys(percentageZeroToTen).length > 0) {
                percentages['range_zerototen'] = percentageZeroToTen;
                console.log(`Porcentaje para 'range_zerototen': ${JSON.stringify(percentageZeroToTen)}`); // Log de 'range_zerototen'
            }
            if (Object.keys(percentageYesNo).length > 0) {
                percentages['yes_no'] = percentageYesNo;
                console.log(`Porcentaje para 'yes_no': ${JSON.stringify(percentageYesNo)}`); // Log de 'yes_no'
            }
            if (Object.keys(percentageRangeDifficulty).length > 0) {
                percentages['range_difficulty'] = percentageRangeDifficulty;
                console.log(`Porcentaje para 'range_difficulty': ${JSON.stringify(percentageRangeDifficulty)}`); // Log de 'range_difficulty'
            }
            if (Object.keys(percentageOneToFive).length > 0) {
                percentages['range_onetofive'] = percentageOneToFive;
                console.log(`Porcentaje para 'range_onetofive': ${JSON.stringify(percentageOneToFive)}`); // Log de 'range_onetofive'
            }

            if (Object.keys(percentages).length > 0) {
                response.data = {
                    question: answers[0].question,  // Agrega la pregunta
                    percentages: percentages  // Agrega los porcentajes calculados
                };
                console.log('Datos de respuesta preparados para la respuesta final'); // Log antes de devolver la respuesta
            } else {
                response = {
                    status: 404,
                    message: "No hay respuestas asociadas a la pregunta consultada"
                };
                console.log('No se encontraron respuestas con porcentajes.'); // Log si no hay respuestas con porcentajes
            }

            // Devuelve la respuesta en formato JSON
            return res.status(200).json(response);

        } catch (error) {
            console.error(`Error al obtener los porcentajes de respuestas para la pregunta con ID ${id}: ${error.message}`);
            return res.status(500).json({
                status: 500,
                message: "Error al obtener los porcentajes de las respuestas."
            });
        }
    }


        // Controlador para obtener los porcentajes de respuestas por encuesta
        async percentagesXSurvey(req, res) {
            const { id } = req.params;
            const { startDate, endDate } = req.query; // Obtenemos las fechas del query params
        
            try {
                console.log(`Iniciando cálculo de porcentajes para la encuesta con ID: ${id}`);
                console.log(`Rango de fechas: Desde ${startDate} hasta ${endDate}`);
                
                const answerModel = new AnswerModel();  // Instanciamos el modelo
                const answers = await answerModel.getAnswersBySurvey(id, startDate, endDate); // Obtenemos las respuestas
        
                if (answers.length === 0) {
                    console.log('No se encontraron respuestas para la encuesta con ID:', id);
                    return res.status(404).json({
                        status: 404,
                        message: "No hay respuestas asociadas a la encuesta consultada"
                    });
                }
        
                console.log(`Total de respuestas obtenidas: ${answers.length}`);
        
                // Filtramos para obtener solo preguntas válidas basándonos en 'question_id'
                const questions = [...new Set(answers.filter(answer => answer.question_id).map(answer => answer.question_id))];
                console.log('Preguntas encontradas:', questions);
        
                if (questions.length === 0) {
                    console.log('No se encontraron preguntas válidas');
                    return res.status(404).json({
                        status: 404,
                        message: "No hay preguntas válidas asociadas a las respuestas"
                    });
                }
        
                const groupedResults = {};
        
                // Aquí, suponiendo que tienes una tabla de preguntas, buscamos los detalles de la pregunta
               // Consulta para obtener los detalles de las preguntas
                const questionDetails = await db('questions').whereIn('id', questions).select('id', 'question', 'type');

        
                // Convertimos el array de detalles de preguntas en un objeto para acceso rápido
                const questionDetailsMap = questionDetails.reduce((acc, question) => {
                    acc[question.id] = question;
                    return acc;
                }, {});
        
                // Agrupamos y calculamos los porcentajes por tipo de respuesta
                for (const question_id of questions) {
                    console.log(`Procesando la pregunta con ID: ${question_id}`);
                    
                    const percentageZeroToTen = answerModel.groupAnswersByType(answers, 'range_zerototen', question_id);
                    const percentageYesNo = answerModel.groupAnswersByType(answers, 'yes_no', question_id);
                    const percentageRangeDifficulty = answerModel.groupAnswersByType(answers, 'range_difficulty', question_id);
                    const percentageOneToFive = answerModel.groupAnswersByType(answers, 'range_onetofive', question_id);

                                        // Verifica los resultados de cada agrupación de tipo
                        console.log('percentageZeroToTen:', percentageZeroToTen);
                        console.log('percentageYesNo:', percentageYesNo);
                        console.log('percentageRangeDifficulty:', percentageRangeDifficulty);
                        console.log('percentageOneToFive:', percentageOneToFive);
                            
                                        const data = [];
                    const labels = [];
        
                    // Consolidar los datos y las etiquetas
                    if (Object.keys(percentageZeroToTen).length > 0) {
                        data.push(percentageZeroToTen);
                        labels.push(...Object.keys(percentageZeroToTen));
                    }
                    if (Object.keys(percentageYesNo).length > 0) {
                        data.push(percentageYesNo);
                        labels.push(...Object.keys(percentageYesNo));
                    }
                    if (Object.keys(percentageRangeDifficulty).length > 0) {
                        data.push(percentageRangeDifficulty);
                        labels.push(...Object.keys(percentageRangeDifficulty));
                    }
                    if (Object.keys(percentageOneToFive).length > 0) {
                        data.push(percentageOneToFive);
                        labels.push(...Object.keys(percentageOneToFive));
                    }
        
                    // Aquí ahora accedemos a los detalles de la pregunta utilizando el `question_id`
                    const questionDetail = questionDetailsMap[question_id];
                    if (questionDetail) {
                        groupedResults[question_id] = {
                            label: questionDetail.text,  // Ahora tienes el texto de la pregunta
                            type: questionDetail.type,   // Ahora tienes el tipo de la pregunta
                            data: data,
                            labels: labels
                        };
                    }
                }
        
                // Enviamos la respuesta
                return res.status(200).json({
                    status: 200,
                    message: "Porcentaje de respuestas obtenido correctamente.",
                    data: groupedResults
                });
            } catch (error) {
                console.error('Error al calcular los porcentajes de la encuesta:', error.message);
                return res.status(500).json({
                    status: 500,
                    message: "Error al obtener los porcentajes de las respuestas."
                });
            }
        }


    
        // Controlador para manejar el post de respuestas
        async postAnswer(req, res) {
            try {
                console.log("Datos recibidos en req.body:", req.body);
        
                // Validación combinada (array y no vacío)
                if (!Array.isArray(req.body) || req.body.length === 0) {
                    return res.status(400).json({
                        status: 400,
                        message: 'El campo answer es requerido'
                    });
                }      
        
                console.log("---respuesta hacia el modeleo", req.body);
                // Crear una nueva respuesta
                const result = await answerModel.createAnswer(req.body);
                
                console.log("Resultado de la inserción:", result);
                
                if (!result.success) {
                    throw new Error(result.message);
                }
                // const date = req.body.date || new Date().toISOString();
                
                // const newAnswer = {
                //     id: result,
                //     survey_id: req.body.survey_id,
                //     answer: req.body.answer,
                //     question_id: req.body.question_id,
                //     date: date
                // };
                
                const newAnswers = result.insertedAnswers;

                console.log("Respuesta creada exitosamente:", newAnswers);
        
                res.status(201).json({
                status: 201,
                message: 'Respuestas creadas exitosamente',
                answers: newAnswers
            });
                            // res.status(201).json({
                //     status: 201,
                //     message: 'Respuesta creada exitosamente',
                //     answer: newAnswer
                // });
            } catch (error) {
                console.error("Error al crear la respuesta:", error);
                res.status(500).json({
                    status: 500,
                    message: 'Error al crear la respuesta',
                    error: error.message
                });
            }
        }




        
    /*async putAnswer(req, res) {
        const id = req.params.id; // Obtenemos el ID desde los parámetros de la URL
        const { answer, question_id } = req.body;

        // Validación de los datos de entrada
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 400,
                message: "Error en los datos proporcionados.",
                errors: errors.array(),
            });
        }

        try {
            // Buscar la respuesta en la base de datos
            const existingAnswer = await AnswerModel.findById(id);

            if (!existingAnswer) {
                return res.status(404).json({
                    status: 404,
                    message: `La respuesta con el ID: ${id} no fue encontrada.`,
                });
            }

            // Actualizar la respuesta
            const updatedAnswer = await AnswerModel.update(id, { answer, question_id });

            return res.status(200).json({
                status: 200,
                message: "Respuesta actualizada correctamente.",
                data: updatedAnswer,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: 500,
                message: `Error al actualizar la respuesta: ${error.message}`,
            });
        }
    }*/
        async updateAnswer(req, res) {
            const { id } = req.params; // Asumiendo que el id se pasa en los parámetros de la URL
            const data = req.body; // Los nuevos datos que se deben actualizar
        
            try {
                const result = await answerModel.update(id, data);
                
                if (result === 0) { // Si no se actualizó ninguna fila
                    return res.status(404).json({ message: 'error al actualizar' });
                }
        
                return res.status(200).json({ message: 'actualizada con exito' });
            } catch (error) {
                return res.status(500).json({ message: error.message });
            }
        }

    // Elimina una respuesta
    async deleteAnswer(req, res) {
        const { id } = req.params;
        try {
            const deleted = await answerModel.delete(id);
            if (deleted === 0) {
                return res.status(404).json({ status: 404, message: `La respuesta con el ID: ${id} no fue encontrada.` });
            }
            return res.status(200).json({ status: 200, message: "Respuesta eliminada correctamente." });
        } catch (error) {
            console.error(`Error en deleteAnswer: ${error.message}`);
            return res.status(500).json({ status: 500, message: "Error al eliminar la respuesta." });
        }
    }

}

module.exports = new AnswerController();