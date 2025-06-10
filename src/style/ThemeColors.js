
export const themeColors = {
    light: {
        
    },

    dark: {
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