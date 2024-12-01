// src/controllers/tourController.js
const {
  doesTourExist,
  insertTour,
  insertTourTimes,
  getAssignedGuideCount,
  getGuideCountForTour,
  fetchTourDetails,
  isUserAssignedToTour,
  hasSchedulingConflict,
  fetchAssignmentCounts,
  validateQuota,
  getReadyTours,
  fetchCandidateGuides,
} = require("../queries/tourQueries");

const { getSchoolId } = require("../queries/schoolQueries"); // Import from school queries
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
  const { school_name, city, date, time, user_id, user_type } = req.body;

  try {
    const { id: tour_id, guide_count } = await fetchTourDetails(
      school_name,
      city,
      date,
      time
    );

    if (await isUserAssignedToTour(tour_id, user_id)) {
      return res.status(400).json({
        success: false,
        message: "Guide is already assigned to this tour!",
      });
    }

    if (await hasSchedulingConflict(user_id, date, time)) {
      return res.status(400).json({
        success: false,
        message: "Guide is already assigned to another tour at the same time!",
      });
    }

    const { assigned_guides, guide_names } = await fetchAssignmentCounts(tour_id);
    validateQuota(assigned_guides, 1, guide_count, "guide");

    await query("INSERT INTO tour_guide (tour_id, guide_id) VALUES ($1, $2)", [
      tour_id,
      user_id,
    ]);
    const guide = await query(
      "SELECT first_name, last_name FROM users WHERE id = $1",
      [user_id]
    );
    const guideName = guide.rows[0].first_name + " " + guide.rows[0].last_name;

    const updatedGuideNames = guide_names ? `${guide_names}, ${guideName}` : guideName;

    // Emit the WebSocket event with updated guide names and count
    const io = req.app.get("io");
    io.emit("guideAssigned", {
      tourId: tour_id,
      guide_names: updatedGuideNames, 
      assignedGuides: assigned_guides + 1,  
    });

    // Respond to the client with success
    res.status(200).json({
      success: true,
      message: "Guide successfully assigned to the tour!",
    });
  } catch (error) {
    console.error("Error assigning guide:", error.message || error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.assignCandidateGuidesToTour = async (req, res) => {
  const { school_name, city, date, time, user_ids } = req.body;
  console.log("User IDs received:", user_ids); // Log incoming user IDs

  try {
    const { id: tour_id, guide_count } = await fetchTourDetails(school_name, city, date, time);
    const { assigned_candidates, candidate_names } = await fetchAssignmentCounts(tour_id);
    console.log("Fetched assigned candidates before insert:", assigned_candidates);
    
    const newAssignments = [];
    for (const user_id of user_ids) {
      if (
        !(await isUserAssignedToTour(tour_id, user_id)) &&
        !(await hasSchedulingConflict(user_id, date, time))
      ) {
        newAssignments.push(user_id);
      }
    }

    console.log("Newassignment length: " + newAssignments.length);

    // Validate the total candidate quota
    validateQuota(assigned_candidates, newAssignments.length, guide_count, "candidate");

    if (newAssignments.length > 0) {
      // Prepare values for bulk insertion
      const bulkInsertValues = newAssignments
        .map((user_id) => `(${tour_id}, ${user_id})`)
        .join(", ");
      await query(`INSERT INTO tour_guide (tour_id, guide_id) VALUES ${bulkInsertValues}`);
    }

    const candidateNames = await Promise.all(
      newAssignments.map(async (user_id) => {
        const user = await query(
          "SELECT first_name, last_name FROM users WHERE id = $1",
          [user_id]
        );
        return `${user.rows[0].first_name} ${user.rows[0].last_name}`;
      })
    );

    // Update the list of candidate names (comma-separated)
    const updatedCandidateNames = candidate_names
      ? `${candidate_names}, ${candidateNames.join(", ")}`
      : candidateNames.join(", ");

    const updatedCount = assigned_candidates + newAssignments.length;
    const io = req.app.get("io");
    io.emit("candidateAssigned", {
      tourId: tour_id,
      candidate_names: updatedCandidateNames,
      assignedCandidates: updatedCount,
    });


    res.status(200).json({
      success: true,
      message: "Candidate guide(s) successfully assigned to the tour!",
      assignedUsers: newAssignments,
    });
  } catch (error) {
    console.error("Error assigning candidate guides:", error.message || error);
    res.status(500).json({ success: false, message: error.message });
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

exports.getCandidateGuides = async (req, res) => {
  try {
    const candidates = await fetchCandidateGuides();
    const formattedCandidates = candidates.map(candidate => ({
      id: candidate.id,
      name: candidate.name,
    }));
    res.status(200).json(formattedCandidates);
  } catch (error) {
    console.error("Error fetching candidate guides:", error.message || error);
    res.status(500).json({ message: "Failed to fetch candidate guides" });
  }
};

