import React from "react";
import "./ToursByCityChart.css";
import { fetchTourData } from "../../services/DataService";

const ToursByCityChart = ({ data }) => {
  return (
    <div className="chart">
      <div className="chart-title">Number of Tours Arranged - Cities</div>
      <div className="bar-chart">
        {Object.entries(data).map(([city, value]) => (
          <div
            key={city}
            className="bar"
            style={{ width: `${value * 1}%` }} // Adjust bar width as needed
          >
            <span>
              {city} - {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToursByCityChart;
