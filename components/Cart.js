import React, { useState } from 'react';
import '../styles/Cart.css';

const Cart = () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || []; // Retrieve cart from local storage

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>Your Cart <span className="cart-count">{cart.length}</span></h2>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <p>Your cart is empty</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map(item => (
              <div key={item._id} className="cart-item">
                <div className="item-details">
                  <div className="item-info">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-price">₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-row total-row">
              <span>Total:</span>
              <span>₹{calculateTotal()}</span>
            </div>
          </div>

          <div className="cart-actions">
            <button 
              className="checkout-btn"
              onClick={() => window.location.href = '/'}
            >
              Continue Shopping
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
