const express = require('express');
require('dotenv').config();
const {
    getFairs, createFair, createFairRequest,
    assignGuide, getAvailableGuides, approveFair, cancelFair, unassignGuide, getAvailableFairsForUser
} = require('../controllers/fairController');
const authenticateToken = require('../middleware/auth'); // Middleware for authentication
const router = express.Router();
const authorizeRole = require('../middleware/authorizeRole'); // Middleware for role-based authorization

router.get('/', authenticateToken, getFairs);
router.post('/createFair', authenticateToken, createFair);
router.post('/fair-requests', authenticateToken, createFairRequest);
router.put('/:id/assign', authenticateToken, authorizeRole(2,3,4), assignGuide);
router.get('/available-guides', authenticateToken, getAvailableGuides);
router.put('/:id/approve', authenticateToken, authorizeRole(4), approveFair);
router.put('/:id/cancel', authenticateToken, cancelFair);
router.put("/:id/unassign", authenticateToken, authorizeRole(2,3,4), unassignGuide);
router.get("/available-fairs", authenticateToken, getAvailableFairsForUser);



module.exports = router;
