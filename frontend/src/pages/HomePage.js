import React from 'react';
import './HomePage.css';
import Header from '../components/homepage/Header';
import CoreValues from '../components/homepage/CoreValues';
import TourForm from '../components/homepage/TourForm';
import Contact from '../components/homepage/Contact';

const HomePage = () => {
    return (
        <div id="home">
            <Header />
            <section id="core-values">
                <CoreValues />
            </section>
            <section id="tour-form">
                <TourForm />
            </section>
            <section id="contact">
                <Contact />
            </section>
        </div>
    );
};

export default HomePage;