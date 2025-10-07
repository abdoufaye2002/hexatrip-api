const express = require("express");
const router = express.Router();
const agencyController = require("../controllers/agency.controller");
const Agency = require("../models/Agency");
const singleFileUploaderMiddleware = require("../middlewares/simpleUploader")

// front :
router.get("/", agencyController.getAll);

// postman :
router.post("/", agencyController.create);
router.get("/:id", agencyController.getOne);
router.post("/:id",singleFileUploaderMiddleware,agencyController.addImage);

module.exports = router;
