const express = require('express');
const app = express();
const port = 3000;
const db = require('./config/db');



app.use((req, res, next) => {
    req.db = db;
    next();
});


// Iniciar el servidor Express
app.listen(port, () => {
    console.log(`Servidor backend corriendo en http://localhost:${port}`);
    console.log('Verificando conexión a la base de datos...');
  });