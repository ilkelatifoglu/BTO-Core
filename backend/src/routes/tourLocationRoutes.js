const express = require("express");
const tourLocationController = require("../controllers/tourLocationController");
const authenticateToken = require('../middleware/auth'); 
const authorizeRole = require("../middleware/authorizeRole");

const router = express.Router();

// Basic CRUD operations
router.get("/",  authenticateToken, tourLocationController.getAllLocations);
router.get("/:id",  authenticateToken, tourLocationController.getLocationById);
router.post("/",  authenticateToken, tourLocationController.createLocation);
router.put("/:id",  authenticateToken, tourLocationController.updateLocation);
router.delete("/:id",  authenticateToken, tourLocationController.deleteLocation);

// Tour management endpoints
router.post("/start-tour", authenticateToken, authorizeRole(1,2,3,4), tourLocationController.startTour);
router.post("/end-tour", authenticateToken, authorizeRole(1,2,3,4), tourLocationController.endTour);
router.post("/reset-occupancies", authenticateToken, authorizeRole(1,2,3,4), tourLocationController.resetAllOccupancies);

module.exports = router;
