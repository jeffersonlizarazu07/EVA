const UserClient = require("../models/userClient");
const UserClientDTO = require("../dtos/userClientDTO");

const userClientController = {
  async userClients(req, res) {
    try {
      const user_clients = await UserClient.getAll();
      if (user_clients.length === 0) {
        return res
          .status(404)
          .json({ status: "404", message: "No se encontraron asociaciones" });
      }
      res.json({
        status: "200",
        message: "Asociaciones obtenidas correctamente",
        data: user_clients,
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: "500", message: "Error interno del servidor", error });
    }
  },

  async userClientByID(req, res) {
    const validarId = UserClientDTO.validarId(req.params.id);
    if (!validarId.status) {
      return res.status(400).json(validarId);
    }

    try {
      const { id } = req.params;
      const userClient = await UserClient.getByUserId(id);
      if (!userClient.length) {
        return res
          .status(404)
          .json({ status: "404", message: "Asociación no encontrada" });
      }
      res.json({
        status: "200",
        message: "Asociación obtenida correctamente",
        data: userClient,
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: "500", message: "Error interno del servidor", error });
    }
  },

  async postUserClient(req, res) {
    try {
      const validaUserClient = await UserClientDTO.validateUserClient(req.body);
      if (!validaUserClient.status) {
        return res.status(400).json(validaUserClient);
      }
      const associations = req.body;
      // if (!Array.isArray(associations)) {
      //     return res.status(400).json({ status: '400', message: 'Datos inválidos' });
      // }
      await UserClient.create(associations);
      res
        .status(201)
        .json({ status: "201", message: "Asociaciones creadas correctamente" });
    } catch (error) {
      res
        .status(500)
        .json({
          status: "500",
          message: "Error al crear la asociación",
          error,
        });
    }
  },

  async putUserClient(req, res) {
    const validarId = UserClientDTO.validarId(req.params.idUser);
    if (!validarId.status) {
      return res.status(400).json(validarId);
    }

    const validaUserClient = await UserClientDTO.validateUserClientUpdate(
      req.body
    );
    if (!validaUserClient.status) {
      return res.status(400).json(validaUserClient);
    }
    try {
      const { idUser } = req.params;
      const { clientIds } = req.body;
      if (!Array.isArray(clientIds)) {
        return res
          .status(400)
          .json({ status: "400", message: "Datos inválidos" });
      }
      await UserClient.updateByUserId(idUser, clientIds);
      res.json({
        status: "200",
        message: "Asociaciones actualizadas correctamente",
      });
    } catch (error) {
      res
        .status(500)
        .json({
          status: "500",
          message: "Error al actualizar la asociación",
          error,
        });
    }
  },

  async deleteUserClient(req, res) {
    try {
      const { id } = req.params;
      const deleted = await UserClient.deleteById(id);
      if (!deleted) {
        return res
          .status(404)
          .json({ status: "404", message: "Asociación no encontrada" });
      }
      res.json({
        status: "200",
        message: "Asociación eliminada correctamente",
      });
    } catch (error) {
      res
        .status(500)
        .json({
          status: "500",
          message: "Error al eliminar la asociación",
          error,
        });
    }
  },
};

module.exports = userClientController;
