import React from 'react';
import styles from '../styles/OrderHistorySkeleton.module.css'; // Import the CSS module

const OrderHistorySkeleton = () => {
  return (
    <li className={`${styles.skeletonItem} ${styles.pulse}`}>
      <div className={`${styles.skeletonHeader} ${styles.pulse}`}></div>
      <div className={styles.skeletonDetails}>
        <div className={`${styles.skeletonText} ${styles.pulse}`}></div>
        <div className={`${styles.skeletonText} ${styles.pulse}`}></div>
        <div className={`${styles.skeletonText} ${styles.pulse}`}></div>
      </div>
    </li>
  );
};

export default OrderHistorySkeleton; 