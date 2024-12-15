import React from "react";
import "./ToursByCityChart.css";

const ToursByCityChart = ({
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

    const maxTourCount = Math.max(...Object.values(data));

    if (maxTourCount === 0) {
      content = <div>No data available</div>;
    } else {
      content = (
        <div className="bar-chart">
          {Object.entries(data).map(([city, value]) => (
            <div key={city} className="bar-container">
              <div
                className="bar"
                style={{
                  width: `${(value / maxTourCount) * 3}%`, 
                  backgroundColor: "#007BFF", 
                }}
              >
                <span className="bar-label">{`${city} - ${value}`}</span>
              </div>
            </div>
          ))}
        </div>
      );
    }
  }

  return (
    <div className="chart">
      <div className="chart-title">Number of Tours Arranged - Cities ({periodLabel})</div>
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

export default ToursByCityChart;
