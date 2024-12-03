import React, { useState, useEffect, useContext } from 'react';
import './ProfileSettings.css';
import { AuthContext } from '../../context/AuthContext';
import { fetchProfileData, updateProfileData } from '../../services/ProfileSettingsService';

const ProfileSettings = () => {
    const { token } = useContext(AuthContext);

    const [photo, setPhoto] = useState('/default-profile.png'); // Default profile photo
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        iban: '',
        department: '',
    });

    const [editData, setEditData] = useState({
        phone: '',
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
                phone: data.phone || '',
                iban: data.iban || '',
                department: data.department || '',
            });
            setEditData({
                phone: data.phone || '',
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
                        name="phone"
                        value={editData.phone}
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



/*            <div className="profile-photo-section">
                <img src={photo} alt="Profile" className="profile-photo" />
                <label className="upload-button">
                    Upload Photo
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => console.log('Photo upload handler')}
                    />
                </label>
            </div>


*/

/*import React, { useState, useEffect, useContext } from 'react';
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
            <h1 className="profile-settings-title">Account</h1> 
            

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

                <button className="edit-button">Edit</button>
            
        </div>
    );
};

export default ProfileSettings;
*/