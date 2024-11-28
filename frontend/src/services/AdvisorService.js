import axios from "axios";

export const fetchAdvisors = async () => {
    try {
        const response = await axios.get("http://localhost:3001/advisors");
        return response.data;
    } catch (error) {
        console.error("Error fetching advisors:", error);
        return [];
    }
};

export const fetchAdvisorDetails = async (id) => {
    try {
        const response = await axios.get(`http://localhost:3001/advisors/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching advisor details:", error);
        return null;
    }
};
