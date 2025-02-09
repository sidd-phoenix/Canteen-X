import React from 'react';
import '@/styles/MenuItemSkeleton.css';

const MenuItemSkeleton = () => {
  return (
    <li className={`menuItem`}>
      <div className={`skeletonImage pulse`}></div>
        <div className="skeletonTitle pulse"></div>
        <div className="skeletonPrice pulse"></div>
        <div className="skeletonButton pulse"></div>
    </li>
  );
};

export default MenuItemSkeleton; 