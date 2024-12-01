const { query } = require("../config/database");

// Check if a tour exists for a school on a specific date
exports.doesTourExist = async (school_id, date) => {
  const result = await query(
    "SELECT * FROM tours WHERE school_id = $1 AND date = $2",
    [school_id, date]
  );
  return result.rows.length > 0;
};

// Insert a new tour
exports.insertTour = async ({
  school_id,
  date,
  day,
  tour_size,
  guide_count,
  teacher_name,
  teacher_phone,
  teacher_email,
}) => {
  const result = await query(
    `INSERT INTO tours (school_id, date, day, tour_size, guide_count, teacher_name, teacher_phone, teacher_email)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
    [school_id, date, day, tour_size, guide_count, teacher_name, teacher_phone, teacher_email]
  );
  return result.rows[0].id;
};

// Insert time preferences for a tour
exports.insertTourTimes = async (tour_id, time_preferences) => {
  const timePrefQueries = time_preferences.map((time) =>
    query("INSERT INTO tour_time (tour_id, time) VALUES ($1, $2)", [tour_id, time])
  );
  await Promise.all(timePrefQueries);
};

// Get tour details by school name, city, date, and time
exports.fetchTourDetails = async (school_name, city, date, time) => {
  const tourQuery = await query(
    `SELECT t.id, t.guide_count
     FROM tours t
     JOIN schools s ON t.school_id = s.id
     WHERE s.school_name = $1 AND s.city = $2 AND t.date = $3 AND t.time = $4`,
    [school_name, city, date, time]
  );

  if (tourQuery.rows.length === 0) {
    throw new Error("Tour not found");
  }

  return tourQuery.rows[0]; // Returns { id: tour_id, guide_count }
};

// Check if a user is already assigned to a tour
exports.isUserAssignedToTour = async (tour_id, user_id) => {
  const result = await query(
    "SELECT 1 FROM tour_guide WHERE tour_id = $1 AND guide_id = $2",
    [tour_id, user_id]
  );
  return result.rows.length > 0;
};

// Check if a user has scheduling conflicts
exports.hasSchedulingConflict = async (user_id, date, time) => {
  const result = await query(
    `SELECT 1 
     FROM tour_guide tg
     JOIN tours t ON tg.tour_id = t.id
     WHERE tg.guide_id = $1 AND t.date = $2 AND t.time = $3`,
    [user_id, date, time]
  );
  return result.rows.length > 0;
};

// Fetch the number of assigned guides and candidates
exports.fetchAssignmentCounts = async (tour_id) => {
  const result = await query(
    `SELECT 
       COUNT(CASE WHEN u.user_type = 1 THEN 1 END) AS assigned_candidates,
       COUNT(CASE WHEN u.user_type != 1 THEN 1 END) AS assigned_guides,
       STRING_AGG(CASE WHEN u.user_type = 1 THEN u.first_name || ' ' || u.last_name END, ', ') AS candidate_names,
       STRING_AGG(CASE WHEN u.user_type != 1 THEN u.first_name || ' ' || u.last_name END, ', ') AS guide_names
     FROM tour_guide tg
     JOIN users u ON tg.guide_id = u.id
     WHERE tg.tour_id = $1`,
    [tour_id]
  );

  return {
    assigned_candidates: parseInt(result.rows[0].assigned_candidates, 10),
    assigned_guides: parseInt(result.rows[0].assigned_guides, 10),
    candidate_names: result.rows[0].candidate_names || "", // Initialize empty string if null
    guide_names: result.rows[0].guide_names || "", // Initialize empty string if null
  };
};


// Validate if the quota is exceeded
exports.validateQuota = (assigned_count, new_count, limit, type) => {
  console.log("new count: " + new_count);
  console.log(assigned_count + new_count);
  if (type === "guide" && assigned_count + new_count > limit) {
    throw new Error("Guide quota exceeded!");
  }
  if (type === "candidate" && assigned_count + new_count > limit) {
    throw new Error("Candidate quota exceeded!");
  }
};


// Count the number of assigned guides for a tour
exports.getAssignedGuideCount = async (tour_id) => {
  const result = await query(
    "SELECT COUNT(*) AS assigned_count FROM tour_guide WHERE tour_id = $1",
    [tour_id]
  );
  return parseInt(result.rows[0].assigned_count, 10);
};

// Get the guide_count for a tour
exports.getGuideCountForTour = async (tour_id) => {
  const result = await query(
    "SELECT guide_count FROM tours WHERE id = $1",
    [tour_id]
  );
  return result.rows.length > 0 ? parseInt(result.rows[0].guide_count, 10) : null;
};

// Get all tours with status 'READY'
exports.getReadyTours = async () => {
  const result = await query(
    `SELECT 
      t.id,
      t.date,
      t.day,
      t.time,
      s.school_name,
      s.city,
      t.tour_size,
      t.guide_count,

      (SELECT STRING_AGG(u.first_name || ' ' || u.last_name, ', ') 
       FROM tour_guide tg
       JOIN users u ON tg.guide_id = u.id
       WHERE tg.tour_id = t.id AND u.user_type != 1) AS guide_names,

      (SELECT STRING_AGG(u.first_name || ' ' || u.last_name, ', ') 
       FROM tour_guide tg
       JOIN users u ON tg.guide_id = u.id
       WHERE tg.tour_id = t.id AND u.user_type = 1) AS candidate_names,

      (SELECT COUNT(*) 
       FROM tour_guide tg 
       JOIN users u ON tg.guide_id = u.id 
       WHERE tg.tour_id = t.id AND u.user_type = 1) AS assigned_candidates,
       
      (SELECT COUNT(*) 
       FROM tour_guide tg 
       JOIN users u ON tg.guide_id = u.id 
       WHERE tg.tour_id = t.id AND u.user_type != 1) AS assigned_guides
    FROM tours t
    JOIN schools s ON t.school_id = s.id
    WHERE t.tour_status = 'READY'
    ORDER BY t.date, t.time;`
  );

  // Ensure that assigned_candidates and assigned_guides are integers
  return result.rows.map(row => ({
    ...row,
    assigned_candidates: parseInt(row.assigned_candidates, 10),
    assigned_guides: parseInt(row.assigned_guides, 10),
  }));
};




exports.fetchCandidateGuides = async () => {
  const result = await query(
    `SELECT user_id AS id, full_name AS name
     FROM candidate_guides
     ORDER BY full_name`
  );
  return result.rows;
};


const fetchGuidesAndCandidatesForTours = async (tourIds) => {
  // SQL query to fetch both guides and candidates in one batch
  const queryResult = await query(
    `
    -- Fetch Guides (user_type != 1)
    SELECT 
      t.id AS tour_id,
      u.first_name, u.last_name, u.user_type, u.id AS user_id
    FROM tours t
    LEFT JOIN tour_guide tg ON t.id = tg.tour_id
    LEFT JOIN users u ON tg.user_id = u.id
    WHERE t.id IN (${tourIds.join(', ')}) AND u.user_type != 1

    UNION ALL

    -- Fetch Candidates (user_type = 1)
    SELECT 
      t.id AS tour_id,
      u.first_name, u.last_name, u.user_type, u.id AS user_id
    FROM tours t
    LEFT JOIN tour_guide tg ON t.id = tg.tour_id
    LEFT JOIN users u ON tg.user_id = u.id
    WHERE t.id IN (${tourIds.join(', ')}) AND u.user_type = 1
    `,
    []
  );

  return queryResult.rows;  // List of guides and candidates for those tours
};
