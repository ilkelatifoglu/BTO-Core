import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Unauthorized.css'; // Import the CSS file

const Unauthorized = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(2); // Start countdown from 2 seconds

  useEffect(() => {
    if (count <= 0) {
      navigate('/login'); // Redirect to login page after countdown
    } else {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer); // Clear timeout if component unmounts
    }
  }, [count, navigate]);

  return (
    <div className="unauthorized-container">
      <h1 className="unauthorized-title">Unauthorized Access</h1>
      <p className="unauthorized-message">You do not have permission to view this page.</p>
      <p className="unauthorized-redirect">You're being redirected in {count}...</p>
    </div>
  );
};

export default Unauthorized;
