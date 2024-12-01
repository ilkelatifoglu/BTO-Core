//This route will handle requests to fetch guide information.

const express = require('express');
const router = express.Router();
const { getGuideInfo } = require('../controllers/guideInfoController');
const authenticateToken = require('../middleware/auth'); // Middleware for authentication

// Route to fetch guide information
router.get('/', getGuideInfo); // Ensure only authenticated users can access this route

// Route to fetch individual schedule
router.get('/schedules/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, '../uploads/schedules', fileName);
    res.sendFile(filePath, err => {
        if (err) {
            res.status(404).send({ message: 'Schedule not found.' });
        }
    });
});

module.exports = router;
