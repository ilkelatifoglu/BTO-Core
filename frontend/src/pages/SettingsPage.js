import React, { useState, useContext } from 'react';
import Sidebar from '../components/common/Sidebar'; // Main application sidebar
import ProfileSettings from '../components/settings/ProfileSettings';
import ChangePassword from '../components/settings/ChangePassword';
import { AuthContext } from '../context/AuthContext';
import './SettingsPage.css';

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('account'); // Default to account view
    const { user } = useContext(AuthContext);

    const userEmail = user?.email;
    const userType = user?.user_type;

    const renderContent = () => {
        switch (activeTab) {
            case 'account':
                return <ProfileSettings userEmail={userEmail} userType={userType} />;
            case 'changePassword':
                return <ChangePassword userEmail={userEmail} />;
            case 'appearance':
                return <div>Appearance settings coming soon...</div>;
            case 'helpSupport':
                return <div>Help and Support details here...</div>;
            case 'about':
                return <div>About the application...</div>;
            default:
                return <div>Select a settings option</div>;
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {/* Main Application Sidebar */}
            <Sidebar setCurrentPage={() => {}} />

            {/* Settings Page Content */}
            <div className="settings-page-container">
                {/* Settings Sidebar */}
                <div className="settings-sidebar">
                    <h2>Settings</h2>
                    <button
                        className={activeTab === 'account' ? 'active-tab' : ''}
                        onClick={() => setActiveTab('account')}
                    >
                        <i className="pi pi-user"></i> Account
                    </button>
                    <button
                        className={activeTab === 'changePassword' ? 'active-tab' : ''}
                        onClick={() => setActiveTab('changePassword')}
                    >
                        <i className="pi pi-key"></i> Change Password
                    </button>
                    <button
                        className={activeTab === 'appearance' ? 'active-tab' : ''}
                        onClick={() => setActiveTab('appearance')}
                    >
                        <i className="pi pi-eye"></i> Appearance
                    </button>
                    <button
                        className={activeTab === 'helpSupport' ? 'active-tab' : ''}
                        onClick={() => setActiveTab('helpSupport')}
                    >
                        <i className="pi pi-headphones"></i> Help and Support
                    </button>
                    <button
                        className={activeTab === 'about' ? 'active-tab' : ''}
                        onClick={() => setActiveTab('about')}
                    >
                        <i className="pi pi-info-circle"></i> About
                    </button>
                </div>

                {/* Settings Main Content */}
                <div className="settings-content">{renderContent()}</div>
            </div>
        </div>
    );
};

export default SettingsPage;
