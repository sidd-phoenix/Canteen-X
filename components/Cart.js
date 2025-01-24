import React, { useEffect, useState , useState } from 'react';
import Link from 'next/link';
import '../styles/Cart.css';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const updateCartItemQuantity = (itemId, quantity) => {
    const updatedCart = cart.map(item =>
      item._id === itemId ? { ...item, quantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart)); // Update local storage
  };

  const removeCartItem = (itemId) => {
    const updatedCart = cart.filter(item => item._id !== itemId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart)); // Update local storage
  };

  const saveCartToLocalStorage = () => {
    localStorage.setItem('cart', JSON.stringify(cart)); // Save the current cart to local storage
  };

  if (!isClient) {
    return null; // Render nothing on the server
  }

  return (
    <div>
      <h2>Your Cart</h2>
      <ul>
        {cart.map(item => (
          <li key={item._id}>
            <button onClick={() => removeCartItem(item._id)}>Remove</button>
            <strong>{item.name}</strong>: ${item.price} x 
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => updateCartItemQuantity(item._id, parseInt(e.target.value))}
            />
            = ${item.price * item.quantity}
          </li>
        ))}
      </ul>
      <h3>Total: ${calculateTotal()}</h3>
      <Link href="/">
        <button onClick={saveCartToLocalStorage}>Continue Shopping</button>
      </Link>
    </div>
  );
};

export default Cart;
