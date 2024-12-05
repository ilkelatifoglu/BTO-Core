const db = require("../config/database");
exports.getData = async (req, res) => {
  const { filter, periodIndex } = req.params;

  const periodIndexInt = parseInt(periodIndex, 10) || 0;

  const currentDate = new Date();
  let startDate, endDate;

  if (filter === "weekly") {

    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);

    startOfWeek.setDate(startOfWeek.getDate() - 7 * periodIndexInt);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    startDate = startOfWeek;
    endDate = endOfWeek;
  } else if (filter === "monthly") {

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    startOfMonth.setMonth(startOfMonth.getMonth() - periodIndexInt);
    const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0);

    startDate = startOfMonth;
    endDate = endOfMonth;
  } else if (filter === "yearly") {

    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
    startOfYear.setFullYear(startOfYear.getFullYear() - periodIndexInt);
    const endOfYear = new Date(startOfYear.getFullYear(), 11, 31);

    startDate = startOfYear;
    endDate = endOfYear;
  } else {
    return res.status(400).json({ error: "Invalid filter type" });
  }

  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = ("0" + (date.getMonth() + 1)).slice(-2);
    const dd = ("0" + date.getDate()).slice(-2);
    return `${yyyy}-${mm}-${dd}`;
  };

  const startDateStr = formatDate(startDate);
  const endDateStr = formatDate(endDate);
  try {
    const statusQuery = `
      SELECT
        EXTRACT(ISODOW FROM date::DATE) AS dow,
        SUM(CASE WHEN tour_status IN ('APPROVED', 'READY', 'DONE', 'CANCELLED') THEN 1 ELSE 0 END) AS approved_count,
        SUM(CASE WHEN tour_status = 'REJECTED' THEN 1 ELSE 0 END) AS rejected_count
      FROM tours
      WHERE date::DATE >= $1::DATE AND date::DATE <= $2::DATE
      GROUP BY dow
      ORDER BY dow;
    `;

    const statusResult = await db.query(statusQuery, [startDateStr, endDateStr]);

    
    // Query for tour days data
    const daysQuery = `
      SELECT
        EXTRACT(ISODOW FROM date::DATE) AS dow,
        COUNT(*) AS tour_count
      FROM tours
      WHERE date::DATE >= $1::DATE AND date::DATE <= $2::DATE
      GROUP BY dow
      ORDER BY dow;
    `;

    const daysResult = await db.query(daysQuery, [startDate, endDateStr]);

    // New query for tours by city data
    const cityQuery = `
      SELECT s.city, COUNT(*) AS tour_count
      FROM tours t
      JOIN schools s ON t.school_id = s.id
      WHERE t.date::DATE >= $1::DATE AND t.date::DATE <= $2::DATE
      GROUP BY s.city
      ORDER BY tour_count DESC;
    `;

    const cityResult = await db.query(cityQuery, [startDate, endDateStr]);

    // Map day numbers to English day names
    const daysOfWeek = {
      1: "Monday",
      2: "Tuesday",
      3: "Wednesday",
      4: "Thursday",
      5: "Friday",
      6: "Saturday",
      7: "Sunday",
    };

    // Process tour status data
    const tourStatusData = {};
    statusResult.rows.forEach((row) => {
      const dayName = daysOfWeek[row.dow];
      tourStatusData[dayName] = {
        approved: parseInt(row.approved_count, 10),
        rejected: parseInt(row.rejected_count, 10),
      };
    });

    // Process tour days data
    const tourDays = {};
    daysResult.rows.forEach((row) => {
      const dayName = daysOfWeek[row.dow];
      tourDays[dayName] = parseInt(row.tour_count, 10);
    });

    // Process tours by city data
    const toursByCity = {};
    cityResult.rows.forEach((row) => {
      const city = row.city;
      toursByCity[city] = parseInt(row.tour_count, 10);
    });

    res.json({
      tourStatusData,
      tourDays,
      toursByCity,
      startDate: startDateStr,
      endDate: endDateStr,
    });
  } catch (error) {
    console.error("Error fetching tour data:", error);
    res.status(500).json({ error: "Failed to fetch tour data" });
  }

};

