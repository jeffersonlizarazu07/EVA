const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ruta base fija para almacenar logos de clientes dentro del backend
const baseClientsDir = path.join(__dirname, '..', 'public', 'clientes');

function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Asegura la existencia de la base y del tmp
ensureDirSync(baseClientsDir);
const tmpDir = path.join(baseClientsDir, 'tmp');
ensureDirSync(tmpDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // POST /clients -> subir a tmp (aún no hay id)
    // PUT /clients/:id -> subir directo a /clientes/{id}
    let targetDir = tmpDir;
    const maybeId = req.params?.id;
    if (req.method === 'PUT' && maybeId) {
      targetDir = path.join(baseClientsDir, String(maybeId));
    }
    ensureDirSync(targetDir);
    console.log('Ruta de destino para el archivo:', targetDir);
    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    // Nombre temporal; en el controlador se renombrará a foto{ext}
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // Límite de tamaño de archivo: 3 MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
    // const sizeImg = 

    if (extname && mimeType) {
      return cb(null, true);
    } else {
      cb(new Error('Archivo no permitido. Solo se permiten imágenes.'));
    }
  }
});

module.exports = upload;
