// services/guideInfoService.js

import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

/**
 * Fetch guide information with optional filters.
 *
 * @param {Object} filters - Filters for fetching guide info (e.g., name, role, department).
 * @returns {Promise<Array>} - Returns an array of guide data.
 */
export const fetchGuideInfo = async (filters = {}) => {
    try {
        // Make a GET request to the backend server
        const response = await axios.get(`${BACKEND_URL}/guide-info`, {
            params: filters,
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
 * Fetch a user's schedule data from the server.
 *
 * @param {number} userId - The ID of the user whose schedule is to be fetched.
 * @returns {Promise<Object|null>} - Returns the schedule data or null if not found.
 */
export const fetchGuideSchedule = async (userId) => {
    try {
        // Make a GET request to fetch the schedule
        const response = await axios.get(`${BACKEND_URL}/schedule/getSchedule/${userId}`);

        // Return the schedule data from the response
        return response.data;
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error fetching guide schedule:', error);

        // Return null if an error occurs
        return null;
    }
};
