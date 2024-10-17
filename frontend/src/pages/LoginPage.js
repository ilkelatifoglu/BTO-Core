import React from 'react';
import './LoginPage.css'; 
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { login, error, user } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    await login(email, password);
    if (user) {
      navigate('/dashboard');
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="container">
      {/* Left side: login form */}
      <div className="left-side">
        <div className="login-page">
          <h1>Login</h1>
          <LoginForm onSubmit={handleLogin} />
          {error && <p className="error-message">{error}</p>}

          {/* Forgot Password Button */}
          <button className="forgot-password" onClick={handleForgotPassword}>
            Forgot Password?
          </button>
        </div>
      </div>

      {/* Right side: abstract image */}
      <div className="right-side"></div>
    </div>
  );
};

export default LoginPage;
