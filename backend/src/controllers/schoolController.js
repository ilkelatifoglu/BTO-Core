// src/controllers/schoolController.js

const {
  getAllSchools,
  getSchoolById,
  insertSchool,
  updateSchool,
  deleteSchool,
  getSchoolId,
} = require("../queries/schoolQueries");

// Add a new school
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
    lgs_score,
  } = req.body;

  try {
    // Check for duplicate schools based on school name, city, and academic year start
    const existingId = await getSchoolId(school_name, city, academic_year_start);

    if (existingId) {
      return res.status(400).json({ message: "School already exists for the specified academic year" });
    }

    // Insert the school into the database
    const schoolId = await insertSchool(req.body);

    res.status(201).json({
      success: true,
      message: "School added successfully",
      schoolId,
    });
  } catch (error) {
    console.error("Error adding school:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Retrieve all schools
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

// Retrieve a single school by ID
exports.getSchoolById = async (req, res) => {
  const { id } = req.params;

  try {
    const school = await getSchoolById(id);

    if (!school) {
      return res.status(404).json({ success: false, message: "School not found" });
    }

    res.status(200).json({
      success: true,
      data: school,
    });
  } catch (error) {
    console.error("Error retrieving school:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update a school by ID
exports.updateSchool = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    // Check if the school exists
    const existingSchool = await getSchoolById(id);

    if (!existingSchool) {
      return res.status(404).json({ success: false, message: "School not found" });
    }

    // Update the school in the database
    const updatedSchool = await updateSchool(id, updateData);

    res.status(200).json({
      success: true,
      message: "School updated successfully",
      data: updatedSchool,
    });
  } catch (error) {
    console.error("Error updating school:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete a school by ID
exports.deleteSchool = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the school exists
    const existingSchool = await getSchoolById(id);

    if (!existingSchool) {
      return res.status(404).json({ success: false, message: "School not found" });
    }

    // Delete the school from the database
    await deleteSchool(id);

    res.status(200).json({
      success: true,
      message: "School deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting school:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
