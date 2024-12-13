import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";
const token = localStorage.getItem("token") || localStorage.getItem("tempToken");

const PasswordService = {
  requestPasswordReset: async (email) => {
    return await axios.post(
      `${API_BASE_URL}/auth/password/reset-request`,
      {
        email,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );
  },

  resetPassword: (newPassword, token) => {
    return axios.post(
      `${API_BASE_URL}/auth/password/reset`,
      {
        token,
        newPassword,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );
  },
};

export default PasswordService;
