import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AuthService from "../services/AuthService";

export const useAuth = () => {
  const { setUser } = useContext(AuthContext);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    try {
      const { token, user_type } = await AuthService.login({ email, password });
      setUser({ token, user_type }); // Store token and user_type in global state or context
      setError(null);
      return { token, user_type };  // Return token and user_type if needed
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  return {
    login,
    error,
  };
};
