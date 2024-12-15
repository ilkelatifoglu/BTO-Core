import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

/**
 * Fetch user profile data.
 *
 * @param {string} token - Authentication token for the user.
 * @returns {Promise<Object>} - The user's profile data.
 */
export const fetchProfileData = async (token) => {
    try {
        const token2 = localStorage.getItem('token') || localStorage.getItem('tempToken');
        const response = await axios.get(`${API_BASE_URL}/profile/getProfile`, {
            headers: { 'Authorization': `Bearer ${token2}` },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching profile data:', error);
        throw new Error('Failed to fetch profile data.');
    }
};

/**
 * Update user profile data.
 *
 * @param {string} token - Authentication token for the user.
 * @param {Object} updatedData - Data to update (phone, iban, department).
 * @returns {Promise<void>}
 */
export const updateProfileData = async (token, updatedData) => {
    try {
        await axios.put(`${API_BASE_URL}/profile/updateProfile`,
            updatedData,
            {
                headers: { 'Authorization': `Bearer ${token}` },
            }
        );
    } catch (error) {
        console.error('Error updating profile data:', error);
        throw new Error('Failed to update profile data.');
    }
};

/**
 * Upload user profile picture.
 *
 * @param {string} token - Authentication token for the user.
 * @param {File} photo - The photo file to upload.
 * @returns {Promise<Object>} - Response data after uploading the photo.
 */
export const uploadProfilePhoto = async (token, photo) => {
    try {
        const formData = new FormData();
        formData.append('photo', photo);

        const response = await axios.post(`${API_BASE_URL}/profile/upload-photo`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error uploading profile photo:', error);
        throw new Error('Failed to upload profile photo.');
    }
};

// Default export to group all functions together
const profileService = {
    fetchProfileData,
    updateProfileData,
    uploadProfilePhoto,
};

export default profileService;
