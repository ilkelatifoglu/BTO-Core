// routes/tourRoutes.js
const express = require("express");
const { getAllIndividualTours, approveTour, rejectTour, addIndividualTour } = require("../controllers/individualTourController");
const router = express.Router();
const authenticateToken = require('../middleware/auth'); 
const authorizeRole = require('../middleware/authorizeRole');

router.get("/getTours", authenticateToken, getAllIndividualTours);
router.put("/approveTour/:tourId", authenticateToken, authorizeRole(3,4), approveTour);
router.put("/rejectTour/:tourId", authenticateToken, authorizeRole(3,4), rejectTour);
router.post("/addIndividualTour", addIndividualTour);

module.exports = router;
