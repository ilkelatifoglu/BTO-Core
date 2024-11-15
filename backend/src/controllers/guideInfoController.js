const db = require('../config/database');

exports.getGuideInfo = async (req, res) => {
    const { name, role, department, sort_by = 'first_name', order = 'asc', page = 1, limit = 10 } = req.query;

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Updated query to include email
    let query = `
        SELECT u.id, u.first_name, u.last_name, u.email, u.role, u.department,
               u.phone_number, u.iban, s.schedule_file
        FROM users u
        LEFT JOIN schedules s ON u.id = s.user_id
        WHERE u.role IN ('guide', 'candidate guide', 'advisor', 'coordinator')
    `;

    // Apply filters if provided
    if (name) {
        query += ` AND (u.first_name ILIKE '%${name}%' OR u.last_name ILIKE '%${name}%')`;
    }

    if (role) {
        query += ` AND u.role = '${role}'`;
    }

    if (department) {
        query += ` AND u.department = '${department}'`;
    }

    // Apply sorting
    query += ` ORDER BY ${sort_by} ${order.toUpperCase()}`;

    // Apply pagination
    query += ` LIMIT ${limit} OFFSET ${offset}`;

    try {
        const result = await db.query(query); // Execute query
        res.status(200).json(result.rows);    // Return rows as JSON
    } catch (err) {
        res.status(500).json({ error: err.message }); // Handle errors
    }
};
