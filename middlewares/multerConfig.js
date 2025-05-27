const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ruta absoluta 
const uploadDir = 'C:\\Users\\moncayorojas.6\\Desktop\\Trabajos\\EVA\\tpco_transversal_EvaFe\\public\\clientes';

// Ruta relativa dentro del proyecto para la carpeta imgClientes
// const uploadDir = path.join(__dirname, '..', 'public', 'imgClientes'); // Esto genera la ruta 'miProyectoNodeJS/public/imgClientes'

// // Asegúrate de que la carpeta exista, si no la crea
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Ruta de destino para el archivo:', uploadDir);  // Esto es solo para depuración
    cb(null, uploadDir);  // Guarda en la carpeta 'imgClientes'
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Usa un timestamp como nombre de archivo
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extname && mimeType) {
      return cb(null, true);
    } else {
      cb(new Error('Archivo no permitido. Solo se permiten imágenes.'));
    }
  }
});

module.exports = upload;
