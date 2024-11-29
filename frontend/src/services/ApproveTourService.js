import axios from "axios";

// Base URL configuration
const BASE_URL = "http://localhost:3001";

// Function to get all tours
export const getAllTours = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/tour/allTours`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching tours:", error);
        throw error;
    }
};
export const approveTour = async (tourId, selectedTime) => {
    return await axios.put(`${BASE_URL}/tour/approve/${tourId}`, { selectedTime });
};

export const rejectTour = async (tourId) => {
    return await axios.put(`${BASE_URL}/tour/reject/${tourId}`);
};