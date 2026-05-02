class ClientsDTO {

    static validateCleint (data){
        const { client, state, color_tag1, color_tag2 } = data;
        const allowedStates = [0, 1];

        // Verifico que todos los campos obligatorios estén presentes
        // Nota: state puede ser 0; por eso se verifica con comparaciones estrictas
        if (!client || state === undefined || state === null || !color_tag1 || !color_tag2 ) {
            return {status : false, message : "Todos los campos son obligatorios"};
        }   

        //Verificar que los campos sean del tipo correcto
        if(typeof client !== 'string'){
            return {status : false, message : "El cliente debe ser un texto"};
        }
         
        const numState = parseInt(state);
         if(isNaN(numState) || !Number.isInteger(numState)){
            return {status : false, message : "Se debe ingresar un estado valido"};
        }
        
        if (!allowedStates.includes(numState)) {
            return { status: false, message: "Debe ingresar un estado valido" };
        }

        if(typeof color_tag1 !== 'string'){
            return {status : false, message : "El color principal debe ser un texto"};
        }   

        if(typeof color_tag2 !== 'string'){
            return {status : false, message : "El color secundario debe ser un texto"};
        }
        return {status : true}
    }

    static validarId(id) {
    if (id === undefined || id === null || id === "") {
        return { status: false, message: "El ID es obligatorio" };
    }

    const numberId = typeof id === "number" ? id : parseInt(id);

    if (isNaN(numberId) || !Number.isInteger(numberId)) {
        return { status: false, message: "Debe ingresar un ID válido" };
    }

    return { status: true };
}

}

module.exports = ClientsDTO; 