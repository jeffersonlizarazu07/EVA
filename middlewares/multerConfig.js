const multer = require('multer');
const path = require('path');

// Configuración de Multer para gestionar los archivos (logos)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Almacenamos los archivos en la carpeta `uploads`
    },
    filename: (req, file, cb) => {
        const filename = `${req.body.client}_${Date.now()}${path.extname(file.originalname)}`;
        cb(null, filename);  // Usamos un nombre único para cada archivo
    }
});

const upload = multer({ storage });

module.exports = upload;
