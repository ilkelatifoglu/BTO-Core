import React from "react";
import Sidebar from "../components/common/Sidebar";
import FeedbackTable from "../components/feedback/FeedbackTable";
import FeedbackForm from "../components/feedback/FeedbackForm";
import { Card } from "primereact/card";

const FeedbackPage = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div
        style={{
          flexGrow: 1,
          marginLeft: "250px", // Adjust this value based on your sidebar width
          padding: "20px",
          backgroundColor: "#f8f9fa",
        }}
      >
        <Card>
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-800">Feedback</h1>
          </div>
          <FeedbackTable />
          <FeedbackForm />
        </Card>
      </div>
    </div>
  );
};

export default FeedbackPage;
