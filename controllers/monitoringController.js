const Monitoring = require("../models/monitoringModel");

exports.create = async (req, res) => {
  try {
    console.log("Payload recibido:", req.body); // LOG AQUÍ
    const [insertId] = await Monitoring.create(req.body);
    console.log("ID insertado:", insertId);
    res.status(201).json({ id: insertId, message: "Monitoreo creado" });
  } catch (error) {
    console.error("Error en create:", error);
    res.status(500).json({ error: "Error al crear monitoreo", details: error });
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await Monitoring.getAll();
    res.json(data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener monitoreos", details: error });
  }
};

exports.getMonitoringByUserAndForm = async (req, res) => {
  try {
    const { userId, formId } = req.params;
    const data = await Monitoring.getMonitoringByUserAndForm(userId, formId);
    if (!data) return res.status(200).json({ monitoring: null });

    res.status(200).json({
      monitoring: {
        id: data.id,
        feedback: data.feedback,
        score: data.score,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al consultar evaluación", details: error });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await Monitoring.getById(req.params.id);
    data.monitoring = data.monitoring_id ? { id: data.monitoring_id } : null;
    if (!data) return res.status(404).json({ error: "No encontrado" });
    res.json(data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener monitoreo", details: error });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await Monitoring.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "No encontrado" });
    res.json({ message: "Monitoreo actualizado" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al actualizar monitoreo", details: error });
  }
};

exports.updateFeedback = async (req, res) => {
  try {
    const { feedback } = req.body;
    const { id } = req.params;

    const updated = await Monitoring.updateFeedback(id, feedback);
    if (!updated)
      return res.status(404).json({ error: "Monitoreo no encontrado" });

    res.json({ message: "Feedback actualizado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al actualizar feedback", details: error });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Monitoring.remove(req.params.id);
    if (!deleted) return res.status(404).json({ error: "No encontrado" });
    res.json({ message: "Monitoreo eliminado" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al eliminar monitoreo", details: error });
  }
};
