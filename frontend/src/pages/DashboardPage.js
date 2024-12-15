import React, { useState, useEffect, useContext } from "react";
import Sidebar from "../components/common/Sidebar";
import { AuthContext } from "../context/AuthContext";
import "./DashboardPage.css";

import btoimg2 from "../assets/btoimg2.jpeg";
import btoimg4 from "../assets/btoimg4.jpeg";
import btoimg6 from "../assets/btoimg6.jpeg";
import btoimg7 from "../assets/btoimg7.jpeg";
import btoimg8 from "../assets/btoimg8.jpeg";
import btoimg9 from "../assets/btoimg9.jpeg";

import useProtectRoute from "../hooks/useProtectRoute";
import Unauthorized from "./Unauthorized";

const DashboardPage = () => {
  const isAuthorized = useProtectRoute([1, 2, 3, 4]);
  const [currentPage, setCurrentPage] = useState("default");
  const { user } = useContext(AuthContext);

  const [currentSlide, setCurrentSlide] = useState(0);
  const images = [
    btoimg7,
    btoimg8,
    btoimg4,
    btoimg6,
    btoimg2,
    btoimg9,
  ];

  useEffect(() => {
    document.body.classList.add("dashboard-body");
    return () => {
      document.body.classList.remove("dashboard-body");
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const renderContent = () => {
    switch (currentPage) {
      default:
        return (
          <div className="dashboard-body">
            <header className="dashboard-header">
              <h1>Welcome to BTO Core</h1>
              <p>
                Your centralized platform to manage tours, guides, and feedback
                effectively.
              </p>
            </header>
            <div className="dashboard-content">
              {/* Slayt Gösterisi */}
              <div className="slideshow-container">
                <img
                  src={images[currentSlide]}
                  alt="Slideshow"
                  className="dashboard-image"
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    transition: "opacity 1s ease-in-out",
                  }}
                />
              </div>

              {/* Cards Section */}
              <div className="features-section">
                <div className="feature-card">
                  <h2>Tour Tables</h2>
                  <p>View approved tours, dates, and tour details.</p>
                </div>
                <div className="feature-card">
                  <h2>Feedback Page</h2>
                  <p>
                    Provide and receive feedback to ensure continuous
                    improvement.
                  </p>
                </div>
                <div className="feature-card">
                  <h2>Puantaj Page</h2>
                  <p>
                    Submit workloads and calculate payments within a monthly
                    calendar.
                  </p>
                </div>
                <div className="feature-card">
                  <h2>Review Tour Requests</h2>
                  <p>
                    Approve or reject tour applications as an advisor or higher
                    role.
                  </p>
                </div>
                <div className="feature-card">
                  <h2>Data Insights</h2>
                  <p>Analyze graphical data and make informed decisions.</p>
                </div>
                <div className="feature-card">
                  <h2>Real-Time Status</h2>
                  <p>Track, communicate, and ensure smooth tour experiences.</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  if (!isAuthorized) {
    return <Unauthorized />;
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar setCurrentPage={setCurrentPage} />
      <main style={{ marginLeft: "250px", padding: "20px", flexGrow: 1 }}>
        {renderContent()}
      </main>
    </div>
  );
};

export default DashboardPage;
