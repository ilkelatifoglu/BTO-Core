const express = require("express");
const { addTour,
        getReadyTours,
 } = require("../controllers/tourController");
 
const router = express.Router();

router.post("/addTour", addTour);
router.get("/readyTours", getReadyTours);

module.exports = router;
