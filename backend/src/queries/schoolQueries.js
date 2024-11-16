const { query } = require("../config/database");

// Retrieve the ID of a school by its name, city, and academic year
exports.getSchoolId = async (school_name, city, academic_year_start) => {
  const result = await query(
    "SELECT id FROM schools WHERE school_name = $1 AND city = $2 AND academic_year_start = $3",
    [school_name, city, academic_year_start]
  );
  return result.rows.length > 0 ? result.rows[0].id : null;
};
