// controllers/clientController.js
const ClientModel = require("../models/clientModel");
const path = require("path");
const fs = require("fs");
const knex = require("../config/db");
const clientModel = new ClientModel(knex);
const ClientsDTO = require("../dtos/clientsDTO");
const pathBaseClientes = path.join(__dirname, "..", "public", "clientes");

function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Método para crear un cliente
const createClient = async (req, res) => {
  const validacionUsurio = ClientsDTO.validateCleint(req.body);

  if (!validacionUsurio.status) {
    return res.status(400).json(validacionUsurio);
  }

  try {
    const { client, state, color_tag1, color_tag2, logo } = req.body;

    // Si hay una imagen, obtenemos su nombre
    //let logo = null;

    // Crear cliente en la base de datos
    const newClient = await clientModel.create({
      client,
      state,
      color_tag1,
      color_tag2,
      logo: null,
    });

    // Si se subió imagen en POST, mover desde tmp a /clientes/{id}/foto{ext} y actualizar registro
    if (req.file && newClient?.id) {
      const clientDir = path.join(pathBaseClientes, String(newClient.id));
      ensureDirSync(clientDir);
      const ext =
        path.extname(req.file.originalname) || path.extname(req.file.filename);
      const finalName = `foto${ext}`;
      const tmpPath = path.join(pathBaseClientes, "tmp", req.file.filename);
      const finalPath = path.join(clientDir, finalName);
      try {
        if (fs.existsSync(tmpPath)) {
          fs.renameSync(tmpPath, finalPath);
        }
        await clientModel.update(newClient.id, {
          logo: `${newClient.id}/${finalName}`,
        });
        newClient.logo = `${newClient.id}/${finalName}`;
      } catch (moveErr) {
        console.error("Error moviendo logo a carpeta del cliente:", moveErr);
      }
    }

    return res.status(201).json({
      status: true,
      message: "Cliente creado correctamente",
      data: newClient,
    });
  } catch (error) {
    console.error("Error al crear el cliente:", error);
    return res
      .status(500)
      .json({ message: "Error al crear el cliente", error: error.message });
  }
};

// Obtener todos los clientes
const getClients = async (req, res) => {
  try {
    const { userType, userId } = req.query;

    let clients;

    if (userType == 2) {
      // Admin: solo clientes asociados
      clients = await clientModel.getByUserId(userId);
    } else {
      // Superadmin o usuario tipo 1: todos los clientes
      clients = await clientModel.getAll();
    }

    if (clients.length === 0) {
      return res.status(404).json({
        message:
          userType == 2
            ? "No tienes clientes asignados"
            : "No se encontraron clientes",
      });
    }

    return res.status(200).json({ data: clients });
  } catch (error) {
    console.error("Error obteniendo clientes:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Obtener un cliente por ID
const getClientById = async (req, res) => {
  const { id } = req.params;

  const validarId = ClientsDTO.validarId(id);
  if (!validarId.status) {
    return res.status(400).json(validarId);
  }

  try {
    const numericId = parseInt(id, 10);
    const client = await clientModel.getById(numericId);
    if (!client) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    return res.status(200).json({ data: client });
  } catch (error) {
    console.error("❌ Error al obtener cliente:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Actualizar cliente
const updateClient = async (req, res) => {
  const validarId = ClientsDTO.validarId(req.params.id);

  if (!validarId.status) {
    return res.status(400).json(validarId);
  }

  const validacionUsurio = ClientsDTO.validateCleint(req.body);

  if (!validacionUsurio.status) {
    return res.status(400).json(validacionUsurio);
  }

  try {
    const { id } = req.params;
    const { client, state, color_tag1, color_tag2 } = req.body;

    if (!client && !state && !color_tag1 && !color_tag2 && !req.file) {
      return res.status(400).json({ message: "No hay datos para actualizar" });
    }

    try {
      const { id } = req.params;
      const { client, state, color_tag1, color_tag2 } = req.body;

      if (!client && !state && !color_tag1 && !color_tag2 && !req.file) {
        return res
          .status(400)
          .json({ message: "No hay datos para actualizar" });
      }

      // Prepara los datos a actualizar
      let dataToUpdate = { client, state, color_tag1, color_tag2 };

      if (req.file) {
        const existingClient = await clientModel.getById(id);

        // Asegurar carpeta del cliente
        const clientDir = path.join(pathBaseClientes, String(id));
        ensureDirSync(clientDir);

        // Borrar anterior si existe
        if (existingClient && existingClient.logo) {
          const oldImagePath = path.join(pathBaseClientes, existingClient.logo);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }

        // Renombrar a foto{ext}
        const ext =
          path.extname(req.file.originalname) ||
          path.extname(req.file.filename);
        const finalName = `foto${ext}`;
        const currentPath = path.join(clientDir, req.file.filename);
        const finalPath = path.join(clientDir, finalName);
        try {
          if (fs.existsSync(currentPath)) {
            fs.renameSync(currentPath, finalPath);
          }
        } catch (renameErr) {
          console.error("Error renombrando logo:", renameErr);
        }

        dataToUpdate.logo = `${id}/${finalName}`;
      }

      // Actualiza el client
      const updatedClient = await clientModel.update(id, dataToUpdate);

      return res.status(200).json({
        status: true,
        message: "Cliente actualizado correctamente",
        data: updatedClient,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }

    // Actualiza el client
    const updatedClient = await clientModel.update(id, dataToUpdate);

    return res.status(200).json({
      status: true,
      message: "Cliente actualizado correctamente",
      data: updatedClient,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Cambiar el estado del cliente
const toggleClientState = async (req, res) => {
  const validarId = ClientsDTO.validarId(req.params.id);

  if (!validarId.status) {
    return res.status(400).json(validarId);
  }
  try {
    const { id } = req.params;
    const updatedClient = await clientModel.toggleState(id);

    return res.status(200).json({
      message: "Estado del cliente actualizado correctamente",
      data: updatedClient,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Eliminar cliente
const deleteClient = async (req, res) => {
  const validarId = ClientsDTO.validarId(req.params.id);

  if (!validarId.status) {
    return res.status(400).json(validarId);
  }
  try {
    const { id } = req.params;
    const client = await clientModel.getById(id);

    if (!client) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    // Eliminar el logo si existe
    if (client.logo) {
      const logoPath = path.join(pathBaseClientes, client.logo);
      if (fs.existsSync(logoPath)) {
        fs.unlinkSync(logoPath);
      }
      // Si la carpeta queda vacía, opcionalmente no hacemos nada; se mantiene estructura por cliente
    }

    await clientModel.delete(id);

    return res.status(200).json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createClient,
  getClients,
  getClientById,
  updateClient,
  toggleClientState,
  deleteClient,
};
