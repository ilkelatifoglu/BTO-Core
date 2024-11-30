const pool = require('../config/database'); // Ensure this points to your DB connection

exports.removeUser = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (user.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user_id = user.rows[0].user_id;

        // Remove user from related tables
        await pool.query("DELETE FROM advisors WHERE user_id = $1", [user_id]);
        await pool.query("DELETE FROM candidate_guides WHERE user_id = $1", [user_id]);
        await pool.query("DELETE FROM users WHERE email = $1", [email]);

        res.status(200).json({ message: "User removed successfully" });
    } catch (error) {
        console.error("Error removing user:", error);
        res.status(500).json({ error: "An error occurred while removing the user" });
    }
};


exports.changeUserRole = async (req, res) => {
    const { email, new_role, days } = req.body;

    try {
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (user.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user_id = user.rows[0].user_id;
        const current_role = user.rows[0].role;

        const roleToUserType = {
            "candidate guide": 1,
            guide: 2,
            advisor: 3,
        };

        const allowedRoles = Object.keys(roleToUserType);
        if (!allowedRoles.includes(new_role)) {
            return res.status(400).json({ message: "Invalid role specified" });
        }

        // Update role and user_type in users table
        await pool.query(
            "UPDATE users SET role = $1, user_type = $2 WHERE user_id = $3",
            [new_role, roleToUserType[new_role], user_id]
        );

        // Remove user from old role-specific tables
        if (current_role === "advisor") {
            await pool.query("DELETE FROM advisors WHERE user_id = $1", [user_id]);
        } else if (current_role === "candidate guide") {
            await pool.query("DELETE FROM candidate_guides WHERE user_id = $1", [user_id]);
        }

        // Add user to the new role-specific table
        if (new_role === "advisor") {
            if (!days) {
                return res.status(400).json({ message: "Days are required for advisor role" });
            }
            await pool.query(
                `INSERT INTO advisors (user_id, day, full_name, candidate_guides_count, created_at, updated_at)
                 VALUES ($1, $2, $3, 0, NOW(), NOW())
                 ON CONFLICT (user_id) DO UPDATE 
                 SET day = EXCLUDED.day, 
                     full_name = EXCLUDED.full_name,
                     updated_at = NOW()`,
                [user_id, days, `${user.rows[0].first_name} ${user.rows[0].last_name}`]
            );
        } /*else if (new_role === "candidate guide") {
            const advisor = await pool.query("SELECT user_id FROM advisors WHERE day = $1 LIMIT 1", [days]);

            if (advisor.rows.length === 0) {
                return res.status(404).json({ message: "No advisor found for the specified days" });
            }

            await pool.query(
                `INSERT INTO candidate_guides (user_id, advisor_user_id, full_name, department, created_at, updated_at)
                 VALUES ($1, $2, $3, $4, NOW(), NOW())
                 ON CONFLICT (user_id) DO UPDATE 
                 SET advisor_user_id = EXCLUDED.advisor_user_id,
                     updated_at = NOW()`,
                [user_id, advisor.rows[0].user_id, `${user.rows[0].first_name} ${user.rows[0].last_name}`, user.rows[0].department]
            );
        }*/
        // Remove user from advisors and candidate_guides if switching to guide
        if (new_role === "guide") {
            await pool.query("DELETE FROM advisors WHERE user_id = $1", [user_id]);
            await pool.query("DELETE FROM candidate_guides WHERE user_id = $1", [user_id]);
        }

        res.status(200).json({ message: "User role updated successfully in all relevant tables" });
    } catch (error) {
        console.error("Error updating user role:", error);
        res.status(500).json({ error: "An error occurred while updating the user role" });
    }
};



exports.updateCrewNo = async (req, res) => {
    const { email, crew_no } = req.body;

    try {
        if (!crew_no) {
            return res.status(400).json({ message: "Crew number is required" });
        }

        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (user.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user_id = user.rows[0].user_id;

        await pool.query("UPDATE users SET crew_no = $1 WHERE user_id = $2", [crew_no, user_id]);

        res.status(200).json({ message: "Crew number updated successfully" });
    } catch (error) {
        console.error("Error updating crew number:", error);
        res.status(500).json({ error: "An error occurred while updating the crew number" });
    }
};
