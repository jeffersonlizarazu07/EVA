const express = require('express');
const { authenticate, checkToken, extendToken } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', authenticate);
router.get('/check-token', authMiddleware, checkToken);
router.post('/extend-token', authMiddleware, extendToken);

module.exports = router;
