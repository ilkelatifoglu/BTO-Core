import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AuthService from "../services/AuthService";

export const useAuth = () => {
  const { setUser } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [user, setUserData] = useState(null); // State to hold user data

  const login = async (email, password) => {
    try {
      const userData = await AuthService.login({ email, password });
      setUser(userData);  // Assuming setUser in AuthContext sets user in global state
      setUserData(userData); // Set local user data
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    login,
    error,
    user, // Return user data
  };
};
