// src/routes/profileRoutes.js

const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, uploadProfilePicture, getProfilePicture } = require('../controllers/profileController');
const authenticateToken = require('../middleware/auth');
const upload = require('../middleware/multer'); // Import multer middleware

// Existing Routes
router.get('/getProfile', authenticateToken, getProfile);
router.put('/updateProfile', authenticateToken, updateProfile);

// New Routes for Profile Picture
router.post('/upload-profile-picture/:id', authenticateToken, upload.single('profile_picture'), uploadProfilePicture);
router.get('/get-profile-picture/:id', authenticateToken, getProfilePicture);

module.exports = router;
