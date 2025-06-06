// helper.jsx o helper.js
import { useTranslation } from "react-i18next";

export const useTranslateBackendMessage = () => {
  const { t } = useTranslation();

  // Traducir mensajes de error del backend
  const translateError = (errorMessage) => {
    const errorTranslations = {
      "Dominio de correo inválido": t("backendErrors.Dominio de correo inválido"),
      "Formato de email inválido": t("backendErrors.Formato de email inválido"),
      "El dominio de correo no existe": t("backendErrors.El dominio de correo no existe"),
      "Cuenta de correo no existe": t("backendErrors.Cuenta de correo no existe"),
      "Error en validación externa": t("backendErrors.Error en validación externa")
    };
    return errorTranslations[errorMessage] || errorMessage;
  };

  // Traducir mensajes de éxito del backend
  const translateSuccess = (successMessage) => {
    const match = successMessage.match(/^(\d+)\s+correos enviados exitosamente\.$/);
    if (match) {
      const count = match[1];
      return `${count} ${t("backendSuccess.correos_enviados_exitosamente")}`;
    }
    return successMessage;
  };

  // Función general
  const translateBackendMessage = (message) => {
    if (message.includes("correos enviados exitosamente")) {
      return translateSuccess(message);
    } else {
      return translateError(message);
    }
  };

  return translateBackendMessage;
};
