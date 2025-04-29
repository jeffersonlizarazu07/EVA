const transporter = require('../config/mailer');
const MailDTO = require ('../dtos/mailDTO');
const dns = require('dns').promises;


const enviarCorreos = async (req, res) => {
    
    const validacion = await MailDTO.ValidateEmail(req.body.users);
    
    if(!validacion.status){
        return res.status(400).json(validacion)
    }

    const { users } = req.body;
    const errores = [];
    let enviados = 0;

    for (const user of users) {
        const { name, email, link } = user;

        // Validar si el dominio del correo existe
        const dominioValido = await validarDominio(email);
        if (!dominioValido) {
            errores.push({ email, error: 'Dominio de correo inválido' });
            continue;
        }

        //mensaje del cuerpo del correo
        const mensaje = `
        ¡Hola, ${name}!
        En el siguiente link podrá diligenciar la encuesta de satisfacción:
        ${link}
        ¡Gracias!`;       
        
        try {            
            await transporter.sendMail({
                from: '"Encuesta de Satisfacción"',
                to: email,
                subject: 'Encuesta de Satisfacción',
                text: mensaje                
            });
            enviados++;
        }catch (error) {
            console.log("Error al enviar el correo : ",error);   
            errores.push({email, error : error.message});
        }
    }

    res.json({
        mensaje: `${enviados} correos enviados exitosamente.`,
        errores
      });
    
}

async function validarDominio(email) {
  const dominio = email.split('@')[1];
  try {
    const registrosMX = await dns.resolveMx(dominio);
    return registrosMX.length > 0;
  } catch (error) {
    return false; // No tiene MX o no existe el dominio
  }
}

module.exports = { enviarCorreos };