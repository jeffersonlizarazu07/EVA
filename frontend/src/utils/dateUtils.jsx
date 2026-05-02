export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;
};

export const getTomorrowDate = (date) => {
  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return formatDate(tomorrow);
};

// Nuevas funciones para formatear fechas de actualización
export const formatDateTime = (dateString) => {
  // Check if dateString is null, undefined, or "No actualizada"
  if (!dateString || dateString === "No actualizada" || dateString === "NULL") {
    return "No actualizada";
  }

  // Create Date object and check if it's valid
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "No actualizada";
  }

  // Ajustar manualmente para UTC-5 (restando 5 horas)
  const utcMinus5 = new Date(date.getTime() - 5 * 60 * 60 * 1000);

  // Formatear cada componente de la fecha con dos dígitos
  const day = ("0" + utcMinus5.getDate()).slice(-2);
  const month = ("0" + (utcMinus5.getMonth() + 1)).slice(-2);
  const year = utcMinus5.getFullYear();

  const hours = ("0" + utcMinus5.getHours()).slice(-2);
  const minutes = ("0" + utcMinus5.getMinutes()).slice(-2);
  const seconds = ("0" + utcMinus5.getSeconds()).slice(-2);

  // Devolver en formato dd/mm/yyyy hh:mm:ss
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

export const formatDateTimeShort = (dateString = new Date()) => {
  // Si se pasa new Date() o una fecha actual, convertirla a string primero
  if (dateString instanceof Date) {
    dateString = dateString.toISOString();
  }
  
  if (!dateString || dateString === "No actualizada" || dateString === "NULL") {
    return "Sin actualizar";
  }
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Sin actualizar";
  }
  
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);
  
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

// Función para mostrar solo la fecha (sin hora) en formato dd/mm/yyyy
export const formatDateOnly = (dateString) => {
  if (!dateString || dateString === "No actualizada" || dateString === "NULL") {
    return "Sin fecha";
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Sin fecha";
  }

  const utcMinus5 = new Date(date.getTime() - 5 * 60 * 60 * 1000);
  
  const day = ("0" + utcMinus5.getDate()).slice(-2);
  const month = ("0" + (utcMinus5.getMonth() + 1)).slice(-2);
  const year = utcMinus5.getFullYear();

  return `${day}/${month}/${year}`;
};