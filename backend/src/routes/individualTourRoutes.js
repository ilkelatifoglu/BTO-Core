// routes/tourRoutes.js
const express = require("express");
require('dotenv').config();
const router = express.Router();
const { getAllIndividualTours, approveTour, rejectTour, addIndividualTour, getMyIndividualTours, withdrawFromIndividualTour } = require("../controllers/individualTourController");
const authenticateToken = require('../middleware/auth');
const authorizeRole = require('../middleware/authorizeRole');

router.get("/getTours", authenticateToken, getAllIndividualTours);
router.put("/approveTour/:tourId", authenticateToken, authorizeRole(2, 3, 4), approveTour);
router.put("/rejectTour/:tourId", authenticateToken, authorizeRole(3, 4), rejectTour);
router.post("/addIndividualTour", addIndividualTour);
router.get("/getMyIndividualTours", authenticateToken, getMyIndividualTours);
router.delete("/withdrawFromIndividualTour/:id", authenticateToken, withdrawFromIndividualTour); // Ensure DELETE method
module.exports = router;
