const express = require('express');
const {
    getFairs, createFair, createFairRequest,
    assignGuide, getAvailableGuides, approveFair, cancelFair
} = require('../controllers/fairController');

const router = express.Router();

router.get('/', getFairs);
router.post('/', createFair);
router.post('/fair-requests', createFairRequest);
router.put('/:id/assign', assignGuide);
router.get('/available-guides', getAvailableGuides);
router.put('/:id/approve', approveFair);
router.put('/:id/cancel', cancelFair);

module.exports = router;
