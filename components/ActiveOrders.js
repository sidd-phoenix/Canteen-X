import React from 'react';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCheckCircle, faReceipt, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import '@/styles/ActiveOrders.css';
import ActiveOrdersSkeleton from './ActiveOrdersSkeleton';

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

const ActiveOrders = () => {
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
                <div key={index} className="skeleton-item"></div>
            ))}
        </div>
    );

    // Filter orders with status 'pending'
    const orders = data.orders.filter(order => order.status === 'pending');

    return (
        <div className="active-orders-container">
            <h3>Active Orders</h3>
            <ul className="order-list">
                {orders.length === 0 ? (
                    <p>No active orders found.</p>
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
                            <ul className="order-items">
                                {order.items.map(item => (
                                    <li key={item.menuItemId} className="order-item">
                                        <div className="item-details">
                                            <span className="item-name">Item: {item.name}</span>
                                            <span className="item-quantity">Quantity: {item.quantity}</span>
                                            <span className="item-status">
                                                {item.status === 'preparing' && <><FontAwesomeIcon icon={faClock} /> Preparing</>}
                                                {item.status === 'ready' && <><FontAwesomeIcon icon={faCheckCircle} /> Ready</>}
                                            </span>
                                        </div>
                                        <span className="item-price">Price: ₹{item.price.toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="order-total">Total Amount: ₹{order.totalAmount.toFixed(2)}</p>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default ActiveOrders;