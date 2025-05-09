const db = require("../config/db"); // Importo la configuración de la base de datos

const Agent = {
  // Obtener todos los agentes de la base de datos
  getAllAgents: async (clientIds) => {
    console.log("clientIds", clientIds); // Para depuración, imprimo los IDs de clientes recibidos
    const agentes = await db("users as u")
      // Unimos la tabla 'users' con 'user_clients' para obtener los usuarios vinculados a clientes
      .join("user_clients as uc", "u.id", "uc.idUser")
      // Filtramos solo los usuarios de tipo 4 (agentes)
      .where("u.type", 4)
      // Filtramos solo los que estén asociados con los IDs de clientes recibidos como parámetro
      .whereIn("uc.idClient", clientIds)
      // Seleccionamos los campos relevantes del usuario
      .select(
        "u.id",
        "u.firstname",
        "u.middlename",
        "u.lastname",
        "u.email",
        "u.state",
        "u.type",
        "u.last_visit_date",
        "u.language",
        "u.registration_date"
      )

      // Agrupamos por ID para evitar duplicados si un usuario está asociado a varios clientes
      .groupBy("u.id");
      registration_date:
      return agentes.map(agent => ({
      ...agent,
      registration_date:  new Date(agent.registration_date).toLocaleDateString()  // "YYYY-MM-DD"
      })); // Formateo la fecha de registro a un formato legible
  },
  // Buscar un agente específico por ID
  getAgentById: async (id) => {
    return await db("users")
      .where({ id, type: 4 }) // Valido que sea agente
      .first();
  },
};

module.exports = Agent; // Exporto el objeto para poder usarlo desde el controlador
