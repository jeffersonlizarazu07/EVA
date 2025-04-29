
class MailDTO {
    constructor(name, email, link) {
        this.name = name;
        this.email = email;
        this.link = link;   
    }

    static async ValidateEmail(data){

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        //validar que el campo sea un array y que no venga vacio
        if (!data || !Array.isArray(data) || data.length === 0) {
            return  {status : false, message : "El campo 'users' es obligatorio o el formato de datos no es valido" };
        }

        //validar cada usuario del array
        for (const user of data) {  
            const {name, email, link} = user;
            
            //verificar que los campos exuistan y no esten vacíos
            if (!name || typeof name !== 'string' || name.trim() === '') {
                return  {status : false, message : "El usuario es obligatorio y debe ser un texto" };
            }

            if (!email || typeof email !== 'string' || email.trim() === '' || !emailRegex.test(email)) {
                return  {status : false, message : "El email es obligatorio y debe ser un correo valido" };
            }

            if (!link || typeof link !== 'string' || link.trim() === '' ) {
                return  {status : false, message : "El link es obligatorio y debe ser una url valida" };
            }       
             // Validar si es una URL válida sin que se caiga
             try {
                new URL(link);
            } catch (error) {
                return { status: false, message: "El link proporcionado no es una URL válida" };
            }

        }    

        return {status : true};

    }       
}

module.exports = MailDTO;