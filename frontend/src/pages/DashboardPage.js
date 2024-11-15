import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import { AuthContext } from '../context/AuthContext';
import './DashboardPage.css';
import welcomeImage from '../assets/btowelcome.jpeg';
import btoimg from '../assets/btoimg.jpeg';


const DashboardPage = () => {
    const [currentPage, setCurrentPage] = useState('default'); // Default page
    const { user } = useContext(AuthContext);
   
    useEffect(() => {
        document.body.classList.add("dashboard-body");
        return () => {
            document.body.classList.remove("dashboard-body");
        };
    }, []);


    const renderContent = () => {
      switch (currentPage) {
          default:
              return (
                  <div className="framed-content">
                      <h1>Welcome to BTO Core</h1>
                      <hr className="welcome-divider" /> {/* Horizontal line */}
                      <p>Here is what you can do within this application</p>
                      <div className="content-container">
                          <div className="text-content">
                              <ol>
                                  <li>From the Tour Tables section, you can view the approved tours and their dates. If you’re a guide, you can apply for a suitable tour and lead it. Additionally, you can see details about the tour, such as which school is attending, the date, and the number of students participating.</li>
                                  <li>In the Information table, you can access the names, surnames, roles, departments, phone numbers, and IBANs of guides and other individuals in the system. You can also view their lesson schedules.</li>
                                  <li>On the Puantaj Page, you can record and submit your workload within the monthly calendar. The system will automatically calculate your total workload, and you can then wait for your payment.</li>
                                  <li>If you have the role of an advisor or higher, you can accept or reject tour applications via the Review Tour Request section.</li>
                                  <li>In the Data Insights section, you can view graphical representations of the collected data and take rational actions accordingly.</li>
                                  <li>From the Register User section, you can add new candidate guides, guides, and advisors. You can also promote individuals to higher ranks.</li>
                                  <li>The Real-time Status section allows you to communicate with other guides during tours, track their locations, and share your own. This ensures a smoother tour experience.</li>
                                  <li>If you are a candidate guide, guide, or advisor, you can view feedback given to you by others in the Feedback Page and write feedback for them as well. If you hold the position of coordinator, secretary, or director, you can view feedback from schools regarding tours.</li>
                                  <li>From the Settings section at the bottom left, you can manage your profile information, learn more about our application and organization, and adjust your preference.</li>
                              </ol>
                          </div>
                          <div className="image-content">
                              <img src={welcomeImage} alt="Welcome 1" className="welcome-image" />
                              <img src={btoimg} alt="Welcome 2" className="welcome-image" />
                          </div>
                      </div>
                  </div>
              );
      }
  };

  return (
    <div style={{ display: 'flex' }}>
        <Sidebar setCurrentPage={setCurrentPage} />
        <main style={{ marginLeft: '250px', padding: '20px', flexGrow: 1 }}>
            {renderContent()}
        </main>
    </div>
    );
};

export default DashboardPage;






/*import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DashboardPage.css";
import useProtectRoute from "../hooks/useProtectRoute";
import {AuthContext} from "../context/AuthContext";

const DashboardPage = () => {
  useProtectRoute("/login", [1,2,3,4]);

  const [showProfile, setShowProfile] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showDeleteUser, setShowDeleteUser] = useState(false);
  const {user} = useContext(AuthContext);
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
*/