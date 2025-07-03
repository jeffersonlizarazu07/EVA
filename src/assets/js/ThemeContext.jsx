import React, { createContext, useState, useEffect } from 'react';

import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "../../components/Admin/index.styles";


export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const storedTheme = localStorage.getItem('app-theme');
    if (storedTheme) {
      setTheme(storedTheme);
      document.body.className = storedTheme;
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('app-theme', newTheme);
    document.body.className = newTheme;
  };

  const muiTheme = theme === "light" ? lightTheme: darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline/>
          {children}
        
      </MuiThemeProvider>
      
    </ThemeContext.Provider>
  );
};
