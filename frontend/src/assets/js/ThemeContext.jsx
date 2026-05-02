import React, { createContext, useState, useEffect } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  CssBaseline,
  createTheme,
} from "@mui/material";
import { lightTheme, darkTheme } from "../../components/Admin/index.styles";

export const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("app-theme");
    if (storedTheme) setTheme(storedTheme);
  }, []);

  useEffect(() => {
    // Marcar el tema en el DOM para que el CSS lo detecte
    document.documentElement.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("app-theme", next);
  };

  let muiTheme;
  try {
    muiTheme = theme === "light" ? lightTheme : darkTheme;
  } catch (error) {
    console.error("[ThemeProvider] Error creating theme:", error);
    muiTheme = createTheme({ palette: { mode: theme } });
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
