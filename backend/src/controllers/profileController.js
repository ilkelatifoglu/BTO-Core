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

// POST /upload-profile-picture/:id
exports.uploadProfilePicture = async (req, res) => {
    const userIdFromParam = parseInt(req.params.id, 10);
    const authenticatedUserId = req.user.userId;

    // Check if the authenticated user is uploading their own profile picture or has admin privileges
    if (userIdFromParam !== authenticatedUserId && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: You can only upload your own profile picture.' });
    }

    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    const mimeType = file.mimetype; // e.g., image/jpeg, image/png
    const base64Data = file.buffer.toString('base64');

    try {
        // Check if the user already has a profile picture
        const existing = await db.query(
            `SELECT id FROM profile_picture WHERE user_id = $1`,
            [userIdFromParam]
        );

        if (existing.rows.length > 0) {
            // Update existing profile picture
            await db.query(
                `
                UPDATE profile_picture
                SET profile_picture_data = $1, profile_picture_mime_type = $2
                WHERE user_id = $3
                `,
                [base64Data, mimeType, userIdFromParam]
            );
        } else {
            // Insert new profile picture
            await db.query(
                `
                INSERT INTO profile_picture (user_id, profile_picture_data, profile_picture_mime_type)
                VALUES ($1, $2, $3)
                `,
                [userIdFromParam, base64Data, mimeType]
            );
        }

        return res.status(200).json({ message: 'Profile picture uploaded successfully.' });
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        return res.status(500).json({ error: 'Failed to upload profile picture.' });
    }
};

// GET /get-profile-picture/:id
exports.getProfilePicture = async (req, res) => {
    const userIdFromParam = parseInt(req.params.id, 10);
    const authenticatedUserId = req.user.userId;

    // Check if the authenticated user is accessing their own profile picture or has admin privileges
    if (userIdFromParam !== authenticatedUserId && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: You can only access your own profile picture.' });
    }

    try {
        const result = await db.query(
            `
            SELECT 
                profile_picture_data AS "profile_picture_data",
                profile_picture_mime_type AS "profile_picture_mime_type"
            FROM profile_picture
            WHERE user_id = $1
            `,
            [userIdFromParam]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Profile picture not found.' });
        }

        const profilePicture = result.rows[0];

        return res.status(200).json(profilePicture);
    } catch (error) {
        console.error('Error fetching profile picture:', error);
        return res.status(500).json({ error: 'Failed to fetch profile picture.' });
    }
};