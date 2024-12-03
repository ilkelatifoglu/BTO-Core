const express = require("express");
const router = express.Router();
const { getData } = require("../controllers/dataController");

// GET /data/:filter
router.get("/data/:filter", getData);

module.exports = router;
