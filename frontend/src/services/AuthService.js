//responsible for handling the communication between the frontend and the backend API for authentication purposes.
//. It is where you define all the API calls related to login, signup, and possibly other authentication actions.
import axios from "axios"; // Use axios for the HTTP request

// Set up Axios interceptor to include token in all requests
axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");  // Get the token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;  // Set the token in the Authorization header
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});
const AuthService = {
  login: async (credentials) => {
    try {
      const response = await axios.post("http://localhost:3001/auth/login", credentials);
      const { token, user } = response.data;
      
      // Save token to localStorage for future authenticated requests
      localStorage.setItem("token", token);

      // Return user data including user_type
      return user; // Assume user contains user_type
    } catch (err) {
      throw new Error("Invalid email or password");
    }
  },
};



export default AuthService;
