const { query } = require("../config/database");

exports.addTour = async (req, res) => {
  const {
    tour_status,
    school_feedback,
    supervisor_email, // Email to find the supervisor in users table
    school_name, // Name of the school to find in schools table
    city, // City to further match the school
    chosen_date,
    time_preferences, 
    guides 
  } = req.body;

  try {
    const supervisorQuery = await query("SELECT id FROM users WHERE email = $1", [supervisor_email]);
    if (supervisorQuery.rows.length === 0) {
      return res.status(400).json({ message: "Supervisor not found" });
    }
    const supervisor_id = supervisorQuery.rows[0].id;

    const schoolQuery = await query("SELECT id FROM schools WHERE school_name = $1 AND city = $2", [school_name, city]);
    if (schoolQuery.rows.length === 0) {
      return res.status(400).json({ message: "School not found" });
    }
    const school_id = schoolQuery.rows[0].id;

    const tourCheck = await query("SELECT * FROM tours WHERE school_id = $1 AND chosen_date = $2", [school_id, chosen_date]);
    if (tourCheck.rows.length > 0) {
      return res.status(400).json({ message: "A tour already exists for this school on the chosen date" });
    }

    const tourResult = await query(
      `INSERT INTO tours (tour_status, school_feedback, supervisor_id, school_id, chosen_date)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [tour_status, school_feedback, supervisor_id, school_id, chosen_date]
    );
    const tourId = tourResult.rows[0].id;

    if (time_preferences && time_preferences.length > 0) {
      const timePrefQueries = time_preferences.map(async ({ day, slot }) => {
        const timeQuery = await query("SELECT id FROM time_preferences WHERE day = $1 AND slot = $2", [day, slot]);
        if (timeQuery.rows.length === 0) {
          throw new Error(`Time preference not found for day: ${day}, slot: ${slot}`);
        }
        return timeQuery.rows[0].id;
      });
      const timePrefIds = await Promise.all(timePrefQueries);

      // Insert into tour_time table
      const tourTimeQueries = timePrefIds.map((timePrefId) =>
        query("INSERT INTO tour_time (tour_id, time_pref_id) VALUES ($1, $2)", [tourId, timePrefId])
      );
      await Promise.all(tourTimeQueries);
    }

    // Retrieve `user_id`s for guides from users table
    if (guides && guides.length > 0) {
      const guideQueries = guides.map(async (email) => {
        const guideQuery = await query("SELECT id FROM users WHERE email = $1", [email]);
        if (guideQuery.rows.length === 0) {
          throw new Error(`Guide not found for email: ${email}`);
        }
        return guideQuery.rows[0].id;
      });
      const guideIds = await Promise.all(guideQueries);

      // Insert into tour_guide table
      const guideInsertQueries = guideIds.map((guideId) =>
        query("INSERT INTO tour_guide (tour_id, user_id) VALUES ($1, $2)", [tourId, guideId])
      );
      await Promise.all(guideInsertQueries);
    }

    // Send success response
    res.status(200).json({
      success: true,
      message: "Tour added successfully",
      tourId: tourId
    });
  } catch (error) {
    console.error("Error adding tour:", error.message || error);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};
