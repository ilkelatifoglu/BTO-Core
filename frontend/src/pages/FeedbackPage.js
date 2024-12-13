import React from "react";
import Sidebar from "../components/common/Sidebar";
import FeedbackTable from "../components/feedback/FeedbackTable";
import FeedbackForm from "../components/feedback/FeedbackForm";
import { Card } from "primereact/card";
import '../components/common/CommonComp.css';
import Unauthorized from './Unauthorized'; // Import the Unauthorized component
import useProtectRoute from '../hooks/useProtectRoute';

const FeedbackPage = () => {
  const isAuthorized = useProtectRoute([1,2,3,4]); // Check authorization

  if (!isAuthorized) {
    return <Unauthorized />;
  }
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
