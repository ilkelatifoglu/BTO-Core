// FeedbackService.js
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";
const token = localStorage.getItem("token") || localStorage.getItem("tempToken");

const FeedbackService = {

  /**
   * Submit feedback using the provided token.
   * @param {Object} data - The feedback data.
   * @param {string} data.token - The feedback token.
   * @param {string} data.feedback - The feedback content.
   * @returns {Promise<void>} - Resolves if the feedback is submitted successfully.
   */
  submitFeedback: async (data) => {
    await axios.post(`${API_BASE_URL}/feedback/submitFeedback`, data);
  },

  getFeedbackByRole: async (userId, userType) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/feedback/getFeedbackByRole`, {
        params: { userId, userType },
      }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching feedback by role:", error);
      throw new Error("Unable to fetch feedback by role");
    }
  },

  createFeedback: async (feedbackData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/feedback/createFeedback`, feedbackData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
      return response.data;
    } catch (error) {
      console.error("Error creating feedback:", error);
      throw new Error(error.response?.data?.message || "Unable to create feedback");
    }
  },

  updateFeedback: async (updateData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/feedback/updateFeedback`, updateData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
      return response.data;
    } catch (error) {
      console.error("Error updating feedback:", error);
      throw new Error(error.response?.data?.message || "Unable to update feedback");
    }
  },

  deleteFeedback: async (feedbackId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/feedback/${feedbackId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
      return response.data;
    } catch (error) {
      console.error("Error deleting feedback:", error);
      throw new Error("Unable to delete feedback");
    }
  },
};

export default FeedbackService;

  //getPaginatedFeedback: async (page, limit = 50) => {
    //   try {
    //     const response = await axios.get(`${API_BASE_URL}/feedback/paginated`, {
    //       params: { page, limit },
    //     });
    //     return response.data;
    //   } catch (error) {
    //     console.error("Error fetching feedback:", error);
    //     throw new Error("Unable to fetch feedback");
    //   }
    // },
  
    // uploadFeedback: async (tourId, file) => {
    //   try {
    //     const formData = new FormData();
    //     formData.append("tourId", tourId);
    //     formData.append("file", file);
  
    //     const response = await axios.post(`${API_BASE_URL}/feedback/upload`, formData, {
    //       headers: { "Content-Type": "multipart/form-data" },
    //     });
    //     return response.data;
    //   } catch (error) {
    //     console.error("Error uploading feedback:", error);
    //     throw new Error("Unable to upload feedback");
    //   }
    // },
  
    // deleteFeedback: async (feedbackId) => {
    //   try {
    //     const response = await axios.delete(`${API_BASE_URL}/feedback/${feedbackId}`);
    //     return response.data;
    //   } catch (error) {
    //     console.error("Error deleting feedback:", error);
    //     throw new Error("Unable to delete feedback");
    //   }
    // },
  
    // getDownloadLink: async (feedbackId) => {
    //   try {
    //     const response = await axios.get(`${API_BASE_URL}/feedback/${feedbackId}/download`);
    //     return response.data;
    //   } catch (error) {
    //     console.error("Error generating download link:", error);
    //     throw new Error("Unable to generate download link");
    //   }
    // },

