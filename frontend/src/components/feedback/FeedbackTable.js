import React, { useState, useEffect, useRef } from "react";
import FeedbackService from "../../services/FeedbackService";
import FeedbackForm from "./FeedbackForm";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import "../common/CommonComp.css";
import FilterBar from "./FilterBar"; // <-- Import the new FilterBar component


const FeedbackTable = () => {
  const [feedback, setFeedback] = useState([]);
  const [filteredFeedback, setFilteredFeedback] = useState([]); 
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [editData, setEditData] = useState(null);
  const toast = useRef(null);

  // Get logged-in user ID
  const loggedInUserId = parseInt(localStorage.getItem("userId"), 10);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    const userId = localStorage.getItem("userId");
    const userType = localStorage.getItem("userType");
    try {
      const data = await FeedbackService.getFeedbackByRole(userId, userType);
      setFeedback(data);
      setFilteredFeedback(data); // initially show all
    } catch (error) {
      console.error("Error fetching feedback:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load feedback.",
        life: 3000,
      });
    }
  };

  const handleViewFeedback = (rowData) => {
    setPopupContent(rowData.text_feedback);
    setPopupVisible(true);
  };

  const handleDeleteFeedback = async (feedbackId) => {
    try {
      if (!feedbackId) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Invalid feedback ID.",
          life: 3000,
        });
        return;
      }
  
      await FeedbackService.deleteFeedback(feedbackId);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Feedback deleted successfully.",
        life: 3000,
      });
      fetchFeedback(); // Refresh feedback list
    } catch (error) {
      console.error("Error deleting feedback:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Failed to delete feedback.",
        life: 3000,
      });
    }
  };
  
  const handleAddFeedback = () => {
    setEditData(null); // Reset edit data for creating a new feedback
    setFormVisible(true); // Open the feedback form
  };
  

  // const handleFormSubmit = async (feedbackData) => {
  //   try {
  //     if (feedbackData.feedbackId) {
  //       // Update feedback
  //       await FeedbackService.updateFeedback(feedbackData);
  //       toast.current.show({
  //         severity: "success",
  //         summary: "Success",
  //         detail: "Feedback updated successfully.",
  //       });
  //     } else {
  //       // Create feedback
  //       await FeedbackService.createFeedback(feedbackData);
  //       toast.current.show({
  //         severity: "success",
  //         summary: "Success",
  //         detail: "Feedback created successfully.",
  //       });
  //     }
  //     fetchFeedback();
  //     setFormVisible(false);
  //   } catch (error) {
  //     toast.current.show({
  //       severity: "error",
  //       summary: "Error",
  //       detail: "Failed to save feedback.",
  //     });
  //   }
  // };

  const handleEditFeedback = async (rowData) => {
    try {
      // Fetch user details
      const users = await FeedbackService.getUsersByIds(rowData.user_ids);
  
      const guidesWithNames = users
        .filter((user) => user.user_type !== 1)
        .map((user) => ({ label: `${user.first_name} ${user.last_name}`, value: user.id }));
  
      const candidatesWithNames = users
        .filter((user) => user.user_type === 1)
        .map((user) => ({ label: `${user.first_name} ${user.last_name}`, value: user.id }));
  
      const allTaggedUsers = [...guidesWithNames, ...candidatesWithNames];
  
      setEditData({
        ...rowData,
        all_tagged_users: allTaggedUsers, // Ensures valid values
      });
  
      setFormVisible(true);
    } catch (error) {
      console.error("Error fetching user details:", error.message);
    }
  };
  
  

  const handleFilterChange = (filters) => {
    const { date, schoolOrIndividual, name, sender, city } = filters;
  
    const filtered = feedback.filter((entry) => {
      // Match date
      let matchDate = true;
      if (date) {
        const entryDate = new Date(entry.tour_date).toDateString();
        const selectedDate = new Date(date).toDateString();
        matchDate = entryDate === selectedDate;
      }
  
      // Match school/individual
      let matchSchoolOrIndividual = true;
      if (schoolOrIndividual) {
        matchSchoolOrIndividual = entry.school_name
          ?.toLowerCase()
          .includes(schoolOrIndividual.toLowerCase());
      }
  
      // Match sender
      let matchSender = true;
      if (sender) {
        matchSender = entry.sender_name
          ?.toLowerCase()
          .includes(sender.toLowerCase());
      }
  
      // Match name (tagged guides or candidates)
      let matchName = true;
      if (name) {
        const searchTerm = name.toLowerCase();
        const guidesMatched =
          Array.isArray(entry.tagged_guides) &&
          entry.tagged_guides.some((g) => g.toLowerCase().includes(searchTerm));
        const candidatesMatched =
          Array.isArray(entry.tagged_candidates) &&
          entry.tagged_candidates.some((c) =>
            c.toLowerCase().includes(searchTerm)
          );
  
        if (!guidesMatched && !candidatesMatched) {
          matchName = false;
        }
      }
  
      // Match city
      let matchCity = true;
      if (city) {
        matchCity = entry.city?.toLowerCase().includes(city.toLowerCase());
      }
  
      return matchDate && matchSchoolOrIndividual && matchSender && matchName && matchCity;
    });
  
    setFilteredFeedback(filtered);
  };
  

  return (
    <div>
      <Toast ref={toast} />
      <FilterBar onFilterChange={handleFilterChange} />

      <DataTable value={filteredFeedback} paginator
                rows={15} responsiveLayout="scroll">
        <Column
          field="tour_date"
          header="Date"
          body={(rowData) => {
            const date = new Date(rowData.tour_date);
            return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
              .toString()
              .padStart(2, "0")}/${date.getFullYear()}`;
          }}
        />
        <Column field="school_name" header="School/Individual" />
        <Column field="city" header="City" />
        <Column field="tour_size" header="Tour Size" />
        <Column
          field="tagged_guides"
          header="Tagged Guides"
          body={(rowData) =>
            Array.isArray(rowData.tagged_guides) && rowData.tagged_guides.length > 0
              ? rowData.tagged_guides.map((name, index) => <div key={index}>{name}</div>)
              : "No Guides"
          }
        />
        <Column
          field="tagged_candidates"
          header="Tagged Candidates"
          body={(rowData) =>
            Array.isArray(rowData.tagged_candidates) && rowData.tagged_candidates.length > 0
              ? rowData.tagged_candidates.map((candidate, index) => (
                  <div key={index}>{candidate}</div>
                ))
              : "No Candidates"
          }
        />
        <Column field="sender_name" header="Sender" />
        <Column
          header="Feedback"
          body={(rowData) => (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Button
                icon="pi pi-eye" // Eye icon for view
                className="p-button-rounded p-button-info"
                tooltip="View"
                tooltipOptions={{ position: "top" }}
                style={{ backgroundColor: "rgb(0, 74, 119)", border: "none", color: "#fff" }}
                onClick={() => handleViewFeedback(rowData)}
              />
              {rowData.sender_id === loggedInUserId && (
                <>
                  <Button
                    icon="pi pi-pencil" // Pencil icon for edit
                    className="p-button-rounded p-button-warning"
                    tooltip="Edit"
                    tooltipOptions={{ position: "top" }}
                    style={{ backgroundColor: "rgb(243, 200, 29)", border: "none", color: "#fff" }}
                    onClick={() => handleEditFeedback(rowData)}
                  />
                  <Button
                    icon="pi pi-trash" // Trash icon for delete
                    className="p-button-rounded p-button-danger"
                    tooltip="Delete"
                    tooltipOptions={{ position: "top" }}
                    style={{ backgroundColor: "rgb(233, 10, 10)", border: "none", color: "#fff" }}
                    onClick={() => handleDeleteFeedback(rowData.feedback_id)} // Pass the correct ID
                    />
                </>
              )}
            </div>
          )}
        />
        
      </DataTable>

      {/* View Feedback Dialog */}
      <Dialog
        header="Feedback Details"
        visible={popupVisible}
        style={{ width: "60vw", height: "60vh", overflowY: "auto" }} // Enlarged popup with vertical scrolling
        onHide={() => setPopupVisible(false)}
      >
        <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {popupContent || "No feedback provided."}
        </div>
      </Dialog>

      {/* Feedback Form */}
      {formVisible && (
        <FeedbackForm
          visible={formVisible}
          setVisible={setFormVisible} // Pass correct function
          initialData={editData}
          onSubmit={fetchFeedback}
          />
      )}
      <Button
      icon="pi pi-plus"
      className="p-button-rounded p-button-lg"
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        width: "4rem",
        height: "4rem",
      }}
      onClick={handleAddFeedback} // Open the form in "Add Feedback" mode
      autoFocus
    />
    </div>
  );
};

export default FeedbackTable;
