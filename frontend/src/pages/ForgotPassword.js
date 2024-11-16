import React, { useState } from "react";
import { Link } from "react-router-dom";
import PasswordService from "../services/PasswordService";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await PasswordService.requestPasswordReset(email);
      setMessage("A reset link has been sent to your email.");
      setError("");
    } catch (err) {
      setError(err.response?.data);
      setMessage("");
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-form">
        <h2>Forgot Password</h2>
        <p>Enter your email to receive a password reset link.</p>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send Reset Link</button>
        </form>

        <Link to="/login" className="back-to-login">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
