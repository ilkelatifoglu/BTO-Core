// src/queries/schoolQueries.js

const { query } = require("../config/database");

// Retrieve the ID of a school by its name, city, and academic year
exports.getSchoolId = async (school_name, city, academic_year_start) => {
  const result = await query(
    "SELECT id FROM schools WHERE school_name = $1 AND city = $2 AND academic_year_start = $3",
    [school_name, city, academic_year_start]
  );
  return result.rows.length > 0 ? result.rows[0].id : null;
};

// Retrieve all schools
exports.getAllSchools = async () => {
  const result = await query(
    `SELECT 
      id, 
      school_name, 
      city, 
      academic_year_start, 
      academic_year_end, 
      student_count, 
      student_sent_last1, 
      student_sent_last2, 
      student_sent_last3, 
      lgs_score
     FROM schools
     ORDER BY school_name ASC;`
  );
  return result.rows;
};

// Retrieve a specific school by ID
exports.getSchoolById = async (id) => {
  const result = await query(
    `SELECT 
      id, 
      school_name, 
      city, 
      academic_year_start, 
      academic_year_end, 
      student_count, 
      student_sent_last1, 
      student_sent_last2, 
      student_sent_last3, 
      lgs_score
     FROM schools
     WHERE id = $1`,
    [id]
  );
  return result.rows.length > 0 ? result.rows[0] : null;
};

// Insert a new school
exports.insertSchool = async (schoolData) => {
  const {
    school_name,
    city,
    academic_year_start,
    academic_year_end,
    student_count,
    student_sent_last1,
    student_sent_last2,
    student_sent_last3,
    lgs_score,
  } = schoolData;

  const result = await query(
    `INSERT INTO schools 
      (school_name, city, academic_year_start, academic_year_end, student_count, 
       student_sent_last1, student_sent_last2, student_sent_last3, lgs_score)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id`,
    [
      school_name,
      city,
      academic_year_start,
      academic_year_end,
      student_count,
      student_sent_last1,
      student_sent_last2,
      student_sent_last3,
      lgs_score,
    ]
  );

  return result.rows[0].id;
};

// Update an existing school by ID
exports.updateSchool = async (id, updateData) => {
  const {
    school_name,
    city,
    academic_year_start,
    academic_year_end,
    student_count,
    student_sent_last1,
    student_sent_last2,
    student_sent_last3,
    lgs_score,
  } = updateData;

  const result = await query(
    `UPDATE schools SET
      school_name = $1,
      city = $2,
      academic_year_start = $3,
      academic_year_end = $4,
      student_count = $5,
      student_sent_last1 = $6,
      student_sent_last2 = $7,
      student_sent_last3 = $8,
      lgs_score = $9
    WHERE id = $10
    RETURNING *`,
    [
      school_name,
      city,
      academic_year_start,
      academic_year_end,
      student_count,
      student_sent_last1,
      student_sent_last2,
      student_sent_last3,
      lgs_score,
      id,
    ]
  );

  return result.rows[0];
};

// Delete a school by ID
exports.deleteSchool = async (id) => {
  await query("DELETE FROM schools WHERE id = $1", [id]);
};
