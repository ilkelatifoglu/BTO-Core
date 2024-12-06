import React from "react";
import "./TourDaysChart.css";

const TourDaysChart = ({
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
    const tourDays = data;
    const totalTours = Object.values(tourDays).reduce((a, b) => a + b, 0);

    if (totalTours === 0) {
      content = <div>No data available</div>;
    } else {
      const dayColors = {
        Monday: "#FF5733",
        Tuesday: "#FFC300",
        Wednesday: "#28A745",
        Thursday: "#17A2B8",
        Friday: "#007BFF",
        Saturday: "#6F42C1",
        Sunday: "#FD7E14",
      };

      const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

      const getPercentage = (value) => (value / totalTours) * 100;

      const getConicGradient = () => {
        let cumulativeOffset = 0;
        const segments = daysOrder.map((day) => {
          const value = tourDays[day] || 0;
          const percentage = getPercentage(value);
          const start = cumulativeOffset;
          const end = cumulativeOffset + percentage;
          cumulativeOffset = end;

          return `${dayColors[day]} ${start.toFixed(1)}% ${end.toFixed(1)}%`;
        });
        return `conic-gradient(${segments.join(", ")})`;
      };

      content = (
        <>
          <div
            className="pie-chart"
            style={{
              background: getConicGradient(),
            }}
          ></div>
          <div className="legend">
            {daysOrder.map((day) => {
              const value = tourDays[day] || 0;
              const percentage = getPercentage(value);
              return (
                <div key={day} className="legend-item">
                  <span
                    className="legend-color"
                    style={{
                      backgroundColor: dayColors[day],
                    }}
                  ></span>
                  <span className="legend-text">{`${day}: ${percentage.toFixed(
                    1
                  )}% (${value} tours)`}</span>
                </div>
              );
            })}
          </div>
        </>
      );
    }
  }

  return (
    <div className="chart">
      <div className="chart-title">Tour Distribution by Day ({periodLabel})</div>
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

export default TourDaysChart;
