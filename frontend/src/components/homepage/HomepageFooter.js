import React from 'react';
import './HomepageFooter.css';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const HomepageFooter = () => {
  return (
    <footer className="homepage-footer">
      {/* Follow Us Section */}
      <div className="footer-top">
        <h3 className="follow-us">Follow Us</h3>
        <div className="social-icons">
          <a href="https://www.facebook.com/bilkentbto/" target="_blank" rel="noopener noreferrer" className="social-link">
            <FaFacebook />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
            <FaTwitter />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
            <FaInstagram />
          </a>
        </div>
      </div>

      {/* Contact Us Section */}
      <div className="footer-middle">
        <p className="contact-us">
          <strong>Contact Us:</strong>{' '}
          <a href="mailto:tanitim@bilkent.edu.tr" className="email-link">
            tanitim@bilkent.edu.tr
          </a>
        </p>
      </div>

      {/* Copyright Section */}
      <div className="footer-bottom">
        <p>2024 © BTO Core, All rights reserved.</p>
      </div>
    </footer>
  );
};

export default HomepageFooter;
