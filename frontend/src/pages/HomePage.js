import React from 'react';
import './HomePage.css';
import Header from '../components/homepage/Header';
import CoreValues from '../components/homepage/CoreValues';
import TourForm from '../components/homepage/tourform-components/TourForm';
import Home from '../components/homepage/Home';
import HorizontalDivider from '../components/homepage/HorizontalDivider80';
import HomepageFooter from '../components/homepage/HomepageFooter';

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
                <section className='section' id="homepage-footer">
                    <HomepageFooter />
                </section>
            </div>
        </div>
    );
};

export default HomePage;