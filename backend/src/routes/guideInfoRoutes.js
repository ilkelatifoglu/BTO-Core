//This route will handle requests to fetch guide information.

const express = require('express');
const router = express.Router();
const { getGuideInfo } = require('../controllers/guideInfoController');
const authenticateToken = require('../middleware/auth'); // Middleware for authentication

// Route to fetch guide information
router.get('/', getGuideInfo); // Ensure only authenticated users can access this route

module.exports = router;
