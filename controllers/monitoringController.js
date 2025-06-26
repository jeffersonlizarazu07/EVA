exports.create = async (req, res) => {
  try {
    await Monitoring.create(req.body);
    res.status(201).json({ message: 'Monitoreo creado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear monitoreo', details: error });
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await Monitoring.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener monitoreos', details: error });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await Monitoring.getById(req.params.id);
    if (!data) return res.status(404).json({ error: 'No encontrado' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener monitoreo', details: error });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await Monitoring.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'No encontrado' });
    res.json({ message: 'Monitoreo actualizado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar monitoreo', details: error });
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Monitoring.remove(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'No encontrado' });
    res.json({ message: 'Monitoreo eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar monitoreo', details: error });
  }
};