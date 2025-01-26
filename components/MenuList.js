"use client"; // Ensure this is a client component

import React, { useEffect, useState } from 'react';
import Link from 'next/link'; // Import Link from Next.js
import Image from 'next/image'; // Import Image from Next.js
import styles from '../styles/MenuList.module.css';

const MenuList = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);

  // Initialize cart from local storage
  useEffect(() => {
    if (typeof window !== 'undefined') { // Check if running in the browser
      const storedCart = localStorage.getItem('cart');
      setCart(storedCart ? JSON.parse(storedCart) : []);
    }
  }, []); // Run this effect only once when the component mounts

  // Fetch menu items based on search term
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('/api/menu');
        if (!response.ok) {
          throw new Error('Failed to fetch menu items');
        }
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, []);

  // Function to add item to cart
  const addToCart = (item, quantity) => {
    const existingItem = cart.find(cartItem => cartItem._id === item._id);
    if (existingItem) {
      // If item already in cart, update the quantity
      const updatedCart = cart.map(cartItem => 
        cartItem._id === item._id ? { ...existingItem, quantity: existingItem.quantity + quantity } : cartItem
      );
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart)); // Update local storage
    } else {
      // If item not in cart, add it
      const newCart = [...cart, { ...item, quantity }];
      setCart(newCart);
      localStorage.setItem('cart', JSON.stringify(newCart)); // Update local storage
    }
  };

  return (
    <div className={styles.menuContainer}>
      <h2>Menu Items</h2>
      <input
        type="text"
        placeholder="Search items by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
        className={styles.searchInput}
      />
      <ul className={styles.menuList}>
        {menuItems
          .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())) // Filter items based on search term
          .map((item) => (
            <li key={item._id} className={styles.menuItem}>
              <Image
                src={item.imageUrl} // Ensure this is the direct link
                alt={item.name}
                width={300} // Set appropriate width
                height={200} // Set appropriate height
                objectFit="cover" // Ensure the image covers the container
              />
              <div className={styles.itemDetails}>
                <h3>{item.name}</h3>
                <p>${item.price}</p>
                <button onClick={() => addToCart(item)}>
                  Add to Cart
                </button>
              </div>
            </li>
          ))}
      </ul>
      <Link href="/cart">
        <button className={styles.viewCartButton}>View Cart</button>
      </Link>
    </div>
  );
};

export default MenuList;
