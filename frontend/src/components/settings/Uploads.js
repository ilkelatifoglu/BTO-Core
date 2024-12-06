// Uploads.js

import React, { useState, useRef } from 'react';
import axios from 'axios';
import './Uploads.css';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import imageCompression from 'browser-image-compression';

const Uploads = () => {
    const toast = useRef(null);

    const scheduleInputRef = useRef(null);
    const profileInputRef = useRef(null);

    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleScheduleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file type
            if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Invalid File Type',
                    detail: 'Please select a JPEG or PNG image.',
                    life: 3000,
                });
                return;
            }

            // Validate file size before compression (optional)
            const MAX_ORIGINAL_FILE_SIZE = 10 * 1024 * 1024; // 10MB
            if (file.size > MAX_ORIGINAL_FILE_SIZE) {
                toast.current.show({
                    severity: 'error',
                    summary: 'File Too Large',
                    detail: 'Please select a file smaller than 10MB.',
                    life: 3000,
                });
                return;
            }

            try {
                // Compress the image
                const options = {
                    maxSizeMB: 1, // Max compressed size in MB
                    maxWidthOrHeight: 1920, // Max width or height
                    useWebWorker: true,
                };

                const compressedFile = await imageCompression(file, options);

                // Upload the compressed image
                await uploadSchedule(compressedFile);
            } catch (error) {
                console.error('Error compressing image:', error);
                toast.current.show({
                    severity: 'error',
                    summary: 'Compression Failed',
                    detail: 'Failed to compress image.',
                    life: 3000,
                });
            }
        }
    };

    const uploadSchedule = async (file) => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            toast.current.show({
                severity: 'error',
                summary: 'User Not Found',
                detail: 'Please log in.',
                life: 3000,
            });
            return;
        }

        const formData = new FormData();
        formData.append('schedule', file);

        try {
            setIsUploading(true);
            setUploadProgress(0);

            await axios.post(
                `http://localhost:3001/schedule/uploadSchedule/${userId}`,
                formData,
                {
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setUploadProgress(percentCompleted);
                    },
                }
            );

            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Schedule uploaded successfully.',
                life: 3000,
            });
        } catch (error) {
            console.error('Error uploading schedule:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Upload Failed',
                detail: 'Failed to upload schedule.',
                life: 3000,
            });
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleProfileFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file type
            if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Invalid File Type',
                    detail: 'Please select a JPEG or PNG image.',
                    life: 3000,
                });
                return;
            }

            // Validate file size before compression (optional)
            const MAX_ORIGINAL_FILE_SIZE = 10 * 1024 * 1024; // 10MB
            if (file.size > MAX_ORIGINAL_FILE_SIZE) {
                toast.current.show({
                    severity: 'error',
                    summary: 'File Too Large',
                    detail: 'Please select a file smaller than 10MB.',
                    life: 3000,
                });
                return;
            }

            try {
                // Compress the image
                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                };

                const compressedFile = await imageCompression(file, options);

                // Upload the compressed image
                await uploadProfilePicture(compressedFile);
            } catch (error) {
                console.error('Error compressing image:', error);
                toast.current.show({
                    severity: 'error',
                    summary: 'Compression Failed',
                    detail: 'Failed to compress image.',
                    life: 3000,
                });
            }
        }
    };

    const uploadProfilePicture = async (file) => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            toast.current.show({
                severity: 'error',
                summary: 'User Not Found',
                detail: 'Please log in.',
                life: 3000,
            });
            return;
        }

        const formData = new FormData();
        formData.append('profile_picture', file);

        try {
            setIsUploading(true);
            setUploadProgress(0);

            await axios.post(
                `http://localhost:3001/profile/upload-profile-picture/${userId}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('tempToken')}`,
                    },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setUploadProgress(percentCompleted);
                    },
                }
            );

            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Profile picture uploaded successfully.',
                life: 3000,
            });
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Upload Failed',
                detail: error.response?.data?.error || 'Failed to upload profile picture.',
                life: 3000,
            });
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleScheduleUploadClick = () => {
        if (scheduleInputRef.current) {
            scheduleInputRef.current.click();
        }
    };

    const handleProfileUploadClick = () => {
        if (profileInputRef.current) {
            profileInputRef.current.click();
        }
    };

    return (
        <div className="uploads-container-wrapper">
            <div className="uploads-container">
                <Toast ref={toast} position="top-right" />

                {isUploading && (
                    <div className="loading-overlay">
                        <i className="pi pi-spin pi-spinner" style={{ fontSize: '2em' }}></i>
                        <p>Uploading... {uploadProgress}%</p>
                        <ProgressBar value={uploadProgress} />
                    </div>
                )}

                <div className="uploads-header">
                    <h2>Uploads</h2>
                </div>
                <div className="uploads-content">
                    <div className="upload-section">
                        <Button
                            label="Upload Profile Photo"
                            icon="pi pi-user"
                            onClick={handleProfileUploadClick}
                            className="upload-button"
                            disabled={isUploading}
                        />
                        <input
                            ref={profileInputRef}
                            type="file"
                            accept=".png, .jpg, .jpeg"
                            onChange={handleProfileFileChange}
                            style={{ display: 'none' }}
                        />
                    </div>
                    <div className="upload-section">
                        <Button
                            label="Upload Schedule"
                            icon="pi pi-upload"
                            onClick={handleScheduleUploadClick}
                            className="upload-button"
                            disabled={isUploading}
                        />
                        <input
                            ref={scheduleInputRef}
                            type="file"
                            accept=".png, .jpg, .jpeg"
                            onChange={handleScheduleFileChange}
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Uploads;
