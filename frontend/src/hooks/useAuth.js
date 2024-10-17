import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AuthService from "../services/AuthService";

export const useAuth = () => {
  const { setUser } = useContext(AuthContext);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    try {
      const userData = await AuthService.login({ email, password });
      setUser(userData);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    login,
    error,
  };
};
