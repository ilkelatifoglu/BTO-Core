import React from 'react';
import './Home.css'; // Import the CSS file
import VerticalDivider from './VerticalDivider.js'; // Import VerticalDivider
import btoPhoto1 from './bto-photo-1.png';

const Home = () => {
    return (
        <div>
            <div className="main-container">
                <div className="left-section">
                    <img
                        src={btoPhoto1}
                        alt="Bilkent Event"
                    />
                </div>
                <VerticalDivider />
                <div className="right-section">
                    <h2>We're Bilkent Tanıtım Ofisi</h2>
                    <p>
                        Bilkent Tanıtım Ofisi is dedicated to promoting the unique offerings of
                        Bilkent University. Our mission is to showcase the diverse academic programs,
                        vibrant campus life, and groundbreaking research initiatives.
                        Join us as we explore the opportunities that Bilkent University provides to
                        its students and the broader community.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Home;
