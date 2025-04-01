const express = require('express');
const router = express.Router();
const endUserController = require('../controllers/endUserController');

router.get('/endUsers', endUserController.endUsers);
router.get('/endUser/:id', endUserController.endUserByID);
router.post('/endUser', endUserController.postEndUser);
router.put('/endUser/:id', endUserController.putEndUser);
router.patch('/endUser/:id', endUserController.patchEndUser);
router.delete('/endUser/:id', endUserController.deleteEndUser);

module.exports = router;
