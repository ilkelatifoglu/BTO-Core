const express = require("express");
const { addTour,
        getReadyTours,
        countAssignedGuides,
        assignGuideToTour,
        assignCandidateGuidesToTour,
        getCandidateGuides,
 } = require("../controllers/tourController");
 
const router = express.Router();

router.post("/addTour", addTour);
router.get("/readyTours", getReadyTours);
router.get("/:tour_id/guideCount", countAssignedGuides);
router.post("/assignGuide", assignGuideToTour);
router.post("/assignCandidate", assignCandidateGuidesToTour);
router.get("/candidateGuides", getCandidateGuides);

module.exports = router;
