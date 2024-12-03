// src/controllers/scheduleController.js

const db = require('../config/database'); // Corrected import

exports.uploadSchedule = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from URL parameters
    const scheduleFile = req.file; // Get the uploaded file from multer

    if (!scheduleFile) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    // Convert file buffer to base64
    const fileData = scheduleFile.buffer.toString('base64');

    // Store base64 data in the database
    await db.query(
      `INSERT INTO schedules (user_id, schedule_data)
       VALUES ($1, $2)
       ON CONFLICT (user_id) DO UPDATE SET schedule_data = $2`,
      [userId, fileData]
    );

    res.status(200).json({ message: 'Schedule uploaded successfully.' });
  } catch (error) {
    console.error('Error uploading schedule:', error);
    res.status(500).json({ error: 'An error occurred while uploading the schedule.' });
  }
};
