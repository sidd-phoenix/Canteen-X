import React from 'react';
import styles from '../styles/MenuList.module.css';

const MenuItemSkeleton = () => {
  return (
    <li className={`${styles.menuItem} ${styles.skeleton}`}>
      <div className={`${styles.skeletonImage} ${styles.pulse}`}></div>
      <div className={styles.itemDetails}>
        <div className={`${styles.skeletonTitle} ${styles.pulse}`}></div>
        <div className={`${styles.skeletonPrice} ${styles.pulse}`}></div>
        <div className={`${styles.skeletonButton} ${styles.pulse}`}></div>
      </div>
    </li>
  );
};

export default MenuItemSkeleton; 