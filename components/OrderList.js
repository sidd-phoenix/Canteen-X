// components/OrderList.js
import React from 'react';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import '@/styles/OrderList.css';

const fetcher = (url) => fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
}).then(res => {
    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }
    return res.json();
});

const OrderList = () => {
    const { data: session } = useSession();
    const counterNumber = session?.user?.counter;

    const { data, error, mutate } = useSWR(
        '/api/orders', // Fetch all orders
        fetcher,
        { refreshInterval: 5000 }
    );

    // Filter orders for the current counter and pending status
    const orders = data?.orders?.filter(order =>
        order.items.some(item => item.assignedCounter === counterNumber && item.status === 'pending')
    ) || [];

    const handleCheckboxChange = async (orderId, itemId) => {
        try {
            await fetch(`/api/orders/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, itemId })
            });
            mutate(); // Re-fetch data after update
        } catch (error) {
            console.error('Error updating item status:', error);
        }
    };

    if (!session) return <p>Loading session...</p>;
    if (error) return <p>Error loading orders: {error.message}</p>;

    return (
        <div className="order-list-container">
            <h2 className="order-list-header">Orders for Counter: {counterNumber}</h2>
            <ul className="order-list">
                {orders.length === 0 ? <p>No pending orders available.</p> : (
                    orders.map(order => (
                        <li key={order._id}>
                            <ul>
                                {order.items.filter(item => item.assignedCounter === counterNumber && item.status === 'pending').map(item => (
                                    <li key={item.menuItemId} className="order-item-details">
                                        <input 
                                            type="checkbox" 
                                            onChange={() => handleCheckboxChange(order._id, item.menuItemId)} 
                                        />
                                        <span className="item-name">{item.name}</span>
                                        <span className="item-price">₹{item.price}</span>
                                        <span className="item-quantity">Quantity: {item.quantity}</span>
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

export default OrderList;