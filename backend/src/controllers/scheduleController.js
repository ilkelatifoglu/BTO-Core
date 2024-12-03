// src/controllers/scheduleController.js

const db = require('../config/database');

exports.uploadSchedule = async (req, res) => {
  try {
    const { userId } = req.params;
    const scheduleFile = req.file;

    if (!scheduleFile) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const fileData = scheduleFile.buffer.toString('base64');
    const mimeType = scheduleFile.mimetype; // Get the MIME type

    await db.query(
      `INSERT INTO schedules (user_id, schedule_data, mime_type)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id) DO UPDATE SET schedule_data = $2, mime_type = $3`,
      [userId, fileData, mimeType]
    );

    res.status(200).json({ message: 'Schedule uploaded successfully.' });
  } catch (error) {
    console.error('Error uploading schedule:', error);
    res.status(500).json({ error: 'An error occurred while uploading the schedule.' });
  }
};

// New function to get schedule data
exports.getSchedule = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await db.query(
      'SELECT schedule_data, mime_type FROM schedules WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0 || !result.rows[0].schedule_data) {
      return res.status(404).json({ error: 'Schedule not found for this user.' });
    }

    const schedule = result.rows[0];

    res.status(200).json({
      schedule_data: schedule.schedule_data,
      schedule_mime_type: schedule.mime_type,
    });
  } catch (error) {
    console.error('Error fetching schedule:', error);
    res.status(500).json({ error: 'An error occurred while fetching the schedule.' });
  }
};
