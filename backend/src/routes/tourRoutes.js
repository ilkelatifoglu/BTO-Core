const express = require("express");
const { addTour,

    getReadyTours,
    countAssignedGuides,
    assignGuideToTour,
    assignCandidateGuidesToTour,
    getCandidateGuides,
    getAllTours,
    approveTour,
    rejectTour,
    updateClassRoom,
    updateTime,
} = require("../controllers/tourController");

const router = express.Router();

router.post("/addTour", addTour);
router.get("/readyTours", getReadyTours);
router.get("/:tour_id/guideCount", countAssignedGuides);
router.post("/assignGuide", assignGuideToTour);
router.post("/assignCandidate", assignCandidateGuidesToTour);
router.get("/candidateGuides", getCandidateGuides);
router.get("/allTours", getAllTours);
router.put("/approve/:id", approveTour);
router.put("/reject/:id", rejectTour);
router.put("/updateClassRoom/:id", updateClassRoom);
router.put("/updateTime/:id", updateTime);
module.exports = router;
