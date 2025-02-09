import React from 'react';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faReceipt, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import OrderHistorySkeleton from './OrderHistorySkeleton';
import '@/styles/OrderHistory.css';

const fetcher = (url, email) => fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
}).then(res => {
    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }
    return res.json();
});

const OrderHistory = () => {
    const { data: session, status: sessionStatus } = useSession();
    const { data, error } = useSWR(
        session ? ['/api/orders/userorders', session.user.email] : null, // Fetch user orders
        ([url, email]) => fetcher(url, email),
        { refreshInterval: 5000 }
    );

    console.log('Session:', session);
    console.log('Data:', data);
    console.log('Error:', error);

    if (sessionStatus === 'loading') return <p>Loading session...</p>;
    if (error) return <p>Error loading orders: {error.message}</p>;

    // Use skeleton loading while data is being fetched
    if (!data) return (
        <div className="skeleton-loading">
            {Array.from({ length: 4 }).map((_, index) => (
                <OrderHistorySkeleton key={index} />
            ))}
        </div>
    );

    // Filter orders with status 'completed'
    const orders = data.orders.filter(order => order.status === 'completed');

    return (
        <div className="order-history-container">
            <h1 className="order-history-header">Order History</h1>
            <ul className="order-list">
                {orders.length === 0 ? (
                    <p>No completed orders found.</p>
                ) : (
                    orders.map(order => (
                        <li key={order._id} className="order-card">
                            <div className="order-header">
                                <h2 className="order-id">
                                    <FontAwesomeIcon icon={faReceipt} /> Order ID: {order._id}
                                </h2>
                                <p className="order-date">
                                    <FontAwesomeIcon icon={faCalendarAlt} /> Placed At: {new Date(order.placedAt).toLocaleString()}
                                </p>
                            </div>
                            <p className="order-status">
                                <FontAwesomeIcon icon={faCheckCircle} /> Status: {order.status}
                            </p>
                            <p className="order-total">Total Amount: ₹{order.totalAmount.toFixed(2)}</p>
                            <ul className="order-items">
                                {order.items.map(item => (
                                    <li key={item.menuItemId} className="order-item">
                                        <div className="item-details">
                                            <span className="item-name">Item: {item.name}</span>
                                            <span className="item-quantity">Quantity: {item.quantity}</span>
                                        </div>
                                        <span className="item-price">Price: ₹{item.price.toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default OrderHistory;
