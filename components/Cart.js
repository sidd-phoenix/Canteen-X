import React, { useEffect, useState } from 'react';
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
    <div className="cart-container">
      <h2 className="cart-title">Your Cart</h2>
      <ul className="cart-items">
        {cart.map(item => (
          <li key={item._id} className="cart-item">
            <button className="remove-button" onClick={() => removeCartItem(item._id)}>Remove</button>
            <strong>{item.name}</strong>: ${item.price}
            <div className="quantity-controls">
              <button 
                className="quantity-button"
                onClick={() => {
                  if (item.quantity > 1) {
                    updateCartItemQuantity(item._id, item.quantity - 1);
                  }
                }}
              >
                -
              </button>
              <input
                className="quantity-input"
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateCartItemQuantity(item._id, parseInt(e.target.value))}
              />
              <button 
                className="quantity-button"
                onClick={() => updateCartItemQuantity(item._id, item.quantity + 1)}
              >
                +
              </button>
              <span className="item-total">= ${item.price * item.quantity}</span>
            </div>
          </li>
        ))}
      </ul>
      <h3 className="total">Total: ${calculateTotal()}</h3>
      <Link href="/">
        <button className="continue-shopping" onClick={saveCartToLocalStorage}>Continue Shopping</button>
      </Link>
    </div>
  );
};

export default Cart;
