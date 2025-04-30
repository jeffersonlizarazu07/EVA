const multer = require('multer');
const path = require('path');

// Ruta absoluta 
const uploadDir = 'C:\\Users\\moncayorojas.6\\Desktop\\Trabajos\\EVA\\tpco_transversal_EvaFe\\public\\clientes';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Ruta de destino para el archivo:', uploadDir); 
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  
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
