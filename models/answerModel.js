const db = require("../config/db");
const { getDateTimeForSQL } = require("../helpers/dateHelper");
class AnswerModel {
  async createAnswer(data) {
    console.log("---------Datos recibidos en createAnswer:", data);
    console.log("********************");
    // Función para formatear la fecha correctamente para MySQL
    const formatDateForMySQL = (date) => {
      return new Date(date).toISOString().slice(0, 19).replace("T", " ");
    };

    const fecha = getDateTimeForSQL(); // Genera la fecha actual

    try {
      const insertedAnswers = [];

      // Recorre el array de respuestas
      for (const answerData of data) {
        const validData = {
          //survey_id: answerData.survey_id,
          answer: answerData.answer,
          question_id: answerData.question_id,
          date: fecha,
        };

        // Realiza la inserción y obtén el ID del registro insertado
        const [insertedId] = await db("answers").insert(validData);

        const insertedAnswer = {
          id: insertedId,
          ...validData,
        };

        insertedAnswers.push(insertedAnswer);

        console.log("---------Respuesta insertada correctamente");
      }

      return {
        success: true,
        message: "Respuestas creadas correctamente",
        insertedAnswers,
      };
    } catch (error) {
      console.error("Error al crear las respuestas:", error);
      return {
        success: false,
        message: "Error al crear las respuestas",
        error: error.message,
      };
    }
  }
  async getAll() {
    try {
      const answers = await db("answers").select("*");
      return answers; // Retorna todas las respuestas
    } catch (error) {
      console.error("Error en getAll:", error.message);
      throw error;
    }
  }

  async getById(id) {
    try {
      const answer = await db("answers").where({ id }).first();
      return answer; // Retorna la respuesta por ID
    } catch (error) {
      console.error("Error en getById:", error.message);
      throw error;
    }
  }

  async update(id, data) {
    try {
      const answer = await db("answers")
        .where({ id }) // Encuentra la fila que corresponde con el id
        .update(data); // Actualiza los valores que se pasan en 'data'

      return answer; // Devuelve el resultado de la actualización (número de filas afectadas)
    } catch (error) {
      throw new Error("Error updating answer: " + error.message);
    }
  }

  async delete(id) {
    try {
      // Intentamos eliminar la respuesta con el id específico
      const result = await db("answers")
        .where({ id }) // Encontramos la fila que corresponde al id
        .del(); // Eliminamos la fila

      return result; // Devuelve el número de filas eliminadas (0 si no se encuentra ninguna fila)
    } catch (error) {
      throw new Error("Error eliminando la respuesta: " + error.message);
    }
  }

  // obtener respuestas por pregunta
  async getAnswersBySurveyScore() {
    try {
      return await db("answers")
        .select(
          "survey_set.link",
          "survey_set.title",
          "questions.select_option",
          "questions.selected_answer",
          "questions.survey_id",
          "answers.question_id",
          "questions.type",
          "answers.answer",
          "questions.question"
        )
        .join("questions", "answers.question_id", "=", "questions.id")
        .join("survey_set", "questions.survey_id", "=", "survey_set.id");
    } catch (error) {
      console.error("Error en getAnswersBySurveyScore:", error.message);
      throw error;
    }
  }

  // Obtener respuestas por encuesta y fechas
  async getAnswersBySurvey(surveyId, startDate, endDate) {
    try {
      console.log("fecha fin: ", endDate);

      const endDatePlusOneDay = new Date(endDate);
      endDatePlusOneDay.setDate(endDatePlusOneDay.getDate() + 1);
      const formattedEndDate = endDatePlusOneDay.toISOString().split("T")[0];
      console.log("fecha fin +1: ", formattedEndDate);

      const answers = await db("answers")
        .join("questions", "answers.question_id", "=", "questions.id")
        .where("questions.survey_id", surveyId)
        .andWhere(db.raw("CAST(answers.date AS DATE) >= ?", [startDate]))
        .andWhere(db.raw("CAST(answers.date AS DATE) <= ?", [endDate]))
        .select(
          "answers.question_id",
          "questions.type",
          "answers.answer",
          "questions.question"
        );

      return answers;
    } catch (error) {
      console.error("Error en getAnswersBySurvey:", error.message);
      throw error;
    }
  }

