import React, { useState } from 'react';
import axios from 'axios';
import './ChangePassword.css';

const ChangePassword = ({ userEmail }) => {
    const [oldPassword, setOldPassword] = useState(" ");
    const [newPassword, setNewPassword] = useState(" ");
    const [confirmNewPassword, setConfirmNewPassword] = useState(" ");
    const [error, setError] = useState(" ");
    const [success, setSuccess] = useState(" ");
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Toggle password visibility
    const togglePasswordVisibility = (field) => {
        if (field === 'old') setShowOldPassword(!showOldPassword);
        if (field === 'new') setShowNewPassword(!showNewPassword);
        if (field === 'confirm') setShowConfirmPassword(!showConfirmPassword);
    };

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate that new passwords match
        if (newPassword !== confirmNewPassword) {
            setError('New passwords do not match');
            return;
        }

        try {
            const response = await axios.put(
                'http://localhost:3001/auth/update-password',
                {
                    email: userEmail,
                    oldPassword,
                    newPassword,
                    confirmNewPassword,
                }
            );

            if (response.data.message === 'Password updated successfully') {
                setSuccess('Password updated successfully');
                setOldPassword(" ");
                setNewPassword(" ");
                setConfirmNewPassword(" ");
            } else {
                setError('Failed to update password');
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'An error occurred while updating the password'
            );
        }
    };

    return (
        <div className="change-password-wrapper">
            <h2 className="change-password-header">Change Password</h2>
            <form onSubmit={handleSubmit} className="change-password-form">
                <div className="input-group">
                    <label>Current Password:</label>
                    <div className="password-field">
                        <input
                            type={showOldPassword ? 'text' : 'password'}
                            placeholder="Enter your current password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />
                        <span
                            className="toggle-password"
                            onClick={() => togglePasswordVisibility('old')}
                        >
                            {showOldPassword ? '🙈' : '👁️'}
                        </span>
                    </div>
                </div>
                <div className="input-group">
                    <label>New Password:</label>
                    <div className="password-field">
                        <input
                            type={showNewPassword ? 'text' : 'password'}
                            placeholder="Enter a new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <span
                            className="toggle-password"
                            onClick={() => togglePasswordVisibility('new')}
                        >
                            {showNewPassword ? '🙈' : '👁️'}
                        </span>
                    </div>
                </div>
                <div className="input-group">
                    <label>Confirm New Password:</label>
                    <div className="password-field">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Repeat your new password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            required
                        />
                        <span
                            className="toggle-password"
                            onClick={() => togglePasswordVisibility('confirm')}
                        >
                            {showConfirmPassword ? '🙈' : '👁️'}
                        </span>
                    </div>
                </div>
                <div className="button-group">
                    <button type="submit" className="save-button">
                        Save
                    </button>
                    <button
                        type="button"
                        className="cancel-button"
                        onClick={() => {
                            setOldPassword('');
                            setNewPassword('');
                            setConfirmNewPassword('');
                            setError('');
                            setSuccess('');
                        }}
                    >
                        Cancel
                    </button>
                </div>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
            </form>
        </div>
    );
};

export default ChangePassword;


