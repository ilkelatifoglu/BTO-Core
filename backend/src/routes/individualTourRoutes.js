// routes/tourRoutes.js
const express = require("express");
const { getAllIndividualTours, approveTour, rejectTour } = require("../controllers/individualTourController");
const router = express.Router();

router.get("/getTours", getAllIndividualTours);
router.put("/approveTour/:tourId", approveTour);
router.put("/rejectTour/:tourId", rejectTour);

module.exports = router;