  // Agrupar respuestas por tipo (por ejemplo, rango de 0 a 10, sí/no, etc.)
  groupAnswersByType(answers, answerType, questionId) {
    try {
      //console.log(`Filtrando respuestas para la pregunta ID: ${questionId}, tipo de respuesta: ${answerType}`);
      const grouped = answers.filter(
        (answer) => answer.question_id === questionId
      );

      //cconsole.log('Respuestas agrupadas:', grouped);

      // Si no hay respuestas, retornamos un objeto vacío
      if (grouped.length === 0) {
        return {};
      }

      const result = grouped.reduce((acc, answer) => {
        const value = answer.answer;

        //console.log('Valor de respuesta:', value); // Verifica cada valor de respuesta

        if (!acc[value]) {
          acc[value] = 0;
        }
        acc[value]++;
        return acc;
      }, {});

      //console.log('Respuestas contadas:', result);

      const totalResponses = grouped.length;
      const percentageResult = {};
      for (const [key, count] of Object.entries(result)) {
        percentageResult[key] = ((count / totalResponses) * 100).toFixed(2);
      }

      //console.log('Resultado de porcentajes:', percentageResult);
      return percentageResult;
    } catch (error) {
      console.error("Error en groupAnswersByType:", error.message);
      throw error;
    }
  }

