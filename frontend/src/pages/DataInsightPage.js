import React, { useState, useEffect } from "react";
import Sidebar from "../components/common/Sidebar";
import TourDaysChart from "../components/data/TourDaysChart";
import CancellationStatsPieChart from "../components/data/CancellationStatsChart";
import ToursByCityChart from "../components/data/ToursByCityChart"; // Import the new component
import { fetchTourData } from "../services/DataService"; // Import the data fetching function
import "./DataInsightPage.css";

const DataInsightPage = () => {
  const [filter, setFilter] = useState("weekly");
  const [tourData, setTourData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchTourData(filter);
        setTourData(data);
      } catch (error) {
        console.error("Error fetching tour data:", error);
      }
    };

    getData();
  }, [filter]);

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
          {tourData ? (
            <>
              <TourDaysChart data={tourData.tourDays} />
              <CancellationStatsPieChart data={tourData.tourStatusData} />
              <ToursByCityChart data={tourData.toursByCity} /> {/* Add the new chart */}
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataInsightPage;

