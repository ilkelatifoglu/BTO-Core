const { query } = require("../config/database");

// Check if a school exists by name, city, and academic year
exports.getSchoolId = async (school_name, city, academic_year_start) => {
  const result = await query(
    "SELECT id FROM schools WHERE school_name = $1 AND city = $2 AND academic_year_start = $3",
    [school_name, city, academic_year_start]
  );
  return result.rows.length > 0 ? result.rows[0].id : null;
};

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

// Check if a guide is already assigned to a tour
exports.isGuideAssignedToTour = async (tour_id, guide_id) => {
  const result = await query(
    "SELECT * FROM tour_guide WHERE tour_id = $1 AND guide_id = $2",
    [tour_id, guide_id]
  );
  return result.rows.length > 0;
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
        t.date,
        t.day,
        tt.time,
        s.school_name,
        s.city,
        t.tour_size,
        t.guide_count
     FROM tours t
     JOIN schools s ON t.school_id = s.id
     JOIN tour_time tt ON t.id = tt.tour_id
     WHERE t.tour_status = 'READY'
     ORDER BY t.date, tt.time`
  );
  return result.rows;
};
// Get all tours with all attributes and associated school details
exports.getAllTours = async () => {
  const result = await query(
    `SELECT 
        t.id AS tour_id,
        t.tour_status,
        s.school_name,
        s.city,
        t.date,
        t.day,
        t.tour_size,
        t.teacher_name,
        t.teacher_phone,
        t.time,
        t.classroom,
        tt.timepref1,
        tt.timepref2,
        tt.timepref3,
        tt.timepref4
     FROM tours t
     JOIN schools s ON t.school_id = s.id
     LEFT JOIN tour_time tt ON t.id = tt.tour_id
     ORDER BY t.id DESC` // Ordering by tour_id in descending order
  );
  return result.rows;
};
exports.approveTour = async (tourId, selectedTime) => {
  await query(
    `UPDATE tours SET time = $1, tour_status = 'APPROVED' WHERE id = $2`,
    [selectedTime, tourId]
  );
};
exports.rejectTour = async (tourId) => {
  await query(
    `UPDATE tours SET time = NULL, tour_status = 'REJECTED' WHERE id = $1`,
    [tourId]
  );
};