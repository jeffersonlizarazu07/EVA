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

  getMonitoringByUserAndForm(userId, formId) {
    return knex("monitoring")
      .where({ id_user: userId, id_form: formId })
      .first();
  },

  // Obtener por ID
  getById: (id) => {
    return knex("users as u")
      .leftJoin("monitoring as m", "m.id_user", "u.id")
      .select(
        "u.*",
        "m.id as monitoring_id" // Solo trae el ID de la monitorización
      )
      .where("u.id", id)
      .first();
  },

  // Obtener monitorizaciones general del  agente
  getByUserGeneral: async (formularioParam,agenteParam, evaluadorParam,formattedStartDate,formattedEndDate) => {
    // Parametros opcionales 
    if (agenteParam === 'null') agenteParam = "";
    if (evaluadorParam === 'null') evaluadorParam = "";
    if (formularioParam === 'null') formularioParam = "";

    let query = knex("monitoring")
      .join("form_set", "monitoring.id_form", "form_set.id")
      .join("clients", "form_set.idClient", "clients.id")
      .join("users", "monitoring.id_user_monitor", "users.id")
      .join("users as agent", "monitoring.id_user_agent", "agent.id")
      .select(
        knex.raw("FORMAT(monitoring.date, 'yyyy-MM-dd HH:mm:ss') as monitoring_date"),
        knex.raw("FORMAT(monitoring.check_date, 'yyyy-MM-dd HH:mm:ss') as check_FORMATted"),
        "monitoring.*",
        "form_set.title as form_title",
        "clients.client as client_name",
        knex.raw("(users.firstname + ' ' + users.lastname) as evaluator_name"),
        knex.raw("(agent.firstname + ' ' + agent.lastname) as agent_name")
      );


      if (formularioParam && formularioParam.trim() !== '' && formularioParam !== '""') {
          query = query.where("monitoring.id_form", formularioParam);
      }
      if (agenteParam && agenteParam.trim() !== '' && agenteParam !== '""') {
          query = query.andWhere(knex.raw(`(agent.firstname + ' ' + agent.lastname)= ?`, [agenteParam]));
      }
      if (evaluadorParam && evaluadorParam.trim() !== '' && evaluadorParam !== '""') {
          query = query.andWhere(knex.raw(`(users.firstname + ' ' + users.lastname)= ?`, [evaluadorParam]));
      }
          query = query.andWhereBetween('monitoring.date', [formattedStartDate, formattedEndDate]);

    const monitorings = await query;

    const stats = await knex("monitoring")
      .select(
        knex.raw("CAST(COUNT(*) AS INT) as total_monitorings"),
        knex.raw("CAST(ISNULL(ROUND(AVG(score), 2), 0) AS FLOAT) as average_score")
      )
      .first();

    return { monitorings, stats };
  },

  //


  // Obtener monitorizaciones por agente
  getByUserId: async (userId) => {
    const monitorings = await knex("monitoring")
      .join("form_set", "monitoring.id_form", "form_set.id")
      .join("clients", "form_set.idClient", "clients.id")
      .join("users", "monitoring.id_user_monitor", "users.id")
      .join("users as agent", "monitoring.id_user_agent", "agent.id")
      .select(
        knex.raw(
          "FORMAT(monitoring.date, 'yyyy-MM-dd HH:mm:ss') as monitoring_date"
        ),
        knex.raw(
          "FORMAT(monitoring.check_date, 'yyyy-MM-dd HH:mm:ss') as check_formatted"
        ),
        "monitoring.*",
        "form_set.title as form_title",
        "clients.client as client_name",
        knex.raw("(users.firstname + ' ' + users.lastname) as evaluator_name"),
        knex.raw("(agent.firstname + ' ' + agent.lastname) as agent_name")
      )
      .where("monitoring.id_user_agent", userId);

    const stats = await knex("monitoring")
      .where("id_user_agent", userId)
      .select(
        knex.raw("CAST(COUNT(*) AS INT) as total_monitorings"),
        knex.raw(
          "CAST(ISNULL(ROUND(AVG(score), 2), 0) AS FLOAT) as average_score"
        )
      )
      .first();

    return { monitorings, stats };
  },

  // Obtener monitorización estructurada por agente
  getMonitoringDetails: async (monitoringId) => {
    // Consulta plana para traer bloques, preguntas y respuestas
    const rows = await knex("monitoring as m")
      .join("form_set as f", "m.id_form", "f.id")
      .join("blocks as b", "f.id", "b.form_id")
      .join("questions_form as q", "b.id", "q.block_id")
      .join("answers_form as af", function () {
        this.on("af.question_id", "=", "q.id").andOn(
          "af.idUser",
          "=",
          "m.id_user_agent"
        );
      })
      .select(
        "b.id as block_id",
        "b.block_name",
        "b.percentage",
        "q.id as question_id",
        "q.question_name",
        "q.select_option",
        "q.selected_answer",
        "af.answer"
        // "af.is_correct" // Suponiendo que este campo existe
      )
      .where("m.id", monitoringId)
      .andWhere("m.date", knex.ref("af.date"))
      .orderBy("b.id")
      .orderBy("q.id");

    // Procesa los datos para agruparlos por bloque
    const groupedData = [];

    rows.forEach((row) => {
      // Busca si el bloque ya existe en groupedData
      let block = groupedData.find((b) => b.block_id === row.block_id);

      if (!block) {
        // Si no existe, crear el bloque
        block = {
          block_id: row.block_id,
          block_name: row.block_name,
          percentage: row.percentage,

          questions: [],
        };
        groupedData.push(block);
      }

      // Convertir la posicion de la respuesta en el array a su equivalente en string
      const options = row.select_option ? row.select_option.split(",") : [];

      const selectedIndexes = row.answer ? row.answer.split(",") : [];
      const correctIndexes = row.selected_answer
        ? row.selected_answer.split(",")
        : [];
      const isCorrect =
        JSON.stringify(selectedIndexes.sort()) ===
        JSON.stringify(correctIndexes.sort());

      const selectedAnswers = selectedIndexes
        .map((i) => options[parseInt(i)])
        .filter((opt) => opt !== undefined)
        .join(", ");

      // Agrega la pregunta al bloque
      block.questions.push({
        question_id: row.question_id,
        question_name: row.question_name,
        select_option: selectedAnswers,
        answer: row.answer,
        correct_answer: isCorrect,
      });
    });

    console.log("Data agrupada", groupedData);
    return groupedData;
  },

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

  updateCheck(id, checkValue, check_date) {
    return knex("monitoring")
      .where({ id })
      .update({ check: checkValue, check_date: getDateTimeForSQL() });
  },
};

module.exports = MonitoringModel;
