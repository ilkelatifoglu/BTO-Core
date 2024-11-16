import React, { useState } from "react";
import "./LoginPage.css";
import LoginForm from "../components/auth/LoginForm";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

import BilkentLogo from "../assets/BilkentÜniversitesi-logo.png";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const handleLogin = async (email, password) => {
    try {
      const response = await login(email, password);
      if (response) {
        navigate("/dashboard");
      } else {
        setError("Login failed");
      }
    } catch (err) {
      setError(err.message || "An error occurred during login.");
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="container">
      <div className="left-side">
        <img
          src={BilkentLogo}
          alt="Bilkent University Logo"
          className="bilkent-logo"
        />
        <h2>Welcome to BTO Core 🌟</h2>
        <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
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
