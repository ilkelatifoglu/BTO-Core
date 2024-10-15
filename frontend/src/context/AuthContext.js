//manages the global user state, ensuring that the logged-in user's information is accessible throughout the entire app.
import { createContext, useState, useEffect } from 'react';

// Create a context for user state
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize the user state by checking localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Effect to store the user in localStorage whenever the user state changes
  useEffect(() => {
    if (user) { //the user data is stored in localStorage
      localStorage.setItem('user', JSON.stringify(user));
    } else { //the user data is removed from localStorage
      localStorage.removeItem('user'); 
    }
  }, [user]);

  // Provide user and setUser to all components within the provider
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}  {/* Render all children components that are wrapped in AuthProvider */}
    </AuthContext.Provider>
  );
};
