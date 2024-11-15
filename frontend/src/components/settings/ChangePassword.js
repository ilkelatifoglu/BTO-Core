import React, { useState } from 'react';
import axios from 'axios';
import './ChangePassword.css';

const ChangePassword = ({ userEmail }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmNewPassword) {
            setError('New passwords do not match');
            return;
        }

        try {
            const response = await axios.put('/auth/update-password', {
                email: userEmail,
                oldPassword,
                newPassword,
            });

            if (response.data.message === 'Password updated successfully') {
                setSuccess('Password updated successfully');
                setOldPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
            } else {
                setError('Failed to update password');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while updating the password');
        }
    };

    return (
        <div className="change-password">
            <h2>Change Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Current Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                />
                <button type="submit">Update Password</button>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
            </form>
        </div>
    );
};

export default ChangePassword;
