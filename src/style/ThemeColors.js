import { Box } from "@mui/material";

export const themeColors = {
    light: {
        Box:{
          backgroundColor:"#666"
        }
    },

    dark: {
      Box:{
          backgroundColor:"#dee2e6"
        }
    }
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
    dark: themeColors.dark
  };