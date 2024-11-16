import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AuthService from "../services/AuthService";

export const useAuth = () => {
  const { setUser } = useContext(AuthContext);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    try {
      const { token, user_type } = await AuthService.login({ email, password });
      console.log(token, user_type, email);
      setUser({ token, user_type, email });
      setError(null);
      return { token, user_type, email };
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
