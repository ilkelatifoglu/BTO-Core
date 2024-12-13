import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";
const token = localStorage.getItem("token") || localStorage.getItem("tempToken");

export const fetchAdvisors = async () => {
    try {
        const response = await axios.get("${API_BASE_URL}/advisors", {headers: {Authorization: `Bearer ${token}`}});
        return response.data;
    } catch (error) {
        console.error("Error fetching advisors:", error);
        return [];
    }
};

export const fetchAdvisorDetails = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/advisors/${id}`, {headers: {Authorization: `Bearer ${token}`}});
        return response.data;
    } catch (error) {
        console.error("Error fetching advisor details:", error);
        return null;
    }
};
