// feedbackQueries.js
const { query } = require("../config/database");

exports.getFeedbackByRole = async (userId, userType) => {
  // Query to fetch feedback from the feedback table
  let feedbackQuery = `
    SELECT DISTINCT
      f.id AS feedback_id, 
      f.text_feedback, 
      f.send_to_candidates, 
      f.tour_id, 
      f.user_ids, 
      f.sender_id,
      t.date AS tour_date, 
      t.day AS tour_day, 
      t.time AS tour_time, 
      s.school_name, 
      s.city, 
      t.tour_size, 
      -- Fetch tagged guides
      (
        SELECT array_agg(u.first_name || ' ' || u.last_name)
        FROM users u
        WHERE u.id = ANY(f.user_ids) AND u.user_type != 1
      ) AS tagged_guides,
      -- Fetch tagged candidates
      (
        SELECT array_agg(cg.full_name)
        FROM candidate_guides cg
        WHERE cg.user_id = ANY(f.user_ids)
      ) AS tagged_candidates,
      sender.first_name || ' ' || sender.last_name AS sender_name
    FROM feedback f
    JOIN tours t ON f.tour_id = t.id
    JOIN schools s ON t.school_id = s.id
    LEFT JOIN users sender ON f.sender_id = sender.id
  `;

  let feedbackParams = [];

  if (userType == 4) {
    feedbackQuery += ` ORDER BY f.id DESC;`;
  } else if (userType == 3) {
    feedbackQuery += `
      LEFT JOIN candidate_guides cg ON cg.user_id = ANY(f.user_ids)
      WHERE f.sender_id = $1 OR cg.advisor_user_id = $1 OR $1 = ANY(f.user_ids)
      ORDER BY f.id DESC;
    `;
    feedbackParams = [userId];
  } else if (userType == 2) {
    feedbackQuery += `
      WHERE f.sender_id = $1 OR $1 = ANY(f.user_ids)
      ORDER BY f.id DESC;
    `;
    feedbackParams = [userId];
  } else {
    feedbackQuery += `
      WHERE f.sender_id = $1 OR ($1 = ANY(f.user_ids) AND (f.send_to_candidates IS TRUE OR f.send_to_candidates IS NULL))
      ORDER BY f.id DESC;
    `;
    feedbackParams = [userId];
  }

  // Query to fetch feedback from tours table
  let toursFeedbackQuery = `
    SELECT
      t.id AS feedback_id,
      t.school_feedback AS text_feedback,
      t.id AS tour_id,
      t.date AS tour_date,
      t.time AS tour_time,
      s.school_name,
      s.city,
      t.tour_size,
      (
        SELECT array_agg(u.first_name || ' ' || u.last_name)
        FROM tour_guide tg
        JOIN users u ON tg.guide_id = u.id
        WHERE tg.tour_id = 51 AND u.user_type != 1
      ) AS tagged_guides,
      (
        SELECT array_agg(u.first_name || ' ' || u.last_name)
        FROM tour_guide tg
        JOIN users u ON tg.guide_id = u.id
        WHERE tg.tour_id = 51 AND u.user_type = 1
      ) AS tagged_candidates,
      s.school_name AS sender_name 
    FROM tours t
    JOIN schools s ON t.school_id = s.id
    WHERE t.tour_status = 'DONE' AND t.school_feedback IS NOT NULL
  `;

  let toursFeedbackParams = [];

  if (userType == 1 || userType == 2) {
    toursFeedbackQuery += `
      AND EXISTS (
        SELECT 1
        FROM tour_guide tg
        WHERE tg.tour_id = t.id AND tg.guide_id = $1
      )
    `;
    toursFeedbackParams = [userId];
  }

  // Query to fetch feedback from individual_tours table
  let individualToursFeedbackQuery = `
    SELECT
      it.id AS feedback_id,
      it.feedback AS text_feedback,
      it.id AS tour_id,
      '-' AS sender_id,
      it.date AS tour_date,
      it.time AS tour_time,
      it.contact_name AS school_name,
      '-' AS city,
      it.tour_size AS tour_size,
      (
        SELECT array_agg(u.first_name || ' ' || u.last_name)
        FROM users u
        WHERE u.id = it.guide_id AND u.user_type != 1
      ) AS tagged_guides,
      '-' AS tagged_candidates,
      it.contact_name AS sender_name 
    FROM individual_tours it
    WHERE it.tour_status = 'DONE' AND it.feedback IS NOT NULL
  `;

  let individualToursFeedbackParams = [];

  if (userType == 1 || userType == 2) {
    individualToursFeedbackQuery += `
      AND it.guide_id = $1
    `;
    individualToursFeedbackParams = [userId];
  }

  // Execute all queries
  const [feedbackResult, toursFeedbackResult, individualToursFeedbackResult] = await Promise.all([
    query(feedbackQuery, feedbackParams),
    query(toursFeedbackQuery, toursFeedbackParams),
    query(individualToursFeedbackQuery, individualToursFeedbackParams),
  ]);

  // Combine results and return
  return [
    ...feedbackResult.rows,
    ...toursFeedbackResult.rows,
    ...individualToursFeedbackResult.rows,
  ];
};




