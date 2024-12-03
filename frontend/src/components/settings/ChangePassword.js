import React, { useState } from 'react';
import axios from 'axios';
import './ChangePassword.css';

const ChangePassword = ({ userEmail }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = (type) => {
        if (type === 'old') setShowOldPassword(!showOldPassword);
        if (type === 'new') setShowNewPassword(!showNewPassword);
        if (type === 'confirm') setShowConfirmPassword(!showConfirmPassword);
    };

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
        <div className="change-password-wrapper">
    <h2 className="change-password-header">Change Password</h2>
    <div className="change-password-container">
        <form onSubmit={handleSubmit}>
            <div className="input-group">
                <label>Current Password:</label>
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
            <div className="input-group">
                <label>New Password:</label>
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
            <div className="input-group">
                <label>Repeat Password:</label>
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
            <div className="button-group">
                <button type="submit" className="save-button">Save</button>
                <button type="button" className="cancel-button">Cancel</button>
            </div>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
        </form>
    </div>
</div>

    );
};

export default ChangePassword;
