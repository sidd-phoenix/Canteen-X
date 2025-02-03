import React from 'react';
import Link from 'next/link'; // Import Link from Next.js
import '@/styles/InfoPages.css'; // Import the shared CSS file

const Contact = () => {
  return (
    <div className="info-page-container">
      <h1 className="info-page-header">Contact Us</h1>
      <div className="info-page-content">
        <p>If you have any questions, feel free to reach out to us at:</p>
        <ul>
          <li>Email: support@example.com</li>
          <li>Phone: +123 456 7890</li>
        </ul>
        <p>We are here to help you 24/7.</p>
      </div>
      <Link href="/" className="home-link">Back to Home</Link>
    </div>
  );
};

export default Contact;