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
const endUserRoutes = require('./routes/endUserRoutes');
const endUserClientRoutes = require('./routes/endUserClientRoutes');
const clientsRoutes = require('./routes/clientRoutes');
const answersRoutes = require('./routes/answerRoutes');
const agentRoutes = require('./routes/agentRoutes');
const formSetRoutes = require('./routes/formRoutes');
const enviarCorreos = require('./routes/mailRoutes');


const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {

    origin: 'http://localhost:5174', 
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true, 
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Configurar rutas de API primero
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', userClientRoutes); 
app.use('/api', surveySetRoutes);
app.use('/api', questionRoutes); 
app.use('/api', endUserRoutes); 
app.use('/api', endUserClientRoutes); 
app.use('/api', clientsRoutes);
app.use('/api', answersRoutes);
app.use('/api', enviarCorreos);
app.use('/api', agentRoutes);
app.use('/api', formSetRoutes);
// app.use('/api', blocksRoutes);

// Hacer accesible la carpeta 'public' para el navegador
app.use('/public', express.static(path.join(__dirname, 'public')));

// Ruta específica para manejar enlaces de encuestas
app.get('/survey/:encodedData', async (req, res) => {
  try {
    const encodedData = req.params.encodedData;
    
    // Redireccionar a tu aplicación React con el parámetro link
    res.redirect(`http://localhost:5174/survey?link=${encodedData}`);
    
    // Alternativa si estás usando server-side rendering:
    // const SurveySet = require('./models/surveySet'); // Importa tu modelo
    // const survey = await SurveySet.getByLink(encodedData);
    // if (!survey) return res.status(404).send('Encuesta no encontrada');
    // res.render('survey', { survey });
  } catch (error) {
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


app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});