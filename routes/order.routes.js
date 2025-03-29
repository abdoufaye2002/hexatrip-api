const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { authenticateMiddleware } = require("../middlewares/authenticationMiddleware");

// endpoints pour front :
// check with authenticate later
router.get("/", authenticateMiddleware, orderController.getAll);

module.exports = router;
