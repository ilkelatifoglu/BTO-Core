import React, { useState, useEffect } from 'react';
import './ProfileSettings.css';
import { fetchProfileData, updateProfileData } from '../../services/ProfileSettingsService';

const ProfileSettings = () => {
    const token = localStorage.getItem('tempToken');
    console.log('Retrieved token:', token); // Debugging

    const [photo, setPhoto] = useState('/default-profile.png'); // Default profile photo
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone_number: '',
        iban: '',
        department: '',
    });

    const [editData, setEditData] = useState({
        phone_number: '',
        iban: '',
        department: '',
    });

    // Fetch user profile data
    const fetchData = async () => {
        try {
            const data = await fetchProfileData(token);
            console.log('Fetched profile data:', data);
            setUserData({
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                email: data.email || '',
                phone_number: data.phone_number || '',
                iban: data.iban || '',
                department: data.department || '',
            });
            setEditData({
                phone_number: data.phone_number || '',
                iban: data.iban || '',
                department: data.department || '',
            });
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchData(); // Fetch data on component mount
        } else {
            console.error('No token found. Please log in.');
            // Optionally, redirect to login page
        }
    }, [token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            console.log('Saving updated profile data:', editData);
            await updateProfileData(token, editData);
            fetchData(); // Refresh profile data
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile data:', error);
            alert('Failed to update profile.');
        }
    };

    return (
        <div className="profile-settings-card">
            <h1 className="profile-settings-title">Account</h1>

            <div className="profile-details-section">
                <div>
                    <label>First Name:</label>
                    <span>{userData.firstName || 'N/A'}</span>
                </div>
                <div>
                    <label>Last Name:</label>
                    <span>{userData.lastName || 'N/A'}</span>
                </div>
                <div>
                    <label>Email Address:</label>
                    <span>{userData.email || 'N/A'}</span>
                </div>

                <div>
                    <label>Phone:</label>
                    <input
                        type="text"
                        name="phone_number"
                        value={editData.phone_number}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>IBAN:</label>
                    <input
                        type="text"
                        name="iban"
                        value={editData.iban}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Department:</label>
                    <input
                        type="text"
                        name="department"
                        value={editData.department}
                        onChange={handleInputChange}
                    />
                </div>

                <button className="save-button" onClick={handleSave}>
                    Save
                </button>
            </div>
        </div>
    );
};

export default ProfileSettings;
