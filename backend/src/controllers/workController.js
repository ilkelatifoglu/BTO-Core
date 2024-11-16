const db = require("../config/database");

const getAllWorkEntries = async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM work");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching work data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getAllNonApprovedWorkEntries = async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM work WHERE is_approved = false");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching work data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
const updateWorkEntry = async (req, res) => {
    const { id } = req.params;
    const { is_approved } = req.body;

    if (is_approved === undefined) {
        return res.status(400).json({ error: 'Missing required field: is_approved' });
    }

    try {
        const query = 'UPDATE work SET is_approved = $1 WHERE id = $2 RETURNING *';
        const values = [is_approved, id];

        const result = await db.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Work entry not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(`Error updating work entry with id ${id}:`, error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const getWorkEntryById = async (req, res) => {
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
};
const addWork = async (req, res) => {
    const { type, date, day, time, guide_name, workload, is_approved = false } = req.body;

    if (!type || !date || !day || !time || !guide_name || !workload) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const result = await db.query( // Changed query to db.query
            "INSERT INTO work (type, date, day, time, guide_name, workload, is_approved) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [type, date, day, time, guide_name, workload, is_approved]
        );

        res.status(201).json({
            success: true,
            message: "Work entry added successfully",
            work: result.rows[0], // Return the added work entry
        });
    } catch (error) {
        console.error("Error adding work entry:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getAllWorkEntries,
    getAllNonApprovedWorkEntries,
    updateWorkEntry,
    getWorkEntryById,
    addWork
};
