import React from 'react';
import Link from 'next/link'; // Import Link from Next.js
import '@/styles/InfoPages.css'; // Import the shared CSS file

const Refunds = () => {
  return (
    <div className="info-page-container">
      <h1 className="info-page-header">Refund Policy</h1>
      <div className="info-page-content">
        <p>Our refund policy is as follows:</p>
        <ul>
          <li>Refunds are processed within 7 business days.</li>
          <li>Contact support for any refund-related queries.</li>
        </ul>
        <p>We strive to ensure customer satisfaction.</p>
      </div>
      <Link href="/" className="home-link">Back to Home</Link>
    </div>
  );
};

export default Refunds;