import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import AssignTourService from "../../services/AssignTourService";
import "./ReadyToursTable.css";

export default function ReadyToursTable() {
  const [tours, setTours] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const data = await AssignTourService.getReadyTours();
        setTours(data);
      } catch (error) {
        console.error("Error fetching tours:", error);
      }
    };

    fetchTours();
  }, []);

  const handleAssignGuide = async (rowData) => {
    const { school_name, city, date } = rowData; // Get school_name, city, and date from the row data
  
    try {
      const response = await AssignTourService.assignGuideToTour({
        school_name,
        city,
        date,
      });
      setMessage(response.message); // Display success message
  
      // Refresh tours after assignment
      const updatedTours = await AssignTourService.getReadyTours();
      setTours(updatedTours);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error assigning guide to tour"); // Display error message
    }
  };
  

  const actionTemplate = (rowData) => {
    return (
      <Button
        icon="pi pi-plus"
        className="p-button-rounded p-button-success"
        onClick={() => handleAssignGuide(rowData)}
      />
    );
  };
  

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  const formatTime = (time) => {
    return time.slice(0, 5); // Extract HH:mm
  };

  return (
    <div className="assign-tour-container">
      <h1 className="table-title">Tour Assignment</h1>
      {message && <p className="message">{message}</p>}
      <div className="assign-tour-table">
        <DataTable
          value={tours}
          className="p-datatable-striped"
          tableStyle={{ width: "100%" }}
        >
          <Column
            field="date"
            header="Date"
            body={(rowData) => formatDate(rowData.date)}
          ></Column>
          <Column field="day" header="Day"></Column>
          <Column
            field="time"
            header="Time"
            body={(rowData) => formatTime(rowData.time)}
          ></Column>
          <Column field="school_name" header="School"></Column>
          <Column field="city" header="City"></Column>
          <Column field="tour_size" header="Tour Size"></Column>
          <Column
            field="guide_count"
            header="Guide #"
            body={(rowData) =>
              `${rowData.assignedGuides || 0} / ${rowData.guide_count}`
            }
          ></Column>
          <Column header="Action" body={actionTemplate}></Column>
        </DataTable>
      </div>
    </div>
  );
}
