const BlockModel = require('../models/blockModel');

exports.createBlock = async (req, res) => {
  try {
    const data = req.body;
    if (!data.name || !data.textQuestion) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const newBlock = await BlockModel.createBlock(data);
    res.status(201).json({ message: 'Bloque creado', data: newBlock });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear bloque', error: error.message });
  }
};

exports.getAllBlocks = async (req, res) => {
  try {
    const blocks = await BlockModel.getAllBlocks();
    res.json(blocks);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener bloques', error: error.message });
  }
};

exports.getBlockById = async (req, res) => {
  try {
    const block = await BlockModel.getBlockById(req.params.id);
    res.json(block);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.updateBlock = async (req, res) => {
  try {
    const updatedBlock = await BlockModel.updateBlock(req.params.id, req.body);
    res.json({ message: 'Bloque actualizado', data: updatedBlock });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar bloque', error: error.message });
  }
};

exports.deleteBlock = async (req, res) => {
  try {
    const result = await BlockModel.deleteBlock(req.params.id);
    res.json({ message: 'Bloque eliminado', ...result });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar bloque', error: error.message });
  }
};
