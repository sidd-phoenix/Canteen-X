import React, { useEffect, useState } from 'react';
import Link from 'next/link'; // Import Link from Next.js
import styles from '../styles/MenuList.module.css';

const MenuList = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState(() => {
    // Initialize cart from local storage
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('/api/menu'); // Adjust the API endpoint as needed
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
  }, []);

  // Filter menu items based on the search term
  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) && item.isAvailable
  );

  // Function to add item to cart
  const addToCart = (item, quantity) => {
    const existingItem = cart.find(cartItem => cartItem._id === item._id);
    let updatedCart;
    if (existingItem) {
      updatedCart = cart.map(cartItem =>
        cartItem._id === item._id ? { ...existingItem, quantity: existingItem.quantity + quantity } : cartItem
      );
    } else {
      updatedCart = [...cart, { ...item, quantity }];
    }
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart)); // Save updated cart to local storage
  };

  return (
    <div className={styles.menuContainer}>
      <h2>Menu Items</h2>
      <input
        type="text"
        placeholder="Search items by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />
      <ul className={styles.menuList}>
        {filteredItems.map(item => (
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
                onChange={(e) => addToCart(item, parseInt(e.target.value))}
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
                onClick={() => addToCart(item, parseInt(document.querySelector(`#quantity-${item._id}`).value))}
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
