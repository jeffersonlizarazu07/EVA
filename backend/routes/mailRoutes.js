const express = require('express');
const router = express.Router();
const {enviarCorreos } = require('../controllers/mailController');  

router.post('/enviar-correos', enviarCorreos);

module.exports = router;

