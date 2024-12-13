import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";
const token = localStorage.getItem('token') || localStorage.getItem('tempToken');

export const getAllWorkEntries = async () => {
    try {
        const response = await axios.get(`${API_URL}/work`,
            {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
            });
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
        const response = await axios.get(`${API_URL}/work/${id}`,
            {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
            });
        return response.data;
    } catch (error) {
        console.error(`Error fetching work entry with id ${id}:`, error);
        throw error;
    }
};


export const addWork = async (workData) => {
    try {
        const response = await axios.post(`${API_URL}/work/add`, workData,
            {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
            });
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
        const response = await axios.get(`${API_URL}/work/user-work?user_id=${userId}`,
            {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
            });
        return response.data;
    } catch (error) {
        console.error("Error fetching user-specific work entries:", error);
        throw error;
    }
};
export const deleteWorkEntry = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/work/delete/${id}`,
            {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
            });
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
                "Authorization": `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error editing work entry with id ${id}:`, error);
        throw error;
    }
};
export const updateWorkEntry = async (id, isApproved, workType) => {
    try {
        const response = await axios.put(`${API_URL}/work/update/${id}`, {
            is_approved: isApproved,
            work_type: workType, // Include work_type in the payload
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error in updateWorkEntry:", error.response?.data || error.message);
        throw error;
    }
};

export const saveWorkload = async (workId, workload) => {

    try {
        const response = await axios.put(`${API_URL}/work/${workId}/workload`, { workload }, { headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }});
        return response.data;
    } catch (error) {
        console.error("Error saving workload:", error);
        throw error;
    }
};