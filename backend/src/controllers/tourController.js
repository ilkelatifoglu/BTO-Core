const { query } = require("../config/database");

exports.addTour = async (req, res) => {
  const {
    school_name,
    city,
    academic_year_start,
    date, 
    tour_size,
    teacher_name,
    teacher_phone,
    teacher_email,
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

    const guide_count = Math.ceil(tour_size / 60);

    const tourResult = await query(
      `INSERT INTO tours (school_id, date, day, tour_size, guide_count, teacher_name, teacher_phone, teacher_email)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [school_id, date, day.charAt(0).toUpperCase() + day.slice(1), tour_size, guide_count, teacher_name, teacher_phone, teacher_email]
    );
    const tourId = tourResult.rows[0].id;

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

exports.getReadyTours = async (req, res) => {
  try {
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

    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error("Error fetching READY tours:", error.message || error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
