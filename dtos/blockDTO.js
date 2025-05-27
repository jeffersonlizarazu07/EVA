const FormSet = require("../models/formSet"); 

class BlockDTO {
    static async validateBlock(data){
        const { form_id, nombreBloque, ponderacion, position} = data;

        if(!form_id || !nombreBloque || ponderacion === "" || position === ""){
            return {status : false, message : "Todos los campos son obligatorios"};
        }

        //valida que el form_id sea un numero y este en la base de datos
        const numFormId = parseInt(form_id);
        if(isNaN(numFormId) || !Number.isInteger(numFormId)){
            return {status : false, message : "El Id del formulario debe ser un número válido"};
        }
        const existForm = await FormSet.getById(numFormId);
        if(!existForm){
            return {status : false, message : "El formulario no existe"};
        }

        if(typeof nombreBloque !== 'string'){
            return {status : false, message : "El nombre del bloque debe ser un texto y no puede estar vacía"};
        }

        const ponderacionNum = parseInt(ponderacion);
        if(isNaN(ponderacionNum) || !Number.isInteger(ponderacionNum)){
            return {status : false, message : "Se debe ingresar una ponderación válida"};
        }
        
        const positionNum = parseInt(position);
        if(isNaN(positionNum) || !Number.isInteger(positionNum)){
            return {status : false, message : "Se debe ingresar una posición válida"};
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

module.exports = BlockDTO;