exports.getSchoolStudentData = async (req, res) => {
  try {
    const query = `
      SELECT s.id, s.school_name, s.student_count, s.student_sent_last1, s.student_sent_last2, s.student_sent_last3
      FROM schools s
      WHERE s.id IN (SELECT DISTINCT school_id FROM tours)
    `;
    const result = await db.query(query);

    const schoolData = result.rows.map((row) => ({
      id: row.id,
      school_name: row.school_name,
      student_count: parseInt(row.student_count, 10) || 0,
      student_sent_last_total:
        (parseInt(row.student_sent_last1, 10) || 0) +
        (parseInt(row.student_sent_last2, 10) || 0) +
        (parseInt(row.student_sent_last3, 10) || 0),
    }));

    res.json({ schoolData });
  } catch (error) {
    console.error("Error fetching school student data:", error);
    res.status(500).json({ error: "Failed to fetch school student data" });
  }
};






/*const db = require("../config/database");

exports.getData = async (req, res) => {
  const { filter } = req.params;

  // Get today's date dynamically
  const currentDate = new Date();
  let startDate;

  // Determine the date range
  if (filter === "weekly") {
    startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - 7); // Last 7 days
  } else if (filter === "monthly") {
    startDate = new Date(currentDate);
    startDate.setMonth(currentDate.getMonth() - 1); // Last 1 month
  } else if (filter === "yearly") {
    startDate = new Date(currentDate);
    startDate.setFullYear(currentDate.getFullYear() - 1); // Last 1 year
  } else {
    return res.status(400).json({ error: "Invalid filter type" });
  }


  try {
    // Corrected query for tour status data
    const statusQuery = `
      SELECT
        EXTRACT(ISODOW FROM date::DATE) AS dow,
        SUM(CASE WHEN tour_status IN ('APPROVED', 'READY', 'DONE', 'CANCELLED') THEN 1 ELSE 0 END) AS approved_count,
        SUM(CASE WHEN tour_status = 'REJECTED' THEN 1 ELSE 0 END) AS rejected_count
      FROM tours
      WHERE date::DATE >= $1::DATE AND date::DATE <= $2::DATE
      GROUP BY dow
      ORDER BY dow;
    `;

    const statusResult = await db.query(statusQuery, [startDate, currentDate]);

    // Query for tour days data
    const daysQuery = `
      SELECT
        EXTRACT(ISODOW FROM date::DATE) AS dow,
        COUNT(*) AS tour_count
      FROM tours
      WHERE date::DATE >= $1::DATE AND date::DATE <= $2::DATE
      GROUP BY dow
      ORDER BY dow;
    `;

    const daysResult = await db.query(daysQuery, [startDate, currentDate]);

    // New query for tours by city data
    const cityQuery = `
      SELECT s.city, COUNT(*) AS tour_count
      FROM tours t
      JOIN schools s ON t.school_id = s.id
      WHERE t.date::DATE >= $1::DATE AND t.date::DATE <= $2::DATE
      GROUP BY s.city
      ORDER BY tour_count DESC;
    `;

    const cityResult = await db.query(cityQuery, [startDate, currentDate]);

    // Map day numbers to English day names
    const daysOfWeek = {
      1: "Monday",
      2: "Tuesday",
      3: "Wednesday",
      4: "Thursday",
      5: "Friday",
      6: "Saturday",
      7: "Sunday",
    };

    // Process tour status data
    const tourStatusData = {};
    statusResult.rows.forEach((row) => {
      const dayName = daysOfWeek[row.dow];
      tourStatusData[dayName] = {
        approved: parseInt(row.approved_count, 10),
        rejected: parseInt(row.rejected_count, 10),
      };
    });

    // Process tour days data
    const tourDays = {};
    daysResult.rows.forEach((row) => {
      const dayName = daysOfWeek[row.dow];
      tourDays[dayName] = parseInt(row.tour_count, 10);
    });

    // Process tours by city data
    const toursByCity = {};
    cityResult.rows.forEach((row) => {
      const city = row.city;
      toursByCity[city] = parseInt(row.tour_count, 10);
    });

    // Send all data in the response
    res.json({ tourStatusData, tourDays, toursByCity });
  } catch (error) {
    console.error("Error fetching tour data:", error);
    res.status(500).json({ error: "Failed to fetch tour data" });
  }
};

*/