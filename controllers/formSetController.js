const FormSet = require("../models/formSet");
const FormDTO = require("../dtos/formDTO");

const formSetController = {
  async forms(req, res) {
    try {
      // Utilizamos la función getAll para obtener los formularios con la información adicional
      const forms = await FormSet.getAll();

      if (forms.length === 0) {
        return res.status(200).json({ data: [] });
      }

      res.json({
        status: "200",
        message: "Formularios obtenidos correctamente",
        data: forms, // Los datos ya están formateados correctamente
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: "500", message: "Error interno del servidor", error });
    }
  },

  async formByID(req, res) {
    const idValidation = FormDTO.validarId(req.params.id);
    if (!idValidation.status) {
      return res.status(400).json(idValidation);
    }

    try {
      const id = req.params.id;
      const form = await FormSet.getById(id);
      if (!form) {
        return res
          .status(404)
          .json({ status: "404", message: "Formulario no encontrado" });
      }
      res.json({
        status: "200",
        message: "Formulario obtenido correctamente",
        data: form,
      });
    } catch (error) {
      res.status(500).json({
        status: "500",
        message: "Error al obtener el formulario",
        error,
      });
    }
  },

  // Obtiene formularios por IDs del cliente
  async formsxClients (req, res) {
  try {
    
    // Obtener clientId de los query parameters
    const { clientId } = req.query;

    // Validación mejorada del clientId
    if (!clientId) {
      return res.status(400).json({
        status: "400",
        message: "El parámetro clientId es requerido"
      });
    }

    // Convertir a número y validar
    const numericClientId = parseInt(clientId, 10);
    
    if (isNaN(numericClientId) || numericClientId <= 0) {
      return res.status(400).json({
        status: "400",
        message: "El clientId debe ser un número entero válido mayor a 0"
      });
    }

    // Llamar al modelo para obtener los formularios
    const forms = await FormSet.getByClients([numericClientId]);

    // Verificar si se encontraron formularios
    if (!forms || forms.length === 0) {
      return res.status(404).json({
        status: "404",
        message: "No se encontraron formularios para el cliente proporcionado"
      });
    }

    // Respuesta exitosa
    res.json({
      status: "200",
      message: "Formularios obtenidos correctamente",
      data: forms
    });

  } catch (error) {
    console.error("Error en formsxClients:", error);
    res.status(500).json({ 
      status: "500", 
      message: "Error interno del servidor", 
      error: error.message 
    });
  }
},

  async postForm(req, res) {
    try {
      const validarForm = await FormDTO.validateForm(req.body);
      if (!validarForm.status) {
        return res.status(400).json(validarForm);
      }

      // const data = req.body;
      // await FormSet.create(data);

      const { title, description, state, idClient, creation_date, created_by } =
        req.body;

      await FormSet.create({
        title,
        description,
        state,
        idClient,
        creation_date,
        created_by,
      });

      res
        .status(201)
        .json({ status: "201", message: "Formulario creado correctamente" });
    } catch (error) {
      res.status(500).json({
        status: "500",
        message: "Error al crear el formulario",
        error,
      });
    }
  },

  async putForm(req, res) {
    try {
      const validarForm = await FormDTO.validateUpdate(req.body);
      if (!validarForm.status) {
        return res.status(400).json(validarForm);
      }

      const idValidation = FormDTO.validarId(req.params.id);
      if (!idValidation.status) {
        return res.status(400).json(idValidation);
      }

      const updated = await FormSet.update(req.params.id, req.body);
      if (!updated) {
        return res
          .status(404)
          .json({ status: "404", message: "Formulario no encontrado" });
      }
      res.json({
        status: "200",
        message: "Formulario actualizado correctamente",
      });
    } catch (error) {
      console.error("Error", error);
      res.status(500).json({
        status: "500",
        message: "Error al actualizar el formulario",
        error,
      });
    }
  },

  async patchForm(req, res) {
    const idValidation = FormDTO.validarId(req.params.id);
    if (!idValidation.status) {
      return res.status(400).json(idValidation);
    }

    try {
      const updated = await FormSet.toggleState(req.params.id);
      if (!updated) {
        return res
          .status(404)
          .json({ status: "404", message: "Formulario no encontrado" });
      }
      res.json({
        status: "200",
        message: "Estado del formulario actualizado correctamente",
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: "500", message: "Error al cambiar el estado", error });
    }
  },

  async deleteForm(req, res) {
    const idValidation = FormDTO.validarId(req.params.id);
    if (!idValidation.status) {
      return res.status(400).json(idValidation);
    }
    try {
      const deleted = await FormSet.delete(req.params.id);
      if (!deleted) {
        return res
          .status(404)
          .json({ status: "404", message: "Formulario no encontrado" });
      }
      res.json({
        status: "200",
        message: "Formulario eliminado correctamente",
      });
    } catch (error) {
      res.status(500).json({
        status: "500",
        message: "Error al eliminar el formulario",
        error,
      });
    }
  },
};

module.exports = formSetController;
