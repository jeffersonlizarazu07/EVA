import axios from "axios";

export const updateFormMetadata = async (id_form, userId) => {
  const now = new Date().toISOString().slice(0, 19).replace("T", " ");
  
  // Validar que userId no sea undefined o null
  if (!userId) {
    console.error("Error: userId es requerido para actualizar el formulario");
    throw new Error("userId es requerido");
  }
  
  try {
    const response = await axios.get(`http://localhost:3000/api/form/${id_form}`, {
      withCredentials: true,
    });

    const formData = response.data.data;

    const updatedForm = {
      title: formData.title,
      description: formData.description,
      state: formData.state,
      idClient: formData.idClient,
      updated_date: now,
      updated_by: userId 
    };

    // Log para debugging
    console.log("Datos a enviar:", updatedForm);
    console.log("userId recibido:", userId);

    await axios.put(
      `http://localhost:3000/api/form/${id_form}`,
      updatedForm,
      { withCredentials: true }
    );

    console.log("Formulario actualizado correctamente");
  } catch (error) {
    console.error("Error al actualizar metadatos del formulario:", error);
    if (error.response) {
      console.error("Respuesta del servidor:", error.response.data);
    }
    throw error; // Re-lanzar el error para que pueda ser manejado en el componente
  }
};