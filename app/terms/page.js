import React from 'react';
import Link from 'next/link'; // Import Link from Next.js
import '@/styles/InfoPages.css'; // Import the shared CSS file

const Terms = () => {
  return (
    <div className="info-page-container">
      <h1 className="info-page-header">Terms and Conditions</h1>
      <div className="info-page-content">
        <p>By using our services, you agree to the following terms:</p>
        <ul>
          <li>All users must comply with our policies.</li>
          <li>We reserve the right to update terms at any time.</li>
        </ul>
        <p>Please read our terms carefully before using our services.</p>
      </div>
      <Link href="/" className="home-link">Back to Home</Link>
    </div>
  );
};

export default Terms; 