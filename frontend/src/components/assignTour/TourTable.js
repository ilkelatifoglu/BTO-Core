import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { formatDate } from "../common/dateUtils";
import { MultiSelect } from "primereact/multiselect";
import AssignTourService from "../../services/AssignTourService";
import "./ReadyToursTable.css";
import io from "socket.io-client";
import FilterBar from "./FilterBar"; // Import the FilterBar component
import { Toast } from "primereact/toast"; // Import Toast

const userType = parseInt(localStorage.getItem("userType"), 10);
const socket = io("http://localhost:3001");

export default function ReadyToursTable() {
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]); 
  const [expandedRows, setExpandedRows] = useState(null); 
  const [selectedCandidates, setSelectedCandidates] = useState({});
  const [candidateGuideOptions, setCandidateGuideOptions] = useState([]);
  const [classroomInputs, setClassroomInputs] = useState({});
  const toast = useRef(null); // Create a ref for Toast

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const data = await AssignTourService.getReadyTours();
        setTours(data);
        setFilteredTours(data); 
      } catch (error) {
        console.error("Error fetching tours:", error);
        toast.current.clear();
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: error.message || "Error fetching tours.",
          life: 3000,
        });
      }
    };

    fetchTours();

    socket.on("candidateAssigned", ({ tourId, candidate_names, assignedCandidates }) => {
      setTours((prevTours) =>
        prevTours.map((tour) =>
          tour.id === tourId
            ? { ...tour, candidate_names, assignedCandidates }
            : tour
        )
      );
    });

    socket.on("guideAssigned", ({ tourId, guide_names, assignedGuides }) => {
      setTours((prevTours) =>
        prevTours.map((tour) =>
          tour.id === tourId
            ? { ...tour, guide_names, assignedGuides }
            : tour
        )
      );
    });

    return () => {
      socket.off("guideAssigned");
      socket.off("candidateAssigned");
    };
  }, []);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const candidates = await AssignTourService.getCandidateGuides();
        const formattedCandidates = candidates.map(candidate => ({
          label: candidate.name,
          value: candidate.id,
        }));
        setCandidateGuideOptions(formattedCandidates);
      } catch (error) {
        console.error("Error fetching candidate guides:", error);
        toast.current.clear();
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: error.message || "Error fetching candidate guides.",
          life: 3000,
        });
      }
    };
    fetchCandidates();
  }, []);

  const handleFilterChange = (filters) => {
    const filtered = tours.filter((tour) => {
      const matchDate = !filters.date || new Date(tour.date).toDateString() === filters.date.toDateString();
      const matchDay = !filters.day || tour.day === filters.day;
      const matchTime = !filters.time || tour.time.includes(filters.time);
      const matchSchool = !filters.school || tour.school_name.toLowerCase().includes(filters.school.toLowerCase());
      const matchCity = !filters.city || tour.city.toLowerCase().includes(filters.city.toLowerCase());
      const matchGuide = !filters.guide ||
        (tour.guide_names && tour.guide_names.toLowerCase().includes(filters.guide.toLowerCase()));

      return matchDate && matchDay && matchTime && matchSchool && matchCity && matchGuide;
    });
    setFilteredTours(filtered);
  };

  const handleAssignGuide = async (rowData) => {
    const { school_name, city, date, time } = rowData;
    const userId = localStorage.getItem("userId");
    const userType = localStorage.getItem("userType");

    try {
      const response = await AssignTourService.assignGuideToTour({
        school_name,
        city,
        date,
        time,
        user_id: userId,
        user_type: userType
      });
      toast.current.clear();
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: response.message,
        life: 3000,
      });

      const updatedTours = await AssignTourService.getReadyTours();
      setTours(updatedTours);
      setFilteredTours(updatedTours);
    } catch (error) {
      console.error("Error assigning guide:", error);
      toast.current.clear();
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Error assigning guide.",
        life: 3000,
      });
    }
  };

  const handleAssignCandidates = async (rowData, selectedCandidates) => {
    const { school_name, city, date, time } = rowData;

    try {
      const response = await AssignTourService.assignCandidateGuidesToTour({
        school_name,
        city,
        date,
        time,
        user_ids: selectedCandidates,
      });
      toast.current.clear();
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: response.message,
        life: 3000,
      });

      const updatedTours = await AssignTourService.getReadyTours();
      setTours(updatedTours);
      setFilteredTours(updatedTours);
      setSelectedCandidates(prevState => ({
        ...prevState,
        [rowData.id]: []
      }));
    } catch (error) {
      console.error("Error assigning candidate guides:", error);
      toast.current.clear();
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Error assigning candidate guides.",
        life: 3000,
      });
    }
  };

  const handleInputChange = (id, value) => {
    setClassroomInputs((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleClassroomUpdate = async (tourId) => {
    try {
      const classroom = classroomInputs[tourId];
      if (!classroom) {
        toast.current.clear();
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Classroom input cannot be empty.",
          life: 3000,
        });
        return;
      }

      const response = await AssignTourService.updateClassroom(tourId, classroom);
      toast.current.clear();
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: response.message,
        life: 3000,
      });

      setClassroomInputs((prev) => ({
        ...prev,
        [tourId]: "",
      }));

      const updatedTours = await AssignTourService.getReadyTours();
      setTours(updatedTours);
      setFilteredTours(updatedTours);
    } catch (error) {
      console.error("Error updating classroom:", error);
      toast.current.clear();
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Error updating classroom.",
        life: 3000,
      });
    }
  };

  const formatTime = (time) => {
    if (typeof time !== 'string') {
      return '';
    }
    return time.slice(0, 5);
  };

  const rowExpansionTemplate = (data) => {
    const guideNames = data.guide_names || "No guides assigned yet.";
    const candidateNames = data.candidate_names || "No candidates assigned yet.";

    const guideLinks = guideNames
      .split(',')
      .map((name, index) => `<a href="#guide-${index}" class="guide-link">${name.trim()}</a>`)
      .join(', ');
    const candidateLinks = candidateNames
      .split(',')
      .map((name, index) => `<a href="#candidate-${index}" class="candidate-link">${name.trim()}</a>`)
      .join(', ');

    return (
      <div className="p-3">
        <h4>Assigned Guides:</h4>
        <p dangerouslySetInnerHTML={{ __html: guideLinks }}></p>

        <h4>Assigned Candidates:</h4>
        <p dangerouslySetInnerHTML={{ __html: candidateLinks }}></p>
      </div>
    );
  };

  const rowClassName = (data) => {
    if (data.tour_status === "CANCELLED") return "cancelled-row";
    if (data.tour_status === "DONE") return "done-row";
    return "";
  };

  return (
    <div className="assign-tour-container">
      <Toast ref={toast} /> {/* Added Toast here */}
      <h1 className="table-title">Tour Assignment</h1>
      <FilterBar onFilterChange={handleFilterChange} />
      <div className="assign-tour-table">
        <DataTable
          value={filteredTours}
          paginator
          rows={50}
          className="p-datatable-striped"
          tableStyle={{ width: "100%" }}
          rowClassName={rowClassName}
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          rowExpansionTemplate={rowExpansionTemplate}
        >
          <Column
            field="date"
            header="Date"
            body={(rowData) => formatDate(rowData.date)}
            style={{ width: "10%" }}
          ></Column>

          <Column field="day" header="Day" style={{ width: "10%" }}></Column>

          <Column
            field="time"
            header="Time"
            body={(rowData) => formatTime(rowData.time)}
            style={{ width: "10%" }}
          ></Column>

          {(localStorage.getItem("userType") === '3' ||
            localStorage.getItem("userType") === '4' ||
            localStorage.getItem("userType") === '2') && (
            <>
              <Column field="school_name" header="School" style={{ width: "20%" }}></Column>
              <Column field="city" header="City" style={{ width: "10%" }}></Column>
              <Column field="tour_size" header="Tour Size" style={{ width: "10%" }}></Column>
              <Column
                field="classroom"
                header="Classroom"
                body={(rowData) => {
                  if (
                    rowData.classroom === null &&
                    rowData.tour_status === "READY" &&
                    (localStorage.getItem("userType") === "4" || localStorage.getItem("userType") === "3")
                  ) {
                    return (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px" }}>
                        <input
                          type="text"
                          value={classroomInputs[rowData.id] || ""}
                          onChange={(e) => handleInputChange(rowData.id, e.target.value)}
                          placeholder="Enter Classroom"
                          style={{ marginRight: "10px" }}
                        />
                        <Button
                          label="Save"
                          icon="pi pi-check"
                          className="p-button-sm p-button-success"
                          onClick={() => handleClassroomUpdate(rowData.id)}
                          disabled={!classroomInputs[rowData.id]}
                        />
                      </div>
                    );
                  }
                  return rowData.classroom || "Not Assigned";
                }}
                style={{ width: "15%" }}
              />
            </>
          )}

          {(localStorage.getItem("userType") === '3' ||
            localStorage.getItem("userType") === '4' ||
            localStorage.getItem("userType") === '2') && (
            <Column
              field="assigned_guides"
              header="Guide #"
              body={(rowData) =>
                `${rowData.assigned_guides || 0} / ${rowData.guide_count}`
              }
              style={{ width: "10%" }}
            ></Column>
          )}

          {(localStorage.getItem("userType") === '3' ||
            localStorage.getItem("userType") === '4' ||
            localStorage.getItem("userType") === '2') && (
            <Column
              field="assigned_candidates"
              header="Candidate #"
              body={(rowData) =>
                `${rowData.assigned_candidates || 0} / ${rowData.guide_count}`
              }
              style={{ width: "10%" }}
            ></Column>
          )}

          {(localStorage.getItem("userType") === '3' ||
            localStorage.getItem("userType") === '4' ||
            localStorage.getItem("userType") === '2') && (
            <Column
              header="Be Guide"
              body={(rowData) => {
                if (rowData.tour_status === "READY") {
                  return (
                    <Button
                      icon="pi pi-plus"
                      className="p-button-rounded p-button-success"
                      onClick={() => handleAssignGuide(rowData)}
                      style={{ width: "45px" }}
                    />
                  );
                }
                return null;
              }}
              style={{ width: "10%" }}
            ></Column>
          )}

          {(localStorage.getItem("userType") === '3' ||
            localStorage.getItem("userType") === '4') && (
            <Column
              header="Assign Candidate"
              body={(rowData) => {
                if (rowData.tour_status === "READY") {
                  const selectedForTour = selectedCandidates[rowData.id] || [];
                  return (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <MultiSelect
                        value={selectedForTour}
                        options={candidateGuideOptions}
                        onChange={(e) => {
                          setSelectedCandidates((prev) => ({
                            ...prev,
                            [rowData.id]: e.value,
                          }));
                        }}
                        placeholder="Select Candidates"
                        display="chip"
                        className="p-multiselect-dropdown scrollable-multiselect"
                        style={{ width: "100%", whiteSpace: "nowrap", maxWidth: "200px" }}
                      />
                      <Button
                        label="Confirm"
                        icon="pi pi-check"
                        className="p-button-sm p-button-rounded p-button-success"
                        onClick={() => handleAssignCandidates(rowData, selectedForTour)}
                        disabled={selectedForTour.length === 0}
                        style={{ alignSelf: "center", width: "60%" }}
                      />
                    </div>
                  );
                }
                return null;
              }}
              style={{ width: "20%" }}
            ></Column>
          )}

          <Column expander style={{ width: '3rem' }} />
        </DataTable>
      </div>
    </div>
  );
}
