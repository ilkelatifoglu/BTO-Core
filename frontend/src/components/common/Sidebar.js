import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import defaultProfileImage from "../../assets/profile.jpg";
import { Toast } from "primereact/toast";

// Module-level variables to cache profile image and user profile
let cachedProfileImage = null;
let cachedUserProfile = null;
let cachedUserId = null;

const token = localStorage.getItem("token");
const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";

// Add this helper function at the component level
const getNameFontSize = (name) => {
  if (!name) return "0.85rem";
  const length = name.length;
  if (length > 20) return "0.75rem";
  if (length > 15) return "0.8rem";
  return "0.85rem";
};

const getRoleText = (userType) => {
  switch (userType) {
    case 4:
      return "Coordinator";
    case 3:
      return "Advisor";
    case 2:
      return "Guide";
    case 1:
      return "Candidate Guide";
    default:
      return "User";
  }
};

const Sidebar = ({ setCurrentPage }) => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPicture, setIsLoadingPicture] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [userType, setUserType] = useState(null);
  const toast = useRef(null);
  const [currentPath, setCurrentPath] = useState(
    window.location.pathname.substring(1)
  );

  const handleNavigation = (page) => {
    if (page === "logout") {
      cachedProfileImage = null;
      cachedUserProfile = null;
      cachedUserId = null;
      localStorage.clear();
      navigate("/login");
    } else {
      setCurrentPath(page);
      navigate(`/${page}`);
    }
  };

  // Helper function to get user ID from localStorage
  const getUserId = () => {
    return localStorage.getItem("userId");
  };

  // Function to fetch profile picture from backend
  const fetchProfilePicture = async () => {
    const userId = getUserId();
    if (!userId) return;

    setIsLoadingPicture(true);
    try {
      if (!token) throw new Error("Authentication token is missing.");

      const url = `${API_URL}/profile/get-profile-picture/${userId}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { profile_picture_data, profile_picture_mime_type } = response.data;
      const imageSrc = `data:${profile_picture_mime_type};base64,${profile_picture_data}`;
      setProfileImage(imageSrc);
      cachedProfileImage = imageSrc;
    } catch (error) {
      // Silently fall back to default profile image
      setProfileImage(defaultProfileImage);
    } finally {
      setIsLoadingPicture(false);
    }
  };

  // Function to fetch user profile from backend
  const fetchUserProfile = async () => {
    const userId = getUserId();
    if (!userId) return;

    setIsLoadingProfile(true);
    try {
      const response = await axios.get(`${API_URL}/profile/getProfile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { firstName, lastName } = response.data;
      setUserName(`${firstName} ${lastName}`);
      cachedUserProfile = { firstName, lastName };
      // Clear the reload flag if request succeeds
      localStorage.removeItem("profileLoadAttempted");
    } catch (error) {
      console.error("Failed to load user profile details:", error);

      // Check if we've already attempted a reload
      if (!localStorage.getItem("profileLoadAttempted")) {
        localStorage.setItem("profileLoadAttempted", "true");
        window.location.reload();
      } else {
        // If we've already tried reloading once, just set default name
        setUserName("User");
        localStorage.removeItem("profileLoadAttempted"); // Reset for next time
      }
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Combined function to fetch both profile picture and user profile
  const fetchUserData = async () => {
    const currentUserId = getUserId();
    await Promise.all([fetchProfilePicture(), fetchUserProfile()]);
    cachedUserId = currentUserId; // Cache the user ID after successful fetch
  };

  useEffect(() => {
    const currentUserId = getUserId();
    setIsLoading(true);

    if (!currentUserId) {
      setIsLoading(false);
      return;
    }

    if (cachedUserId !== currentUserId) {
      // Clear cache if different user
      cachedProfileImage = null;
      cachedUserProfile = null;
      cachedUserId = null;

      fetchUserData().finally(() => setIsLoading(false));
    } else if (cachedProfileImage && cachedUserProfile) {
      // Use cache if same user
      setProfileImage(cachedProfileImage);
      setUserName(
        `${cachedUserProfile.firstName} ${cachedUserProfile.lastName}`
      );
      setIsLoading(false);
    } else {
      // Fetch if no cache
      fetchUserData().finally(() => setIsLoading(false));
    }
  }, []);

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    setUserType(parseInt(storedUserType, 10)); // `userType`'ı localStorage'dan al
  }, []);

  // Add useEffect to update currentPath when location changes
  useEffect(() => {
    setCurrentPath(window.location.pathname.substring(1));
  }, [window.location.pathname]);

  return (
    <div className="sidebar">
      <Toast ref={toast} />
      <div>
        <div className="sidebar__header">
          <div className="profile-container">
            <div className="profile-content">
              <div className="profile-picture-wrapper">
                <img
                  src={profileImage || defaultProfileImage}
                  alt="Profile"
                  className={`profile-picture ${
                    isLoading ? "loading-blur" : ""
                  }`}
                />
                <button
                  className={`refresh-button ${
                    isLoadingPicture || isLoadingProfile ? "loading" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    fetchUserData();
                  }}
                  disabled={isLoadingPicture || isLoadingProfile}
                  title="Refresh Profile"
                >
                  <i className="pi pi-refresh"></i>
                </button>
              </div>
              <div className="user-info">
                <h2 className="user-name">{userName || "User"}</h2>
                <span className="user-role">{getRoleText(userType)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="sidebar__divider"></div>

        <ul className="sidebar__menu">
          <li
            className={`menu__item ${
              currentPath === "dashboard" ? "active" : ""
            }`}
            onClick={() => handleNavigation("dashboard")}
          >
            <i className="pi pi-home"></i>
            <span>Dashboard</span>
          </li>
          {(userType === 4 ||
            userType === 3 ||
            userType === 2 ||
            userType === 1) && (
            <li
              className={`menu__item ${
                currentPath === "assign-tour" ? "active" : ""
              }`}
              onClick={() => handleNavigation("assign-tour")}
            >
              <i className="pi pi-table"></i>
              <span>Tour Assignment</span>
            </li>
          )}
          {(userType === 4 || userType === 3 || userType === 2) && (
            <li
              className={`menu__item ${
                currentPath === "guideInfo" ? "active" : ""
              }`}
              onClick={() => handleNavigation("guideInfo")}
            >
              <i className="pi pi-info-circle"></i>
              <span>Guide Info</span>
            </li>
          )}
          {(userType === 4 || userType === 3 || userType === 2) && (
            <li
              className={`menu__item ${
                currentPath === "puantaj-page" ? "active" : ""
              }`}
              onClick={() => handleNavigation("puantaj-page")}
            >
              <i className="pi pi-calendar"></i>
              <span>Puantaj Page</span>
            </li>
          )}
          {(userType === 4 || userType === 3) && (
            <li
              className={`menu__item ${
                currentPath === "approve-tour" ? "active" : ""
              }`}
              onClick={() => handleNavigation("approve-tour")}
            >
              <i className="pi pi-check"></i>
              <span>Tour Approval</span>
            </li>
          )}
          {userType === 4 && (
            <li
              className={`menu__item ${
                currentPath === "data-insight" ? "active" : ""
              }`}
              onClick={() => handleNavigation("data-insight")}
            >
              <i className="pi pi-chart-line"></i>
              <span>Data Insights</span>
            </li>
          )}
          {userType === 4 && (
            <li
              className={`menu__item ${
                currentPath === "manageUser" ? "active" : ""
              }`}
              onClick={() => handleNavigation("manageUser")}
            >
              <i className="pi pi-user-plus"></i>
              <span>User Management</span>
            </li>
          )}
          {(userType === 4 || userType === 3 || userType === 2) && (
            <li
              className={`menu__item ${
                currentPath === "realtime-status" ? "active" : ""
              }`}
              onClick={() => handleNavigation("realtime-status")}
            >
              <i className="pi pi-clock"></i>
              <span>Real-time Status</span>
            </li>
          )}
          {(userType === 4 ||
            userType === 3 ||
            userType === 2 ||
            userType === 1) && (
            <li
              className={`menu__item ${
                currentPath === "feedback" ? "active" : ""
              }`}
              onClick={() => handleNavigation("feedback")}
            >
              <i className="pi pi-comments"></i>
              <span>Feedback Page</span>
            </li>
          )}
          {(userType === 4 || userType === 3 || userType === 2) && (
            <li
              className={`menu__item ${
                currentPath === "advisors" ? "active" : ""
              }`}
              onClick={() => handleNavigation("advisors")}
            >
              <i className="pi pi-briefcase"></i>
              <span>Advisors</span>
            </li>
          )}
          {(userType === 4 ||
            userType === 3 ||
            userType === 2 ||
            userType === 1) && (
            <li
              className={`menu__item ${
                currentPath === "my-tours" ? "active" : ""
              }`}
              onClick={() => handleNavigation("my-tours")}
            >
              <i className="pi pi-map"></i>
              <span>My Tours</span>
            </li>
          )}
          {userType === 4 && (
            <li
              className={`menu__item ${
                currentPath === "approve-fair" ? "active" : ""
              }`}
              onClick={() => handleNavigation("approve-fair")}
            >
              <i className="pi pi-check-circle"></i>
              <span>Fair Approval</span>
            </li>
          )}
          {(userType === 4 || userType === 3 || userType === 2) && (
            <li
              className={`menu__item ${
                currentPath === "assign-fair" ? "active" : ""
              }`}
              onClick={() => handleNavigation("assign-fair")}
            >
              <i className="pi pi-users"></i>
              <span>Fair Assignment</span>
            </li>
          )}
          {(userType === 4 || userType === 3 || userType === 2) && (
            <li
              className={`menu__item ${
                currentPath === "individual-tours" ? "active" : ""
              }`}
              onClick={() => handleNavigation("individual-tours")}
            >
              <i className="pi pi-user"></i>
              <span>Individual Tours</span>
            </li>
          )}
        </ul>

        <div className="sidebar__footer">
          <button
            className={`menu__item ${
              currentPath === "Settings" ? "active" : ""
            }`}
            onClick={() => handleNavigation("Settings")}
          >
            <i className="pi pi-cog"></i>
            <span>Settings</span>
          </button>
          <button
            className="menu__item"
            onClick={() => handleNavigation("logout")}
          >
            <i className="pi pi-sign-out"></i>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
