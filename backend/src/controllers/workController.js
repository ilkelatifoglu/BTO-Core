const db = require("../config/database");

const getAllWorkEntries = async (req, res) => {
    try {
        const query = `
            SELECT 
                u.id,
                u.first_name,
                u.last_name,
                u.iban,
                'Tour' AS work_type,
                t.id AS work_id,
                t.date,
                t.day,
                t.time,
                t.workload,
                tg.is_approved,
                s.school_name,
                s.city
            FROM tours t
            JOIN tour_guide tg ON t.id = tg.tour_id
            JOIN users u ON tg.guide_id = u.id
            LEFT JOIN schools s ON t.school_id = s.id
            WHERE t.tour_status = 'DONE' AND t.workload IS NOT NULL

            UNION ALL

            SELECT 
                u.id,
                u.first_name,
                u.last_name,
                u.iban,
                ow.type AS work_type,
                ow.id AS work_id,
                ow.date,
                ow.day,
                ow.time,
                ow.workload,
                ow.is_approved,
                NULL AS school_name,
                NULL AS city
            FROM other_works ow
            JOIN users u ON ow.user_id = u.id

            UNION ALL

            SELECT
                u.id,
                u.first_name,
                u.last_name,
                u.iban,
                'Individual Tour' AS work_type,
                it.id AS work_id,
                it.date,
                it.day,
                it.time,
                it.workload,
                it.is_approved,
                NULL AS school_name,
                NULL AS city
            FROM individual_tours it
            JOIN users u ON it.guide_id = u.id
            WHERE it.tour_status = 'DONE' AND it.workload IS NOT NULL

            UNION ALL

            SELECT
                u.id,
                u.first_name,
                u.last_name,
                u.iban,
                'Fair' AS work_type,
                f.id AS work_id,
                f.date,
                TO_CHAR(f.date, 'Day') AS day,
                '10:00' AS time,
                f.workload,
                fg.is_approved,
                f.organization_name AS school_name,
                f.city AS city
            FROM fair_guide fg
            JOIN fairs f ON fg.fair_id = f.id
            JOIN users u ON fg.guide_id = u.id
            WHERE f.status = 'DONE' AND f.workload IS NOT NULL

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
                tg.is_approved,
                s.school_name,
                s.city
            FROM tours t
            JOIN tour_guide tg ON t.id = tg.tour_id
            JOIN users u ON tg.guide_id = u.id
            LEFT JOIN schools s ON t.school_id = s.id
            WHERE tg.guide_id = $1 AND t.tour_status = 'DONE'

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
                ow.is_approved,
                NULL AS school_name,
                NULL AS city
            FROM other_works ow
            JOIN users u ON ow.user_id = u.id
            WHERE ow.user_id = $1

            UNION ALL

            SELECT
                u.first_name,
                u.last_name,
                'Individual Tour' AS work_type,
                it.id AS work_id,
                it.date,
                it.day,
                it.time,
                it.workload,
                it.is_approved,
                NULL AS school_name,
                NULL AS city
            FROM individual_tours it
            JOIN users u ON it.guide_id = u.id
            WHERE it.guide_id = $1 AND it.tour_status = 'DONE'

            UNION ALL

            SELECT
                u.first_name,
                u.last_name,
                'Fair' AS work_type,
                f.id AS work_id,
                f.date,
                TO_CHAR(f.date, 'Day') AS day, -- Extracts the day name from the date
                '10:00' AS time,
                f.workload,
                fg.is_approved,
                f.organization_name AS school_name,
                f.city AS city
            FROM fair_guide fg
            JOIN fairs f ON fg.fair_id = f.id
            JOIN users u ON fg.guide_id = u.id
            WHERE fg.guide_id = $1 AND f.status = 'DONE'

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
            WHERE tg.is_approved = false and t.tour_status = 'DONE'

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
    const { work_type, date, day, time, workload, is_approved } = req.body; // Get the updated fields from the request body
    //console.log(work_type, id);
    // Validate input
    if (!id || !work_type || !date || !day || !time || !workload) {
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
        const values = [work_type, date, day, time, workload, is_approved, id];
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
const updateWork = async (req, res) => {
    const { id } = req.params;
    const { is_approved, work_type, user_id } = req.body;

    // Convert id to integer
    const workId = parseInt(id, 10);

    if (isNaN(workId) || typeof is_approved === "undefined" || !work_type || !user_id) {
        console.error("Invalid input data:", { id, is_approved, work_type, user_id });
        return res.status(400).json({ success: false, message: "Invalid input data." });
    }

    try {
        if (work_type === "Tour") {
            await db.query(
                'UPDATE "tour_guide" SET "is_approved" = $1 WHERE "tour_id" = $2 AND "guide_id" = $3',
                [is_approved, workId, user_id]
            );

            return res.status(200).json({ success: true, message: "Tour entry updated successfully." });
        }
        else if (work_type === "Individual Tour") {
            await db.query(
                'UPDATE "individual_tours" SET "is_approved" = $1 WHERE "id" = $2 AND "guide_id" = $3',
                [is_approved, workId, user_id]
            );

            return res.status(200).json({ success: true, message: "Individual Tour entry updated successfully." });
        }
        else if (work_type === "Fair") {
            await db.query(
                'UPDATE "fair_guide" SET "is_approved" = $1 WHERE "fair_id" = $2 AND "guide_id" = $3',
                [is_approved, workId, user_id]
            );

            return res.status(200).json({ success: true, message: "Fair entry updated successfully." });
        }
        else {
            await db.query(
                'UPDATE "other_works" SET "is_approved" = $1 WHERE "id" = $2 AND "user_id" = $3',
                [is_approved, workId, user_id]
            );

            return res.status(200).json({ success: true, message: "Other work entry updated successfully." });
        }
    } catch (error) {
        console.error("Error in updateWork:", error);
        res.status(500).json({ success: false, message: "Failed to update work entry.", error: error.message });
    }
};


const saveWorkload = async (req, res) => {
    const { workId, workType } = req.params; // Extract work ID and type from route parameters
    const { workload } = req.body; // Extract workload from request body
    //console.log(workId, workType, workload);
    // Validate workload
    if (workload == null || workload <= 0) {
        return res.status(400).json({ success: false, message: "Invalid workload value." });
    }

    // Validate work type
    const validWorkTypes = ["tours", "fairs", "individual_tours"];
    if (!validWorkTypes.includes(workType)) {
        return res.status(400).json({ success: false, message: "Invalid work type." });
    }

    try {
        // Dynamically set the table name based on work type
        const query = `UPDATE "${workType}" SET "workload" = $1 WHERE "id" = $2`;
        const values = [workload, workId];

        // Execute the query
        const result = await db.query(query, values);

        // Check if any rows were affected
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Work entry not found." });
        }

        res.status(200).json({ success: true, message: `Workload updated successfully for ${workType}.` });
    } catch (error) {
        console.error("Error updating workload:", error);
        res.status(500).json({ success: false, message: "Failed to update workload.", error: error.message });
    }
};


module.exports = {
    getAllWorkEntries,
    getUserWorkEntries,
    getAllNonApprovedWorkEntries,
    /*updateWorkEntry,
    getWorkEntryById,*/
    addWork,
    deleteWorkEntry,
    editWorkEntry,
    updateWork,
    saveWorkload
};
