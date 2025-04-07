const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'C:/xampp/htdocs/tpco_transversal_EvaFe-main/public/clientes/'); // ruta de imagenes en el front
  },
  filename: (req, file, cb) => {
    
    cb(null, Date.now() + path.extname(file.originalname));  // nombre del archivo
  }
});

const upload = multer({ storage });

module.exports = upload;
