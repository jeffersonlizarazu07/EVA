const express = require("express");
const { authMsalService } = require("../services/loginService");
const jwt = require("jsonwebtoken");
const { decrypt } = require("@teleperformance/tpco_cryptojs");

// Devolver configuración MSAL encriptada desde .env
const getConfig = async (req, res) => {
    try {
        // Desencriptar la configuración desde .env
        const encryptedConfig = process.env.FRONTEND;

        if (!encryptedConfig) {
            throw new Error("FRONTEND no está configurado en las variables de entorno");
        }

        // La configuración ya viene encriptada, la devolvemos tal como está
        res.json({
            config: encryptedConfig
        });
    } catch (error) {
        console.error("Error en getConfig:", error);
        res.status(500).json({
            error: "Error al obtener configuración",
            message: error.message
        });
    }
};

// Login con MSAL usando validaciones desencriptadas
const postLog = async (req, res) => {
    try {
        const { user, er, ta } = req.body; // user = email, er = issuer, ta = tenant


        // Validaciones básicas
        if (!user || !er || !ta) {
            return res.status(400).json({
                status: false,
                message: "Faltan parámetros requeridos para la autenticación"
            });
        }

        // Validar email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user)) {
            return res.status(400).json({
                status: false,
                message: "El formato del email no es válido"
            });
        }

        // Desencriptar valores esperados desde .env
        let expectedTenant, expectedIssuer;

        try {
            expectedTenant = decrypt(process.env.TA, (error) => {
                console.log(error);
            });
            expectedIssuer = decrypt(process.env.ISS, (error) => {
                console.log(error);
            });
        } catch (decryptError) {
            console.error("Error desencriptando variables de entorno:", decryptError);
            return res.status(500).json({
                status: false,
                message: "Error de configuración del servidor"
            });
        }

        // Validar que el issuer y tenant coincidan con lo esperado
        if (ta !== expectedTenant || er !== expectedIssuer) {
            console.log("Validación fallida:", {
                receivedTenant: ta,
                expectedTenant,
                receivedIssuer: er,
                expectedIssuer
            });

            return res.status(401).json({
                status: false,
                message: "La fuente de autenticación no es válida"
            });
        }

        // Buscar usuario en BD por email
        const response = await authMsalService(user);

        if (response.status) {
            const token = jwt.sign(
                {
                    name_user: response.user.name,
                    id: response.user.id_user,
                    userRed: response.user.userRed,
                    rl: response.user.role,
                },
                process.env.JWT_SECRET,
                { expiresIn: "8h" }
            );

            res.json({
                status: true,
                cdt: response.user.id_user,
                rl: response.user.role,
                active: response.user.state === 1,
                user: response.user,
                access_token: token,
            });
        } else {
            // Determinar el código de estado HTTP y mensaje basado en el tipo de error
            let statusCode = 401;
            let message = response.message;
            
            if (response.message?.includes('no encontrado')) {
                statusCode = 404;
                message = "Tu usuario no está registrado en el sistema. Contacta al administrador para verificar tu acceso.";
            } else if (response.message?.includes('inactiv')) {
                statusCode = 403;
                message = "Tu cuenta se encuentra inactiva en el sistema. Contacta al administrador para reactivar tu acceso.";
            } else {
                statusCode = 401;
                message = "No tienes autorización para acceder a esta aplicación.";
            }
            
            res.status(statusCode).json({
                status: false,
                message: message
            });
        }
    } catch (error) {
        console.error("Error en postLog:", error);
        res.status(500).json({
            status: false,
            message: "Error interno del servidor. Inténtalo nuevamente en unos minutos."
        });
    }
};

module.exports = { postLog, getConfig };