exports.createFeedback = async (userIds, tourId, textFeedback, senderId, sendToCandidates) => {
  const result = await query(
    `INSERT INTO feedback (user_ids, tour_id, text_feedback, sender_id, send_to_candidates) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING id, user_ids, tour_id, text_feedback, sender_id, send_to_candidates`,
    [userIds, tourId, textFeedback, senderId, sendToCandidates]
  );
  return result.rows[0];
};

exports.updateFeedback = async (feedbackId, textFeedback, sendToCandidates) => {
  const result = await query(
    `UPDATE feedback 
     SET text_feedback = $1, send_to_candidates = $2
     WHERE id = $3 
     RETURNING id, text_feedback, send_to_candidates`,
    [textFeedback, sendToCandidates, feedbackId]
  );
  return result.rows[0];
};

exports.deleteFeedback = async (feedbackId) => {
  await query(`DELETE FROM feedback WHERE id = $1`, [feedbackId]);
};

// exports.getPaginatedFeedback = async (limit, offset) => {
//   const sql = `
//     SELECT 
//       t.id AS tour_id,
//       t.date AS tour_date,
//       t.day AS tour_day,
//       t.time AS tour_time,
//       s.school_name,
//       s.city,
//       t.tour_size,
//       t.guide_count,
//       f.sender_id,
//       sender.first_name || ' ' || sender.last_name AS sender_name, -- Fetch sender's name
//       f.text_feedback,
//       f.user_ids,
//       (
//         SELECT array_agg(u.first_name || ' ' || u.last_name)
//         FROM users u
//         WHERE u.id = ANY(f.user_ids)
//       ) AS user_names, -- Fetch names for all user_ids
//       (
//         SELECT array_agg(
//           CASE 
//             WHEN u.user_type = 1 THEN 'Candidate'
//             ELSE 'Guide'
//           END
//         )
//         FROM users u
//         WHERE u.id = ANY(f.user_ids)
//       ) AS user_roles, -- Fetch roles for all user_ids
//       f.id AS feedback_id,
//       f.filename,
//       f.upload_date
//     FROM tours t
//     JOIN schools s ON t.school_id = s.id
//     LEFT JOIN feedback f ON f.tour_id = t.id
//     LEFT JOIN users sender ON f.sender_id = sender.id -- Join to fetch sender details
//     WHERE t.tour_status = 'DONE'
//     ORDER BY f.upload_date DESC
//     LIMIT $1 OFFSET $2;
//   `;
//   return await query(sql, [limit, offset]);
// };





// exports.addFeedback = async (filename, fileType, fileSize, s3Url, userId, tourId) => {
//   const sql = `
//     INSERT INTO feedback (filename, file_type, file_size, s3_url, user_id, tour_id)
//     VALUES ($1, $2, $3, $4, $5, $6)
//     RETURNING id;
//   `;
//   return await query(sql, [filename, fileType, fileSize, s3Url, userId, tourId]);
// };

// exports.deleteFeedback = async (feedbackId) => {
//   const sql = `DELETE FROM feedback WHERE id = $1 RETURNING s3_url;`;
//   return await query(sql, [feedbackId]);
// };
