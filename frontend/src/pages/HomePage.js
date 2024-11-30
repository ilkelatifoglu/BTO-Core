import React from 'react';
import './HomePage.css';
import Header from '../components/homepage/Header';
import CoreValues from '../components/homepage/CoreValues';
import TourForm from '../components/homepage/tourform-components/TourForm';
import Contact from '../components/homepage/Contact';
import Home from '../components/homepage/Home';
import HorizontalDivider from '../components/homepage/HorizontalDivider80';

const HomePage = () => {
    return (
        <div>
            <Header /> 
            <div className='maincontent'>
                <section className='section' id="home">
                    <Home />
                </section>
                <HorizontalDivider />
                <section className='section' id="core-values">
                    <CoreValues />
                </section>
                <HorizontalDivider />
                <section className='section' id="tour-form">
                    <TourForm />
                </section>
                <HorizontalDivider />
                <section className='section' id="contact">
                    <Contact />
                </section>
            </div>
        </div>
    );
};

export default HomePage;