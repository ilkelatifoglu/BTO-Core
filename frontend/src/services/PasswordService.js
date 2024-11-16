import axios from "axios";

const PasswordService = {
  requestPasswordReset: async (email) => {
    return await axios.post(
      "http://localhost:3001/auth/password/reset-request",
      {
        email,
      }
    );
  },

  resetPassword: (newPassword, token) => {
    return axios.post("http://localhost:3001/auth/password/reset", {
      token,
      newPassword,
    });
  },
};

export default PasswordService;
