const express = require("express");
const { addSchool } = require("../controllers/schoolController");
const router = express.Router();

router.post("/addSchool", addSchool);

module.exports = router;
