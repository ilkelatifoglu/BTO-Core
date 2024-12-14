// FeedbackTable.jsx
import React, { useState, useEffect, useRef } from "react";
import FeedbackService from "../../services/FeedbackService";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import { Toast } from "primereact/toast"; // (2) Importing Toast
import '../common/CommonComp.css';

const FeedbackTable = () => {
  const [feedback, setFeedback] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const rowsPerPage = 50;
  const toast = useRef(null); // (3) Toast ref

  useEffect(() => {
    fetchFeedback(currentPage);
  }, [currentPage]);

  const fetchFeedback = async (page) => {
    try {
      const data = await FeedbackService.getPaginatedFeedback(page, rowsPerPage);
      const feedbackArray = data.data.rows || [];
      setFeedback(feedbackArray);
      setTotalRecords(data.totalRecords || 500);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      toast.current.clear(); // (4) Clear before showing new toast
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Failed to load feedback: ${error.message}`,
        life: 3000,
      });
    }
  };

  const handlePopupOpen = (content) => {
    setPopupContent(content);
    setPopupVisible(true);
  };

  const handleUpload = async (tourId, file) => {
    try {
      await FeedbackService.uploadFeedback(tourId, file);
      toast.current.clear();
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Feedback uploaded successfully.",
        life: 3000,
      });
    } catch (error) {
      console.error("Error uploading feedback:", error);
      toast.current.clear();
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Failed to upload feedback: ${error.message}`,
        life: 3000,
      });
    } finally {
      fetchFeedback(currentPage);
    }
  };

  const handleDelete = async (feedbackId) => {
    try {
      await FeedbackService.deleteFeedback(feedbackId);
      toast.current.clear();
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Feedback deleted successfully.",
        life: 3000,
      });
    } catch (error) {
      console.error("Error deleting feedback:", error);
      toast.current.clear();
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Failed to delete feedback: ${error.message}`,
        life: 3000,
      });
    } finally {
      fetchFeedback(currentPage);
    }
  };

  const handleDownload = async (feedbackId) => {
    try {
      const response = await FeedbackService.getDownloadLink(feedbackId);
      if (response.url) {
        window.open(response.url, "_blank");
        toast.current.clear();
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Download link generated successfully.",
          life: 3000,
        });
      } else {
        throw new Error("No download URL provided.");
      }
    } catch (error) {
      console.error("Error generating download link:", error);
      toast.current.clear();
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Failed to generate download link: ${error.message}`,
        life: 3000,
      });
    } finally {
      fetchFeedback(currentPage);
    }
  };

  return (
    <div>
      <Toast ref={toast} /> {/* (5) Adding Toast to JSX */}
     
      <DataTable
        value={feedback}
        paginator
        rows={rowsPerPage}
        totalRecords={totalRecords}
        onPage={(e) => setCurrentPage(e.page + 1)}
      >
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
        <Column field="school_name" header="School" />
        <Column field="city" header="City" />
        <Column
          field="user_names"
          header="User"
          body={(rowData) => (
            <div>
              {rowData.user_names?.length
                ? rowData.user_names.map((name, index) => <div key={index}>{name}</div>)
                : "No Users"}
            </div>
          )}
        />
        <Column
          field="user_roles"
          header="Roles"
          body={(rowData) => (
            <div>
              {rowData.user_roles?.length
                ? rowData.user_roles.map((role, index) => <div key={index}>{role}</div>)
                : "No Roles"}
            </div>
          )}
        />
        <Column field="sender_name" header="Sender" />
        <Column
          field="text_feedback"
          header="Text Feedback"
          body={(rowData) =>
            rowData.text_feedback ? (
              <Button
                label="View Feedback"
                className="p-button-info"
                onClick={() => handlePopupOpen(rowData.text_feedback)}
              />
            ) : (
              <span>No Feedback Provided</span>
            )
          }
        />
        <Column
          header="Actions"
          body={(rowData) => (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                label="Delete"
                className="p-button-danger"
                onClick={() => handleDelete(rowData.feedback_id)}
              />
              <FileUpload
                mode="basic"
                name="file"
                accept="application/pdf"
                customUpload
                uploadHandler={(e) => handleUpload(rowData.tour_id, e.files[0])}
                chooseLabel="Upload"
               
              />
              <Button
                label="Download"
                className="p-button-primary"
                onClick={() => handleDownload(rowData.feedback_id)}
              />
            </div>
          )}
        />
      </DataTable>

      <Dialog
        header="Feedback Details"
        visible={popupVisible}
        style={{ width: "50vw" }}
        onHide={() => setPopupVisible(false)}
      >
        <p>{popupContent}</p>
      </Dialog>
    </div>
  );
};

export default FeedbackTable;
