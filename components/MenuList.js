"use client"; // Ensure this is a client component

import React, { useEffect, useState } from 'react';
import Link from 'next/link'; // Import Link from Next.js
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
        const response = await fetch(`/api/menu?search=${searchTerm}`); // Fetch menu items based on search term
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMenuItems(data); // Set the fetched menu items to state
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, [searchTerm]); // Fetch menu items whenever the search term changes

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
        {menuItems.map(item => (
          <li key={item._id} className={styles.menuItem}>
            <div className={styles.itemInfo}>
              <strong>{item.name}</strong>
              <span>${item.price}</span>
            </div>
            <div className={styles.quantityControls}>
              <button 
                className={styles.quantityButton}
                onClick={() => {
                  const input = document.querySelector(`#quantity-${item._id}`);
                  if (parseInt(input.value) > 1) {
                    input.value = parseInt(input.value) - 1;
                  }
                }}
              >
                -
              </button>
              <input
                id={`quantity-${item._id}`}
                type="number"
                min="1"
                defaultValue="1"
                className={styles.quantityInput}
                onChange={(e) => addToCart(item, parseInt(e.target.value))} // Add item to cart with specified quantity
              />
              <button 
                className={styles.quantityButton}
                onClick={() => {
                  const input = document.querySelector(`#quantity-${item._id}`);
                  input.value = parseInt(input.value) + 1;
                }}
              >
                +
              </button>
              <button 
                className={styles.addToCartButton}
                onClick={() => addToCart(item, parseInt(document.querySelector(`#quantity-${item._id}`).value))} // Add to cart with current quantity
              >
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
