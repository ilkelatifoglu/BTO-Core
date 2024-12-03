import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AuthService from "../services/AuthService";

export const useAuth = () => {
  const { setUser } = useContext(AuthContext);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    try {
      const { token, user_type, user_id } = await AuthService.login({
        email,
        password,
      });
      setUser({ token, user_type, email });
      setError(null);
      return { token, user_type, email, user_id };
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
