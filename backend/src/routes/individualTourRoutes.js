// routes/tourRoutes.js
const express = require("express");
const { getAllIndividualTours, approveTour, rejectTour, addIndividualTour, getMyIndividualTours, withdrawFromIndividualTour} = require("../controllers/individualTourController");
const router = express.Router();
const authenticateToken = require('../middleware/auth'); // Middleware for authentication

router.get("/getTours", getAllIndividualTours);
router.put("/approveTour/:tourId", approveTour);
router.put("/rejectTour/:tourId", rejectTour);
router.post("/addIndividualTour", addIndividualTour);
router.get("/getMyIndividualTours", authenticateToken, getMyIndividualTours);
router.delete("/withdrawFromIndividualTour/:id", authenticateToken, withdrawFromIndividualTour); // Ensure DELETE method
module.exports = router;
