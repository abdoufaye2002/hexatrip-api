const express = require("express");
const router = express.Router();
const agencyController = require("../controllers/agency.controller");
const Agency = require("../models/Agency");

// front :
router.get("/", agencyController.getAll);

// postman :
router.post("/", agencyController.create);
router.get("/:id", agencyController.getOne);
router.post("/:id", agencyController.addImage);

module.exports = router;
