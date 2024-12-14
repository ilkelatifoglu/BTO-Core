import axios from "axios";

const BASE_URL = "http://localhost:3001"; // Adjust this to match your backend's base URL

// Get individual tours
export const getIndividualTours = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/individual-tours/getTours`);
        return response.data.data; // Return only the data array
    } catch (error) {
        console.error("Error fetching individual tours:", error);
        throw error; // Rethrow the error to handle it in the component
    }
};

// Approve a tour
export const approveTour = async (tourId, guideId) => {
    try {
        const response = await axios.put(`${BASE_URL}/individual-tours/approveTour/${tourId}`, {
            guide_id: guideId,
            tour_status: "APPROVED",
        });
        return response.data; // Return the updated data
    } catch (error) {
        console.error("Error approving the tour:", error);
        throw error; // Rethrow the error to handle it in the component
    }
};

// Reject a tour
export const rejectTour = async (tourId) => {
    try {
        const response = await axios.put(`${BASE_URL}/individual-tours/rejectTour/${tourId}`, {
            tour_status: "REJECTED",
        });
        return response.data; // Return the updated data
    } catch (error) {
        console.error("Error rejecting the tour:", error);
        throw error; // Rethrow the error to handle it in the component
    }
};

export const withdrawFromIndividualTour = async (tourId) => {
    const token = localStorage.getItem("tempToken"); // Retrieve token from localStorage
    try {
        const response = await axios.delete(
            `${BASE_URL}/individual-tours/withdrawFromIndividualTour/${tourId}`,
            {
                headers: { Authorization: `Bearer ${token}` }, // Include the token in headers
            }
        );
        return response.data; // Return the response data
    } catch (error) {
        console.error("Error withdrawing from individual tour:", error.response?.data || error);
        throw new Error(error.response?.data?.message || "Failed to withdraw from the individual tour.");
    }
};
export const getMyIndividualTours = async () => {
    const userId = localStorage.getItem("userId"); // Retrieve userId from localStorage
    const token = localStorage.getItem("tempToken"); // Retrieve token from localStorage
    try {
      console.log("Fetching individual tours for user ID:", userId);
      const response = await axios.get(`${BASE_URL}/individual-tours/getMyIndividualTours`, {
        params: { guide_id: userId }, // Send guide_id as query parameter
        headers: { Authorization: `Bearer ${token}` }, // Pass token in Authorization header
      });
      return response.data.data; // Return tours data
    } catch (error) {
      console.error("Error fetching my individual tours:", error.response?.data || error);
      throw new Error(error.response?.data?.message || "Unable to fetch individual tours");
    }
};


