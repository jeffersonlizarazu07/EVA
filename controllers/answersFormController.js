const knex = require("../config/db");
const AnswersFormModel = require("../models/answersFormModel");

exports.createAnswer = async (req, res) => {
  try {
    const { monitoringDate, userId, answers } = req.body;

    if (!monitoringDate) {
      return res.status(400).json({ message: "Fecha de monitorización requerida" });
    }

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: "Se requiere un array de respuestas" });
    }

    // Validar campos de cada respuesta
    for (const respuesta of answers) {
      const { question_id, answer_question } = respuesta;
      if (!question_id || !answer_question) {
        return res.status(400).json({ message: "Faltan campos en una o más respuestas" });
      }
    }

    // Guardar cada respuesta con la fecha que viene desde frontend
    const results = [];
    for (const respuesta of answers) {
      const result = await AnswersFormModel.createAnswer({
        question_id: respuesta.question_id,
        answer: respuesta.answer_question,
        idUser: userId,
        date: monitoringDate,  // <-- Usar fecha enviada desde frontend
      });
      results.push(result);
    }

    res.status(201).json({ message: "Respuestas guardadas", data: results });
  } catch (error) {
    console.error("Error en createAnswersBulk:", error);
    res.status(500).json({ message: "Error al guardar respuestas" });
  }
};

exports.createMonitoring = async (req, res) => {
  try {
    const { date, feedback, idUserAgent, idUserMonitor, idForm, score } = req.body;

    if (!date || !idUserAgent || !idUserMonitor || !idForm || score === undefined) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const result = await AnswersFormModel.createMonitoring({
      date,
      score,
      feedback,
      id_user_agent: idUserAgent,
      id_user_monitor: idUserMonitor,
      id_form: idForm,
    });

    res.status(201).json({ message: "Monitoreo guardado", data: result });
  } catch (error) {
    console.error("Error guardando monitoreo final:", error);
    res.status(500).json({ message: "Error interno al guardar monitoreo" });
  }
};

exports.getAllAnswers = async (req, res) => {
  try {
    const answers = await AnswersFormModel.getAllAnswers();
    res.json(answers);
  } catch (error) {
    console.error("Error al obtener todas las respuestas:", error.message);
    res.status(500).json({ message: "Error al obtener respuestas" });
  }
};

exports.getAnswerById = async (req, res) => {
  const { id } = req.params;
  try {
    const answer = await AnswersFormModel.getAnswerById(id);

    if (!answer) {
      return res.status(404).json({ message: "Respuesta no encontrada" });
    }

    res.json(answer);
  } catch (error) {
    console.error("Error al obtener respuesta por ID:", error.message);
    res.status(500).json({ message: "Error al obtener respuesta" });
  }
};

exports.getAnswersByBlockId = async (req, res) => {
  const { blockId } = req.params;
  try {
    const answers = await AnswersFormModel.getAnswersByBlockId(blockId);
    res.json(answers);
  } catch (error) {
    console.error(
      "Error al obtener respuestas por bloque:",
      error.message,
      error.stack
    );
    res.status(500).json({ message: "Error al obtener respuestas" });
  }
};

exports.getAnswersByQuestionId = async (req, res) => {
  const { questionId } = req.params;
  try {
    const answers = await AnswersFormModel.getAnswersByQuestionId(questionId);
    res.json(answers);
  } catch (error) {
    console.error("Error al obtener respuestas por pregunta:", error.message);
    res.status(500).json({ message: "Error al obtener respuestas" });
  }
};

exports.getAnswersByQuestionAndBlockId = async (req, res) => {
  const { questionId, blockId } = req.params;
  try {
    const answer = await AnswersFormModel.getAnswersByQuestionAndBlockId(
      questionId,
      blockId
    );
    if (!answer) {
      return res.status(404).json({ message: "Respuesta no encontrada" });
    }
    res.json(answer);
  } catch (error) {
    console.error("Error al obtener respuesta específica:", error.message);
    res.status(500).json({ message: "Error al obtener respuesta" });
  }
};

exports.updateAnswer = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    // Verificar si la respuesta existe
    const existingAnswers = await knex("answers").where({ id }).first();

    if (!existingAnswers) {
      return res.status(404).json({ message: "Respuesta no encontrada" });
    }

    // Actualizar la respuesta
    const updatedAnswer = await AnswersFormModel.updateAnswer(id, data);
    res.json(updatedAnswer);
  } catch (error) {
    console.error("Error al actualizar respuesta:", error.message);
    res.status(500).json({ message: "Error al actualizar respuesta" });
  }
};

exports.deleteAnswer = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await AnswersFormModel.deleteAnswer(id);

    if (!deleted) {
      return res.status(404).json({ message: "Respuesta no encontrada" });
    }

    res.json({ message: "Respuesta eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar respuesta:", error.message);
    res.status(500).json({ message: "Error al eliminar respuesta" });
  }
};

exports.getQuestionsAndAnswersByBlockId = async (req, res) => {
  const { blockId } = req.params;

  try {
    const questions = await knex("questions_form")
      .where({ block_id: blockId })
      .orderBy("id");

    const questionIds = questions.map((q) => q.id);

    let answers = [];
    if (questionIds.length > 0) {
      answers = await knex("answers")
        .whereIn("question_id", questionIds)
        .select("question_id", "answer as answer_question");
    }

    const merged = questions.map((q) => {
      const relatedAnswers = answers
        .filter((a) => a.question_id === q.id)
        .map((a) => a.answer_question);

      return {
        ...q,
        answers: relatedAnswers
      };
    });

    res.status(200).json(merged);
  } catch (error) {
    console.error("Error al obtener preguntas + respuestas:", error);
    res.status(500).json({ message: "Error interno" });
  }
};
