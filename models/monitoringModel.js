const knex = require("../config/db");
const { getDateTimeForSQL } = require("../helpers/dateHelper");

const MonitoringModel = {
  // Crear
  create(data) {
    return knex("monitoring").insert({
      monitoring_date: getDateTimeForSQL(),
      score: data.score,
      feedback: data.feedback,
      check: data.check,
      id_user: data.id_user,
      id_form: data.id_form,
    });
  },

  // Obtener todos con join
  getAll() {
    return knex("monitoring")
      .join("users", "monitoring.id_user", "users.id")
      .join("forms", "monitoring.id_form", "forms.id")
      .select(
        "monitoring.*",
        "users.name as user_name",
        "forms.title as form_title"
      );
  },

  // Obtener por ID
  getById: (id) => db("monitoring").where({ id }).first(),

  // Actualizar
  update(id, data) {
    return knex("monitoring").where({ id }).update({
      score: data.score,
      check: data.check,
      id_user: data.id_user,
      id_form: data.id_form,
    });
  },

  updateFeedback(id, feedback) {
    return knex("monitoring").where({ id }).update({ feedback });
  },

  // Eliminar
  remove(id) {
    return knex("monitoring").where({ id }).del();
  },
};

module.exports = MonitoringModel;
