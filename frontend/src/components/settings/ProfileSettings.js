import React from 'react';
import './ProfileSettings.css';

const ProfileSettings = ({ userEmail, userType, onChangePassword }) => {
    return (
        <div className="profile-settings-card">
            <h2>Profile</h2>
            <div className="profile-details">
                <p><strong>Email:</strong> {userEmail || 'No email provided'}</p>
                <p>
                    <strong>User Type:</strong> {userType === 1 && 'Candidate Guide'}
                    {userType === 2 && 'Guide'}
                    {userType === 3 && 'Advisor'}
                    {userType === 4 && 'Coordinator'}
                </p>
            </div>
           
        </div>
    );
};

export default ProfileSettings;
