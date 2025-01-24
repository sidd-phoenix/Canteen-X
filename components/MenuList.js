import React, { useEffect, useState } from 'react';
import Link from 'next/link'; // Import Link from Next.js

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
    <div>
      <h2>Menu Items</h2>
      <input
        type="text"
        placeholder="Search items by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
      />
      <ul>
        {filteredItems.map(item => (
          <li key={item._id}>
            <strong>{item.name}</strong>: ${item.price}
            <input
              type="number"
              min="1"
              defaultValue="1"
              onChange={(e) => addToCart(item, parseInt(e.target.value))} // Add item to cart with specified quantity
            />
            <button onClick={() => addToCart(item, 1)}>Add to Cart</button> {/* Add item to cart with quantity 1 */}
          </li>
        ))}
      </ul>
      <Link href="/cart">
        <button>View Cart</button> {/* Button to view cart */}
      </Link>
    </div>
  );
};

export default MenuList;
