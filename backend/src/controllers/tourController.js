// src/controllers/tourController.js

const {
  doesTourExist,
  insertTour,
  insertTourTimes,
  isGuideAssignedToTour,
  getAssignedGuideCount,
  getGuideCountForTour,
  getReadyTours,
  getAllTours,
  approveTour,
  rejectTour
} = require("../queries/tourQueries");

const { getSchoolId } = require("../queries/schoolQueries"); // Import from school queries
const { query } = require("../config/database");
const { sendEmail } = require("../utils/email");
// src/controllers/tourController.js

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
    time_preferences,
  } = req.body;

  try {
    const school_id = await getSchoolId(school_name, city, academic_year_start);
    if (!school_id) {
      return res.status(400).json({ message: "School not found" });
    }

    const tourExists = await doesTourExist(school_id, date);
    if (tourExists) {
      return res.status(400).json({ message: "A tour already exists for this school on the given date" });
    }

    const day = new Date(date).toLocaleString("tr-TR", { weekday: "long" });
    const guide_count = Math.ceil(tour_size / 60);

    const tourId = await insertTour({
      school_id,
      date,
      day: day.charAt(0).toUpperCase() + day.slice(1),
      tour_size,
      guide_count,
      teacher_name,
      teacher_phone,
      teacher_email,
    });

    if (time_preferences && time_preferences.length > 0) {
      await insertTourTimes(tourId, time_preferences);
    } else {
      return res.status(400).json({ message: "At least one time preference is required." });
    }

    res.status(200).json({
      success: true,
      message: "Tour and time preferences added successfully",
      tourId,
    });
  } catch (error) {
    console.error("Error adding tour:", error.message || error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.assignGuideToTour = async (req, res) => {
  const { school_name, city, date } = req.body;
  const guide_id = req.user.id; // Ensure that req.user.id is correctly populated

  try {
    // Query to find the tour based on school name, city, and date
    const tourQuery = await query(
      `
      SELECT t.id, t.guide_count
      FROM tours t
      JOIN schools s ON t.school_id = s.id
      WHERE s.school_name = $1 AND s.city = $2 AND t.date = $3
      `,
      [school_name, city, date]
    );

    if (tourQuery.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Tour not found" });
    }

    const { id: tour_id, guide_count } = tourQuery.rows[0];

    // Check if the guide is already assigned
    const guideCheck = await query(
      "SELECT * FROM tour_guide WHERE tour_id = $1 AND guide_id = $2",
      [tour_id, guide_id]
    );
    if (guideCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Guide is already assigned to this tour!",
      });
    }

    // Check if there is room for another guide
    const assignedCountResult = await query(
      "SELECT COUNT(*) AS assigned_count FROM tour_guide WHERE tour_id = $1",
      [tour_id]
    );

    const assignedCount = parseInt(assignedCountResult.rows[0].assigned_count, 10);

    if (assignedCount >= guide_count) {
      return res.status(400).json({
        success: false,
        message: "Maximum number of guides already assigned!",
      });
    }

    // Assign the guide to the tour
    await query("INSERT INTO tour_guide (tour_id, guide_id) VALUES ($1, $2)", [
      tour_id,
      guide_id,
    ]);

    res.status(200).json({
      success: true,
      message: "Guide successfully assigned to the tour!",
    });
  } catch (error) {
    console.error("Error assigning guide to tour:", error.message || error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.countAssignedGuides = async (req, res) => {
  const { tour_id } = req.params;

  try {
    const guideCount = await getAssignedGuideCount(tour_id);

    res.status(200).json({
      success: true,
      guide_count: guideCount,
    });
  } catch (error) {
    console.error("Error counting assigned guides:", error.message || error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getReadyTours = async (req, res) => {
  try {
    const tours = await getReadyTours();
    res.status(200).json({
      success: true,
      data: tours,
    });
  } catch (error) {
    console.error("Error fetching READY tours:", error.message || error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
exports.getAllTours = async (req, res) => {
  try {
    const tours = await getAllTours();
    res.status(200).json({
      success: true,
      data: tours,
    });
  } catch (error) {
    console.error("Error fetching all tours:", error.message || error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
exports.approveTour = async (req, res) => {
  const { id } = req.params;
  const { selectedTime } = req.body;

  if (!selectedTime) {
    return res.status(400).json({ message: "Time preference is required" });
  }

  try {
    // Update the tour in the database
    const tour = await approveTour(id, selectedTime); // Ensure this query returns teacher_email and other relevant fields

    // Send an email to the teacher
    const emailContent = `
      <p>Dear ${tour.teacher_name},</p>
      <p>We are pleased to inform you that your tour has been approved with the selected time: <b>${selectedTime}</b>.</p>
      <p>Thank you for your patience.</p>
      <p>Best regards,<br/>BTO Core Team</p>
    `;

    await sendEmail({
      to: tour.teacher_email,
      subject: "Tour Approved",
      html: emailContent,
    });

    res.status(200).json({ message: "Tour approved and email sent" });
  } catch (error) {
    console.error("Error approving tour:", error);
    res.status(500).json({ message: "Failed to approve tour" });
  }
};

// Controller to reject a tour
exports.rejectTour = async (req, res) => {
  const { id } = req.params;

  try {
    // Update the tour in the database
    const tour = await rejectTour(id); // Ensure this query returns teacher_email and other relevant fields

    // Send an email to the teacher
    const emailContent = `
      <p>Dear ${tour.teacher_name},</p>
      <p>We regret to inform you that your tour request has been rejected.</p>
      <p>If you have any questions, please feel free to contact us.</p>
      <p>Best regards,<br/>BTO Core Team</p>
    `;

    await sendEmail({
      to: tour.teacher_email,
      subject: "Tour Rejected",
      html: emailContent,
    });

    res.status(200).json({ message: "Tour rejected and email sent" });
  } catch (error) {
    console.error("Error rejecting tour:", error);
    res.status(500).json({ message: "Failed to reject tour" });
  }
};