import axios from "axios";

const API_URL = "http://localhost:3001";


export const getAllWorkEntries = async () => {
    try {
        const response = await axios.get(`${API_URL}/work`);
        return response.data;
    } catch (error) {
        console.error("Error fetching all work entries:", error);
        throw error;
    }
};

/**
 * Fetch only non-approved work entries.
 */
export const getAllNonApprovedWorkEntries = async () => {
    try {
        const response = await axios.get(`${API_URL}/work/non-approved`);
        return response.data;
    } catch (error) {
        console.error("Error fetching non-approved work entries:", error);
        throw error;
    }
};

/**
 * Fetch a specific work entry by its ID.
 * @param {number} id - ID of the work entry.
 */
export const getWorkEntryById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/work/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching work entry with id ${id}:`, error);
        throw error;
    }
};


export const addWork = async (workData) => {
    try {
        const response = await axios.post(`${API_URL}/work/add`, workData);
        return response.data;
    } catch (error) {
        console.error("Error adding work entry:", error);
        throw error;
    }
};

/**
 * Fetch work entries for the currently logged-in user.
 */
export const getUserWorkEntries = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/work/user-work?user_id=${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user-specific work entries:", error);
        throw error;
    }
};
export const deleteWorkEntry = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/work/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting work entry with id ${id}:`, error);
        throw error;
    }
};
export const editWorkEntry = async (id, updatedWork) => {
    try {
        const response = await axios.put(`${API_URL}/work/edit/${id}`, updatedWork, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error editing work entry with id ${id}:`, error);
        throw error;
    }
};
export const updateWorkEntry = async (workId, isApproved, workType) => {
    try {
        const response = await axios.put(`${API_URL}/work/update/${workId}`, {
            is_approved: isApproved,
            work_type: workType, // Include work_type in the payload
        });
        return response.data;
    } catch (error) {
        console.error("Error in updateWorkEntry:", error);
        throw error;
    }
};
export const saveWorkload = async (workId, workload) => {

    try {
        const response = await axios.put(`${API_URL}/work/${workId}/workload`, { workload });
        return response.data;
    } catch (error) {
        console.error("Error saving workload:", error);
        throw error;
    }
};