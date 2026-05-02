const ClientModel  = require('../models/clientModel');
const knex = require('../config/db'); 

class SurveyDTO{

    static async validateSurvey(data){
        const { title, start_date, end_date, description, link, idClient, state } = data    
        const allowedStates = [0, 1];
        const clientService = new ClientModel(knex);  // Instancia de la clase ClientModel
        
        if(!title || !start_date || !end_date || !description || !link || !idClient || !state){
            return {status : false, message : "Todos los campos son obligatorios"};
        }
        
        //Verificar que los campos sean del tipo correcto
        if(typeof title !== 'string'){
            return {status : false, message : "El primer nombre debe ser un texto"};
        }

        const startDateObj = new Date(start_date); //se convierte en un objeto de fecha
        const endDateObj = new Date(end_date); //se convierte en un objeto de fecha

         if (isNaN(startDateObj.getTime())) {
        return { status: false, message: "La fecha de inicio no es una fecha válida." };
        }
        if (isNaN(endDateObj.getTime())) {
            return { status: false, message: "La fecha de fin no es una fecha válida." };
        }

        if(typeof description !== 'string'){
            return {status : false, message : "El primer nombre debe ser un texto"};
        }

        const url = this.validateUrl(link);
        if(!url.status){
            return {status : false, message : "El link proporcionado no es una URL válida"};

        }

        const numState = parseInt(state);
        if(isNaN(numState) || !Number.isInteger(numState)){
            return {status : false, message : "Se debe ingresar un estado valido"};
        }

        if (!allowedStates.includes(numState)) {
            return { status: false, message: "Debe ingresar un estado valido" };
        }

        //validar que el cliente exista en la base de datos 
        const numIdClient = parseInt(idClient);
            if(isNaN(numIdClient) || !Number.isInteger(numIdClient)){
            return {status : false, message : "Se debe ingresar un cliente valido"};
        }

        const existClient = await clientService.getById(idClient);
        if(!existClient){
            return {status : false, message : "El cliente no existe"};
        }
        return {status : true}
    }

    static validateUrl(url) {
        try {
            new URL(url); // Si no lanza error, es válida
            return { status: true };
        } catch (err) {
            return { status: false };
        }
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

module.exports = SurveyDTO