const knex = require("../config/db");
const AnswersFormModel = require("../models/answersFormModel");

exports.saveMonitoringAndAnswers = async (req, res) => {
  try {
    const {
      monitoringDate,
      id_user_monitor,
      id_user_agent,
      id_form,
      score,
      feedback,
      answers,
    } = req.body;

    // Validaciones básicas
    if (!monitoringDate || !id_user_monitor || !id_user_agent || !id_form) {
      return res.status(400).json({ message: "Datos obligatorios faltantes" });
    }

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: "Se requiere un array de respuestas" });
    }

    for (const ans of answers) {
      if (!ans.question_id || !ans.answer_question) {
        return res.status(400).json({ message: "Campos incompletos en respuestas" });
      }
    }

    // Llamar al modelo para insertar monitorización y respuestas
    const result = await AnswersFormModel.saveMonitoringAndAnswers({
      monitoringDate,
      id_user_monitor,
      id_user_agent,
      id_form,
      score,
      feedback,
      answers,
    });

    return res.status(201).json({
      message: "Monitorización y respuestas guardadas correctamente",
      data: result,
    });
  } catch (error) {
    console.error("Error al guardar monitorización y respuestas:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
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

// Obtener el monitoreo de respuestas
exports.getMonitoring = async (req, res) => {
  try{
    const monitoring = await AnswersFormModel.getMonitoring();
    res.json(monitoring);
  }catch (error) {
    console.error('Error al obtener el monitoreo:', error.message);
    res.status(500).json({ message: 'Error al obtener el monitoreo' });
  }
}

// ...

// obtener clientes y infomacion de forms_set


exports.getClientsAndForms = async (req, res)=>{
  try {
    const response = await AnswersFormModel.getClientsAndForms();
    res.json(response);
  } catch (error) {
    console.error('Error al obtener clientes y formularios:', error.message);
    res.status(500).json({ message: 'Error al obtener clientes y formularios' });
  }
}

// ...


// obtener respuestas multiple 

exports.getResponseMult = async (req, res)=>{
  try {
    const response = await AnswersFormModel.getResponseMult()
    res.json(response)
  } catch (error) {
     console.error('Error al obtener respuestas multiple :', error.message);
    res.status(500).json({ message: 'Error al obtener respuestas multiple ' });
  }
}

// ...
// obtener los reportes filtrados 

exports.getReportFilter= async(req,res)=>{
  const {fromId, starDate, endDate, agente, evaluador} = req.params
  try {
    const response = await AnswersFormModel.getReportFilter(fromId, starDate, endDate, agente, evaluador);
    if(!response){
      return res.status(404).json({message:'Reporte no encontrada'})
    }
    res.json(response)
  } catch (error) {
     console.error('Error al obtener el reporte filtrado:', error.message);
    res.status(500).json({ message: 'Error al obtener el reporte filtrado' });
  }
}

// ...

// obtener los reportes de los monitores para agentes

exports.getReportMonitoring = async (req, res)=>{
  try {
    const report = await AnswersFormModel.getReportMonitoring();
    res.json(report)
  } catch (error) {
    console.error('Error al obtener el reporte de monitoreos:', error.message);
    res.status(500).json({ message: 'Error al obtener el reporte de monitoreos' });
  }
}

// ...

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
