import React, { useState, useRef } from 'react';
import axios from 'axios';
import './ChangePassword.css';
import { Toast } from 'primereact/toast';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
const token = localStorage.getItem('token') || localStorage.getItem('tempToken');

const ChangePassword = ({ userEmail }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const toast = useRef(null);

    // Toggle password visibility
    const togglePasswordVisibility = (field) => {
        if (field === 'old') setShowOldPassword(!showOldPassword);
        if (field === 'new') setShowNewPassword(!showNewPassword);
        if (field === 'confirm') setShowConfirmPassword(!showConfirmPassword);
    };

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate that new passwords match
        if (newPassword !== confirmNewPassword) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'New passwords do not match',
                life: 3000,
            });
            return;
        }

        try {
            const response = await axios.put(
                `${API_BASE_URL}/auth/update-password`,
                {
                    email: userEmail,
                    oldPassword,
                    newPassword,
                    confirmNewPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.message === 'Password updated successfully') {
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Password updated successfully',
                    life: 3000,
                });
                setOldPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
            } else {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to update password',
                    life: 3000,
                });
            }
        } catch (err) {
            const errorMessage =
                err.response?.data?.message ||
                'An error occurred while updating the password';
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: errorMessage,
                life: 3000,
            });
        }
    };

    return (
        <div className="change-password-container-wrapper">
            <Toast ref={toast} position="top-right" />
            <h2 className="change-password-header">Change Password</h2>
            <form onSubmit={handleSubmit} className="change-password-form">
                <div className="input-group">
                    <label htmlFor="current-password">Current Password:</label>
                    <div className="password-field">
                        <input
                            id="current-password"
                            type={showOldPassword ? 'text' : 'password'}
                            placeholder="Enter your current password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />
                        <span
                            className="toggle-password"
                            onClick={() => togglePasswordVisibility('old')}
                            aria-label={
                                showOldPassword ? 'Hide password' : 'Show password'
                            }
                        >
                            {showOldPassword ? '🙈' : '👁️'}
                        </span>
                    </div>
                </div>
                <div className="input-group">
                    <label htmlFor="new-password">New Password:</label>
                    <div className="password-field">
                        <input
                            id="new-password"
                            type={showNewPassword ? 'text' : 'password'}
                            placeholder="Enter a new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <span
                            className="toggle-password"
                            onClick={() => togglePasswordVisibility('new')}
                            aria-label={
                                showNewPassword ? 'Hide password' : 'Show password'
                            }
                        >
                            {showNewPassword ? '🙈' : '👁️'}
                        </span>
                    </div>
                </div>
                <div className="input-group">
                    <label htmlFor="confirm-password">Confirm New Password:</label>
                    <div className="password-field">
                        <input
                            id="confirm-password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Repeat your new password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            required
                        />
                        <span
                            className="toggle-password"
                            onClick={() => togglePasswordVisibility('confirm')}
                            aria-label={
                                showConfirmPassword ? 'Hide password' : 'Show password'
                            }
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
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangePassword;
