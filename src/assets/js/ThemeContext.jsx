import React, { createContext, useState, useEffect } from 'react';

import { ThemeProvider as MuiThemeProvider, CssBaseline, createTheme } from "@mui/material";
import { lightTheme, darkTheme } from "../../components/Admin/index.styles";


export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {}
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const storedTheme = localStorage.getItem('app-theme');
    if (storedTheme) {
      setTheme(storedTheme);
      //document.body.className = storedTheme;
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('app-theme', newTheme);
    //document.body.className = newTheme;
  };

  let muiTheme;
  try {
    muiTheme = theme === "light" ? lightTheme : darkTheme;
  } catch (error) {
    console.error('[ThemeProvider] Error creating theme:', error);
    // Fallback a un tema básico si hay error
    muiTheme = createTheme({
      palette: {
        mode: theme,
      },
    });
  }



  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline/>
          {children}
        
      </MuiThemeProvider>
      
    </ThemeContext.Provider>
  );
};
