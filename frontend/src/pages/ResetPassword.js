import React, { useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Toast } from "primereact/toast"; // (2) Importing Toast
import "./ResetPassword.css";
import PasswordService from "../services/PasswordService";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const toast = useRef(null); // (3) Toast ref

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Check password match
    if (name === "newPassword") {
      setPasswordsMatch(value === formData.confirmPassword);
    } else if (name === "confirmPassword") {
      setPasswordsMatch(value === formData.newPassword);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.current.clear(); // (4) Clear before showing toast
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Passwords do not match",
        life: 3000,
      });
      return;
    }

    try {
      await PasswordService.resetPassword(formData.newPassword, token);
      toast.current.clear();
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Password successfully reset!",
        life: 3000,
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.current.clear();
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response?.data || "An error occurred",
        life: 3000,
      });
    }
  };

  return (
    <div className="reset-password-container">
      <Toast ref={toast} /> {/* (5) Adding Toast to JSX */}
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
