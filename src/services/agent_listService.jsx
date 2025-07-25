import axios from "axios";
import Swal from "sweetalert2";

// Configuración base para las peticiones
const API_BASE_URL = "http://localhost:3000/api";
const config = {
  withCredentials: true,
};

//obtener respuestas multiple
export const getResponseMult = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/answersform/getResponseMult`,
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
    const response = await axios.get(
      `${API_BASE_URL}/answersform/clients-forms`,
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
    const response = await axios.get(
      `${API_BASE_URL}/answersform/report-monitoring`,
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
    const response = await axios.post(
      `${API_BASE_URL}/agent`,
      { clients },
      config
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching admins:", error);
    throw error;
  }
};

// Función para obtener la lista de clientes registrados
export const getClients = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/clients`, config);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
};

// Función para obtener los clientes asignados a un usuario específico
export const getUserClients = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/users_client/${id}`,
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
    const response = await axios.get(
      `${API_BASE_URL}/agent/${agentId}`,
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
    // Validar que clientId sea válido
    if (!clientId || isNaN(clientId)) {
      console.error("Client ID inválido:", clientId);
      return null;
    }

    // Convertir a número para asegurar el tipo correcto
    const numericClientId = parseInt(clientId, 10);

    if (numericClientId <= 0) {
      console.error("Client ID debe ser mayor a 0:", numericClientId);
      return null;
    }

    const response = await axios.get(`${API_BASE_URL}/clients/forms`, {
      params: { clientId: numericClientId },
      ...config,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error completo:", error);
    console.error("Error response:", error.response);

    // Mostrar mensaje más específico según el error
    let errorMessage =
      "No se pudo obtener la información de los formularios del cliente seleccionado";

    if (error.response?.status === 400) {
      errorMessage = error.response.data?.message || "ID de cliente inválido";
    } else if (error.response?.status === 404) {
      errorMessage = "No se encontraron formularios para este cliente";
    }

    Swal.fire({
      title: "Error",
      text: errorMessage,
      icon: "error",
      confirmButtonText: "Ok",
    });
    return null;
  }
};

// Obtener bloques para un formulario específico
export const getBlocksForIdForm = async (formId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/blocks/form/${formId}`,
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
    const response = await axios.post(`${API_BASE_URL}/answersform`, payload, {
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
    const response = await axios.get(
      `${API_BASE_URL}/monitoring/user/${id}`,
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
    const response = await axios.get(
      `${API_BASE_URL}/monitoring/${id}/details`,
      config
    );
    console.log("Estructura del monitoreo actual", response.data);
    return response.data;
  } catch (error) {
    console.error("No se obtuvo la estructura para este monitoreo", error);
    throw error;
  }
};
