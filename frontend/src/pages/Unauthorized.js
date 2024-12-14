// Unauthorized.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Unauthorized.css'; // Import the CSS file

const Unauthorized = () => {
    const navigate = useNavigate();
    const [count, setCount] = useState(2); 
    const token = localStorage.getItem('token') || localStorage.getItem('tempToken');

    useEffect(() => {
        if (count <= 0) {
            if(token){
                navigate('/dashboard', { replace: true }); // Redirect to the dashboard if user is logged in
            }
            else{
                navigate('/login', { replace: true }); // Redirect to the login page if user is not logged in
            }
        } else {
            const timer = setTimeout(() => setCount(count - 1), 1000);
            return () => clearTimeout(timer); 
        }
    }, [count, navigate]);

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

export default Unauthorized;
