//responsible for handling the communication between the frontend and the backend API for authentication purposes.
//. It is where you define all the API calls related to login, signup, and possibly other authentication actions.
import axios from "axios"; // Use axios for the HTTP request

const AuthService = {
  login: async (credentials) => {
    try {
      //const response = await axios.post('http://localhost:5000/api/login', credentials);
      //return response.data.user;  // Return the user data from the response
      // Check if the entered email and password match any user in the mock API
      const response = await axios.get("http://localhost:5000/users");
      const user = response.data.find(
        (user) =>
          user.email === credentials.email &&
          user.password === credentials.password
      );

      if (user) {
        return user; // Return user data from the response
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (err) {
      throw new Error("Invalid email or password"); // Throw error if login fails
    }
  },
};

export default AuthService;
