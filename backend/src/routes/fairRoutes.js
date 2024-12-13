const express = require('express');
require('dotenv').config();
const {
    getFairs, createFair, createFairRequest,
    assignGuide, getAvailableGuides, approveFair, cancelFair, unassignGuide, getAvailableFairsForUser
} = require('../controllers/fairController');
const authenticateToken = require('../middleware/auth'); // Middleware for authentication
const router = express.Router();
const authorizeRole = require('../middleware/authorizeRole'); // Middleware for role-based authorization

router.get('/', getFairs);
router.post('/createFair', createFair);
router.post('/fair-requests', createFairRequest);
router.put('/:id/assign', authorizeRole(2,3,4), assignGuide);
router.get('/available-guides', getAvailableGuides);
router.put('/:id/approve', authorizeRole(4), approveFair);
router.put('/:id/cancel', cancelFair);
router.put("/:id/unassign", authorizeRole(2,3,4), unassignGuide);
router.get("/available-fairs", authenticateToken, getAvailableFairsForUser);



module.exports = router;
