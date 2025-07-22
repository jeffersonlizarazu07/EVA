import { Box } from "@mui/material";


export const themeColors = {
  light: {
    // Botón aceptar
    acceptButtonBg: "rgb(199, 14, 143)", // Color del Background
    acceptButtonText: "#fff", // Color del texto
    // Botón cancelar
    cancelButtonBg: "#6c757d;",
    cancelButtonText: "#fff",
    // Botón confirmar
    confirmButtonBg: "rgb(199, 14, 143)", // Color del Background
    confirmButtonText: "#fff", // Color del texto

    // Clores personalizados que se utilizan en Eva
    purpuraEva: "#b62a8b",
    grisButtonEva: "#6c757d", // Color del botón cancelar po si se necesita utilizar en otros componentes que no sean botones

    legend:{
      color: "#000",
    }
  },

  dark: {
    legend:{
      color: "#ffffff",
    }
  },
};

/** 
@param {string} theme - Tema actual ('light' o 'dark')
@param {string} colorName - Nombre de la variable de color
@returns {string} El valor hexadecimal del color
*/

export const getThemeColor = (theme, colorName) => {
  return themeColors[theme]?.[colorName] || themeColors.light[colorName]; // Fallback al tema claro
};

export const colors = {
  light: themeColors.light,
  dark: themeColors.dark,
};
