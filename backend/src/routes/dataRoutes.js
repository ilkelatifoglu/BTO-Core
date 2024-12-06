const express = require("express");
const router = express.Router();
const { getData, getSchoolStudentData } = require("../controllers/dataController");

router.get("/school-student-data", getSchoolStudentData);
router.get("/:filter/:periodIndex", getData);

module.exports = router;
