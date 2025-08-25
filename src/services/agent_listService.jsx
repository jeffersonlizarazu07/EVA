import { Feedback } from "@mui/icons-material";
import { apiClient } from "../utils/axiosConfig";
import Swal from "sweetalert2";

// Configuración base para las peticiones
const API_BASE_URL = ""; // baseURL ya está en apiClient
const config = {
  withCredentials: true,
};

//obtener respuestas multiple
export const getResponseMult = async () => {
  try {
    const response = await apiClient.get(
      `/answersform/getResponseMult`,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error obtener respuestas multiple:", error);
    throw error;
  }
};

//obtener Clientes y informacion de los forms_set

export const getClientsAndForms = async () => {
  try {
    const response = await apiClient.get(
      `/answersform/clients-forms`,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching clients and forms:", error);
    throw error;
  }
};

// obtener todos los monitoreos

export const getMonitoring = async () => {
  try {
    const response = await apiClient.get(
      `/answersform/report-monitoring`,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching monitoring data:", error);
    throw error;
  }
};

// Obtener todos los administradores (agentes) desde el backend
export const getAdmins = async (clients) => {
  try {
    const safeClients = Array.isArray(clients)
      ? Array.from(new Set(
          clients
            .map((c) => (typeof c === 'string' ? parseInt(c, 10) : c))
            .filter((c) => Number.isFinite(c))
        ))
      : [];

    if (safeClients.length === 0) {
      // Sin clientes asignados, no llamar al backend para evitar 400
      return [];
    }

    // Algunos backends esperan 'clients' como texto (CSV)
    const clientsCsv = safeClients.join(',');
    const response = await apiClient.post(
      `/agent`,
      { clients: clientsCsv },
      config
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching admins:", error.response?.data || error.message);
    throw error;
  }
};

// Función para obtener la lista de clientes registrados
export const getClients = async () => {
  try {
    const response = await apiClient.get(`/clients`, config);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
};

// Función para obtener los clientes asignados a un usuario específico
export const getUserClients = async (id) => {
  try {
    const response = await apiClient.get(
      `/users_client/${id}`,
      config
    );
    const responseData = response.data.data;

    if (responseData && responseData.length > 0) {
      return {
        selectedClients: responseData.map((client) => client.idClient),
        userClients: responseData.map((client) => ({
          id: client.idClient,
          name: client.clientName,
        })),
      };
    } else {
      return {
        selectedClients: [],
        userClients: [],
      };
    }
  } catch (error) {
    console.error("Error fetching user clients:", error);
    return {
      selectedClients: [],
      userClients: [],
    };
  }
};

// Función para obtener un agente específico por ID
export const getAgentById = async (agentId) => {
  try {
    const response = await apiClient.get(
      `/agent/${agentId}`,
      config
    );
    return response.data.data;
  } catch (error) {
    console.error("Error obteniendo agente:", error);

    // Mostrar mensaje de error al usuario
    Swal.fire({
      title: "Error",
      text: "No se pudo obtener la información del agente",
      icon: "error",
      confirmButtonText: "Ok",
    });

    throw error;
  }
};

// Traer formularios asociados a un cliente seleccionado
export const getFormsByClient = async (clientId) => {
  try {
    if (!clientId || isNaN(clientId)) {
      console.error("Client ID inválido:", clientId);
      return null;
    }

    const numericClientId = parseInt(clientId, 10);

    if (numericClientId <= 0) {
      console.error("Client ID debe ser mayor a 0:", numericClientId);
      return null;
    }

    const response = await apiClient.get(`/clients/forms`, {
      params: { clientId: numericClientId },
      ...config,
    });
    return response.data.data;

  } catch (error) {
    console.error("Error completo:", error);
    console.error("Error response:", error.response);

    // Aquí guardamos el mensaje en una variable para exponerla junto con null
    if (error.response?.status === 404) {
      // Retornamos un objeto especial con el error para manejarlo después
      return { error: "No se encontraron formularios para este cliente" };
    }

    return null; // Otros errores
  }
};

// Obtener bloques para un formulario específico
export const getBlocksForIdForm = async (formId) => {
  try {
    const response = await apiClient.get(
      `/blocks/form/${formId}`,
      config
    );
    console.log("Bloques cargados:", response.data.data);
    console.log(JSON.stringify(response.data.data, null, 2));
    return response.data.data;
  } catch (error) {
    console.error("Error al cargar bloques:", error);
    return [];
  }
};

// Guardar monitorización y respuestas
export const saveMonitoringAndAnswers = async (payload) => {
  try {
    const response = await apiClient.post(`/answersform`, payload, {
      headers: { "Content-Type": "application/json" },
      ...config,
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error al guardar la monitorización y respuestas:", error);
    throw error;
  }
};

// Traer monitorizaciones por agente
export const getMonitoringByUser = async (id) => {
  if (!id) {
    console.error("getMonitoringByUser fue llamado sin userId");
    throw new Error("userId no proporcionado");
  }
  try {
    const response = await apiClient.get(
      `/monitoring/user/${id}`,
      config
    );
    console.log("Respuesta de la API:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al obtener monitoreos del agente:", error);
    throw error;
  }
};

// Traer las monitorizaciones estructuradas
export const getMonitorinStructure = async (id) => {
  try {
    const response = await apiClient.get(
      `/monitoring/${id}/details`,
      config
    );
    console.log("Estructura del monitoreo actual", response.data);
    return response.data;
  } catch (error) {
    console.error("No se obtuvo la estructura para este monitoreo", error);
    throw error;
  }
};

// Guardar el feedback desde la vista general de monitorizaciones
export const saveFeedback = async (id, feedback) => {
  try {
    const response = await apiClient.put(
      `/monitoring/${id}`,
      { feedback },
      config
    );
    return response.data;
  } catch (error) {
    console.error("No fue posible actualizar el comentario"), error;
    throw error;
  }
};

// Actualizar check
export const updateCheck = async (id, checkValue, check_date) => {
  console.log("Enviando data:", { id, checkValue, check_date });
  try {
    const response = await apiClient.put(
      `/monitoring/${id}/check`,
      {
        check: checkValue,
      },
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el check:", error);
    throw error;
  }
};
