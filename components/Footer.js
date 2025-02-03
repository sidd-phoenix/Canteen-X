import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import '@/styles/Footer.css'; // Import the CSS file

const Footer = () => {
  return (
    <footer className="footer-container">
      <a href="/" className="footer-logo">CanteenX</a>
      <ul className="footer-links">
        {/* <li><a href="/about">About Us</a></li> */}
        <li><a href="/contact">Contact</a></li>
        <li><a href="/terms">Terms</a></li>
        <li><a href="/refunds">Refund Policy</a></li>
      </ul>
      <div className="footer-socials">

        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faFacebook} />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faTwitter} />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faInstagram} />
        </a>
      </div>
      <div className="footer-copyright">
        &copy; {new Date().getFullYear()} Dedicated to SVNIT
        <br />
        Credited to @Nikhil Tiwari @Aadil Siddiqui @Aniruddh Jain
      </div>
    </footer>

  );
};

export default Footer;
