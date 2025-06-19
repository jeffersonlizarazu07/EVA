const db = require("../config/db"); // Importar db congig
const { getAgents } = require("../controllers/agenteController");

const AgentMonitoring = {
  // Obtener todos los agentes de la base de datos
  getAgents: async (clientIds) => {
    const monitoring = await db("user as u")
      // Unimos la tabla 'users' con 'user_clients' para obtener los usuarios vinculados a clientes
      .join("user_clients as uc", "u.id", "uc.idUser")
      // Filtramos solo los usuarios de tipo 4 (agentes)
      .where("u.type", 4)
      // Filtramos solo los que estén asociados con los IDs de clientes recibidos como parámetro
      .whereIn("uc.idClient", clientIds)
      // Seleccionamos los campos relevantes del usuario
      .select(
        "u.id"
      )
  },
};
