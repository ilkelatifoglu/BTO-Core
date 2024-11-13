import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css'; // Assuming you will create a CSS file for styling

const Header = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header__logo">
        <span>Bilkent Information Office</span>
      </div>
      <nav className="header__nav">
        <ul className="nav__list">
          <li className="nav__item"><a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Home</a></li>
          <li className="nav__item"><a href="#core-values" onClick={(e) => { e.preventDefault(); scrollToSection('core-values'); }}>Core Values</a></li>
          <li className="nav__item"><a href="#tour-form" onClick={(e) => { e.preventDefault(); scrollToSection('tour-form'); }}>Tour Form</a></li>
          <li className="nav__item"><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a></li>
        </ul>
      </nav>
      <div className="header__login">
        <button className="login__button" onClick={handleLoginClick}>Login</button>
      </div>
    </header>
  );
};

export default Header;