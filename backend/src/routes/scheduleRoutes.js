// src/routes/scheduleRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadSchedule } = require('../controllers/scheduleController');
const upload = require('../utils/fileUpload'); // Import the file upload utility

router.post('/uploadSchedule/:userId', upload.single('schedule'), uploadSchedule);

module.exports = router;
