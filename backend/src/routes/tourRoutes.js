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
    updateClassroom,
    updateTime,
    getMyTours,
    withdrawFromTour,
    cancelTour,
    fetchDoneTours,
    getToursByUserId,
    getUsersByTourId, 
    requestToJoinTour, 
    getDistinctSchoolsAndCities
} = require("../controllers/tourController");
const authenticateToken = require('../middleware/auth'); 
const authorizeRole = require("../middleware/authorizeRole");

const router = express.Router();

router.post("/addTour", addTour);
router.get("/readyTours", authenticateToken, getReadyTours);
router.get("/:tour_id/guideCount", authenticateToken, countAssignedGuides);
router.post("/assignGuide", authenticateToken, authorizeRole(2,3,4), assignGuideToTour);
router.post("/assignCandidate", authenticateToken, authorizeRole(2,3,4), assignCandidateGuidesToTour);
router.get("/candidateGuides", authenticateToken, getCandidateGuides);
router.get("/allTours", authenticateToken, getAllTours);
router.put("/approve/:id", authenticateToken, authorizeRole(3,4), approveTour);
router.put("/reject/:id", authenticateToken, authorizeRole(3,4), rejectTour);
router.put("/:id/updateClassroom", authenticateToken, updateClassroom);
router.put("/updateTime/:id", authenticateToken, updateTime);
router.get("/myTours", authenticateToken, getMyTours);
router.delete("/withdraw/:id", authenticateToken, withdrawFromTour);
router.get("/doneTours", authenticateToken, fetchDoneTours);
router.get("/cancel", cancelTour);
router.get("/getToursByUser", authenticateToken, getToursByUserId);
router.get("/getUsersByTour", authenticateToken, getUsersByTourId);
router.post("/requestToJoin", authenticateToken, requestToJoinTour);
router.get("/distinctSchoolsAndCities", getDistinctSchoolsAndCities);

module.exports = router;