  // models/answerModel.js
  async getAnswersByRanges() {
    return db("questions as q")
      .join("answers as a", "q.id", "a.question_id")
      .select(
        "q.type as question_type",

        // CSAT (1-5) - conteos
        db.raw(`
        SUM(
          CASE WHEN q.type = 'range_onetofive'
               AND TRY_CAST(LTRIM(RTRIM(CAST(a.answer AS NVARCHAR(MAX)))) AS INT) IN (4,5)
               THEN 1 ELSE 0 END
        ) AS rango_4_5
      `),
        db.raw(`
        SUM(
          CASE WHEN q.type = 'range_onetofive'
               AND TRY_CAST(LTRIM(RTRIM(CAST(a.answer AS NVARCHAR(MAX)))) AS INT) = 5
               THEN 1 ELSE 0 END
        ) AS exact_5
      `),
        db.raw(`
        SUM(
          CASE WHEN q.type = 'range_onetofive'
               AND TRY_CAST(LTRIM(RTRIM(CAST(a.answer AS NVARCHAR(MAX)))) AS INT) = 1
               THEN 1 ELSE 0 END
        ) AS exact_1
      `),
        db.raw(`
        SUM(
          CASE WHEN q.type = 'range_onetofive'
               AND TRY_CAST(LTRIM(RTRIM(CAST(a.answer AS NVARCHAR(MAX)))) AS INT) IN (1,2)
               THEN 1 ELSE 0 END
        ) AS rango_1_2
      `),

        // CSAT (1-5) - porcentajes
        db.raw(`
        ROUND(
          100.0 * SUM(CASE WHEN q.type = 'range_onetofive'
                           AND TRY_CAST(LTRIM(RTRIM(CAST(a.answer AS NVARCHAR(MAX)))) AS INT) IN (4,5)
                           THEN 1 ELSE 0 END)
          / NULLIF(COUNT(*),0), 2
        ) AS csat_rango_4_5
      `),
        db.raw(`
        ROUND(
          100.0 * SUM(CASE WHEN q.type = 'range_onetofive'
                           AND TRY_CAST(LTRIM(RTRIM(CAST(a.answer AS NVARCHAR(MAX)))) AS INT) = 5
                           THEN 1 ELSE 0 END)
          / NULLIF(COUNT(*),0), 2
        ) AS csat_exact_5
      `),
        db.raw(`
        ROUND(
          100.0 * SUM(CASE WHEN q.type = 'range_onetofive'
                           AND TRY_CAST(LTRIM(RTRIM(CAST(a.answer AS NVARCHAR(MAX)))) AS INT) = 1
                           THEN 1 ELSE 0 END)
          / NULLIF(COUNT(*),0), 2
        ) AS csat_exact_1
      `),
        db.raw(`
        ROUND(
          100.0 * SUM(CASE WHEN q.type = 'range_onetofive'
                           AND TRY_CAST(LTRIM(RTRIM(CAST(a.answer AS NVARCHAR(MAX)))) AS INT) IN (1,2)
                           THEN 1 ELSE 0 END)
          / NULLIF(COUNT(*),0), 2
        ) AS csat_rango_1_2
      `),

        // Total buckets CSAT
        db.raw(`
        (
          SUM(CASE WHEN q.type = 'range_onetofive'
                   AND TRY_CAST(LTRIM(RTRIM(CAST(a.answer AS NVARCHAR(MAX)))) AS INT) IN (4,5)
                   THEN 1 ELSE 0 END)
        + SUM(CASE WHEN q.type = 'range_onetofive'
                   AND TRY_CAST(LTRIM(RTRIM(CAST(a.answer AS NVARCHAR(MAX)))) AS INT) = 5
                   THEN 1 ELSE 0 END)
        + SUM(CASE WHEN q.type = 'range_onetofive'
                   AND TRY_CAST(LTRIM(RTRIM(CAST(a.answer AS NVARCHAR(MAX)))) AS INT) = 1
                   THEN 1 ELSE 0 END)
        + SUM(CASE WHEN q.type = 'range_onetofive'
                   AND TRY_CAST(LTRIM(RTRIM(CAST(a.answer AS NVARCHAR(MAX)))) AS INT) IN (1,2)
                   THEN 1 ELSE 0 END)
        ) AS csat_total_buckets
      `),

        // NPS (0-10) - conteos
        db.raw(`
        SUM(
          CASE WHEN q.type = 'range_zerototen'
               AND TRY_CAST(LTRIM(RTRIM(CAST(a.answer AS NVARCHAR(MAX)))) AS INT) BETWEEN 9 AND 10
               THEN 1 ELSE 0 END
        ) AS rango_9_10
      `),
        db.raw(`
        SUM(
          CASE WHEN q.type = 'range_zerototen'
               AND TRY_CAST(LTRIM(RTRIM(CAST(a.answer AS NVARCHAR(MAX)))) AS INT) BETWEEN 7 AND 8
               THEN 1 ELSE 0 END
        ) AS rango_7_8
      `),
        db.raw(`
        SUM(
          CASE WHEN q.type = 'range_zerototen'
               AND TRY_CAST(LTRIM(RTRIM(CAST(a.answer AS NVARCHAR(MAX)))) AS INT) BETWEEN 0 AND 6
               THEN 1 ELSE 0 END
        ) AS rango_0_6
      `),

        // NPS (0-10) - porcentajes
        db.raw(`
        ROUND(
          100.0 * SUM(CASE WHEN q.type = 'range_zerototen'
                           AND TRY_CAST(LTRIM(RTRIM(CAST(a.answer AS NVARCHAR(MAX)))) AS INT) BETWEEN 9 AND 10
                           THEN 1 ELSE 0 END)
          / NULLIF(COUNT(*),0), 2
        ) AS nps_rango_9_10
      `),
        db.raw(`
        ROUND(
          100.0 * SUM(CASE WHEN q.type = 'range_zerototen'
                           AND TRY_CAST(LTRIM(RTRIM(CAST(a.answer AS NVARCHAR(MAX)))) AS INT) BETWEEN 7 AND 8
                           THEN 1 ELSE 0 END)
          / NULLIF(COUNT(*),0), 2
        ) AS nps_rango_7_8
      `),
        db.raw(`
        ROUND(
          100.0 * SUM(CASE WHEN q.type = 'range_zerototen'
                           AND TRY_CAST(LTRIM(RTRIM(CAST(a.answer AS NVARCHAR(MAX)))) AS INT) BETWEEN 0 AND 6
                           THEN 1 ELSE 0 END)
          / NULLIF(COUNT(*),0), 2
        ) AS nps_rango_0_6
      `),

        // FCR (Yes/No) - conteos
        db.raw(`
        SUM(
          CASE WHEN q.type = 'yes_no'
               AND UPPER(LTRIM(RTRIM(CAST(a.answer AS NVARCHAR(MAX))))) IN ('SÍ','SI','YES','Y','1')
               THEN 1 ELSE 0 END
        ) AS total_si
      `),
        db.raw(`
        SUM(
          CASE WHEN q.type = 'yes_no'
               AND UPPER(LTRIM(RTRIM(CAST(a.answer AS NVARCHAR(MAX))))) IN ('NO','N','NOT','0')
               THEN 1 ELSE 0 END
        ) AS total_no
      `),

        // FCR (Yes/No) - porcentajes
        db.raw(`
        ROUND(
          100.0 * SUM(CASE WHEN q.type = 'yes_no'
                           AND UPPER(LTRIM(RTRIM(CAST(a.answer AS NVARCHAR(MAX))))) IN ('SÍ','SI','YES','Y','1')
                           THEN 1 ELSE 0 END)
          / NULLIF(COUNT(*),0), 2
        ) AS fcr_si
      `),
        db.raw(`
        ROUND(
          100.0 * SUM(CASE WHEN q.type = 'yes_no'
                           AND UPPER(LTRIM(RTRIM(CAST(a.answer AS NVARCHAR(MAX))))) IN ('NO','N','NOT','0')
                           THEN 1 ELSE 0 END)
          / NULLIF(COUNT(*),0), 2
        ) AS fcr_no
      `),

        // CES (dificultad) - conteos
        db.raw(`
        SUM(
          CASE WHEN q.type = 'range_difficulty'
               AND LTRIM(RTRIM(CAST(a.answer AS NVARCHAR(MAX)))) IN ('Muy difícil','5')
               THEN 1 ELSE 0 END
        ) AS muy_dificil
      `),
        db.raw(`
        SUM(
          CASE WHEN q.type = 'range_difficulty'
               AND LTRIM(RTRIM(CAST(a.answer AS NVARCHAR(MAX)))) IN ('Difícil','4')
               THEN 1 ELSE 0 END
        ) AS dificil
      `),
        db.raw(`
        SUM(
          CASE WHEN q.type = 'range_difficulty'
               AND LTRIM(RTRIM(CAST(a.answer AS NVARCHAR(MAX)))) IN ('Ni fácil / ni difícil','3')
               THEN 1 ELSE 0 END
        ) AS ni_facil
      `),
        db.raw(`
        SUM(
          CASE WHEN q.type = 'range_difficulty'
               AND LTRIM(RTRIM(CAST(a.answer AS NVARCHAR(MAX)))) IN ('Fácil','2')
               THEN 1 ELSE 0 END
        ) AS facil
      `),
        db.raw(`
        SUM(
          CASE WHEN q.type = 'range_difficulty'
               AND LTRIM(RTRIM(CAST(a.answer AS NVARCHAR(MAX)))) IN ('Muy fácil','1')
               THEN 1 ELSE 0 END
        ) AS muy_facil
      `),

        // CES (dificultad) - porcentajes
        db.raw(`
        ROUND(
          100.0 * SUM(CASE WHEN q.type = 'range_difficulty'
                           AND LTRIM(RTRIM(CAST(a.answer AS NVARCHAR(MAX)))) IN ('Muy difícil','5')
                           THEN 1 ELSE 0 END)
          / NULLIF(COUNT(*),0), 2
        ) AS ces_muy_dificil
      `),
        db.raw(`
        ROUND(
          100.0 * SUM(CASE WHEN q.type = 'range_difficulty'
                           AND LTRIM(RTRIM(CAST(a.answer AS NVARCHAR(MAX)))) IN ('Difícil','4')
                           THEN 1 ELSE 0 END)
          / NULLIF(COUNT(*),0), 2
        ) AS ces_dificil
      `),
        db.raw(`
        ROUND(
          100.0 * SUM(CASE WHEN q.type = 'range_difficulty'
                           AND LTRIM(RTRIM(CAST(a.answer AS NVARCHAR(MAX)))) IN ('Ni fácil / ni difícil','3')
                           THEN 1 ELSE 0 END)
          / NULLIF(COUNT(*),0), 2
        ) AS ces_ni_facil
      `),
        db.raw(`
        ROUND(
          100.0 * SUM(CASE WHEN q.type = 'range_difficulty'
                           AND LTRIM(RTRIM(CAST(a.answer AS NVARCHAR(MAX)))) IN ('Fácil','2')
                           THEN 1 ELSE 0 END)
          / NULLIF(COUNT(*),0), 2
        ) AS ces_facil
      `),
        db.raw(`
        ROUND(
          100.0 * SUM(CASE WHEN q.type = 'range_difficulty'
                           AND LTRIM(RTRIM(CAST(a.answer AS NVARCHAR(MAX)))) IN ('Muy fácil','1')
                           THEN 1 ELSE 0 END)
          / NULLIF(COUNT(*),0), 2
        ) AS ces_muy_facil
      `),

        // Total respuestas por tipo
        db.raw("COUNT(*) AS total_responses")
      )
      .whereIn("q.type", [
        "range_onetofive",
        "range_zerototen",
        "yes_no",
        "range_difficulty",
      ])
      .groupBy("q.type");
  }
}

module.exports = AnswerModel;
