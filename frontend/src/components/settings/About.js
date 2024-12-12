import React from 'react';
import './About.css';
import mervePhoto from '../../assets/mervephoto.jpeg';
import egehanPhoto from '../../assets/egehanphoto.jpeg';
import ekinPhoto from '../../assets/ekinphoto.jpeg';
import ilkePhoto from '../../assets/ilkephoto.jpeg';
import emrePhoto from '../../assets/emrephoto.jpeg';
import bertanPhoto from '../../assets/bertanphoto.jpeg';

const About = () => {
    return (
        <div className="about-container" style={{marginLeft: "-15px"}}>
            <h1 className="about-main-heading" style={{marginTop: "60px", marginLeft: "15px"}}>About</h1>
            <div className="about-section">
                <h2>
                    <i className="pi pi-desktop about-icon"></i> What BTO Core is?
                </h2>
                <p>
                    BTO Core is a centralized platform designed for efficient tour management, data insights, and real-time updates. 
                    It helps users streamline tasks, improve organization, and access essential data securely.
                </p>
            </div>

            <div className="about-section">
                <h2>
                    <i className="pi pi-lock about-icon"></i> Data Security
                </h2>
                <p>
                    Data Security in BTO Core ensures all information is protected through role-based access, data encryption, and regular monitoring. 
                    We prioritize privacy and adhere to standards to maintain a safe and trusted platform for all users.
                </p>
            </div>

            <div className="about-section">
                <h2>
                    <i className="pi pi-users about-icon"></i> App Developers
                </h2>
                <div className="developer-profiles">
                    <figure className="developer">
                        <img src={ekinPhoto} alt="Ekin Köylü" />
                        <figcaption>Ekin Köylü</figcaption>
                    </figure>
                    <figure className="developer">
                        <img src={egehanPhoto} alt="Egehan Yıldız" />
                        <figcaption>Egehan Yıldız</figcaption>
                    </figure>
                    <figure className="developer">
                        <img src={ilkePhoto} alt="İlke Latifoğlu" />
                        <figcaption>İlke Latifoğlu</figcaption>
                    </figure>
                    <figure className="developer" style={{marginTop: "-10px"}}>
                        <img src={emrePhoto} alt="Emre Yazıcıoğlu" />
                        <figcaption>Emre Yazıcıoğlu</figcaption>
                    </figure>
                    <figure className="developer" style={{marginTop: "-10px"}}>
                        <img src={mervePhoto} alt="Merve Güleç" />
                        <figcaption>Merve Güleç</figcaption>
                    </figure>
                    <figure className="developer" style={{marginTop: "-10px"}}>
                        <img src={bertanPhoto} alt="Bertan Uran" />
                        <figcaption>Bertan Uran</figcaption>
                    </figure>
                </div>
            </div>
        </div>
    );
};

export default About;
