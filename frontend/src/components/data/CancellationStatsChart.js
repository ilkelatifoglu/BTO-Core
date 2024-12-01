import React from "react";
import "./CancellationStatsChart.css";

const CancellationStatsPieChart = ({ data }) => {
  const { completed, cancelled } = data.cancellationStats;
  const total = completed + cancelled;

  const getPercentage = (value) => (value / total) * 100;

  return (
    <div className="chart">
      <div className="chart-title">Cancellation Statistics</div>
      <div
        className="pie-chart"
        style={{
          background: `conic-gradient(
            #16b95a 0% ${getPercentage(completed)}%, 
            #f44336 ${getPercentage(completed)}% 100%
          )`,
        }}
      />
      <div className="legend">
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: "#16b95a" }}></span>
          <span>Completed: {completed} ({getPercentage(completed).toFixed(1)}%)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: "#f44336" }}></span>
          <span>Cancelled: {cancelled} ({getPercentage(cancelled).toFixed(1)}%)</span>
        </div>
      </div>
    </div>
  );
};

export default CancellationStatsPieChart;
