import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const API_BASE_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";
const token = localStorage.getItem("token");

const AdvisorTable = () => {
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAdvisors = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/advisors`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAdvisors(response.data);
      } catch (error) {
        console.error("Error fetching advisors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvisors();
  }, []);

  const renderCandidateGuides = (rowData) => {
    return (
      <ul>
        {rowData.candidate_guides?.map((guide, index) => (
          <li key={index}>
            {guide.full_name} ({guide.department})
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <h1>Advisor Table</h1>
      <DataTable
        value={advisors}
        responsiveLayout="scroll"
        loading={loading}
        style={{ width: "80%", margin: "auto" }}
      >
        <Column field="advisor_name" header="Advisor Name"></Column>
        <Column
          field="days"
          header="Days"
          body={(rowData) => rowData.days.join(", ")}
        ></Column>
        <Column header="Candidate Guides" body={renderCandidateGuides}></Column>
      </DataTable>
    </div>
  );
};

export default AdvisorTable;
