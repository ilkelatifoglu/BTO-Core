const db = require('../config/database');

exports.getGuideInfo = async (req, res) => {
    try {
        const { name, role, department, sort_by = 'first_name', order = 'asc', page = 1, limit = 10 } = req.query;

        // Calculate offset for pagination
        const offset = (page - 1) * limit;

        // Base query to fetch guide info
        let query = `
            SELECT 
                u.first_name, 
                u.last_name, 
                u.email, 
                u.role, 
                u.department, 
                u.phone_number, 
                s.schedule_file
            FROM 
                users u
            LEFT JOIN 
                schedules s 
            ON 
                u.id = s.user_id
            WHERE 
                u.role IN ('guide', 'advisor', 'coordinator')
        `;


        // Initialize query parameters array
        const queryParams = [];
        let paramIndex = 1; // Keep track of parameter index for placeholders ($1, $2, etc.)

        // Apply filters if provided
        if (name) {
            query += ` AND (u.first_name ILIKE $${paramIndex} OR u.last_name ILIKE $${paramIndex})`;
            queryParams.push(`%${name}%`);
            paramIndex++;
        }

        if (role) {
            query += ` AND u.role ILIKE $${paramIndex}`;
            queryParams.push(`%${role}%`);
            paramIndex++;
        }

        if (department) {
            query += ` AND u.department ILIKE $${paramIndex}`;
            queryParams.push(`%${department}%`);
            paramIndex++;
        }

        // Apply sorting
        query += ` ORDER BY ${sort_by} ${order.toUpperCase()}`;

        // Apply pagination
        query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        queryParams.push(limit, offset);

        // Execute the query
        const result = await db.query(query, queryParams);

         // Map the result to add a URL for the schedule
         const formattedResult = result.rows.map(row => {
            if (row.schedule_file) {
                row.schedule_url = `http://localhost:3001/schedules/${row.schedule_file}`;
            } else {
                row.schedule_url = null;
            }
            return row;
        });
        
        // Send the result as JSON
        return res.status(200).json(formattedResult);
    } catch (err) {
        // Log the error for debugging
        console.error('Error in getGuideInfo:', err.message);

        // Send a generic error response
        return res.status(500).json({ error: 'An error occurred while fetching guide information.' });
    }
};
