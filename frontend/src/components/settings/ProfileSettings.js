import React, { useState, useEffect } from 'react';
import { fetchProfileData, updateProfileData } from '../../services/ProfileSettingsService';
import { Dropdown } from 'primereact/dropdown';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import './ProfileSettings.css';

const departments = [
    { label: "American Culture and Literature", value: "American Culture and Literature" },
    { label: "Archaeology", value: "Archaeology" },
    { label: "Architecture", value: "Architecture" },
    { label: "Art", value: "Art" },
    { label: "Biochemistry and Molecular Biology", value: "Biochemistry and Molecular Biology" },
    { label: "Business Administration", value: "Business Administration" },
    { label: "Chemical Engineering", value: "Chemical Engineering" },
    { label: "Computer Science", value: "Computer Science" },
    { label: "Design and Communication", value: "Design and Communication" },
    { label: "Department of Electrical Engineering", value: "Department of Electrical Engineering" },
    { label: "Education Sciences", value: "Education Sciences" },
    { label: "English Language and Literature", value: "English Language and Literature" },
    { label: "English Translation and Interpretation", value: "English Translation and Interpretation" },
    { label: "French Translation and Interpretation", value: "French Translation and Interpretation" },
    { label: "Graphic Design", value: "Graphic Design" },
    { label: "History", value: "History" },
    { label: "Industrial Engineering", value: "Industrial Engineering" },
    { label: "Law", value: "Law" },
    { label: "Machine Engineering", value: "Machine Engineering" },
    { label: "Mathematics", value: "Mathematics" },
    { label: "Music", value: "Music" },
    { label: "Music and Performing Arts", value: "Music and Performing Arts" },
    { label: "Philosophy", value: "Philosophy" },
    { label: "Physics", value: "Physics" },
    { label: "Political Science and Public Administration", value: "Political Science and Public Administration" },
    { label: "Psychology", value: "Psychology" },
    { label: "Social Sciences and Economy", value: "Social Sciences and Economy" },
    { label: "Teaching", value: "Teaching" },
    { label: "Urban Design", value: "Urban Design" },
];

const ProfileSettings = () => {
    const token = localStorage.getItem('tempToken');

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
        iban: 'TR',
        department: '',
    });

    useEffect(() => {
        if (token) {
            fetchData();
        } else {
            console.error('No token found. Please log in.');
        }
    }, [token]);

    const fetchData = async () => {
        try {
            const data = await fetchProfileData(token);
            setUserData({
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                email: data.email || '',
                phone_number: data.phone_number || '',
                iban: data.iban || 'TR',
                department: data.department || '',
            });
            setEditData({
                phone_number: data.phone_number || '',
                iban: data.iban || 'TR',
                department: data.department || '',
            });
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    };

    const handleSave = async () => {
        try {
            await updateProfileData(token, editData);
            fetchData();
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
                    <label>First Name: </label>
                    <span>{userData.firstName || 'N/A'}</span>
                </div>
                <div>
                    <label>Last Name: </label>
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
                        placeholder="0 XXX XXX XX XX"
                        value={editData.phone_number}
                        onChange={(e) => setEditData({ ...editData, phone_number: e.target.value })}
                        className="large-input"
                    />
                </div>
                <div>
                    <label>IBAN:</label>
                    <input
                        type="text"
                        name="iban"
                        placeholder="TRXX XXXX XXXX XXXX XXXX XXXX XX"
                        value={editData.iban}
                        onChange={(e) => setEditData({ ...editData, iban: e.target.value })}
                        className="large-input"
                    />
                </div>
                <div>
                    <label>Department:</label>
                    <Dropdown
                        value={editData.department}
                        options={departments}
                        onChange={(e) => setEditData({ ...editData, department: e.value })}
                        placeholder="Select Department"
                        className="large-dropdown"
                        showClear
                        filter
                    />
                </div>

                <button className="save-buttonaccount" onClick={handleSave}>
                    Save
                </button>
            </div>
        </div>
    );
};

export default ProfileSettings;
