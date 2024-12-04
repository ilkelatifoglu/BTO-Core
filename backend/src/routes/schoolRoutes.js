const express = require("express");
const { addSchool, getAllSchools } = require("../controllers/schoolController");
const router = express.Router();

router.post("/addSchool", addSchool);
router.get("/getAllSchools", getAllSchools);

module.exports = router;
