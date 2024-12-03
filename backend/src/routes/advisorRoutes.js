const express = require('express');
const { getAdvisors, getAdvisorDetails } = require('../controllers/advisorController');
const router = express.Router();

router.get('/', getAdvisors); // List all advisors with guides
router.get('/:id', getAdvisorDetails); // Get specific advisor details

module.exports = router;
