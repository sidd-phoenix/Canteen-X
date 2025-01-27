import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        phone: '',
        role: '',
        profileImage: '/default-profile.png', // Add a default profile image
    });

    const updateUserDetails = (details) => {
        setUserDetails(prev => ({
            ...prev,
            ...details
        }));
    };

    return (
        <UserContext.Provider value={{ userDetails, updateUserDetails }}>
            {children}
        </UserContext.Provider>
    );
}; 