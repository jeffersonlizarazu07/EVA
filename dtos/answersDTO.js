const Question = require('../models/question');

class AnswersDTO {

    static async validateAnswers(data){

        //validamos que sea un array y que no este vacio
        if (!Array.isArray(data) || data.length === 0) {
            return {status : false, message : "El campo ansers no puede estra vacio"};
        }      

        //itera cada elemento del array para validar los campos
        for(const datos of data){
            const { answer, question_id } = datos;

            //validamos que el campo answer no sea null, undifined o vacio
            if(!answer || typeof answer !== 'string' || answer.trim() === '') {
                return {status : false, message : "El campo answer es obligatorio y debe ser un texto no vacio"};
            }

            //validamos que el campo question_id no sea null, undifined o vacio y sea un numero y este en la base de datos
            const numberQuestionId = parseInt(question_id);
            if(isNaN(numberQuestionId) || !Number.isInteger(numberQuestionId)){
                return {status : false, message : "Se debe ingresar un estado valido"};
            }

            const response = await Question.getById(numberQuestionId);
            if(!response){
                return {status : false, message : "La pregunta no existe"};
            }
        }
        return {status : true};
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

    static validateDates(data){
        const { startDate, endDate } = data;
        // Validar que startDate y endDate sean fechas válidas
        
        const startDateObj = new Date(startDate); //se convierte en un objeto de fecha
        const endDateObj = new Date(endDate); //se convierte en un objeto de 
        
        if (isNaN(startDateObj.getTime())) {
        return { status: false, message: "La fecha de inicio no es una fecha válida." };
        }
        if (isNaN(endDateObj.getTime())) {
            return { status: false, message: "La fecha de fin no es una fecha válida." };
        }
        return { status: true };
    }
}

module.exports = AnswersDTO;