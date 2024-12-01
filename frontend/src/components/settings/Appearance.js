import React, { useState, useEffect } from 'react';
import './Appearance.css';

const Appearance = () => {
    const [theme, setTheme] = useState(() => {
        // Load the saved theme from local storage or default to "system"
        return localStorage.getItem('theme') || 'system';
    });

    const handleThemeChange = (value) => {
        setTheme(value);
    };

    const handleSave = () => {
        localStorage.setItem('theme', theme); // Save the selected theme to local storage
        alert(`Theme saved as: ${theme}`);
    };

    const handleCancel = () => {
        setTheme(localStorage.getItem('theme') || 'system'); // Revert to the saved theme
    };

    useEffect(() => {
        // Apply the selected theme to the document body
        document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
    }, [theme]);

    return (
        <div className="appearance-page">
            {/* Title moved outside the container */}
            <h1 className="appearance-title">Appearance</h1>

            {/* Appearance container */}
            <div className={`appearance-container ${theme}-theme`}>
                <p>Select or customize your UI theme</p>

                <div className="theme-options">
                    <div className="theme-option">
                        <label htmlFor="system">
                            System Preference
                            <input
                                id="system"
                                type="checkbox"
                                checked={theme === 'system'}
                                onChange={() => handleThemeChange('system')}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>

                    <div className="theme-option">
                        <label htmlFor="light">
                            Light
                            <input
                                id="light"
                                type="checkbox"
                                checked={theme === 'light'}
                                onChange={() => handleThemeChange('light')}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>

                    <div className="theme-option">
                        <label htmlFor="dark">
                            Dark
                            <input
                                id="dark"
                                type="checkbox"
                                checked={theme === 'dark'}
                                onChange={() => handleThemeChange('dark')}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>

                <div className="appearance-actions">
                    <button className="save-button" onClick={handleSave}>Save</button>
                    <button className="cancel-button" onClick={handleCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default Appearance;
