// src/routes/workRoutes.js
const express = require("express");
const { getAllWorkEntries, getAllNonApprovedWorkEntries, updateWork, saveWorkload, addWork, getUserWorkEntries, deleteWorkEntry, editWorkEntry } = require("../controllers/workController");
const router = express.Router();

// Define routes for work entries
router.get("/", getAllWorkEntries);      // GET /work - Get all work entries
router.get("/non-approved", getAllNonApprovedWorkEntries);
//router.put('/approve/:id', updateWorkEntry); // Update a specific work entry by ID
//router.get("/:id", getWorkEntryById);    // GET /work/:id - Get a single work entry by ID
router.post("/add", addWork)
router.get("/user-work", getUserWorkEntries);
router.delete("/delete/:id", deleteWorkEntry);
router.put("/edit/:id", editWorkEntry); // Route to edit a work entry
router.put("/update/:work_id", updateWork);
router.put("/:workId/workload", saveWorkload);
module.exports = router;