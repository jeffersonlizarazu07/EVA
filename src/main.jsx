import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { ThemeProvider } from './assets/js/ThemeContext';
import "./assets/js/i18n";

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App tab="LogIn" />
    </ThemeProvider>
  </React.StrictMode>
);
