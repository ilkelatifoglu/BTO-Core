import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AuthService from '../services/AuthService';

export const useAuth = () => {
  const { setUser } = useContext(AuthContext); // Use the global context for user state
  const [error, setError] = useState(null); // Track any errors during login

  const login = async (email, password) => {
    try {
      const { token, user_type } = await AuthService.login({ email, password });
      setUser({ token, user_type, email }); // Store token and user_type in global state/context
      setError(null); // Clear any previous errors
      return { token, user_type, email };  // Return token and user_type if needed
    } catch (err) {
      setError(err.message); // Set error if login fails
      return null;
    }
  };

  return {
    login,
    error,
  };
};
