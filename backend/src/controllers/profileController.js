const db = require('../config/database');

exports.getProfile = async (req, res) => {
    console.log('req.user in getProfile:', req.user); 
    const userId = req.user.userId;

    try {
        const result = await db.query(
            `
            SELECT 
                first_name AS "firstName", 
                last_name AS "lastName", 
                email, 
                phone, 
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
    console.log('req.user in updateProfile:', req.user); 
    const userId = req.user.userId;
    const { phone, iban, department } = req.body;

    try {
        await db.query(
            `
            UPDATE users 
            SET phone = $1, iban = $2, department = $3
            WHERE id = $4
            `,
            [phone, iban, department, userId]
        );
        return res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ error: 'Failed to update profile' });
    }
};





















/*
// Controller to handle profile photo upload
exports.uploadProfilePhoto = async (req, res) => {
    try {
        const userId = req.user.id; // Use user ID from the token
        const photoUrl = `/uploads/${req.file.filename}`;

        // Insert or update the photo URL in the profile_photos table
        const query = `
            INSERT INTO profile_photos (user_id, photo_url)
            VALUES ($1, $2)
            ON CONFLICT (user_id)
            DO UPDATE SET photo_url = EXCLUDED.photo_url, upload_at = NOW()
            RETURNING id, user_id, photo_url, upload_at;
        `;
        const values = [userId, photoUrl];
        const result = await db.query(query, values);

        const serverBaseURL = 'http://localhost:3001'; // Adjust base URL as needed
        const uploadedPhoto = result.rows[0];
        uploadedPhoto.photo_url = `${serverBaseURL}${uploadedPhoto.photo_url}`;

        return res.status(200).json({
            message: 'Profile photo uploaded successfully',
            photo: uploadedPhoto,
        });
    } catch (error) {
        console.error('Error uploading profile photo:', error);
        return res.status(500).json({ error: 'Failed to upload profile photo' });
    }
};

exports.fetchUserProfile = async (req, res) => {
    const userId = req.user.id; // Get user ID from the token

    try {
        // Fetch user data from the users table
        const userQuery = `
            SELECT 
                first_name AS firstName,
                last_name AS lastName,
                email,
                phone_number AS phone,
                iban,
                CASE 
                    WHEN role = 1 THEN 'Candidate Guide'
                    WHEN role = 2 THEN 'Guide'
                    WHEN role = 3 THEN 'Advisor'
                    WHEN role = 4 THEN 'Coordinator'
                    ELSE 'Unknown'
                END AS userType
            FROM users
            WHERE id = $1;
        `;
        const userResult = await db.query(userQuery, [userId]);

        if (userResult.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userProfile = userResult.rows[0];

        // Fetch the latest photo for this user
        const photoQuery = `
            SELECT photo_url
            FROM profile_photos
            WHERE user_id = $1
            ORDER BY upload_at DESC
            LIMIT 1;
        `;
        const photoResult = await db.query(photoQuery, [userId]);

        const serverBaseURL = 'http://localhost:3001';
        userProfile.photo_url = photoResult.rowCount > 0
            ? `${serverBaseURL}${photoResult.rows[0].photo_url}`
            : null;

        return res.status(200).json(userProfile);
    } catch (error) {
        console.error('Error fetching user profile:', error.message);
        return res.status(500).json({ error: 'Failed to fetch user profile' });
    }
};
*/