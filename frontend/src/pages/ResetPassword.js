import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Toast } from "primereact/toast";
import "./ResetPassword.css";
import PasswordService from "../services/PasswordService";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    letterNumber: false,
    special: false,
  });
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const toast = useRef(null);

  useEffect(() => {
    if (formData.newPassword) {
      const requirements = {
        length: formData.newPassword.length >= 8,
        letterNumber: /(?=.*[A-Za-z])(?=.*\d)/.test(formData.newPassword),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword),
      };
      setPasswordRequirements(requirements);
    }

    setPasswordsMatch(
      !formData.confirmPassword ||
        formData.newPassword === formData.confirmPassword
    );
  }, [formData.newPassword, formData.confirmPassword]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePassword = () => {
    return Object.values(passwordRequirements).every(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword()) {
      toast.current?.show({
        severity: "error",
        summary: "Invalid Password",
        detail: "Please meet all password requirements",
        life: 3000,
      });
      return;
    }

    if (!passwordsMatch) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Passwords do not match",
        life: 3000,
      });
      return;
    }

    try {
      await PasswordService.resetPassword(formData.newPassword, token);
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Password successfully reset!",
        life: 3000,
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.response?.data?.message || "An error occurred",
        life: 3000,
      });
    }
  };

  return (
    <div className="reset-password-container">
      <Toast ref={toast} />
      <div className="reset-password-form">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="password-requirements">
            <div
              className={`requirement-item ${
                passwordRequirements.length ? "valid" : "invalid"
              }`}
            >
              <span className="requirement-icon">
                {passwordRequirements.length ? "✓" : "○"}
              </span>
              At least 8 characters
            </div>
            <div
              className={`requirement-item ${
                passwordRequirements.letterNumber ? "valid" : "invalid"
              }`}
            >
              <span className="requirement-icon">
                {passwordRequirements.letterNumber ? "✓" : "○"}
              </span>
              At least one letter and one number
            </div>
            <div
              className={`requirement-item ${
                passwordRequirements.special ? "valid" : "invalid"
              }`}
            >
              <span className="requirement-icon">
                {passwordRequirements.special ? "✓" : "○"}
              </span>
              One special character (!@#$%^&*(),.?":{}|&lt;&gt;)
            </div>
          </div>

          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={handleInputChange}
            className={
              formData.newPassword
                ? validatePassword()
                  ? "valid"
                  : "invalid"
                : ""
            }
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={
              formData.confirmPassword
                ? passwordsMatch
                  ? "valid"
                  : "invalid"
                : ""
            }
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
