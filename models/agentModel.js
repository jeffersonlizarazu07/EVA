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
      .distinct(
        "u.id",
        "u.firstname",
        "u.middlename",
        "u.lastname",
        "u.state",
        "u.type",
        "u.last_visit_date",
        "u.language",
        "u.registration_date"
      );

    return agentes.map((agent) => ({
      ...agent,
      registration_date: new Date(agent.registration_date).toLocaleDateString(), // "YYYY-MM-DD" Formateo la fecha de registro a un formato legible
    }));
  },

  // Buscar un agente específico por ID
  getAgentById: async (id) => {
    return await db("users")
      .where({ id, type: 4 }) // Valido que sea agente
      .first();
  },

  getAgentsByAdmin: async (adminId) => {
    // Paso 1: Obtener agentes únicos
    const agents = await db("users")
      .where("users.type", 4)
      .join("user_clients as uc_agents", "users.id", "uc_agents.idUser")
      .whereIn("uc_agents.idClient", function () {
        this.select("idClient").from("user_clients").where("idUser", adminId);
      })
      .distinct()
      .select(
        "users.id",
        "users.firstname",
        "users.lastname",
        "users.type",
        "users.state",
        "users.user_red"
      );

    // Paso 2: Para cada agente, obtener sus clientes
    for (let agent of agents) {
      const clients = await db("user_clients")
        .join("clients", "user_clients.idClient", "clients.id")
        .where("user_clients.idUser", agent.id)
        .whereIn("user_clients.idClient", function () {
          this.select("idClient").from("user_clients").where("idUser", adminId);
        })
        .select("clients.client");

      agent.clientNames = clients.map((c) => c.client).join(", ");
    }

    return agents;
  },
};

module.exports = Agent; // Exporto el objeto para poder usarlo desde el controlador
