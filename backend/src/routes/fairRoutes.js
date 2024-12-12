const express = require('express');
const {
    getFairs, createFair, createFairRequest,
    assignGuide, getAvailableGuides, approveFair, cancelFair, unassignGuide, getAvailableFairsForUser
} = require('../controllers/fairController');
const authenticateToken = require('../middleware/auth'); // Middleware for authentication
const router = express.Router();

router.get('/', getFairs);
router.post('/createFair', createFair);
router.post('/fair-requests', createFairRequest);
router.put('/:id/assign', assignGuide);
router.get('/available-guides', getAvailableGuides);
router.put('/:id/approve', approveFair);
router.put('/:id/cancel', cancelFair);
router.put("/:id/unassign", unassignGuide);
router.get("/available-fairs", authenticateToken, getAvailableFairsForUser);



module.exports = router;
