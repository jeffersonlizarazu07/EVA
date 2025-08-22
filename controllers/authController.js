/*const bcrypt = require('bcryptjs'); // Para comparar contraseñas encriptadas
const jwt = require('jsonwebtoken'); // Para generar tokens de autenticación
const User = require('../models/user'); // Modelo de usuario para manejar la BD

// Función para autenticar usuario
const authenticate = async (req, res) => {
    const { email, password } = req.body;

    // Verifico que se haya enviado el correo y la contraseña
    if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
    }

    try {
        // Busco al usuario por su email
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'El usuario no existe.' });
        }

        // Comparo la contraseña ingresada con la encriptada en la base de datos
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        // Obtengo los IDs de los clientes asociados a este usuario
        const clientIds = await User.getClientIds(user.id);

        // Creo un token JWT con la info del usuario
        const token = jwt.sign(
            { id: user.id, state: user.state, type: user.type, clients_id: clientIds },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Guardo el token en una cookie (opciones básicas de seguridad)
        res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax', path: '/', maxAge: 3600000 });

        // Envío respuesta con el token y los datos del usuario
        return res.status(200).json({
            status: true,
            message: 'Autenticación exitosa.',
            token: token,
            user: {
                id: user.id,
                state: user.state,
                type: user.type,
                clients_id: clientIds
            }
        });

    } catch (error) {
        // Si algo sale mal, devuelvo error del servidor
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

// Función para validar token (usada cuando se quiere comprobar si el token es válido)
const checkToken = (req, res) => {
    return res.status(200).json({
        status: true,
        message: 'Token válido.',
        user: req.user
    });
};

// Función para extender la duración del token
const extendToken = (req, res) => {
    // Creo un nuevo token con la misma info del usuario
    const newToken = jwt.sign(
        { id: req.user.id, state: req.user.state, type: req.user.type, clients_id: req.user.clients_id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    // Lo vuelvo a guardar en la cookie
    res.cookie('token', newToken, { httpOnly: true, secure: false, sameSite: 'lax', path: '/', maxAge: 3600000 });

    return res.status(200).json({
        status: true,
        message: 'Token extendido.',
    });
};

// Función para cerrar sesión
const logout = async (req, res) => {
    try {
        // Actualizo la última visita del usuario
        await User.updateLastVisit(req.user.id);

        // Elimino la cookie con el token
        res.clearCookie('token', {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/',
        });

        return res.status(200).json({ status: true, message: 'Sesión cerrada exitosamente.' });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Error al cerrar sesión',
            error: error.message,
        });
    }
};

// Exporto las funciones para usarlas en rutas
module.exports = { authenticate, checkToken, extendToken, logout };*/
