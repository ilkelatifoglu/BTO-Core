import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:3001"; // Replace with your API base URL
const token = localStorage.getItem("token");

const UserService = {
  async getAllUsers() {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // Assuming the API response contains the `data` field
    } catch (error) {
      console.error("Error fetching users:", error.response?.data || error);
      throw new Error(error.response?.data?.message || "Unable to fetch users");
    }
  },
};

export default UserService;
