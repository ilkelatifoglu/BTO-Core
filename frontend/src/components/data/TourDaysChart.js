import React, { useState, useEffect } from "react";
import "./TourDaysChart.css";
import { fetchTourData } from "../../services/DataService";

const TourDaysChart = ({ filter }) => {
  const [tourDays, setTourDays] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchTourData(filter.toLowerCase());
        setTourDays(result.tourDays); // Use tourDays from the response
      } catch (error) {
        console.error("Error fetching tour data:", error);
      }
    };

    fetchData();
  }, [filter]);
  if (!tourDays || Object.keys(tourDays).length === 0) {
    return <div>Loading...</div>;
  }
  const totalTours = Object.values(tourDays).reduce((a, b) => a + b, 0);

  const getPercentage = (value) => (value / totalTours) * 100;

  const predefinedColors = [
    "#FF5733", // Monday - Red
    "#FFC300", // Tuesday - Yellow
    "#28A745", // Wednesday - Green
    "#17A2B8", // Thursday - Cyan
    "#007BFF", // Friday - Blue
    "#6F42C1", // Saturday - Purple
    "#FD7E14", // Sunday - Orange
  ];

  const getConicGradient = () => {
    let cumulativeOffset = 0;
    const segments = Object.entries(tourDays).map(([day, value], index) => {
      const percentage = getPercentage(value); // Calculate percentage of each segment
      const start = cumulativeOffset; // Start offset for the current segment
      const end = cumulativeOffset + percentage; // End offset for the current segment
      cumulativeOffset = end; // Update cumulative offset

      return `${predefinedColors[index]} ${start.toFixed(1)}% ${end.toFixed(1)}%`;
    });
    return `conic-gradient(${segments.join(", ")})`; // Join segments into a conic-gradient
  };

  return (
    <div className="chart">
      <div className="chart-title">Tour Distribution by Day</div>
      <div
        className="pie-chart"
        style={{
          background: getConicGradient(),
        }}
      ></div>
      <div className="legend">
        {Object.entries(tourDays).map(([day, value], index) => (
          <div key={day} className="legend-item">
            <span
              className="legend-color"
              style={{
                backgroundColor: predefinedColors[index],
              }}
            ></span>
            <span className="legend-text">{`${day}: ${getPercentage(value).toFixed(
              1
            )}% (${value} tours)`}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TourDaysChart;
