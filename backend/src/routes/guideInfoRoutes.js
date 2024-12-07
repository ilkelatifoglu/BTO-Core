// src/routes/guideInfoRoutes.js

const express = require('express');
const router = express.Router();
const { getGuideInfo } = require('../controllers/guideInfoController');
const authenticateToken = require('../middleware/auth'); // Middleware for authentication

// router.get('/', authenticateToken, getGuideInfo);
router.get('/', getGuideInfo);
module.exports = router;
