import React from 'react';
import './HelpSupport.css';

const HelpSupport = () => {
    return (
        <div className="help-support-container">
            <h1 className="help-support-header" style={{marginTop: "20px"}}>Help and Support</h1>

            <div className="help-support-section">
                <h2>
                    <i className="pi pi-question-circle help-icon"></i> FAQ
                </h2>
                <p>
                    <strong>Q:</strong> "How can I schedule a tour?"<br />
                    <strong>A:</strong> "After logging in, go to the 'Highschool Application Tracking System' on your dashboard, 
                    select an available date and time, and follow the on-screen instructions to complete your booking."
                </p>
                <p>For more questions and answers, please <a href="#">click here</a>.</p>
            </div>

            <div className="help-support-section">
                <h2>
                    <i className="pi pi-book help-icon"></i> How to Use BTO Core?
                </h2>
                <p>
                    To learn more, please <a href="#">click here</a> for the detailed user manual and comprehensive tutorial videos 
                    that will guide you through using BTO Core efficiently.
                </p>
            </div>

            <div className="help-support-section">
                <h2>
                    <i className="pi pi-envelope help-icon"></i> Contact us
                </h2>
                <p>
                    For support, email us at <a href="mailto:agorateam@gmail.com">agorateam@gmail.com</a>.
                </p>
            </div>
        </div>
    );
};

export default HelpSupport;
