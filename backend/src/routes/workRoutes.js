// src/routes/workRoutes.js
const express = require("express");
const {
    getAllWorkEntries,
    getAllNonApprovedWorkEntries,
    updateWork,
    saveWorkload,
    addWork,
    getUserWorkEntries,
    deleteWorkEntry,
    editWorkEntry } = require("../controllers/workController");
const router = express.Router();

const authenticateToken = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole");

// Define routes for work entries
router.get("/", authenticateToken, authorizeRole(2, 3, 4), getAllWorkEntries);      // GET /work - Get all work entries
router.get("/non-approved", authenticateToken, authorizeRole(2, 3, 4), getAllNonApprovedWorkEntries);
router.post("/add", authenticateToken, authorizeRole(2, 3, 4), addWork)
router.get("/user-work", authenticateToken, authorizeRole(2, 3, 4), getUserWorkEntries);
router.delete("/delete/:id", authenticateToken, authorizeRole(2, 3, 4), deleteWorkEntry);
router.put("/edit/:id", authenticateToken, authorizeRole(2, 3, 4), editWorkEntry); // Route to edit a work entry
router.put("/update/:id", authenticateToken, authorizeRole(2, 3, 4), updateWork);
router.put("/:workId/workload", authenticateToken, authorizeRole(2, 3, 4), saveWorkload);

//router.put('/approve/:id', updateWorkEntry); // Update a specific work entry by ID
//router.get("/:id", getWorkEntryById);    // GET /work/:id - Get a single work entry by ID

module.exports = router;