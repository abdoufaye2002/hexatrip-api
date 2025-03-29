const express = require("express");
const validateRegister = require("../middlewares/registerValidator");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post("/register", validateRegister, authController.register);
router.post("/login", authController.login);

module.exports = router;
