import React from 'react';
import "@/styles/Sidebar.css"

const SidebarSkeleton = () => {
    return (
        <div className="sidebar skeleton">
            {/* Create 3 skeleton buttons to match sidebar buttons */}
            {[1, 2].map((item) => (
                <div key={item} className="skeleton-button pulse"></div>
            ))}
        </div>
    );
};

export default SidebarSkeleton; 