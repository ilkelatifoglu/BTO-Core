const db = require('../config/database');

exports.getProfile = async (req, res) => {
    const userId = req.user.userId;

    try {
        const result = await db.query(
            `
            SELECT 
                first_name AS "firstName", 
                last_name AS "lastName", 
                email, 
                phone_number, 
                iban, 
                department
            FROM users
            WHERE id = $1
            `,
            [userId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching profile:', error);
        return res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

exports.updateProfile = async (req, res) => {
    const userId = req.user.userId;
    const { phone_number, iban, department } = req.body;

    try {
        await db.query(
            `
            UPDATE users 
            SET phone_number = $1, iban = $2, department = $3
            WHERE id = $4
            `,
            [phone_number, iban, department, userId]
        );
        return res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ error: 'Failed to update profile' });
    }
};
