import axios from 'axios';

const API_URL = "http://localhost:3001";

const workService = {
    getAllWorkEntries: async () => {
        try {
            const response = await axios.get(`${API_URL}/work`);
            return response.data;
        } catch (error) {
            console.error('Error fetching work entries:', error);
            throw error;
        }
    },
    getAllNonApprovedWorkEntries: async () => {
        try {
            const response = await axios.get(`${API_URL}/work/non-approved`);
            return response.data;
        } catch (error) {
            console.error('Error fetching work entries:', error);
            throw error;
        }
    },
    updateWorkEntry: async (id, updateData) => {
        try {
            const response = await axios.put(`${API_URL}/work/approve/${id}`, updateData);
            return response.data;
        } catch (error) {
            console.error(`Error updating work entry with id ${id}:`, error);
            throw error;
        }
    },
    getWorkEntryById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/work/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching work entry with id ${id}:`, error);
            throw error;
        }
    },
    addWork: async (workData) => {
        try {
            const response = await axios.post(`${API_URL}/work/add`, workData);
            return response.data;
        } catch (error) {
            console.error('Error adding work entry:', error);
            throw error;
        }
    },
};

export default workService;
