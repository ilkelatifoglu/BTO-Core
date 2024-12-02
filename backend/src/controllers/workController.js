const db = require("../config/database");

const getAllWorkEntries = async (req, res) => {
    try {
        const query = `
            SELECT 
                u.first_name,
                u.last_name,
                'Tour' AS work_type,
                t.id AS work_id,
                t.date,
                t.day,
                t.time,
                t.workload,
                tg.is_approved
            FROM tours t
            JOIN tour_guide tg ON t.id = tg.tour_id
            JOIN users u ON tg.guide_id = u.id

            UNION ALL

            SELECT 
                u.first_name,
                u.last_name,
                ow.type AS work_type,
                ow.id AS work_id,
                ow.date,
                ow.day,
                ow.time,
                ow.workload,
                ow.is_approved
            FROM other_works ow
            JOIN users u ON ow.user_id = u.id

            ORDER BY date DESC, work_type;
        `;
        const result = await db.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching work data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
const getUserWorkEntries = async (req, res) => {
    const user_id = req.query.user_id;
    try {
        const query = `
            SELECT 
                u.first_name,
                u.last_name,
                'Tour' AS work_type,
                t.id AS work_id,
                t.date,
                t.day,
                t.time,
                t.workload,
                tg.is_approved
            FROM tours t
            JOIN tour_guide tg ON t.id = tg.tour_id
            JOIN users u ON tg.guide_id = u.id
            WHERE tg.guide_id = $1

            UNION ALL

            SELECT 
                u.first_name,
                u.last_name,
                ow.type AS work_type,
                ow.id AS work_id,
                ow.date,
                ow.day,
                ow.time,
                ow.workload,
                ow.is_approved
            FROM other_works ow
            JOIN users u ON ow.user_id = u.id
            WHERE ow.user_id = $1

            ORDER BY date DESC, work_type;
        `;
        const result = await db.query(query, [user_id]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching work data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getAllNonApprovedWorkEntries = async (req, res) => {
    try {
        const query = `
            SELECT 
                u.first_name,
                u.last_name,
                'Tour' AS work_type,
                t.id AS work_id,
                t.date,
                t.day,
                t.time,
                t.workload,
                tg.is_approved
            FROM tours t
            JOIN tour_guide tg ON t.id = tg.tour_id
            JOIN users u ON tg.guide_id = u.id
            WHERE tg.is_approved = false

            UNION ALL

            SELECT 
                u.first_name,
                u.last_name,
                ow.type AS work_type,
                ow.id AS work_id,
                ow.date,
                ow.day,
                ow.time,
                ow.workload,
                ow.is_approved
            FROM other_works ow
            JOIN users u ON ow.user_id = u.id
            WHERE ow.is_approved = false

            ORDER BY date DESC, work_type;
        `;

        const result = await db.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching non-approved work data:", error.message || error);
        res.status(500).json({ error: "Failed to fetch non-approved work entries. Please try again later." });
    }
};

/*const getWorkEntryById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query("SELECT * FROM work WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Work entry not found" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching work entry:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};*/
const addWork = async (req, res) => {
    const { type, date, day, time, user_id, workload, is_approved = false } = req.body;

    // Check if all required fields are provided
    if (!type || !date || !day || !time || !user_id || !workload) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Insert into the other_works table
        const result = await db.query(
            "INSERT INTO other_works (type, date, day, time, workload, is_approved, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [type, date, day, time, workload, is_approved, user_id]
        );

        // Return the added work entry
        res.status(201).json({
            success: true,
            message: "Work entry added successfully",
            work: result.rows[0],
        });
    } catch (error) {
        console.error("Error adding work entry:", error);
        res.status(500).json({ message: "Server error" });
    }
};
// Backend: Delete a work entry by ID
const deleteWorkEntry = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query("DELETE FROM other_works WHERE id = $1 RETURNING *", [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Work entry not found" });
        }

        res.status(200).json({ success: true, message: "Work entry deleted successfully" });
    } catch (error) {
        console.error("Error deleting work entry:", error);
        res.status(500).json({ message: "Server error" });
    }
};
const editWorkEntry = async (req, res) => {
    const { id } = req.params; // Get the work ID from the URL parameters
    const { type, date, day, time, workload, is_approved } = req.body; // Get the updated fields from the request body

    // Validate input
    if (!id || !type || !date || !day || !time || !workload) {
        return res.status(400).json({ error: "All fields are required for editing the work entry." });
    }

    try {
        // Update the work entry in the `other_works` table
        const query = `
            UPDATE other_works
            SET type = $1, date = $2, day = $3, time = $4, workload = $5, is_approved = $6
            WHERE id = $7
            RETURNING *;
        `;
        const values = [type, date, day, time, workload, is_approved, id];
        const result = await db.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Work entry not found." });
        }

        res.status(200).json({
            success: true,
            message: "Work entry updated successfully.",
            work: result.rows[0], // Return the updated work entry
        });
    } catch (error) {
        console.error("Error updating work entry:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
async function updateWork(req, res) {
    const { work_id } = req.params; // Extract work ID from the route parameter
    const { is_approved, work_type } = req.body; // Extract is_approved and work_type from request body

    try {
        if (work_type === "Tour") {
            // Update the tour_guide table for tours
            const [tour] = await db.query(
                "SELECT tour_id, guide_id FROM tour_guide WHERE tour_id = ?",
                [work_id]
            );

            if (!tour) {
                return res.status(404).json({ success: false, message: "Tour entry not found." });
            }

            await db.query(
                "UPDATE tour_guide SET is_approved = ? WHERE tour_id = ? AND guide_id = ?",
                [is_approved, tour.tour_id, tour.guide_id]
            );
            return res.status(200).json({ success: true, message: "Tour entry updated successfully." });
        } else if (work_type === "Other") {
            // Update the other_works table for other work types
            const [otherWork] = await db.query(
                "SELECT work_id FROM other_works WHERE id = ?",
                [work_id]
            );

            if (!otherWork) {
                return res.status(404).json({ success: false, message: "Other work entry not found." });
            }

            await db.query(
                "UPDATE other_works SET is_approved = ? WHERE work_id = ?",
                [is_approved, work_id]
            );
            return res.status(200).json({ success: true, message: "Other work entry updated successfully." });
        } else {
            return res.status(400).json({ success: false, message: "Invalid work type." });
        }
    } catch (error) {
        console.error("Error in updateWork:", error);
        res.status(500).json({ success: false, message: "Failed to update work entry.", error: error.message });
    }
}
module.exports = {
    getAllWorkEntries,
    getUserWorkEntries,
    getAllNonApprovedWorkEntries,
    /*updateWorkEntry,
    getWorkEntryById,*/
    addWork,
    deleteWorkEntry,
    editWorkEntry,
    updateWork
};
