import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import './LoginForm.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      // Call the AuthService to validate login credentials
      const isLoggedIn = await AuthService.login({ email, password });

      if (isLoggedIn) {
        setError('');
        // If login is successful, redirect the user to another page
        navigate('/dashboard'); // Redirect to the dashboard or any other route
      }
    } catch (error) {
      setError(error.message); // Set the error message if login fails
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <p className="error-message">{error}</p>} {/* Display error message if login fails */}

      <button type="submit" className="btn">Login</button>
    </form>
  );
};

export default LoginForm;
