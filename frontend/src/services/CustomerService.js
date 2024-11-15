// src/services/workService.js
import axios from 'axios';

const API_URL = "http://localhost:3001";

// Fetch all work entries
const getAllWorkEntries = async () => {
    try {
        const response = await axios.get(`${API_URL}/work`); // Changed from /api/work to /work
        return response.data;
    } catch (error) {
        console.error('Error fetching work entries:', error);
        throw error;
    }
};


const getAllNonApprovedWorkEntries = async () => {
    try {
        const response = await axios.get(`${API_URL}/work/non-approved`); // Changed from /api/work to /work
        return response.data;
    } catch (error) {
        console.error('Error fetching work entries:', error);
        throw error;
    }
};
export const updateWorkEntry = async (id, updateData) => {
    try {
        const response = await axios.put(`${API_URL}/work/approve/${id}`, updateData);
        return response.data;
    } catch (error) {
        console.error(`Error updating work entry with id ${id}:`, error);
        throw error;
    }
};
// Fetch a single work entry by ID
const getWorkEntryById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/work/${id}`); // Changed from /api/work/:id to /work/:id
        return response.data;
    } catch (error) {
        console.error(`Error fetching work entry with id ${id}:`, error);
        throw error;
    }
};

// Other functions like create and delete should also be updated similarly
export default {
    getAllWorkEntries,
    getAllNonApprovedWorkEntries,
    updateWorkEntry,
    getWorkEntryById,
    // other functions...
};
