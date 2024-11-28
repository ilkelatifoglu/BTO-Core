import axios from "axios";

axios.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");
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
        "http://localhost:3001/auth/login",
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
