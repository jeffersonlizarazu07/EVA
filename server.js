require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const userClientRoutes = require('./routes/userClientRoutes');
const surveySet = require('./routes/surveyRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

// Rutas
app.use('/auth', authRoutes);
app.use('/user_clients', userClientRoutes); // Asigna las rutas de user_clients
app.use('/surveys', surveySet); // Asigna las rutas de surveys

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
