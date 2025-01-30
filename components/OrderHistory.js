import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import '../styles/OrderHistory.css';
import OrderHistorySkeleton from './OrderHistorySkeleton';

const OrderHistory = () => {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const currencySymbol="₹";

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session?.user?.email) {
        console.error('User email not found');
        return;
      }

      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: session.user.email }),
        });

        const data = await response.json();
        setOrders(data.orders?.filter(order => order.status === 'completed') || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session]);

  return (
    <div className="order-history-container">
      <h1>Order History</h1>
      <ul className="order-list">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <OrderHistorySkeleton key={index} />
          ))
        ) : (
          orders.map(order => (
            <li key={order._id} className="order-card">
              <div className="order-header">
                <h2 className="order-id">Order ID: {order._id}</h2>
                <p className="order-date">Placed At: {new Date(order.placedAt).toLocaleString()}</p>
              </div>
              <p className="order-status">Status: {order.status}</p>
              <p className="order-total">Total Amount: {currencySymbol}{order.totalAmount.toFixed(2)}</p>
              <ul className="order-items">
                {order.items.map(item => (
                  <li key={item.menuItemId} className="order-item">
                    <div className="item-details">
                      <span className="item-name">Item: {item.name}</span>
                      <span className="item-quantity">Quantity: {item.quantity}</span>
                    </div>
                    <span className="item-price">Price: {currencySymbol}{item.price.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default OrderHistory;
