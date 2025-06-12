const ClientModel  = require('../models/clientModel');
const knex = require('../config/db'); 
const User = require('../models/user')

class FormDTO {
    static async validateForm(data){
        const { title, description, state, idClient, created_by } = data;
        const allowedStates = [0, 1];
        const clientService = new ClientModel(knex);  // Instancia de la clase ClientModel
        
    // console.log("Info en el DTO", data)
    // console.log("Datos del DTO", title, description, state, idClient, creation_date, created_by)
      
        //validar que todos los campos obligatorios estén presentes
        if(!title || !description || !state || !idClient || !created_by){
            return {status : false, message : "Todos los campos son obligatorios"};
        }


        if(typeof title !== 'string'){
            return {status : false, message : "El título debe ser un texto"};
        }

        if(typeof description !== 'string'){
            return {status : false, message : "La descripción debe ser un texto"};
        }

        const numState = parseInt(state);
        if(isNaN(numState) || !Number.isInteger(numState)){
            return {status : false, message : "Se debe ingresar un estado valido"};
        }

        if (!allowedStates.includes(numState)) {
            return { status: false, message: "Debe proporcionar un estado valido" };
        }

        const numIdClient = parseInt(idClient);
        if(isNaN(numIdClient) || !Number.isInteger(numIdClient)){
            return {status : false, message : "Se debe ingresar un cliente valido"};
        }
        //validar que el cliente exista en la base de datos
        const existClient = await clientService.getById(numIdClient);
        if(!existClient){
            return {status : false, message : "El cliente no existe"};
        }


        const numCreatedBy = parseInt(created_by);
        if(isNaN(numCreatedBy) || !Number.isInteger(numCreatedBy)){
            return {status : false, message : "Se debe ingresar un usuario valido"};
        }

        //valida que el usuario exista en la base de datos
        const existUser = await User.findById(numCreatedBy);
        if(!existUser){
            return {status : false, message : "El usuario no existe"};
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

    static async validateUpdate(data){
        const { title, description, state, idClient, updated_by } = data;
        const allowedStates = [0, 1];
        const clientService = new ClientModel(knex);  // Instancia de la clase ClientModel
        
    // console.log("Info en el DTO", data)
    // console.log("Datos del DTO", title, description, state, idClient, updated_by)
        //validar que todos los campos obligatorios estén presentes
        if(!title || !description || !state || !idClient || !updated_by){
            return {status : false, message : "Todos los campos son obligatorios"};
        }


        if(typeof title !== 'string'){
            return {status : false, message : "El título debe ser un texto"};
        }

        if(typeof description !== 'string'){
            return {status : false, message : "La descripción debe ser un texto"};
        }

        const numState = parseInt(state);
        if(isNaN(numState) || !Number.isInteger(numState)){
            return {status : false, message : "Se debe ingresar un estado valido"};
        }

        if (!allowedStates.includes(numState)) {
            return { status: false, message: "Debe proporcionar un estado valido" };
        }

        const numIdClient = parseInt(idClient);
        if(isNaN(numIdClient) || !Number.isInteger(numIdClient)){
            return {status : false, message : "Se debe ingresar un cliente valido"};
        }
        //validar que el cliente exista en la base de datos
        const existClient = await clientService.getById(numIdClient);
        if(!existClient){
            return {status : false, message : "El cliente no existe"};
        }


        const numCreatedBy = parseInt(updated_by);
        if(isNaN(numCreatedBy) || !Number.isInteger(numCreatedBy)){
            return {status : false, message : "Se debe ingresar un usuario valido"};
        }

        //valida que el usuario exista en la base de datos
        const existUser = await User.findById(numCreatedBy);
        if(!existUser){
            return {status : false, message : "El usuario no existe"};
        }

        return {status : true}
    }    
}


module.exports = FormDTO;