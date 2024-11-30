import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './ProfileSettings.css';
import { AuthContext } from '../../context/AuthContext';

axios.defaults.baseURL = 'http://localhost:3001'; // Set base URL for Axios

const ProfileSettings = () => {
    const { token } = useContext(AuthContext);

    const [photo, setPhoto] = useState('/default-profile.png'); // Default photo
    const [userData, setUserData] = useState({
        firstName: 'Name',
        lastName: 'Surname',
        email: 'No email provided',
        phone: '1234',
        iban: '1234',
        userType: 'Unknown',
    });

    const fetchProfileData = async () => {
        if (!token) return; // Ensure token is available
        try {
            const response = await axios.get('/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = response.data;
            setPhoto(data.photo_url || '/default-profile.png');
            setUserData({
                firstName: data.firstName || 'Name',
                lastName: data.lastName || 'Surname',
                email: data.email || 'No email provided',
                phone: data.phone || '1234',
                iban: data.iban || '1234',
                userType: data.userType || 'Unknown',
            });
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    };

    // Fetch user's profile data on component mount
    useEffect(() => {
        fetchProfileData();
    }, [token]);

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('photo', file);  // Fotoğrafı formData'ya ekliyoruz
    
            try {
                // Fotoğrafı sunucuya yüklerken Bearer token'ı header'a ekliyoruz
                const response = await axios.post('/profile/upload-photo', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,  // Bearer token ekleyin
                    },
                });
                console.log(response.data);
                await fetchProfileData();  // Fotoğraf yüklendikten sonra profile verilerini güncelle
            } catch (error) {
                console.error('Error uploading photo:', error);
            }
        }
    };
    

    return (
        <div className="profile-settings-card">
            <h1 className="profile-settings-title">Account</h1> {/* Account Title */}
            
                {/* Profile Photo Section */}
                <div className="profile-photo-section">
                    <img
                        src={photo}
                        alt="Profile"
                        className="profile-photo"
                    />
                    <label className="upload-button">
                        Upload Photo
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                        />
                    </label>
                </div>

                {/* User Details Section */}
                <div className="profile-details-section">
                    <div>
                        <label>First Name:</label>
                        <span>{userData.firstName}</span>
                    </div>
                    <div>
                        <label>Last Name:</label>
                        <span>{userData.lastName}</span>
                    </div>
                    <div>
                        <label>Email Address:</label>
                        <span>{userData.email}</span>
                    </div>
                    <div>
                        <label>Phone:</label>
                        <span>{userData.phone}</span>
                    </div>
                    <div>
                        <label>User Type:</label>
                        <span>{userData.userType}</span>
                    </div>
                    <div>
                        <label>IBAN:</label>
                        <span>{userData.iban}</span>
                    </div>
                  
                </div>

                {/* Edit Button */}
                <button className="edit-button">Edit</button>
            
        </div>
    );
};

export default ProfileSettings;
