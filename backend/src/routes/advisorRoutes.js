const express = require('express');
const { getAdvisors, getAdvisorDetails } = require('../controllers/advisorController');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const authorizeRole = require('../middleware/authorizeRole');

router.get('/', authenticateToken, authorizeRole(2,3,4), getAdvisors); 
router.get('/:id', authenticateToken, authorizeRole(2,3,4), getAdvisorDetails); 

module.exports = router;
