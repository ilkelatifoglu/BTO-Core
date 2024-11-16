const { query } = require("../config/database");

exports.addTour = async (req, res) => {
  const {
    teacher_name,
    teacher_phone,
    teacher_email,
    school_name,
    city,
    academic_year_start,
    date, 
    time_preferences 
  } = req.body;

  try {
    const schoolQuery = await query(
      "SELECT id FROM schools WHERE school_name = $1 AND city = $2 AND academic_year_start = $3",
      [school_name, city, academic_year_start]
    );
    if (schoolQuery.rows.length === 0) {
      return res.status(400).json({ message: "School not found" });
    }
    const school_id = schoolQuery.rows[0].id;

    const tourCheck = await query(
      "SELECT * FROM tours WHERE school_id = $1 AND date = $2",
      [school_id, date]
    );
    if (tourCheck.rows.length > 0) {
      return res.status(400).json({ message: "A tour already exists for this school on the given date" });
    }

    const day = new Date(date).toLocaleString("tr-TR", { weekday: "long" });

    const tourResult = await query(
      `INSERT INTO tours (teacher_name, teacher_phone, teacher_email, school_id, date, day)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [teacher_name, teacher_phone, teacher_email, school_id, date, day.charAt(0).toUpperCase() + day.slice(1)]
    );
    const tourId = tourResult.rows[0].id;

    // Insert time preferences into the tour_time table
    if (time_preferences && time_preferences.length > 0) {
      const timePrefQueries = time_preferences.map((time) =>
        query(
          `INSERT INTO tour_time (tour_id, time) VALUES ($1, $2)`,
          [tourId, time]
        )
      );
      await Promise.all(timePrefQueries);
    }

    res.status(200).json({
      success: true,
      message: "Tour and time preferences added successfully",
      tourId: tourId
    });
  } catch (error) {
    console.error("Error adding tour:", error.message || error);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};
