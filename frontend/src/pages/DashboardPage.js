import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DashboardPage.css";
import useProtectRoute from "../hooks/useProtectRoute";
import { AuthContext } from "../context/AuthContext";

const DashboardPage = () => {
  useProtectRoute("/login", [1, 2, 3, 4]);

  const [showProfile, setShowProfile] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showDeleteUser, setShowDeleteUser] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const userEmail = user?.email;
  const userType = user?.user_type;

  useEffect(() => {
    document.body.classList.add("dashboard-body");
    return () => {
      document.body.classList.remove("dashboard-body");
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
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
            <button onClick={() => setShowDeleteUser(!showDeleteUser)}>
              Delete User
            </button>
            {showAddUser && <AddUserForm userEmail={userEmail} />}
            {showDeleteUser && <DeleteUserForm />}
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

const DeleteUserForm = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/auth/users");
      setUsers(response.data);
    } catch (err) {
      setError("Failed to fetch users");
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedUser) {
      setError("Please select a user to delete");
      return;
    }

    try {
      const response = await axios.delete(
        "http://localhost:3001/auth/delete-user",
        {
          data: { email: selectedUser },
        }
      );
      setSuccess(response.data.message);
      setSelectedUser("");
      fetchUsers(); // Refresh the user list
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div className="delete-user-section">
      <h2>Delete User</h2>
      <form onSubmit={handleDelete}>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          required
        >
          <option value="">Select a user</option>
          {users.map((user) => (
            <option key={user.id} value={user.email}>
              {user.email}
            </option>
          ))}
        </select>
        <button type="submit">Delete User</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
};

export default DashboardPage;
