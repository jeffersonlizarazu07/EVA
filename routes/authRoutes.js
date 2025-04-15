const express = require('express');
const { authenticate, checkToken, extendToken, logout } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', authenticate);
router.get('/check-token', authMiddleware, checkToken);
router.post('/extend-token', authMiddleware, extendToken);
router.post('/logout', authMiddleware, logout);

module.exports = router;
