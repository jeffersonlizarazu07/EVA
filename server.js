require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path'); // Asegúrate de importar path
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); 
const userClientRoutes = require('./routes/userClientRoutes');
const surveySetRoutes = require('./routes/surveyRoutes');
const questionRoutes = require('./routes/questionRoutes');
const clientsRoutes = require('./routes/clientRoutes');
const answersRoutes = require('./routes/answerRoutes');
const agentRoutes = require('./routes/agentRoutes');
const formSetRoutes = require('./routes/formRoutes');
const enviarCorreos = require('./routes/mailRoutes');
const blockRoutes = require('./routes/blockRoutes');
const questionFormRoutes = require('./routes/questionsFormRoutes');
const answersFormRoutes = require('./routes/answersFormRoutes');



const app = express(); // Crear una instancia de Express
const port = process.env.PORT || 3000; // Puerto por defecto

const corsOptions = { // Configuración de CORS

    origin: 'http://localhost:5174', // URL del frontend
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
    credentials: true, // Permitir credenciales (cookies, autenticación)
};

app.use(cors(corsOptions)); // Configurar CORS
app.use(express.json()); // Middleware para parsear el cuerpo de las solicitudes JSON
app.use(cookieParser()); // Middleware para parsear cookies

// Configurar rutas de API primero
app.use('/api', authRoutes); // Rutas de autenticación
app.use('/api', userRoutes); // Rutas de usuarios
app.use('/api', userClientRoutes); // Rutas de usuarios para clientes
app.use('/api', surveySetRoutes); // Rutas de encuestas
app.use('/api', questionRoutes); // Rutas de preguntas
app.use('/api', answersRoutes); // Rutas de respuestas
app.use('/api', formSetRoutes); // Rutas de formularios
app.use('/api', clientsRoutes); // Rutas de clientes
app.use('/api', enviarCorreos); // Rutas de envío de correos
app.use('/api', agentRoutes); // Rutas de agentes
app.use("/api/blocks", blockRoutes); // Rutas de bloques
app.use("/api/questions", questionFormRoutes); // Rutas de preguntas de bloques
app.use("/api/answers", answersFormRoutes); // Rutas de respuestas de bloques

// Hacer accesible la carpeta 'public' para el navegador
app.use('/public', express.static(path.join(__dirname, 'public')));

// Ruta específica para manejar enlaces de encuestas
app.get('/survey/:encodedData', async (req, res) => {
  try {
    const encodedData = req.params.encodedData; // Obtener el parámetro de la URL
    
    // Redireccionar a tu aplicación React con el parámetro link
    res.redirect(`http://localhost:5174/survey?link=${encodedData}`);
    
    // Alternativa si estás usando server-side rendering:
    // const SurveySet = require('./models/surveySet'); // Importa tu modelo
    // const survey = await SurveySet.getByLink(encodedData);
    // if (!survey) return res.status(404).send('Encuesta no encontrada');
    // res.render('survey', { survey });
  } catch (error) {
    // Manejo de errores
    console.error('Error al procesar la encuesta:', error); 
    res.status(500).send('Error interno del servidor');
  }
});

// Servir archivos estáticos de React después de las rutas de API
//app.use(express.static(path.join(__dirname, 'client', 'dist')));

// Catch-all debe ser lo último para que no interfiera con las rutas anteriores
//app.get('*', (req, res) => {
  //res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
//});


app.listen(port, () => { // Iniciar el servidor
    console.log(`Servidor corriendo en http://localhost:${port}`); // Mensaje de inicio
});