import axios from "axios";

class AgentListService {
  // Obtener todos los administradores (agentes) desde el backend
  async getAdmins() {
    try {
      // Hago la petición a la API para traer los agentes
      const response = await axios.post(
        `http://localhost:3000/api/agent`,
        { clients },
        {
          withCredentials: true,
        }
      );

      // Guardo los datos de los admins en el estado
      setAdmins(response.data.data);
    } catch (error) {
      // Si algo sale mal, lo muestro en consola
      console.error("Error fetching data:", error);
    }
  }

  // Función para obtener la lista de clientes registrados
  async getClients() {
    try {
      // Hago la petición a la API de clientes
      const response = await axios.get(`http://localhost:3000/api/clients`, {
        withCredentials: true,
      });

      // Guardo los datos en el estado de clientes
      setListClients(response.data.data);
    } catch (error) {
      // Capturo el error si ocurre
      console.error("Error fetching data:", error);
    }
  }

  // Función para obtener los clientes asignados a un usuario específico
  async getUserClients(id) {
    try {
      // Hago la petición pasando el ID del usuario
      const response = await axios.get(
        `http://localhost:3000/api/users_client/${id}`,
        { withCredentials: true }
      );
      const responseData = response.data.data;

      if (responseData && responseData.length > 0) {
        // Guardo los IDs de los clientes seleccionados en el estado
        setSelectedClients(responseData.map((client) => client.idClient));

        setUserClients(
          responseData.map((client) => ({
            id: client.idClient,
            name: client.clientName,
          }))
        );
      } else {
        // Si no hay clientes, limpiar los estados
        setSelectedClients([]);
        setUserClients([]);
      }
    } catch (error) {
      console.error("Error fetching user clients:", error);
      // Limpiar estados en caso de error
      setSelectedClients([]);
      setUserClients([]);
    }
  }

  // Función para obtener un agente específico por ID
  async getAgentById(agentId) {
    try {
      setLoading(true); // Mostrar indicador de carga

      const response = await axios.get(
        `http://localhost:3000/api/agent/${agentId}`,
        { withCredentials: true }
      );
      return response.data.data; // Retornar los datos del agente
    } catch (error) {
      console.error("Error obteniendo agente:", error);

      // Mostrar mensaje de error al usuario
      Swal.fire({
        title: "Error",
        text: "No se pudo obtener la información del agente",
        icon: "error",
        confirmButtonText: "Ok",
      });

      return null;
    } finally {
      setLoading(false); // Ocultar indicador de carga
    }
  }

  // Traer formularios asociados a un cliente seleccionado
  async getFormsByClient(clientId) {
    try {
      setLoading(true);

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

      // Usar params en lugar de query string manual para mejor manejo
      const response = await axios.get(
        `http://localhost:3000/api/clients/forms`,
        {
          params: { clientId: numericClientId }, // Usar params para pasar el ID del cliente
          withCredentials: true,
        }
      );
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
    } finally {
      setLoading(false);
    }
  }

  async getBlocksForIdForm(formId) {
    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:3000/api/blocks/form/${formId}`,
        {
          withCredentials: true,
        }
      );
      setLoading(false);
      console.log("Bloques cargados:", res.data.data);
      console.log(JSON.stringify(res.data.data, null, 2));
      return res.data.data;
    } catch (error) {
      console.error("Error al cargar bloques:", error);
      return [];
    }
  };

  
}
