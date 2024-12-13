import React, { useState, useEffect, useRef } from 'react';
import { fetchProfileData, updateProfileData } from '../../services/ProfileSettingsService';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import './ProfileSettings.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

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
    const token = localStorage.getItem('token') || localStorage.getItem('tempToken');
    const toast = useRef(null);

    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
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
            });
            setEditData({
                phone_number: data.phone_number || '',
                iban: data.iban || 'TR',
                department: data.department || '',
            });
        } catch (error) {
            console.error('Error fetching profile data:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to fetch profile data.',
                life: 3000,
            });
        }
    };

    const handlePhoneNumberChange = (e) => {
        let input = e.target.value.replace(/\D/g, '').substring(0, 11); 

        let formattedNumber = '';
        if (input.length > 0) {
            formattedNumber = '0';
        }
        if (input.length > 1 && input.length <= 4) {
            formattedNumber += ` ${input.substring(1)}`;
        } else if (input.length > 4 && input.length <= 7) {
            formattedNumber += ` ${input.substring(1, 4)} ${input.substring(4)}`;
        } else if (input.length > 7 && input.length <= 9) {
            formattedNumber += ` ${input.substring(1, 4)} ${input.substring(4, 7)} ${input.substring(7)}`;
        } else if (input.length > 9) {
            formattedNumber += ` ${input.substring(1, 4)} ${input.substring(4, 7)} ${input.substring(7, 9)} ${input.substring(9)}`;
        }

        setEditData({ ...editData, phone_number: formattedNumber });
    };

    const handleIBANChange = (e) => {
        let input = e.target.value.toUpperCase().replace(/[^0-9]/g, ''); 
        input = input.substring(0, 24); 
        let formattedIBAN = 'TR'; 
        const parts = input.match(/.{1,4}/g); 
        if (parts) {
            formattedIBAN += ' ' + parts.join(' ');
        }

        setEditData({ ...editData, iban: formattedIBAN });
    };

    useEffect(() => {
        if (!editData.iban.startsWith('TR')) {
            setEditData((prevData) => ({ ...prevData, iban: 'TR' }));
        }
    }, []);

    const handleSave = async () => {
        try {
            await updateProfileData(token, editData);
            fetchData();
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Profile updated successfully!',
                life: 3000,
            });
        } catch (error) {
            console.error('Error updating profile data:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update profile.',
                life: 3000,
            });
        }
    };

    const handleCancel = () => {
        // Reset editData to original userData
        setEditData({
            phone_number: userData.phone_number || '',
            iban: userData.iban || 'TR',
            department: userData.department || '',
        });
    };

    return (
        <div className="profile-settings-container">
            <Toast ref={toast} position="top-right" />
            <h2 className="profile-settings-header">Account</h2>
            <form className="profile-settings-form" onSubmit={(e) => e.preventDefault()}>
                <div className="input-group">
                    <label htmlFor="firstName">First Name:</label>
                    <InputText
                        id="firstName"
                        value={userData.firstName}
                        disabled
                        className="input-field"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="lastName">Last Name:</label>
                    <InputText
                        id="lastName"
                        value={userData.lastName}
                        disabled
                        className="input-field"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email Address:</label>
                    <InputText
                        id="email"
                        value={userData.email}
                        disabled
                        className="input-field"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="phone">Phone:</label>
                    <InputText
                        id="phone"
                        type="text"
                        placeholder="0 XXX XXX XX XX"
                        value={editData.phone_number}
                        onChange={handlePhoneNumberChange}
                        className="input-field"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="iban">IBAN:</label>
                    <InputText
                        id="iban"
                        type="text"
                        placeholder="TRXX XXXX XXXX XXXX XXXX XXXX XX"
                        value={editData.iban}
                        onChange={handleIBANChange}
                        className="input-field"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="department">Department:</label>
                    <Dropdown
                        id="department"
                        value={editData.department}
                        options={departments}
                        onChange={(e) => setEditData({ ...editData, department: e.value })}
                        placeholder="Select Department"
                        className="dropdown-field"
                        showClear
                        filter
                    />
                </div>
                <div className="button-group">
                    <Button
                        label="Save"
                        icon="pi pi-check"
                        className="save-button"
                        onClick={handleSave}
                    />
                    <Button
                        label="Cancel"
                        icon="pi pi-times"
                        className="cancel-button"
                        onClick={handleCancel}
                    />
                </div>
            </form>
        </div>
    );
};

export default ProfileSettings;