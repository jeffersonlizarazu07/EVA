
class UserDTO {
    
    static validateCreateUser(data) {
        const { firstname, lastname, type, language, user_red } = data;
        const allowedTypes = [1, 2, 3, 4];

        // Verifico que todos los campos obligatorios estén presentes
        if (!firstname || !lastname || !type || !language) {
            return {status : false, message : "Todos los campos son obligatorios"};
        }
        
        const numType = parseInt(type);

        //Verificar que los campos sean del tipo correcto
        if(typeof firstname !== 'string'){
            return {status : false, message : "El primer nombre debe ser un texto"};
        }

        if(typeof lastname !== 'string'){
            return {status : false, message : "El apellido debe ser un texto"};
        }
        
        if(isNaN(numType) || !Number.isInteger(numType)){
            return {status : false, message : "Debe ingresar un rol valido"};
        }

        if (!allowedTypes.includes(numType)) {
            return { status: false, message: "Debe ingresar un rol válido" };
        }

        if(typeof language !== 'string'){
            return {status : false, message : "Debe ingresar un idioma valido"};
        }

        // Validar user_red si está presente
        if (user_red !== undefined && user_red !== null && user_red !== '') {
            if(typeof user_red !== 'string'){
                return {status : false, message : "El usuario de red debe ser un texto"};
            }
        }

        return {status : true}

    }

    static validarId(id) {
                 
        //validamos que el no sea null, undifined o vacio
        if(id === undefined || id === null || id === "") {
            return {status : false, message : "El ID es obligatorio"};
        }

        const numberId = parseInt(id); //para validar que sea un numero

        if (isNaN(numberId) || !Number.isInteger(numberId)) {
            return { status: false, message: "Debe ingresar un ID válido " };
        }

        return {status : true}
    }

    static validateLanguage (data){
        const { language } = data;
        const allowedLanguages = ['es', 'en', 'it', 'pt']; // Ejemplo de idiomas permitidos

        // Verifico que el campo de idioma esté presente
        if (!language) {
            return { status: false, message: "El campo de idioma es obligatorio" };
        }

        // Verifico que el idioma sea un string
        if (typeof language !== 'string') {
            return { status: false, message: "El idioma debe ser un texto" };
        }

        // Verifico que el idioma esté en la lista de idiomas permitidos
        if (!allowedLanguages.includes(language)) {
            return { status: false, message: "Debe ingresar un udioma valido" };
        }
        
        return { status: true };
    }
   

}

module.exports = UserDTO;