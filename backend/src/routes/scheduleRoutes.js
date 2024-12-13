// src/routes/scheduleRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const authenticateToken = require('../middleware/auth'); 
const { uploadSchedule, getSchedule } = require('../controllers/scheduleController');
const upload = require('../utils/fileUpload'); // Import the file upload utility

router.post('/uploadSchedule/:userId', authenticateToken, upload.single('schedule'), uploadSchedule);
router.get('/getSchedule/:userId', authenticateToken, getSchedule);

module.exports = router;
