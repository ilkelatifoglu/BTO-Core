import './TourForm.css';
import React from 'react';
import Title from './Title';
import LeftForm from './LeftForm';
import RightForm from './RightForm';
import Buttons from './Buttons';

const TourForm = () => {
    return (
        <div className="tour-form-container">
            <div className="tour-form-inner">
                <Title />
                <div className="tour-form-sections">
                    <LeftForm />
                    <RightForm />
                </div>
                <Buttons />
            </div>
        </div>
    );
};

export default TourForm;
