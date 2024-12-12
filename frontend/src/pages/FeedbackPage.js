import React from "react";
import Sidebar from "../components/common/Sidebar";
import FeedbackTable from "../components/feedback/FeedbackTable";
import FeedbackForm from "../components/feedback/FeedbackForm";
import { Card } from "primereact/card";
import '../components/common/CommonComp.css';

const FeedbackPage = () => {
  return (
    <div>
      <Sidebar />
    <div className="page-container"  >
      <div className="page-content" >
      
       
            <h1 >Feedback Page</h1>
          
          <FeedbackTable />
          <FeedbackForm />
  
      </div>
    </div>
    </div>
  );
};

export default FeedbackPage;
