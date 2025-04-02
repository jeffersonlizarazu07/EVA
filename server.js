require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const userClientRoutes = require('./routes/userClientRoutes');
const surveySet = require('./routes/surveyRoutes');
const questionRoutes = require('./routes/questionRoutes');
const endUserRoutes = require('./routes/endUserRoutes');
const endUserClientRoutes = require('./routes/endUserClientRoutes');

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true, 
};

app.use(cors(corsOptions))
app.use(express.json());
app.use(cookieParser());


  
// Rutas
app.use('/auth', authRoutes);
app.use('/user_clients', userClientRoutes); // Asigna las rutas de user_clients
app.use('/surveys', surveySet); // Asigna las rutas de surveys
app.use('/questions', questionRoutes); // Asigna las rutas de questions
app.use('/endUsers', endUserRoutes); // Asigna las rutas de endUsers
app.use('/endUserClients', endUserClientRoutes); // Asigna las rutas de endUserClients

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
