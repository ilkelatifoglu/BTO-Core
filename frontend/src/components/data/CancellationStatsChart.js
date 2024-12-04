import React from "react";
import "./CancellationStatsChart.css";

const CancellationStatsPieChart = ({ data }) => {
  if (!data) {
    return <div>No data available</div>;
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
    segments.push(`#ff0000 ${currentPercentage}% ${currentPercentage + rejectedPercentage}%`);
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
            <span className="legend-color" style={{ backgroundColor: "#ff0000" }}></span>
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
