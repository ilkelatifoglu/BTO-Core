const express = require("express");
const router = express.Router();
const { getData, getYearlySchoolStudentData } = require("../controllers/dataController");
const authenticationToken = require('../middleware/auth'); 
const authorizeRole = require('../middleware/authorizeRole'); 

// Specific route first
router.get("/school/yearly/:year", authenticationToken, authorizeRole(4), getYearlySchoolStudentData); 
// General route after
router.get("/:filter/:periodIndex", authenticationToken, authorizeRole(4), getData); 

module.exports = router;
