require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); 
<<<<<<< Updated upstream
=======
const userClientRoutes = require('./routes/userClientRoutes');
const surveySetRoutes = require('./routes/surveyRoutes');
const questionRoutes = require('./routes/questionRoutes');
const endUserRoutes = require('./routes/endUserRoutes');
const endUserClientRoutes = require('./routes/endUserClientRoutes');
const clientsRoutes = require('./routes/clientRoutes');
const answersRoutes = require('./routes/answerRoutes');

>>>>>>> Stashed changes

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
app.use(express.urlencoded({ extended: true}));


  
// Rutas
app.use('/auth', authRoutes);
app.use('/api', userRoutes);

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
