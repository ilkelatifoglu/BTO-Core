import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "./AdvisorPage.css"; // CSS for the page
import Sidebar from "../components/common/Sidebar";
import { Toast } from "primereact/toast";
import "../components/common/CommonComp.css";
import Unauthorized from "./Unauthorized"; // Import the Unauthorized component
import useProtectRoute from "../hooks/useProtectRoute";

const daysOptions = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Weekend",
];
const token = localStorage.getItem("token");
const API_BASE_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";

const AdvisorPage = () => {
  const isAuthorized = useProtectRoute([2, 3, 4]); // Check authorization
  const [advisors, setAdvisors] = useState([]);
  const [groupedAdvisors, setGroupedAdvisors] = useState(
    daysOptions.reduce((acc, day) => ({ ...acc, [day]: [] }), {}) // Initialize grouped advisors
  );
  const advisorRefs = useRef({});
  const toast = useRef(null);

  useEffect(() => {
    const fetchAdvisors = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/advisors`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const advisorsData = response.data;

        const grouped = daysOptions.reduce(
          (acc, day) => ({ ...acc, [day]: [] }),
          {}
        );
        advisorsData.forEach((advisor) => {
          advisor.days.forEach((day) => {
            if (grouped[day]) grouped[day].push(advisor);
          });
        });

        setAdvisors(advisorsData);
        setGroupedAdvisors(grouped);

        // Show success toast
        if (toast.current) {
          toast.current.show({
            severity: "success",
            summary: "Advisors Loaded",
            detail: "Advisors have been successfully fetched.",
            life: 3000,
          });
        }
      } catch (error) {
        console.error("Error fetching advisors:", error);
        // Show error toast
        if (toast.current) {
          toast.current.show({
            severity: "error",
            summary: "Fetch Failed",
            detail: `Failed to fetch advisors: ${error.message}`,
            life: 5000,
          });
        }
      }
    };

    fetchAdvisors();
  }, []);

  const scrollToAdvisor = (id) => {
    if (advisorRefs.current[id]) {
      advisorRefs.current[id].scrollIntoView({ behavior: "smooth" });
    }
  };
  const renderDayColumn = (day) => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {groupedAdvisors[day]?.map((advisor) => (
          <div
            key={advisor.advisor_id}
            className="advisor-name-container"
            onClick={() => scrollToAdvisor(advisor.advisor_id)}
          >
            <span className="advisor-name">{advisor.advisor_name}</span>
          </div>
        ))}
      </div>
    );
  };

  if (!isAuthorized) {
    return <Unauthorized />;
  }

  return (
    <div className="advisor-page">
      <Sidebar />
      <Toast ref={toast} />
      <div className="page-container">
        <div className="page-content">
          <h1>Advisor Schedule</h1>
          <DataTable
            value={[{ key: "schedule" }]}
            className="advisor-datatable"
            style={{ width: "100%", margin: "auto" }}
          >
            {daysOptions.map((day, index) => (
              <Column
                key={index}
                field={day}
                header={<div className="advisor-datatable-header">{day}</div>}
                body={() => renderDayColumn(day)}
              />
            ))}
          </DataTable>

          <div className="advisor-details-section">
            {advisors.map((advisor) => (
              <div
                key={advisor.advisor_id}
                ref={(el) => (advisorRefs.current[advisor.advisor_id] = el)}
                className="advisor-card"
              >
                <h3 className="advisor-card-title">{advisor.advisor_name}</h3>
                <p>
                  <strong>Days:</strong> {advisor.days.join(", ")}
                </p>
                <p>
                  <strong>Candidate Guides:</strong>
                  <ul className="advisor-guides-list">
                    {advisor.candidate_guides.map((guide, index) => (
                      <li key={index} className="advisor-guide-item">
                        <strong>Name:</strong> {guide.full_name} <br />
                      </li>
                    ))}
                  </ul>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvisorPage;
