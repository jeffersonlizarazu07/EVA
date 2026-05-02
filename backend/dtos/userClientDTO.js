const ClientModel = require('../models/clientModel');
const User = require('../models/user')
const knex = require('../config/db');
const e = require('express');
const clientModel = new ClientModel(knex);

class UserClientDTO{

    static async validateUserClient(data){

        //validamos que sea un array y que no este vacio
        if (!Array.isArray(data) || data.length === 0) {
            return {status : false, message : "El campo ansers no puede estra vacio"};
        }      

        //itera cada elemento del array para validar los campos
        for(const datos of data){
            const { idUser, clientId } = datos;

            //validamos que el campo question_id no sea null, undifined o vacio y sea un numero y este en la base de datos
            const numberIdUser = parseInt(idUser);
            if(isNaN(numberIdUser) || !Number.isInteger(numberIdUser)){
                return {status : false, message : "Se debe ingresar un estado valido"};
            }

            //validamos que el usuario exista en la base de datos
            const existUser = await User.findById(numberIdUser);
            if(!existUser){
                return {status : false, message : "El usuario no existe"};
            }

            const numberIdClient = parseInt(clientId);
            if(isNaN(numberIdClient) || !Number.isInteger(numberIdClient)){
                return {status : false, message : "Se debe ingresar un estado valido"};
            }

            //validamos que el usuario exista en la base de datos
            const existClient = await clientModel.getById(numberIdClient);
            if(!existClient){
                return {status : false, message : "Cliente no existe"};
            }
        }
        return {status : true};
    }

    static async validateUserClientUpdate(data){

        console.log("datos en el dto",data);
        const { clientIds } = data;

        //validamos que sea un array y que no este vacio
        if (!Array.isArray(clientIds) || clientIds.length === 0) {
            return {status : false, message : "Debe ingresar al menos un cliente"};
        }      

        //itera cada elemento del array para validar los campos
        for(const clientId of clientIds ){
            
            //validamos que el cleint sea un numeor y este en la base de datos
            const numberIdClient = parseInt(clientId);
            if(isNaN(numberIdClient) || !Number.isInteger(numberIdClient)){
                return {status : false, message : "Se debe ingresar un estado valido"};
            }

            //validamos que el usuario exista en la base de datos
            const existClient = await clientModel.getById(numberIdClient);
            if(!existClient){
                return {status : false, message : "Cliente no existe"};
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

module.exports = UserClientDTO