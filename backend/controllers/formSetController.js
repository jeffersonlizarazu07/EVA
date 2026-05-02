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
  async formsxClients(req, res) {
    try {
      // Obtener clientId de los query parameters
      const { clientId } = req.query;

      // Validación mejorada del clientId
      if (!clientId) {
        return res.status(400).json({
          status: "400",
          message: "El parámetro clientId es requerido",
        });
      }

      // Convertir a número y validar
      const numericClientId = parseInt(clientId, 10);

      if (isNaN(numericClientId) || numericClientId <= 0) {
        return res.status(400).json({
          status: "400",
          message: "El clientId debe ser un número entero válido mayor a 0",
        });
      }

      // Llamar al modelo para obtener los formularios
      const forms = await FormSet.getByClients([numericClientId]);

      // Verificar si se encontraron formularios
      if (!forms || forms.length === 0) {
        return res.status(404).json({
          status: "404",
          message:
            "No se encontraron formularios para el cliente proporcionado",
        });
      }

      // Respuesta exitosa
      res.json({
        status: "200",
        message: "Formularios obtenidos correctamente",
        data: forms,
      });
    } catch (error) {
      console.error("Error en formsxClients:", error);
      res.status(500).json({
        status: "500",
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  },

  async getForms(req, res) {
    try {
      const { userType, userId } = req.query;

      let forms;

      if (userType == 2) {
        // Admin: obtener clientes asociados y luego sus formularios
        const userClients = await db("user_clients")
          .where("idUser", userId)
          .select("idClient");

        if (userClients.length === 0) {
          return res.status(404).json({
            status: "404",
            message: "No tienes clientes asignados",
          });
        }

        // Extraer solo los IDs de cliente
        const clientIds = userClients.map((client) => client.idClient);

        // Usar el método existente del modelo
        forms = await FormSet.getFormsByAdmin(clientIds);
      } else {
        // Superadmin: todos los formularios
        forms = await FormSet.getAll(); // Asumiendo que tienes este método
      }

      if (!forms || forms.length === 0) {
        return res.status(404).json({
          status: "404",
          message:
            userType == 2
              ? "No tienes formularios disponibles"
              : "No se encontraron formularios",
        });
      }

      // Opcional: agregar información del cliente a cada formulario
      const formsWithClient = await Promise.all(
        forms.map(async (form) => {
          const client = await db("clients")
            .where("id", form.idClient)
            .select("name")
            .first();

          return {
            ...form,
            client_name: client?.name || "Cliente no encontrado",
          };
        })
      );

      res.json({
        status: "200",
        message: "Formularios obtenidos correctamente",
        data: formsWithClient,
      });
    } catch (error) {
      console.error("Error en getForms:", error);
      res.status(500).json({
        status: "500",
        message: "Error al obtener los formularios",
        error: error.message,
      });
    }
  },

  async postForm(req, res) {
    try {
      const validarForm = await FormDTO.validateForm(req.body);
      if (!validarForm.status) {
        return res.status(400).json(validarForm);
      }

      const {
        title,
        description,
        state,
        idClient,
        creation_date,
        created_by,
        userType,
      } = req.body;

      // Validar solo si es admin (userType = 2)
      if (userType == 2) {
        // Verificar que el cliente esté asociado al usuario admin en la tabla intermedia
        const clientAssociation = await db("user_clients")
          .where({
            idUser: created_by,
            idClient: idClient,
          })
          .first();

        if (!clientAssociation) {
          return res.status(403).json({
            status: "403",
            message: "El cliente no está asociado a este usuario admin",
          });
        }
      }

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
      console.error("Error en postForm:", error);
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
