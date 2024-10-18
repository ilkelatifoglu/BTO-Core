import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userEmail = location.state?.email;
  const userType = location.state?.user_type || "Admin";

  useEffect(() => {
    document.body.classList.add("dashboard-body");
    return () => {
      document.body.classList.remove("dashboard-body");
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
          <div>
            <button onClick={() => setShowProfile(!showProfile)}>
              Profile
            </button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </header>

        {showProfile ? (
          <ProfilePage userEmail={userEmail} userType={userType} />
        ) : (
          <div>
            <button onClick={() => setShowAddUser(!showAddUser)}>
              Add User
            </button>
            {showAddUser && <AddUserForm userEmail={userEmail} />}
          </div>
        )}
      </div>
    </div>
  );
};

const ProfilePage = ({ userEmail, userType }) => {
  const [showChangePassword, setShowChangePassword] = useState(false);

  return (
    <div className="profile-section">
      <h2>Profile</h2>
      <p>
        <strong>Email:</strong> {userEmail || "No email provided"}
      </p>
      <p>
        <strong>User Type:</strong> {userType === 1 && "Candidate Guide"}
        {userType === 2 && "Guide"}
        {userType === 3 && "Advisor"}
        {userType === 4 && "Coordinator"}
      </p>
      <button onClick={() => setShowChangePassword(!showChangePassword)}>
        Change Password
      </button>
      {showChangePassword && <ChangePasswordForm userEmail={userEmail} />}
    </div>
  );
};

const ChangePasswordForm = ({ userEmail }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:3001/auth/update-password",
        {
          email: userEmail,
          oldPassword,
          newPassword,
          confirmNewPassword,
        }
      );

      if (response.data.message === "Password updated successfully") {
        setSuccess("Password updated successfully");
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        setError("Failed to update password");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while updating the password"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="change-password-form">
      <input
        type="password"
        placeholder="Current Password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmNewPassword}
        onChange={(e) => setConfirmNewPassword(e.target.value)}
        required
      />
      <button type="submit">Update Password</button>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </form>
  );
};

const AddUserForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:3001/auth/register", {
        email,
        password,
      });
      if (response.data.success) {
        setSuccess(response.data.message || "User registered successfully");
        setEmail("");
        setPassword("");
      } else {
        setError(response.data.message || "Registration failed");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred during registration"
      );
    }
  };

  return (
    <div className="add-user-section">
      <h2>Add New User</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Add User</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
};

export default Dashboard;
