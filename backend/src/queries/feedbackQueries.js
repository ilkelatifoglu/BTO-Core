const { query } = require("../config/database");

exports.getPaginatedFeedback = async (limit, offset) => {
  const sql = `
    SELECT 
      t.id AS tour_id,
      t.date AS tour_date,
      t.day AS tour_day,
      t.time AS tour_time,
      s.school_name,
      s.city,
      t.tour_size,
      t.guide_count,
      u.id AS user_id,
      u.first_name || ' ' || u.last_name AS user_name,
      CASE WHEN u.user_type = 1 THEN 'Candidate' ELSE 'Guide' END AS role,
      f.id AS feedback_id,
      f.filename,
      f.upload_date
    FROM tours t
    JOIN schools s ON t.school_id = s.id
    JOIN tour_guide tg ON t.id = tg.tour_id
    JOIN users u ON tg.guide_id = u.id
    LEFT JOIN feedback f ON f.tour_id = t.id AND f.user_id = u.id
    WHERE t.tour_status = 'COMPLETED'
    ORDER BY t.date DESC
    LIMIT $1 OFFSET $2;
  `;
  return await query(sql, [limit, offset]);
};

exports.addFeedback = async (filename, fileType, fileSize, s3Url, userId, tourId) => {
  const sql = `
    INSERT INTO feedback (filename, file_type, file_size, s3_url, user_id, tour_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id;
  `;
  return await query(sql, [filename, fileType, fileSize, s3Url, userId, tourId]);
};

exports.deleteFeedback = async (feedbackId) => {
  const sql = `DELETE FROM feedback WHERE id = $1 RETURNING s3_url;`;
  return await query(sql, [feedbackId]);
};
