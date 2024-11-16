import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./OtpVerification.css";

export default function EmailVerification() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:3001/auth/verify-otp`,
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
      setError(err.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    setError("");

    try {
      const credentials = JSON.parse(localStorage.getItem("tempCredentials") || "{}");
      const response = await axios.post(
        `http://localhost:3000/auth/login`,
        credentials
      );

      if (response.data.tempToken) {
        localStorage.setItem("tempToken", response.data.tempToken);
        setTimeLeft(300);
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

          <div className="time-remaining">
            Time remaining: {formatTime(timeLeft)}
          </div>

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
              Resend Code
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
