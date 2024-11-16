import axios from "axios";

const API_BASE_URL = "http://localhost:3001";

const AssignTourService = {
  getReadyTours: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tour/readyTours`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching READY tours:", error);
      throw new Error("Unable to fetch tours");
    }
  },
  getAssignedGuides: async (tourId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tour/${tourId}/guideCount`);
      return response.data.guide_count; 
    } catch (error) {
      console.error(`Error fetching assigned guides for tour ${tourId}:`, error);
      return 0; 
    }
  },
  assignGuideToTour: async ({ school_name, city, date }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/tour/assignGuide`, {
        school_name,
        city,
        date,
      });
      return response.data; // Return success message
    } catch (error) {
      console.error("Error assigning guide to tour:", error.response?.data || error);
      throw new Error(error.response?.data?.message || "Unable to assign guide to tour");
    }
  },
};

export default AssignTourService;
