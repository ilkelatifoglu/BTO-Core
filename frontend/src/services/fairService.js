import axios from "axios";
const BASE_URL = (process.env.REACT_APP_BACKEND_URL || "http://localhost:3001") + "/fairs";
const token = localStorage.getItem("token") || localStorage.getItem("tempToken");

export const fetchFairs = async (status = null) => {
    try {
        const params = status ? { status } : {};
        const response = await axios.get(BASE_URL, { params }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching fairs:", error);
        throw error;
    }
};

export const requestToJoinFair = async (fairId, guideId) => {
    try {
        await axios.post(`${BASE_URL}/fair-requests`, { fair_id: fairId, guide_id: guideId }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        if (error.response?.status === 400) {
            alert(error.response.data.message); // Show "You already applied" message
        } else {
            console.error("Error sending join request:", error);
            throw error;
        }
    }
};


export const fetchAvailableGuides = async (fairId) => {
    try {
        const response = await axios.get(`${BASE_URL}/available-guides`, { params: { fairId } }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error("Error fetching guides:", error);
        throw error;
    }
};

export const assignGuide = async (fairId, column, guideId) => {
    try {
        await axios.put(`${BASE_URL}/${fairId}/assign`, { column, guideId }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
        );
    } catch (error) {
        console.error("Error assigning guide:", error);
        throw error;
    }
};

export const approveFair = async (fairId) => {
    try {
        const response = await axios.put(`${BASE_URL}/${fairId}/approve`, {
            headers:
            {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error approving fair:", error);
        throw error;
    }
};

export const cancelFair = async (fairId) => {
    try {
        const response = await axios.put(`${BASE_URL}/${fairId}/cancel`, {
            headers:
            {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error cancelling fair:", error);
        throw error;
    }
};

export const unassignGuide = async (fairId, column) => {
    try {
        const response = await axios.put(`${BASE_URL}/${fairId}/unassign`, { column }, {
            headers:
            {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error unassigning guide:", error);
        throw error;
    }
};

export const fetchAvailableFairsForUser = async () => {
    try {
        if (!token) throw new Error("No authentication token found.");
        const response = await axios.get(`${BASE_URL}/available-fairs`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching available fairs:", error);
        throw error;
    }
};
export const addFairGuide = async (fairId, guideId) => {
    try {
        const response = await axios.post(`${BASE_URL}/fair-guide`, {
            fair_id: fairId,
            guide_id: guideId,
        });
        return response.data;
    } catch (error) {
        console.error("Error adding fair-guide:", error);
        throw error;
    }
};
export const removeFairGuide = async (fairId, column) => {
    try {
        const response = await axios.delete(`${BASE_URL}/remove-fair-guide`, {
            params: { fair_id: fairId, column }, // Send as query params
        });
        return response.data;
    } catch (error) {
        console.error("Error removing fair-guide:", error);
        throw error;
    }
};
