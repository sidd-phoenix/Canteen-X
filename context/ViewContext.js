import React, { createContext, useContext, useState } from 'react';

const ViewContext = createContext();

export const ViewProvider = ({ children }) => {
    const [view, setView] = useState('default'); // Default view

    return (
        <ViewContext.Provider value={{ view, setView }}>
            {children}
        </ViewContext.Provider>
    );
};

export const useView = () => {
    const context = useContext(ViewContext);
    if (!context) {
        throw new Error("useView must be used within a ViewProvider");
    }
    return context;
};