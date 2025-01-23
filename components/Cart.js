import React from 'react';

const Cart = () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || []; // Retrieve cart from local storage

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div>
      <h2>Your Cart</h2>
      <ul>
        {cart.map(item => (
          <li key={item._id}>
            <strong>{item.name}</strong>: ${item.price} x {item.quantity} = ${item.price * item.quantity}
          </li>
        ))}
      </ul>
      <h3>Total: ${calculateTotal()}</h3>
      <button onClick={() => window.location.href = '/'}>Continue Shopping</button> {/* Button to go back to menu */}
    </div>
  );
};

export default Cart;
