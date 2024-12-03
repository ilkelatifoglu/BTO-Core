import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/common/Sidebar";
import ToursByCityChart from "../components/data/ToursByCityChart";
import TourDaysChart from "../components/data/TourDaysChart";
import CancellationStatsChart from "../components/data/CancellationStatsChart";
import "./DataInsightPage.css";

const DataInsightPage = () => {
  const [filter, setFilter] = useState("weekly");

  return (
    <div className="data-insight-page">
      <Sidebar />
      <div className="data-insight-content">
        <h1>Data Insights</h1>
        <div className="filter-buttons">
          {["Yearly", "Monthly", "Weekly"].map((type) => (
            <button
              key={type}
              className={filter.toLowerCase() === type.toLowerCase() ? "active" : ""}
              onClick={() => setFilter(type.toLowerCase())}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="charts">
          <TourDaysChart filter={filter} />
        </div>
      </div>
    </div>
  );
};

export default DataInsightPage;










/*
const DataInsightPage = () => {
  const [filter, setFilter] = useState("Weekly");
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Backend endpoint çağrılır
        const response = await axios.get(`http://localhost:3001/data/${filter.toLowerCase()}`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [filter]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="data-insight-page">
      <Sidebar />
      <div className="data-insight-content">
        <h1>Data Insights</h1>
        <div className="filter-buttons">
          {["Yearly", "Monthly", "Weekly"].map((type) => (
            <button
              key={type}
              className={filter === type ? "active" : ""}
              onClick={() => setFilter(type)}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="charts">
          <ToursByCityChart data={data} />
          <TourDaysChart data={data} />
          <CancellationStatsChart data={data} />
        </div>
      </div>
    </div>
  );
};

export default DataInsightPage;
*/