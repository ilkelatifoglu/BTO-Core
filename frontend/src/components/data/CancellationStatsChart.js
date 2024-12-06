import React from "react";
import "./CancellationStatsChart.css";

const CancellationStatsPieChart = ({
  data,
  startDate,
  endDate,
  periodIndex,
  handlePrevious,
  handleNext,
  maxPeriod,
}) => {
  const periodLabel = `${startDate} - ${endDate}`;

  let content;

  if (!data || Object.keys(data).length === 0) {
    content = <div>No data available</div>;
  } else {
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
      content = <div>No data available</div>;
    } else {
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

      content = (
        <>
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
        </>
      );
    }
  }

  return (
    <div className="chart">
      <div className="chart-title">Tour Status Statistics ({periodLabel})</div>
      {content}
      <div className="navigation-buttons">
        <button onClick={handlePrevious} disabled={periodIndex >= maxPeriod}>
          Previous
        </button>
        <button onClick={handleNext} disabled={periodIndex <= 0}>
          Next
        </button>
      </div>
    </div>
  );
};

export default CancellationStatsPieChart;
