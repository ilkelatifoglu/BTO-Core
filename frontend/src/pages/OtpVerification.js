import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./OtpVerification.css";

const API_BASE_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";

export default function OtpVerification() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/verify-otp`,
        { otp },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tempToken")}`,
          },
        }
      );

      localStorage.removeItem("tempToken");
      localStorage.setItem("token", response.data.token);

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Verification failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    setError("");

    try {
      const email = localStorage.getItem("email");
      const password = localStorage.getItem("password");
      const credentials = { email, password };
      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        credentials
      );

      if (response.data.token) {
        localStorage.setItem("tempToken", response.data.token);
        setTimeLeft(30);
      }
    } catch (err) {
      setError("Failed to resend code. Please try logging in again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="otp-verification-container">
      <div className="otp-verification-form">
        <h2>Verify Your Email</h2>
        <p>Enter the 6-digit code sent to your email</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            required
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            maxLength={6}
            className="otp-input"
          />

          <div className="buttons-container">
            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="verify-button"
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </button>

            <button
              type="button"
              onClick={handleResend}
              disabled={isLoading || timeLeft > 0}
              className="resend-button"
            >
              {timeLeft > 0 ? `Resend Code (${timeLeft}s)` : "Resend Code"}
            </button>
          </div>
        </form>

        <a href="/login" className="back-to-login">
          Back to Login
        </a>
      </div>
    </div>
  );
}
