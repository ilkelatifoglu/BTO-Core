const express = require("express");
const { addTour,
        getReadyTours,
        countAssignedGuides,
        assignGuideToTour,
 } = require("../controllers/tourController");
 
const router = express.Router();

router.post("/addTour", addTour);
router.get("/readyTours", getReadyTours);
router.get("/:tour_id/guideCount", countAssignedGuides);
router.post("/assignGuide", assignGuideToTour);

module.exports = router;
