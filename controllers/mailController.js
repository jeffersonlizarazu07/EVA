const transporter = require('../config/mailer');
const MailDTO = require ('../dtos/mailDTO');
const dns = require('dns').promises;
const axios = require('axios');
require('dotenv').config();


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

              // Validar con mailboxlayer
      const validEmail = await validarEmailConMailboxlayer(email);
      if (!validEmail.status) {
        errores.push({ email, error: validEmail.error });
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

    const respuesta =  {
      mensaje: `${enviados} correos enviados exitosamente.`,
      errores
    }
    
    console.log("Respuesta enviada ", respuesta);
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

async function validarEmailConMailboxlayer(email) {
  const API_KEY = process.env.MAILBOXLAYER_API_KEY; 

  try {
    const response = await axios.get('http://apilayer.net/api/check', {
      params: {
        access_key: API_KEY,
        email,
        smtp: 1,    // activa validación SMTP (valida si existe el buzón)
        format: 1
      }
    });

    const data = response.data;

    if (!data.format_valid) {
      return { status: false, error: 'Formato de email inválido' };
    }
    if (!data.mx_found) {
      return { status: false, error: 'El dominio de correo no existe' };
    }
    if (!data.smtp_check) {
      return { status: false, error: 'Cuenta de correo no existe' };
    }

    return { status: true };

  } catch (error) {
    return { status: false, error: 'Error en validación externa' };
  }
}

module.exports = { enviarCorreos };