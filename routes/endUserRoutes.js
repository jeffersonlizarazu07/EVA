const express = require('express');
const router = express.Router();
const endUserController = require('../controllers/endUserController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/endUsers',authMiddleware, endUserController.endUsers);
router.get('/endUser/:id',authMiddleware, endUserController.endUserByID);
router.post('/endUser',authMiddleware, endUserController.postEndUser);
router.put('/endUser/:id', authMiddleware,endUserController.putEndUser);
router.patch('/endUser/:id',authMiddleware, endUserController.patchEndUser);
router.delete('/endUser/:id',authMiddleware, endUserController.deleteEndUser);

module.exports = router;
