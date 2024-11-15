const { query } = require("../config/database");

exports.addSchool = async (req, res) => {
  const {
    no_of_students,
    city,
    school_name,
    teacher,
    teacher_phone,
    email,
    student_sent_last1,
    student_sent_last2,
    student_sent_last3,
    LGS_point,
    credit_score
  } = req.body;

  try {

    const schoolCheck = await query(
      "SELECT * FROM schools WHERE school_name = $1 AND city = $2",
      [school_name, city]
    );
    if (schoolCheck.rows.length > 0) {
      return res.status(400).json({ message: "school already exists" });
    }
    // Insert the school info into the database
    const result = await query(
      `INSERT INTO schools
       (no_of_students, city, school_name, teacher, teacher_phone, email, 
        student_sent_last1, student_sent_last2, student_sent_last3, LGS_point, credit_score)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
       RETURNING id`,
      [
        no_of_students,
        city,
        school_name,
        teacher,
        teacher_phone,
        email,
        student_sent_last1,
        student_sent_last2,
        student_sent_last3,
        LGS_point,
        credit_score
      ]
    );

    // Send a success response
    res.status(200).json({
      success: true,
      message: "School information added successfully",
      schoolId: result.rows[0].id
    });
  } catch (error) {
    console.error("Error adding school info:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
