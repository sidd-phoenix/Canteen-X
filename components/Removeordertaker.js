import React, { useEffect, useState } from 'react';

const Removeordertaker = () => {
  const [orderTakers, setOrderTakers] = useState([]);

  useEffect(() => {
    // Fetch order takers from the server
    const fetchOrderTakers = async () => {
      try {
        const response = await fetch('/api/admin/getOrderTakers');
        const data = await response.json();
        setOrderTakers(data.orderTakers);
      } catch (error) {
        console.error('Error fetching order takers:', error);
      }
    };

    fetchOrderTakers();
  }, []);

  const handleRemoveOrderTaker = async (email) => {
    try {
      const response = await fetch('/api/admin/removeOrderTaker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setOrderTakers(orderTakers.filter((user) => user.email !== email));
      } else {
        console.error('Failed to remove order taker');
      }
    } catch (error) {
      console.error('Error removing order taker:', error);
    }
  };

  return (
    <div className="remove-ordertaker-container">
      <h2>Order Takers</h2>
      <ul className="ordertaker-list">
        {orderTakers.map((user) => (
          <li key={user.email} className="ordertaker-item">
            <span className="ordertaker-info">
              {user.name} ({user.email})
            </span>
            <button onClick={async () => {
              await handleRemoveOrderTaker(user.email);
              alert('Order taker removed successfully');
            }}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Removeordertaker;