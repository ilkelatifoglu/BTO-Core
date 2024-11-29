const express = require("express");
const { addTour,
    getReadyTours,
    countAssignedGuides,
    assignGuideToTour,
    getAllTours,
    approveTour,
    rejectTour
} = require("../controllers/tourController");

const router = express.Router();

router.post("/addTour", addTour);
router.get("/readyTours", getReadyTours);
router.get("/:tour_id/guideCount", countAssignedGuides);
router.post("/assignGuide", assignGuideToTour);
router.get("/allTours", getAllTours);
router.put("/approve/:id", approveTour);
router.put("/reject/:id", rejectTour);
module.exports = router;
