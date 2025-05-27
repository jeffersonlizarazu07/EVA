import axios from "axios";

// Actualizar metadatos del formulario
export const updateFormMetadata = async (formId, userId) => {
  const now = new Date().toISOString().slice(0, 19).replace("T", " ");
  try {
    await axios.put(
      `http://localhost:3000/api/form/${formId}`,
      {
        updated_date: now,
        updated_by: userId,
      },
      { withCredentials: true }
    );
  } catch (error) {
    console.error("Error al actualizar metadatos del formulario:", error);
  }
};