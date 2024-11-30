import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Sidebar.css';
import defaultProfileImage from '../../assets/profile.jpg'; 

const Sidebar = ({ setCurrentPage }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

   
    const handleNavigation = (page) => {
        if (page === 'logout') {
            localStorage.clear();
            navigate('/login');
        } else {
            navigate(`/${page}`);
        }
    };

    return (
        <div style={{ display: "flex" }}>
            <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
                <button className="sidebar__toggle" onClick={toggleSidebar}>
                    {isExpanded ? '<<' : '>>'}
                </button>
                <div className="sidebar__header">
                    <img src={defaultProfileImage} alt="Profile" />
                    {isExpanded && <h2>{user?.email}</h2>}
                </div>
                {isExpanded && <p className="sidebar__dashboard">Dashboard</p>}
                <ul className="sidebar__menu">
                    <li className="menu__item" onClick={() => handleNavigation('TourTables')}>
                        <i className="pi pi-table"></i>
                        {isExpanded && <span>Tour Tables</span>}
                    </li>
                    <li className="menu__item" onClick={() => handleNavigation('guideInfo')}>
                        <i className="pi pi-info-circle"></i>
                        {isExpanded && <span>Guide Info</span>}
                    </li>
                    <li className="menu__item" onClick={() => handleNavigation('puantaj-page')}>
                        <i className="pi pi-calendar"></i>
                        {isExpanded && <span>Puantaj Page</span>}
                    </li>
                    <li className="menu__item" onClick={() => handleNavigation('ReviewTourRequest')}>
                        <i className="pi pi-check"></i>
                        {isExpanded && <span>Review Tour Request</span>}
                    </li>
                    <li className="menu__item" onClick={() => handleNavigation('DataInsights')}>
                        <i className="pi pi-chart-line"></i>
                        {isExpanded && <span>Data Insights</span>}
                    </li>
                    <li className="menu__item" onClick={() => handleNavigation('manageUser')}>
                        <i className="pi pi-user-plus"></i>
                        {isExpanded && <span>User Management</span>}
                    </li>
                    <li className="menu__item" onClick={() => handleNavigation('RealTimeStatus')}>
                        <i className="pi pi-clock"></i>
                        {isExpanded && <span>Real-time Status</span>}
                    </li>
                    <li className="menu__item" onClick={() => handleNavigation('FeedbackPage')}>
                        <i className="pi pi-comments"></i>
                        {isExpanded && <span>Feedback Page</span>}
                    </li>
                </ul>
                <div className="sidebar__footer">
                    <button className="menu__item" onClick={() => handleNavigation('Settings')}>
                        <i className="pi pi-cog"></i>
                        {isExpanded && <span>Settings</span>}
                    </button>
                    <button className="menu__item" onClick={() => handleNavigation('logout')}>
                        <i className="pi pi-sign-out"></i>
                        {isExpanded && <span>Logout</span>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
