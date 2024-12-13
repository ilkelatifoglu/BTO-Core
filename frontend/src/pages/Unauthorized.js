// Unauthorized.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Unauthorized.css'; // Import the CSS file
import PropTypes from 'prop-types'; // For prop type validation (optional)

const Unauthorized = ({ from }) => {
    const navigate = useNavigate();
    const [count, setCount] = useState(2); // Start countdown from 2 seconds

    // Determine the path to redirect to. If 'from' is not provided, default to home.
    const fromPath = from?.pathname || '/';

    useEffect(() => {
        if (count <= 0) {
            navigate(fromPath, { replace: true }); // Redirect back to the originating page
        } else {
            const timer = setTimeout(() => setCount(count - 1), 1000);
            return () => clearTimeout(timer); // Clear timeout if component unmounts
        }
    }, [count, navigate, fromPath]);

    return (
        <div className="unauthorized-container">
            <h1 className="unauthorized-title">Unauthorized Access</h1>
            <p className="unauthorized-message">You do not have permission to view this page.</p>
            <p className="unauthorized-redirect">
                You're being redirected back in {count} second{count !== 1 ? 's' : ''}...
            </p>
        </div>
    );
};

// Optional: Define prop types for better maintainability
Unauthorized.propTypes = {
    from: PropTypes.object.isRequired,
};

export default Unauthorized;
