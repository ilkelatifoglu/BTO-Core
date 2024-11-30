import React, { useState } from 'react';
import './ProfileSettings.css';

const ProfileSettings = ({ userEmail, userType }) => {
    const [photo, setPhoto] = useState(null);

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPhoto(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const getUserTypeLabel = () => {
        switch (userType) {
            case 1:
                return 'Candidate Guide';
            case 2:
                return 'Guide';
            case 3:
                return 'Advisor';
            case 4:
                return 'Coordinator';
            default:
                return 'Unknown';
        }
    };

    return (
        <div className="profile-settings-container">
            <div className="profile-settings-card">
                <div className="profile-photo-section">
                    <img
                        src={photo || '/default-profile.png'}
                        alt="Profile"
                        className="profile-photo"
                    />
                    <label className="upload-button">
                        Upload Photo
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handlePhotoUpload}
                        />
                    </label>
                </div>
                <div className="profile-details-section">
                    <div>
                        <label>First Name:</label>
                        <span>Name</span>
                    </div>
                    <div>
                        <label>Last Name:</label>
                        <span>Surname</span>
                    </div>
                    <div>
                        <label>Email Address:</label>
                        <span>{userEmail || 'ekin.koylu@ug.bilkent.edu.tr'}</span>
                    </div>
                    <div>
                        <label>Phone:</label>
                        <span>1234</span>
                    </div>
                    <div>
                        <label>IBAN:</label>
                        <span>1234</span>
                    </div>
                    <div>
                        <label>User Type:</label>
                        <span>{getUserTypeLabel()}</span>
                    </div>
                </div>
                <button className="edit-button">Edit</button>
            </div>
        </div>
    );
};

export default ProfileSettings;
