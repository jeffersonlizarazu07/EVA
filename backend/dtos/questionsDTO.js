const Question = require('../models/question');
const SurveySet = require('../models/surveySet')

class QuestionsDTO{

    static async validateQuestion(data){
        
        const { conditional, conditional_answer, id_conditional, question, survey_id, type, select_option, selected_answer } = data;
        const types = ["radio_opt", "check_opt"];
        
        //validar que todos lo campos sean obligatorios
        if(!conditional || !question || !survey_id || !type){
            return {status : false, message : "Todos los campos son obligatorios"};
        }

        if (types.includes(type)) {
            if(!select_option || !selected_answer){
                return {status : false, message : "Todos los campos son obligatorios"};
            }

            if(typeof select_option !== 'string'){
                return {status : false, message : "El tipo de encuesta debe ser un texto"};
            }

            if(typeof selected_answer !== 'string'){
                return {status : false, message : "El tipo de encuesta debe ser un texto"};
            }
        }

        if(conditional === "SI" || conditional === "Si" || conditional === "si"){
            if(!id_conditional || !conditional_answer){
                return {status : false, message : "Todos los campos son obligatorios"};
            }

            //valida que el id_Conditional sea un entero y este presente en la base de datos
            const numIdConditional = parseInt(id_conditional);
            if(isNaN(numIdConditional) || !Number.isInteger(numIdConditional)){
                return {status : false, message : "Se debe ingresar un estado valido"};
            }

            const response = await Question.getById(numIdConditional);
            if(!response){
                return {status : false, message : "La pregunta no existe"};
            }

        }        
    
        if(typeof question !== 'string'){
            return {status : false, message : "La pregunta debe ser un texto"};
        }
        
        if(typeof type !== 'string'){
            return {status : false, message : "El tipo de encuesta debe ser un texto"};
        }       

        if(typeof conditional !== 'string'){
            return {status : false, message : "El tipo de encuesta debe ser un texto"};
        }

        //validar que el id_survey exista 
        const numIdSurvey = parseInt(survey_id);
        if(isNaN(numIdSurvey) || !Number.isInteger(numIdSurvey)){
            return {status : false, message : "Se debe ingresar una encuesta valida"};
        }
        
        const response = await SurveySet.getById(numIdSurvey)
        if(!response){
            return {status : false, message : "La encuesta no existe"};
        }
        return {status : true}
    }

    static validarId(id) {                 
        //validamos que el id no sea null, undifined o vacio
        if(id === undefined || id === null || id === "") {
            return {status : false, message : "El ID es obligatorio"};
        }

        const numberId = parseInt(id); //para validar que sea un numero

        if (isNaN(numberId) || !Number.isInteger(numberId)) {
            return { status: false, message: "Debe ingresar un ID válido " };
        }
        return {status : true}
    }

}

module.exports = QuestionsDTO