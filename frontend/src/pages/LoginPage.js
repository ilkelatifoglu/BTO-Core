import React from 'react';
import './LoginPage.css'; 
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

import BilkentLogo from './BilkentÜniversitesi-logo.png'; 

const LoginPage = () => {
  const { login, error, user } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    await login(email, password);
    if (user) {
      // Check user_type as an integer and navigate to the correct dashboard
      switch (user.user_type) {
        case 1:
          navigate('/dashboard'); // Admin dashboard
          break;
        case 2:
          navigate('/dashboard'); // Student dashboard
          break;
        case 3:
          navigate('/dashboard'); // Teacher dashboard
          break;
        case 4:
          navigate('/dashboard'); // Guest dashboard or default
          break;
        default:
          navigate('/dashboard'); // Default dashboard if user_type is not matched
          break;
      }
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="container">
      <div className="left-side">
        <img src={BilkentLogo} alt="Bilkent University Logo" className="bilkent-logo" />
        <h2>Welcome to BTO Core 🌟</h2> 
        <LoginForm onSubmit={handleLogin} />
        {error && <p className="error-message">{error}</p>}
        <button className="forgot-password" onClick={handleForgotPassword}>
          Forgot Password?
        </button>
      </div>
      <div className="right-side"></div>
    </div>
  );
};

export default LoginPage;
