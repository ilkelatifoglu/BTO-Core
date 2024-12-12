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

const Sidebar = ({ setCurrentPage }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPicture, setIsLoadingPicture] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [userType, setUserType] = useState(null);
  const toast = useRef(null);

  // Add new state for current path
  const [currentPath, setCurrentPath] = useState(
    window.location.pathname.substring(1)
  );

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

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
      const token =
        localStorage.getItem("token") || localStorage.getItem("tempToken");
      if (!token) throw new Error("Authentication token is missing.");

      const url = `${process.env.REACT_APP_BACKEND_URL}/profile/get-profile-picture/${userId}`;
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
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/profile/getProfile`,
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("token") || localStorage.getItem("tempToken")
            }`,
          },
        }
      );

      const { firstName, lastName } = response.data;
      setUserName(`${firstName} ${lastName}`);
      cachedUserProfile = { firstName, lastName };
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error Loading Profile",
        detail: "Failed to load user profile details. Please try again later.",
        life: 3000,
      });
      setUserName("User");
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
    <div style={{ display: "flex" }}>
      <div className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}>
        <Toast ref={toast} position="top-right" />
        <button
          className="sidebar__toggle"
          onClick={toggleSidebar}
          style={{ marginRight: "15px" }}
        >
          {isExpanded ? "<<" : ">>"}
        </button>
        <div className="sidebar__header">
          <div className="profile-container">
            <div className="profile-picture-wrapper">
              <img
                src={profileImage || defaultProfileImage}
                alt="Profile"
                className={`profile-picture ${isLoading ? "loading-blur" : ""}`}
              />
              {isExpanded && !isLoadingPicture && (
                <button
                  className="refresh-button"
                  onClick={fetchUserData}
                  disabled={isLoadingPicture || isLoadingProfile}
                  title="Refresh Profile and Name"
                >
                  <i className="pi pi-refresh"></i>
                </button>
              )}
            </div>
            {isExpanded && <h2>{userName || "User"}</h2>}
          </div>
        </div>
        {/* Divider */}
        {isExpanded && <div className="sidebar__divider"></div>}

        {isExpanded && <p className="sidebar__dashboard">Dashboard</p>}

        <ul className="sidebar__menu">
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
              {isExpanded && <span>Tour Assignment</span>}
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
              {isExpanded && <span>Guide Info</span>}
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
              {isExpanded && <span>Puantaj Page</span>}
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
              {isExpanded && <span>Tour Approval</span>}
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
              {isExpanded && <span>Data Insights</span>}
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
              {isExpanded && <span>User Management</span>}
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
              {isExpanded && <span>Real-time Status</span>}
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
              {isExpanded && <span>Feedback Page</span>}
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
              {isExpanded && <span>Advisors</span>}
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
              {isExpanded && <span>My Tours</span>}
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
              {isExpanded && <span>Fair Approval</span>}
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
              {isExpanded && <span>Fair Assignment</span>}
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
              {isExpanded && <span>Individual Tours</span>}
            </li>
          )}
        </ul>
        <div className="sidebar__footer">
          <button
            className="menu__item"
            onClick={() => handleNavigation("Settings")}
          >
            <i className="pi pi-cog"></i>
            {isExpanded && <span>Settings</span>}
          </button>
          <button
            className="menu__item"
            onClick={() => handleNavigation("logout")}
          >
            <i className="pi pi-sign-out"></i>
            {isExpanded && <span>Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
