import React from 'react';
import VerticalDivider from './VerticalDivider.js'; // Import your VerticalDivider component
import btoPhoto1 from './bto-photo-1.png';

const Home = () => {
    return (
        <div style={{ margin: '0 auto' }}>

            {/* Main Container */}
            <div
                style={{
                    width: '100%',
                    height: '400px', // Adjust as needed
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-around', // Space between the three sections
                    alignItems: 'center', // Align vertically in center
                    borderRadius: '16px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Optional for a card-like look
                    backgroundColor: '#ffffff', // Optional for card-style background
                    padding: '20px',
                }}
            >
                {/* Left Section - Image */}
                <div
                    style={{
                        width: '30%',
                        height: '85%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <img
                        src={btoPhoto1}
                        alt="Bilkent Event"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '16px 0 0 16px',
                        }}
                    />
                </div>

                {/* Vertical Divider */}
                <VerticalDivider />

                {/* Right Section - Text Content */}
                <div
                    style={{
                        width: '40%',
                        height: '85%',
                        paddingLeft: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}
                >
                    <h2
                        style={{
                            fontWeight: 'bold',
                            fontSize: 'clamp(1.0rem, 1.5vw, 1.5rem)', 
                        }}
                    >
                        We're Bilkent Tanıtım Ofisi
                    </h2>
                    <p
                        style={{
                            fontSize: 'clamp(0.9rem, 1.5vw, 1rem)', 
                            lineHeight: '1.5',
                        }}
                    >
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
