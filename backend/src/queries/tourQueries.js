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



// src/queries/tourQueries.js

exports.insertTour = async ({
  school_id,
  date,
  day,
  tour_size,
  guide_count,
  teacher_name,
  teacher_phone,
  teacher_email,
  visitor_notes, // Added visitor_notes
}) => {
  const result = await query(
    `INSERT INTO tours (
        school_id,
        date,
        day,
        tour_size,
        guide_count,
        teacher_name,
        teacher_phone,
        teacher_email,
        visitor_notes
      )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
    [
      school_id,
      date,
      day,
      tour_size,
      guide_count,
      teacher_name,
      teacher_phone,
      teacher_email,
      visitor_notes, // Added visitor_notes to values
    ]
  );
  return result.rows[0].id;
};



// Insert time preferences for a tour
// src/queries/tourQueries.js

exports.insertTourTimes = async (tour_id, time_preferences) => {
  // Validate time preferences
  const allowedTimes = ['09:00', '11:00', '13:30', '16:00'];
  if (time_preferences.length < 1 || time_preferences.length > 4) {
    throw new Error('You must provide between 1 and 4 time preferences.');
  }

  // Check for duplicates
  if (new Set(time_preferences).size !== time_preferences.length) {
    throw new Error('Time preferences cannot have duplicates.');
  }

  // Validate time preferences
  time_preferences.forEach((time) => {
    if (!allowedTimes.includes(time)) {
      throw new Error(`Invalid time preference: ${time}`);
    }
  });

  // Prepare columns and values
  const columns = ['tour_id', 'timepref1', 'timepref2', 'timepref3', 'timepref4'];
  const placeholders = columns.map((_, idx) => `$${idx + 1}`).join(', ');
  const values = [tour_id, null, null, null, null];

  // Assign time preferences to appropriate columns
  time_preferences.forEach((time, index) => {
    values[index + 1] = time; // timepref1 starts at index 1
  });

  const result = await query(
    `INSERT INTO tour_time (${columns.join(', ')})
     VALUES (${placeholders}) RETURNING id`,
    values
  );

  return result.rows[0].id;
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
// src/queries/tourQueries.js

exports.getReadyTours = async () => {
  const result = await query(
    `SELECT 
        t.date,
        t.day,
        t.time,
        t.classRoom,
        tt.timepref1,
        tt.timepref2,
        tt.timepref3,
        tt.timepref4,
        s.school_name,
        s.city,
        t.tour_size,
        t.guide_count
     FROM tours t
     JOIN schools s ON t.school_id = s.id
     JOIN tour_time tt ON t.id = tt.tour_id
     WHERE t.tour_status = 'READY'
     ORDER BY t.date`
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
        t.classRoom, 
        t.visitor_notes,
        tt.timepref1,
        tt.timepref2,
        tt.timepref3,
        tt.timepref4
     FROM tours t
     JOIN schools s ON t.school_id = s.id
     LEFT JOIN tour_time tt ON t.id = tt.tour_id
     ORDER BY t.id DESC`
  );
  return result.rows;
};

exports.approveTour = async (tourId, selectedTime) => {
  const allowedTimes = ['09:00', '11:00', '13:30', '16:00'];
  if (!allowedTimes.includes(selectedTime)) {
    throw new Error('Invalid time preference');
  }

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

exports.updateClassRoom = async (tourId, classRoom) => {
  await query(
    `UPDATE tours SET classRoom = $1 WHERE id = $2`,
    [classRoom, tourId]
  );
};

exports.updateTime = async (tourId, selectedTime) => {
  const allowedTimes = ['09:00', '11:00', '13:30', '16:00'];
  
  // Validate the selected time
  if (!allowedTimes.includes(selectedTime)) {
    throw new Error('Invalid time preference. Allowed values are 09:00, 11:00, 13:30, or 16:00.');
  }

  // Update the time column in the database
  await query(
    `UPDATE tours SET time = $1 WHERE id = $2`,
    [selectedTime, tourId]
  );
};
