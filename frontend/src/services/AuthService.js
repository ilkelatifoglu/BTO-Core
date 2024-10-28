import axios from "axios";

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
      const { token, user_type } = response.data; // Extract token and user_type from response
      return { token, user_type }; 
    } catch (err) {
      throw new Error("Invalid email or password");
    }
  },
};

export default AuthService;
