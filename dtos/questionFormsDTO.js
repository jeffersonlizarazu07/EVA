const BlockModel = require('../models/blockModel');


class QuestionFormsDTO {
    static async validateQuestionForm(data){
        const { block_id, preguntas } = data;
        const allowedTypes = ["radio_opt", "textfield_s", "selector_opt"];
        const allowedConditional = ["SI", "NO"];

        //valida que todos los campos sean obligatorios
        if (!block_id){
            return {status : false, message : "Todos los campos son obligatorios"};
        }

        if(!Array.isArray(preguntas) || preguntas.length === 0){
            return {status : false, message : "Todos los campos son obligatorios"};
        }


        //valida que el block_id sea un entero y este presente en la base de datos 
        const numBlockId = parseInt(block_id);
        if(isNaN(numBlockId) || !Number.isInteger(numBlockId)){
            return {status : false, message : "Se debe ingresar un Id debloque valido"};
        }

        const existBlock = await BlockModel.getBlockById(numBlockId);
        if(!existBlock){
            return {status : false, message : "El bloque no existe, ingrese un bloque valido"};
        }

        //iteramos cada elemento de preguntas para validar 
        for(const pregunta of preguntas){
            const { text, type, select_option, selected_answer, conditional } = pregunta;

            //validar que los capos son obligatorios
            if(!text || typeof text !== 'string' || text.trim() === ""){
                return {status : false, message : "El titulo debe ser un texto y no puede estar vacio"};                
            }

            if(!allowedTypes.includes(type)){
                return {status : false, message : "Debe ingresar un tipo valido"};        
            }
            
            if(!conditional || typeof conditional !== 'string' || conditional.trim() === ""){
                return {status : false, message : "El conditional debe ser un texto y no puede estar vacio"};                
            }      
            
            if(!allowedConditional.includes(conditional)){
                return {status : false, message : "Debe ingresar un conditional valido"};        
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

module.exports = QuestionFormsDTO;