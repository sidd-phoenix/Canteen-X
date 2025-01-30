import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        // Load the cart from local storage
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        const initialCount = storedCart.reduce((total, item) => total + (item.quantity || 0), 0);
        setCartCount(initialCount);
    }, []);

    const addToCart = () => {
        setCartCount(prevCount => prevCount + 1);
        // Optionally, you can also update the local storage here if needed
        // const updatedCart = [...storedCart, newItem]; // Add your new item logic here
        // localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    return (
        <CartContext.Provider value={{ cartCount, addToCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
}; 