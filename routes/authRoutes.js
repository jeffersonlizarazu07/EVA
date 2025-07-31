const express = require("express");
const { postLog, getConfig } = require("../controllers/LoginController");

const router = express.Router();

// Rutas MSAL
router.post("/msal-login", postLog);
router.get("/msal-config", getConfig);


module.exports = router;