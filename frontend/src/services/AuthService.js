import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";
const token = localStorage.getItem("token");

axios.interceptors.request.use(
  function (config) {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

const AuthService = {
  login: async (credentials) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        credentials
      );
      const { token, user_type, user_id } = response.data;
      return { token, user_type, user_id };
    } catch (err) {
      throw new Error("Invalid email or password");
    }
  },
};

export default AuthService;
