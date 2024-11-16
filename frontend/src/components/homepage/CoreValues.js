import React from 'react';
import './CoreValues.css';
import HorizontalDivider from './HorizontalDivider100';

const CoreValues = () => {
    const values = [
        {
            number: 1,
            title: 'Showcasing the Bilkent Experience',
            description:
                'The Bilkent Information Office is dedicated to promoting the value of higher education by providing comprehensive information about Bilkent University. Through campus tours and fairs, it helps prospective students understand the unique opportunities the university offers.',
        },
        {
            number: 2,
            title: 'Empowering Your Educational Journey',
            description:
                'By offering personalized guidance and detailed insights into Bilkent University’s academic programs and campus life, the office empowers students to make informed decisions about their future, encouraging them to pursue their educational goals with confidence.',
        },
        {
            number: 3,
            title: 'Connecting with Future Leaders',
            description:
                'The office is committed to identifying the most promising prospective students and introducing them to Bilkent University’s world-class education and vibrant community. Through engaging and informative events, it aims to inspire the next generation of leaders.',
        },
        {
            number: 4,
            title: 'Inspiring a Lifelong Passion for Learning',
            description:
                'The Bilkent Information Office seeks to ignite curiosity and enthusiasm for learning by providing prospective students with immersive experiences that highlight the university’s commitment to academic excellence and personal growth.',
        },
    ];

    return (
        <div className="outer-container">
            {values.map((value, index) => (
                <div className="value-box" key={index}>
                    <div className="upper-section">
                        <div className="value-number">{value.number}</div>
                        <div className="value-title">{value.title}</div>
                    </div>
                    <div className="lower-section">
                        <div className="value-description">{value.description}</div>
                    </div>
                    {index !== values.length - 1 && <HorizontalDivider />}
                </div>
            ))}
        </div>
    );
};

export default CoreValues;
