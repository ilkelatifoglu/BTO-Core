import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import PasswordService from "../services/PasswordService";
import { Toast } from "primereact/toast"; // (2) Importing Toast
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toast = useRef(null); // (3) Create a ref for Toast

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.current.clear(); // (4) Clear before showing new toast
      toast.current.show({
        severity: "error",
        summary: "Invalid Email",
        detail: "Please enter a valid email address.",
        life: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      await PasswordService.requestPasswordReset(email);
      toast.current.clear();
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "A reset link has been sent to your email.",
        life: 3000,
      });
    } catch (err) {
      toast.current.clear();
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err.response?.data || "An error occurred. Please try again.",
        life: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <Toast ref={toast} /> {/* (5) Adding Toast component to JSX */}
      <div className="forgot-password-form">
        <h2>Forgot Password</h2>
        <p>Enter your email to receive a password reset link.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className="visually-hidden">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-required="true"
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <Link to="/login" className="back-to-login">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
