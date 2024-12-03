import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CancellationStatsChart.css";
import { fetchTourData } from "../../services/DataService";

const CancellationStatsPieChart = ({ filter }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/data/${filter}`);
        setData(response.data.tourStatusData);
      } catch (error) {
        console.error("Error fetching tour data:", error);
      }
    };
    fetchTourData();
  }, [filter]);

  if (!data) {
    return <div>Loading...</div>;
  }

  // Aggregate counts across all days
  let totalApproved = 0;
  let totalRejected = 0;

  Object.values(data).forEach((dayData) => {
    totalApproved += dayData.approved;
    totalRejected += dayData.rejected;
  });

  const total = totalApproved + totalRejected;

  // Handle case when total is zero
  if (total === 0) {
    return <div>No data available</div>;
  }

  // Compute percentages as numbers
  const approvedPercentage = (totalApproved / total) * 100;
  const rejectedPercentage = (totalRejected / total) * 100;

  // Build the gradient dynamically
  const segments = [];
  let currentPercentage = 0;

  if (approvedPercentage > 0) {
    segments.push(`#16b95a ${currentPercentage}% ${currentPercentage + approvedPercentage}%`);
    currentPercentage += approvedPercentage;
  }



  if (rejectedPercentage > 0) {
    segments.push(`#ff9800 ${currentPercentage}% ${currentPercentage + rejectedPercentage}%`);
    currentPercentage += rejectedPercentage;
  }

  const gradient = `conic-gradient(${segments.join(", ")})`;

  return (
    <div className="chart">
      <div className="chart-title">Tour Status Statistics</div>
      <div
        className="pie-chart"
        style={{
          background: gradient,
        }}
      />
      <div className="legend">
        {totalApproved > 0 && (
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: "#16b95a" }}></span>
            <span>
              Approved: {totalApproved} ({approvedPercentage.toFixed(1)}%)
            </span>
          </div>
        )}

        {totalRejected > 0 && (
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: "#ff9800" }}></span>
            <span>
              Rejected: {totalRejected} ({rejectedPercentage.toFixed(1)}%)
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CancellationStatsPieChart;
