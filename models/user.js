const db = require("../config/db");
const { getDateTimeForSQL } = require("../helpers/dateHelper");

const User = {
  // Buscar usuario por su correo electrónico
  findByEmail: async (email) => {
    return await db("users")
      .where({ email })
      .select(
        "id",
        "firstname",
        "middlename",
        "lastname",
        "email",
        "password",
        "state",
        "type"
      )
      .first(); // Solo el primero que coincida
  },

  // Obtener los IDs de los clientes asociados a un usuario
  getClientIds: async (userId) => {
    return await db("user_clients")
      .join("clients", "user_clients.idClient", "clients.id")
      .where("user_clients.idUser", userId)
      .pluck("clients.id"); // Devuelvo solo los IDs
  },

  // Buscar usuario por ID
  findById: async (id) => {
    return await db("users")
      .where({ id })
      .select(
        "id",
        "firstname",
        "middlename",
        "lastname",
        "email",
        "password",
        "state",
        "type",
        "language"
      )
      .first();
  },

  // Obtener todos los usuarios del sistema
  getAllUsers: async () => {
    // return await db('users').select('id', 'firstname', 'middlename', 'lastname', 'email', 'state', 'type', 'created_at', 'last_visit_date', 'language');
    const users = await db("users").select(
      "id",
      "firstname",
      "middlename",
      "lastname",
      "email",
      "state",
      "type",
      "last_visit_date",
      "language",
      "registration_date"
    );
    const usersWithFormattedDate = users.map((user) => ({
      ...user,
      //Llamado a función auxiliar para formatear fechas
      registration_date: getDateTimeForSQL(), // Formatea la fecha según la configuración local
      last_visit_date: getDateTimeForSQL(), // Formatea la última visita
      updated_at: getDateTimeForSQL(), // Formatea la fecha de actualización
    }));
    return usersWithFormattedDate; // Retorno los usuarios con la fecha formateada
  },

  // Crear nuevo usuario
  createUser: async (userData) => {
    const [newUserId] = await db("users").insert(userData); // Inserto y obtengo el ID del nuevo usuario
    const newUser = await db("users").where({ id: newUserId }).first(); // Busco y retorno el nuevo usuario
    return newUser;
  },

  // Actualizar un usuario por su ID
  updateUser: async (id, userData) => {
    // Asignar fecha de actualización
    const updatedData = {
      ...userData,
      updated_at: getDateTimeForSQL(), // Se actualiza desde el modelo
    };

    await db("users").where({ id }).update(updatedData);
    const updatedUser = await db("users").where({ id }).first();
    return updatedUser;
  },

  // Cambiar estado del usuario (activo/inactivo)
  toggleUserState: async (id) => {
    const user = await db("users").where({ id }).select("state").first();
    if (!user) return null;

    const newState = !user.state; // Invierto el estado actual
    await db("users").where({ id }).update({ state: newState });

    const updatedUser = await db("users").where({ id }).first(); // Retorno el nuevo estado
    return updatedUser;
  },

  // Eliminar un usuario de la base de datos
  deleteUser: async (id) => {
    const user = await db("users").where({ id }).first(); // Verifico que exista
    if (!user) return null;

    await db("users").where({ id }).del(); // Elimino el usuario
    return user;
  },

  // Actualizar la fecha de última visita del usuario
  updateLastVisit: async (id) => {
    return await db("users")
      .where({ id })
      .update({ last_visit_date: getDateTimeForSQL() }); // Fecha actual
  },

  updateLanguage: async (id, language) => {
    try {
      const update = await db("users").where({ id }).update({ language });
      return update;
    } catch (error) {
      console.error("Error en el modelo al actualizar language:", error);
      throw error; // Lo relanzas para que el controlador lo capture
    }
  },

  // Actualizar auth_provider para usuarios MSAL
  updateAuthProvider: async (id, provider = 'microsoft') => {
    try {
        const update = await db("users")
            .where({ id })
            .update({ 
                auth_provider: provider,
                updated_at: getDateTimeForSQL()
            });
        return update;
    } catch (error) {
        console.error("Error actualizando auth_provider:", error);
        throw error;
    }
  },

  // Buscar usuario por email y provider
  findByEmailAndProvider: async (email, provider = 'local') => {
    return await db("users")
        .where({ email, auth_provider: provider })
        .select(
            "id",
            "firstname", 
            "middlename",
            "lastname",
            "email",
            "password",
            "state",
            "type",
            "auth_provider"
        )
        .first();
  },

};

module.exports = User;
