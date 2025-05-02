const express = require('express');
const router = express.Router();
const { createBlock } = require('../controllers/form.controller');

router.post('/form', createBlock);

module.exports = router;