import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../components/common/Sidebar';
import { AuthContext } from '../context/AuthContext';
import './DashboardPage.css';
import welcomeImage from '../assets/btowelcome.jpeg';
import btoimg from '../assets/btoimg.jpeg';
import useProtectRoute from '../hooks/useProtectRoute';
import Unauthorized from './Unauthorized';

const DashboardPage = () => {
    const isAuthorized = useProtectRoute([1, 2, 3, 4]);

    const [currentPage, setCurrentPage] = useState('default');
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
                    <div className="dashboard-body">
                        <header className="dashboard-header">
                            <h1>Welcome to BTO Core</h1>
                            <p>Your centralized platform to manage tours, guides, and feedback effectively.</p>
                        </header>
                        <div className="dashboard-content">
                            {/* Images Section */}
                            <div className="images-section">
                                <img src={welcomeImage} alt="Welcome" className="dashboard-image" />
                                <img src={btoimg} alt="BTO Team" className="dashboard-image" />
                            </div>

                            {/* Cards Section */}
                            <div className="features-section">
                                <div className="feature-card">
                                    <h2>Tour Tables</h2>
                                    <p>View approved tours, dates, and tour details.</p>
                                </div>
                                <div className="feature-card">
                                    <h2>Feedback Page</h2>
                                    <p>Provide and receive feedback to ensure continuous improvement.</p>
                                </div>
                                <div className="feature-card">
                                    <h2>Puantaj Page</h2>
                                    <p>Submit workloads and calculate payments within a monthly calendar.</p>
                                </div>
                                <div className="feature-card">
                                    <h2>Review Tour Requests</h2>
                                    <p>Approve or reject tour applications as an advisor or higher role.</p>
                                </div>
                                <div className="feature-card">
                                    <h2>Data Insights</h2>
                                    <p>Analyze graphical data and make informed decisions.</p>
                                </div>
                                <div className="feature-card">
                                    <h2>Real-Time Status</h2>
                                    <p>Track, communicate, and ensure smooth tour experiences.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    if (!isAuthorized) {
        return <Unauthorized />;
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
