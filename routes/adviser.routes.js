const express = require("express");
const router = express.Router();
const adviserController = require("../controllers/adviser.controller");

// Endpoints pour le front :
router.get("/", adviserController.getAll);
router.get("/:id", adviserController.getOne);

// Endpoints pour le postman :
router.post("/", adviserController.create);
router.post("/:id", adviserController.addImage);

module.exports = router;
