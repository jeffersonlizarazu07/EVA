const db = require("../config/db");
const { getDateTimeForSQL } = require("../helpers/dateHelper");

const FormSet = {
  getAll: () => {
    try {
      return db("form_set")
        .join("clients", "form_set.idClient", "clients.id")
        .join("users as creator", "form_set.created_by", "creator.id")
        .leftJoin("users as updater", "form_set.updated_by", "updater.id")
        .leftJoin("monitoring", "monitoring.id_form", "form_set.id")
        .groupBy(
          "form_set.id",
          "form_set.idClient",
          "form_set.title",
          "form_set.description",
          "form_set.creation_date",
          "form_set.updated_date",
          "form_set.state",
          "clients.client",
          "creator.firstname",
          "creator.lastname",
          "updater.firstname",
          "updater.lastname"
        )
        .select(
          "form_set.id",
          "form_set.idClient",
          "form_set.title",
          "form_set.description",
          "form_set.creation_date",
          "form_set.updated_date",
          db.raw(`CASE 
                  WHEN form_set.state = 1 THEN 'Activo' 
                  WHEN form_set.state = 0 THEN 'Inactivo' 
                  ELSE 'Desconocido' 
                END as state`),
          "clients.client as client_name",
          db.raw(
            `(creator.firstname + ' ' + creator.lastname) as created_by_name`
          ),
          db.raw(
            `ISNULL(FORMAT(form_set.updated_date, 'yyyy-MM-dd HH:mm:ss'), 'No actualizada') as formatted_updated_date`
          ),
          db.raw(
            `ISNULL(FORMAT(form_set.creation_date, 'yyyy-MM-dd HH:mm:ss'), 'No actualizada') as formatted_creation_date`
          ),
          db.raw(
            `ISNULL((updater.firstname + ' ' + updater.lastname), 'No actualizada') as updated_by_name`
          ),
          db.raw(`COUNT(monitoring.id) as monitorings_number`),
          db.raw(
            `ISNULL(CAST(AVG(monitoring.score) AS DECIMAL(10,2)), 0.00) as average_score`
          )
        );
    } catch (error) {
      console.error("Error al crear la respuesta:", error);
      throw new Error(
        "No se pudo crear la respuesta debido a un error en el servidor." +
          error.message
      );
    }
  },

  getById: (id) => db("form_set").where({ id }).first(), // Obtener formulario por ID

  // Obtener Id por ID del
  getByClients: (clientIdsArray) => {
    // Validar que el array no esté vacío
    if (!clientIdsArray || clientIdsArray.length === 0) {
      throw new Error("Se requiere al menos un ID de cliente");
    }

    // Validar que todos los IDs sean números enteros positivos
    const invalidIds = clientIdsArray.filter(
      (id) => !Number.isInteger(id) || id <= 0
    );

    if (invalidIds.length > 0) {
      throw new Error(`IDs de cliente inválidos: ${invalidIds.join(", ")}`);
    }

    // Realizar la consulta a la base de datos
    return db("form_set")
      .whereIn("idClient", clientIdsArray)
      .select("*") // Corregir el select que estaba vacío
      .then((results) => {
        return results;
      })
      .catch((error) => {
        console.error("Error en consulta DB:", error);
        throw error;
      });
  },
  // create: (data) => db("form_set").insert(data),

  create: async (data) => {
    try {
      const date = getDateTimeForSQL(); // Genera la fecha actual
      const [id] = await db("form_set").insert({
        title: data.title,
        description: data.description,
        creation_date: date,
        created_by: data.created_by,
        state: 1,
        idClient: data.idClient,
      });
      return { id, ...data };
    } catch (error) {
      console.error("Error al insertar datos");
      throw error;
    }
  },

  update: async (id, data) => {
    const date = getDateTimeForSQL(); // Fecha actual al actualizar
    try {
      await db("form_set").where({ id }).update({
        title: data.title,
        description: data.description,
        updated_date: date,
        updated_by: data.updated_by,
      });

      // Obtener y retornar el registro actualizado
      const updatedForm = await db("form_set").where({ id }).first();
      return updatedForm;
    } catch (error) {
      console.error("Error updating form_set:", error);
      return false;
    }
  },

  toggleState: async (id) => {
    try {
      return await db("form_set")
        .where({ id })
        .first()
        .then((form) => {
          if (!form) return null;
          return db("form_set").where({ id }).update({ state: !form.state });
        });
    } catch (error) {
      console.error("Error al cambiar el estado del formulario:", error);
      throw new Error(
        "No se pudo cambiar el estado del formulario debido a un error en el servidor." +
          error.message
      );
    }
  },

  delete: async (id) => {
    try {
      const res = await db("form_set").where({ id }).del();
      return res;
    } catch (error) {
      console.error("Error al eliminar el formulario:", error);
      throw new Error(
        "No se pudo eliminar el formulario debido a un error en el servidor." +
          error.message
      );
    }
  },
};

module.exports = FormSet;
