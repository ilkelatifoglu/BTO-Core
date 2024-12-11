const express = require("express");
const tourLocationController = require("../controllers/tourLocationController");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

// TODO: Uncomment this when testing is done
// router.use(authenticateToken);

// Basic CRUD operations
router.get("/", tourLocationController.getAllLocations);
router.get("/:id", tourLocationController.getLocationById);
router.post("/", tourLocationController.createLocation);
router.put("/:id", tourLocationController.updateLocation);
router.delete("/:id", tourLocationController.deleteLocation);

// Tour management endpoints
router.post("/start-tour", tourLocationController.startTour);
router.post("/end-tour", tourLocationController.endTour);

module.exports = router;
