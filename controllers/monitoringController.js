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

exports.getByUserId = async (req, res) => {
  const { userId } = req.params; // Obtener el userId desde la URL
  console.log("📥 Backend recibió userId:", userId);

  try {
    // Llamar al servicio que consulta las monitorizaciones
    const data = await Monitoring.getByUserId(userId);

    if (!data || data.length === 0) {
      // Si no hay monitorizaciones asociadas al usuario
      return res.status(200).json([]);
    }

    // Devolver las monitorizaciones
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error al obtener monitorizaciones del agente:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

exports.getMonitoringDetails = async (req, res) => {
  const { monitoringId } = req.params;

  try {
    const details = await Monitoring.getMonitoringDetails(monitoringId);
    console.log("Detalles de los monitoreos", details);
    res.json({
      monitoringId,
      details,
    });
  } catch (error) {
    console.error("Error al obtener la monitorización detallada:", error);
    res.status(500).json({ message: "Error interno del servidor." });
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

exports.updateCheck = async (req, res) => {
  const { id } = req.params;
  const { check, check_date } = req.body;

  try {
    if (typeof check !== "boolean" && typeof check !== "number") {
      return res.status(400).json({ error: "El valor 'check' no es válido." });
    }

    await Monitoring.updateCheck(id, check, check_date);
    res.status(200).json({ message: "Check actualizado correctamente." });
  } catch (error) {
    console.error("Error al actualizar el check:", error);
    res.status(500).json({ error: "Error interno al actualizar el check." });
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
