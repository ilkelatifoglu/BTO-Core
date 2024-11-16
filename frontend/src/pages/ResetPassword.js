import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./ResetPassword.css";
import PasswordService from "../services/PasswordService";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Check password match when either password field changes
    if (name === "newPassword" || name === "confirmPassword") {
      if (name === "newPassword") {
        setPasswordsMatch(value === formData.confirmPassword);
      } else {
        setPasswordsMatch(value === formData.newPassword);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ text: "Passwords do not match", type: "error" });
      return;
    }

    try {
      const response = await PasswordService.resetPassword(
        formData.newPassword,
        token
      );

      setMessage({ text: "Password successfully reset!", type: "success" });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage({
        text: error.response?.data || "An error occurred",
        type: "error",
      });
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-form">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="password-requirements">
            Password must contain:
            <ul>
              <li>At least 8 characters</li>
              <li>One uppercase letter</li>
              <li>One lowercase letter</li>
              <li>One number</li>
              <li>One special character (@$!%*?&)</li>
            </ul>
          </div>

          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={handleInputChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />

          {!passwordsMatch && (
            <div className="password-match-error">Passwords do not match</div>
          )}

          {message.text && (
            <div className={`${message.type}-message`}>{message.text}</div>
          )}

          <button type="submit">Reset Password</button>
        </form>

        <Link to="/login" className="back-to-login">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;
