const db = require("../config/db"); // Tu conexión Knex existente

const authMsalService = async (userEmail) => {
    try {
        const userRed = userEmail.split("@")[0];
        
        const user = await db("users")
            .where({ user_red: userRed })
            .select("id", "firstname", "lastname", "user_red", "type", "state")
            .first();

        if (!user) {
            return { status: false, message: "Usuario no encontrado..." };
        }

        if (user.state !== 1) {
            return { status: false, message: "Cuenta inactiva..." };
        }

        return {
            status: true,
            user: {
                id_user: user.id,
                userRed: user.user_red,
                name: `${user.firstname} ${user.lastname}`,
                role: user.type,      // ✅ Este es el userType
                state: user.state
            }
        };
    } catch (error) {
        console.error("Error en authMsalService:", error);
        return { status: false, message: "Error al consultar base de datos: " + error.message };
    }
};

module.exports = { authMsalService };