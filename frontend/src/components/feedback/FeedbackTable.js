import React, { useState, useEffect } from "react";
import FeedbackService from "../../services/FeedbackService";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";

const FeedbackTable = () => {
  const [feedback, setFeedback] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;

  useEffect(() => {
    fetchFeedback(currentPage);
  }, [currentPage]);

  const fetchFeedback = async (page) => {
    try {
      const data = await FeedbackService.getPaginatedFeedback(page, rowsPerPage);
      setFeedback(data.data);
      setTotalRecords(data.totalRecords || 500);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  const handleUpload = async (tourId, file) => {
    try {
      await FeedbackService.uploadFeedback(tourId, file);
      fetchFeedback(currentPage);
    } catch (error) {
      console.error("Error uploading feedback:", error);
    }
  };

  const handleDelete = async (feedbackId) => {
    try {
      await FeedbackService.deleteFeedback(feedbackId);
      fetchFeedback(currentPage);
    } catch (error) {
      console.error("Error deleting feedback:", error);
    }
  };

  const handleDownload = async (feedbackId) => {
    try {
      const response = await FeedbackService.getDownloadLink(feedbackId);
      if (response.url) {
        window.open(response.url, "_blank");
      }
    } catch (error) {
      console.error("Error generating download link:", error);
    }
  };

  return (
    <div>
      <h2>Feedback Table</h2>
      <DataTable value={feedback} paginator rows={rowsPerPage} totalRecords={totalRecords}>
        <Column field="tour_date" header="Date" />
        <Column field="school_name" header="School" />
        <Column field="city" header="City" />
        <Column field="user_name" header="User" />
        <Column field="role" header="Role" />
        <Column
          body={(rowData) => (
            <div>
              <Button label="Delete" onClick={() => handleDelete(rowData.feedback_id)} />
              <FileUpload
                mode="basic"
                name="file"
                accept="application/pdf"
                customUpload
                uploadHandler={(e) => handleUpload(rowData.tour_id, e.files[0])}
              />
              <Button
                label="Download"
                className="p-button-primary"
                onClick={() => handleDownload(rowData.feedback_id)}
              />
            </div>
          )}
          header="Actions"
        />
      </DataTable>
    </div>
  );
};

export default FeedbackTable;
