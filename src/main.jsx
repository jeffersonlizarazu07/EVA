import { createRoot } from 'react-dom/client';
import { App } from './App';
import "./assets/js/i18n"
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App tab='LogIn'/>);