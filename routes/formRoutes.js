const express = require('express');
const router = express.Router();
const formSetController = require('../controllers/formSetController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas para formularios
router.get('/forms', authMiddleware, formSetController.forms);
router.get('/form/:id', authMiddleware, formSetController.formByID);
router.get('/clients/forms', authMiddleware, formSetController.formsxClients);
router.post('/forms', authMiddleware, formSetController.postForm);
router.put('/form/:id', authMiddleware, formSetController.putForm);
router.patch('/form/:id', authMiddleware, formSetController.patchForm);
router.delete('/form/:id', authMiddleware, formSetController.deleteForm);

module.exports = router;
