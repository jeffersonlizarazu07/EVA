const ClientModel = require('../models/clientModel');
const knex = require('../config/db');
const clientModel = new ClientModel(knex);

class AgentDTO{

    static async validateAgent(data){
        const { clients } = data;
        
        if(!clients || clients.length === 0 ){
            return {status : false, message : "No tienes clientes asociados"};
        }

        if( typeof clients !== 'string'){
            return {status : false, message : "El campo debe ser un texto"};
        }
        
        const clientsArray = clients.split(','); // Divido la cadena de IDs en un array

        //validan que los clientes existen en la base de datos 
        for(const clientId of clientsArray){ 
            
            const numberCleintId = parseInt(clientId);
            if(isNaN(numberCleintId) || !Number.isInteger(numberCleintId)){
                return {status : false, message : "Se debe ingresar un cliente valido"};
            }

            const existClient = await clientModel.getById(numberCleintId);
            if(!existClient){
                return {status : false, message : "El cliente no existe"};
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

}

module.exports = AgentDTO;