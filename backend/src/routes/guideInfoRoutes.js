// src/routes/guideInfoRoutes.js

const express = require('express');
const router = express.Router();
const { getGuideInfo } = require('../controllers/guideInfoController');
const authenticateToken = require('../middleware/auth'); // Middleware for authentication
const authorizeRole = require('../middleware/authorizeRole'); // Middleware for role-based authorization

router.get('/', authenticateToken, authorizeRole(2,3,4), getGuideInfo);
module.exports = router;
