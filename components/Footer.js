import React from 'react';
import Link from 'next/link'; // Use Next.js Link component
import "@/styles/Footer.css"; // Import the CSS file for styling

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-links">
                <Link href="/contact">Contact Us</Link>
                <Link href="/terms">Terms & Conditions</Link>
                <Link href="/refunds">Refunds & Cancellations</Link>
            </div>
        </footer>
    );
};

export default Footer; 