import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../components/common/Sidebar';
import { AuthContext } from '../context/AuthContext';
import './DashboardPage.css';
import welcomeImage from '../assets/btowelcome.jpeg';
import btoimg from '../assets/btoimg.jpeg';
import useProtectRoute from '../hooks/useProtectRoute';
import Unauthorized from './Unauthorized'; // Import the Unauthorized component
import { useLocation } from 'react-router-dom';

const DashboardPage = () => {
    const isAuthorized = useProtectRoute([1,2,3,4]); // Check authorization
    const location = useLocation();

    const [currentPage, setCurrentPage] = useState('default'); // Default page
    const { user } = useContext(AuthContext);

    useEffect(() => {
        document.body.classList.add("dashboard-body");
        return () => {
            document.body.classList.remove("dashboard-body");
        };
    }, []);



    const renderContent = () => {
      switch (currentPage) {
          default:
              return (
                  <div className="framed-content">
                      <h1>Welcome to BTO Core</h1>
                      <hr className="welcome-divider" /> {/* Horizontal line */}
                      <p>Here is what you can do within this application</p>
                      <div className="content-container">
                          <div className="text-content">
                              <ol>
                                  <li>From the Tour Tables section, you can view the approved tours and their dates. Additionally, you can see details about the tour.</li>
                                  <li>In the Information table, you can access the names, surnames, roles, departments, phone numbers, and IBANs of guides and other individuals in the system. You can also view their lesson schedules.</li>
                                  <li>On the Puantaj Page, you can submit your workload within the monthly calendar. The system will calculate your payment.</li>
                                  <li>If you have the role of an advisor or higher, you can accept or reject tour applications via the Review Tour Request section.</li>
                                  <li>In the Data Insights section, you can view graphical representations of the collected data and take rational actions accordingly.</li>
                                  <li>From the Register User section, you can add new candidate guides, guides, and advisors. You can also promote individuals to higher ranks.</li>
                                  <li>The Real-time Status section allows you to communicate with other guides during tours, track their locations, and share your own. This ensures a smoother tour experience.</li>
                                  <li>If you are a candidate guide, guide, or advisor, you can view feedback given to you by others in the Feedback Page and write feedback for them as well.</li>
                                  <li>From the Settings section at the bottom left, you can manage your profile information, learn more about our application and organization, and adjust your preference.</li>
                              </ol>
                          </div>
                          <div className="image-content">
                              <img src={welcomeImage} alt="Welcome 1" className="welcome-image" />
                              <img src={btoimg} alt="Welcome 2" className="welcome-image" />
                          </div>
                      </div>
                  </div>
              );
      }
  };

  // If not authorized, render the Unauthorized component
  if (!isAuthorized) {
    return <Unauthorized from={location}/>;
  }

  return (
      <div style={{ display: 'flex' }}>
          <Sidebar setCurrentPage={setCurrentPage} />
          <main style={{ marginLeft: '250px', padding: '20px', flexGrow: 1 }}>
              {renderContent()}
          </main>
      </div>
  );
};

export default DashboardPage;