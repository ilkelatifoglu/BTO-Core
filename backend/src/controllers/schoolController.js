const { query } = require("../config/database");
const { getAllSchools } = require("../queries/schoolQueries");

exports.addSchool = async (req, res) => {
  const {
    school_name,
    city,
    academic_year_start,
    academic_year_end,
    student_count,
    student_sent_last1,
    student_sent_last2,
    student_sent_last3,
    lgs_score
  } = req.body;

  try {
    // Check for duplicate schools based on school name, city, and academic year start
    const schoolCheck = await query(
      "SELECT * FROM schools WHERE school_name = $1 AND city = $2 AND academic_year_start = $3",
      [school_name, city, academic_year_start]
    );

    if (schoolCheck.rows.length > 0) {
      return res.status(400).json({ message: "School already exists for the specified academic year" });
    }

    // Insert the school into the database
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
        lgs_score
      ]
    );

    res.status(200).json({
      success: true,
      message: "School added successfully",
      schoolId: result.rows[0].id
    });
  } catch (error) {
    console.error("Error adding school:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getAllSchools = async (req, res) => {
  try {
    const schools = await getAllSchools();

    res.status(200).json({
      success: true,
      data: schools,
    });
  } catch (error) {
    console.error("Error retrieving schools:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};