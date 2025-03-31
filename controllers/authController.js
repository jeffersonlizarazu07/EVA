const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = async (req, res) => {
    const { email, password } = req.body;

    // Validación de entrada
    if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
    }

    try {
        // Buscar usuario en la base de datos
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'El usuario no existe.' });
        }

        // Validar contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        // Obtener IDs de clientes asociados
        const clientIds = await User.getClientIds(user.id);

        // Generar token JWT
        const token = jwt.sign(
            { id: user.id, state: user.state, type: user.type, clients_id: clientIds },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Configurar cookie
        res.cookie('token', token, { httpOnly: true, secure: false, maxAge: 3600000 });

        return res.status(200).json({
            status: true,
            message: 'Autenticación exitosa.',
            user: {
                id: user.id,
                state: user.state,
                type: user.type,
                clients_id: clientIds
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};


module.exports = { authenticate };
