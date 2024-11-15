const express = require("express");
const { addTour } = require("../controllers/tourController");
const router = express.Router();

router.post("/addTour", addTour);

module.exports = router;
