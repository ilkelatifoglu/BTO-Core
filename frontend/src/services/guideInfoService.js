import axios from 'axios';

/**
 * Fetch guide information with optional filters.
 *
 * @param {Object} filters - Filters for fetching guide info (e.g., name, role, department).
 * @returns {Promise<Array>} - Returns an array of guide data.
 */
export const fetchGuideInfo = async (filters = {}) => {
    try {
        // Make a GET request to the backend server
        const response = await axios.get('http://localhost:3001/guideInfo', {
            params: filters, // Send filters as query parameters
        });

        // Return the data from the response
        return response.data;
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error fetching guide information:', error);

        // Return an empty array if an error occurs
        return [];
    }
};

/**
 * Upload a user's schedule file to the server.
 *
 * @param {Object} data - Form data containing the schedule file and user ID.
 * @returns {Promise<Object>} - Returns the response from the server.
 */
export const uploadSchedule = async (data) => {
    try {
        // Create a FormData object for sending file data
        const formData = new FormData();
        formData.append('userId', data.userId); // Add user ID to the form data
        formData.append('schedule', data.schedule); // Add the schedule file

        // Make a POST request to upload the schedule
        const response = await axios.post('http://localhost:3001/guideInfo/uploadSchedule', formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Ensure correct content type for file upload
            },
        });

        // Return the server's response
        return response.data;
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error uploading schedule:', error);

        // Return an error object if an error occurs
        return { error: 'Failed to upload schedule' };
    }
};
