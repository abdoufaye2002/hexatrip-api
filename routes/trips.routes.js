const express = require("express");
const router = express.Router();
const tripController = require("../controllers/trip.controller");
const multipleFilesUploaderMiddleware = require("../middlewares/complexUploader");
const { authenticateMiddleware } = require("../middlewares/authenticationMiddleware");
const { authorizeMiddleware } = require("../middlewares/authorizationMiddleware");

// front :
router.get("/", tripController.getAll);
router.get("/bestsellers", tripController.getAllBestsellers);

// postman :
router.post("/", tripController.create);
router.get("/:id", tripController.getOne);
router.patch("/:id", tripController.patchOne);
router.delete("/:id", tripController.deleteOne);
router.delete("/", authenticateMiddleware, authorizeMiddleware(["admin"]), tripController.deleteAll);
router.post("/:id", multipleFilesUploaderMiddleware, tripController.addImages);

module.exports = router;
