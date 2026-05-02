const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    let token = null;
    
    // ✅ INTENTAR LEER DEL HEADER AUTHORIZATION PRIMERO
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
    }
    
    // ✅ SI NO HAY EN HEADER, LEER DE COOKIES (PARA COMPATIBILIDAD)
    if (!token) {
        token = req.cookies.token;
    }
    
    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error verificando token:', error);
        res.status(401).json({ message: 'Token inválido o expirado.' });
    }
};

module.exports = authMiddleware;