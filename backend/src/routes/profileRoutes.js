// profileRoutes.js
const express = require('express');
const router = express.Router();
const { uploadProfilePhoto, fetchUserProfile } = require('../controllers/profileController');
const authenticateToken = require('../middleware/auth');
const multer = require('multer');

// Configure multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

// Route to upload profile photo
router.post('/upload-photo', authenticateToken, upload.single('photo'), uploadProfilePhoto);

// Route to fetch user profile
router.get('/', authenticateToken, fetchUserProfile);

module.exports = router;
