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

// **New Function: Get All Schools**
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
