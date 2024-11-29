import React from "react";
import "./ToursByCityChart.css";

const ToursByCityChart = ({ data }) => {
  return (
    <div className="chart">
      <div className="chart-title">Number of Tours Arranged - Cities</div>
      <div className="bar-chart">
        {Object.entries(data.toursByCity).map(([city, value]) => (
          <div
            key={city}
            className="bar"
            style={{ width: `${value * 0.5}%` }} /* Bar genişliğini azaltmak için çarpan oranı küçültüldü */
          >
            <span>{city} - {value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToursByCityChart;
