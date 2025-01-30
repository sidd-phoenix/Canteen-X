// components/OrderList.js
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'; // Import useSession
// import '../styles/OrderList.css';

const OrderList = () => {
    const { data: session } = useSession(); // Get session data
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("session",session)
        const fetchOrders = async () => {
            if (!session?.user?.email) {
                console.error('User email not found');
                return;
            }
            console.log(session.user.counter)
            if (!session?.user?.counter) {
                console.error('User counter not found');
                return;
            }
            
            try {
                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: session.user.email }), // Send only email
                });

                const data = await response.json();
                console.log(data);
                setOrders(data.orders || []);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [session]); // Remove counter from dependency array

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2>Orders for Counter: {session.counter}</h2>
            <ul>
                {orders
                    .filter(order => order.status === 'pending') // Filter orders with status 'pending'
                    .map(order => (
                        <li key={order._id}>
                            <h3>Order ID: {order._id}</h3>
                            <ul>
                                {order.items
                                    .filter(item => item.assignedCounter === session.counter && item.status === 'pending') // Filter items by assignedCounter and status
                                    .map(item => (
                                        <li key={item.menuItemId}>
                                            <input type="checkbox" /> {/* Checkbox for each item */}
                                            {item.name} - ${item.price} (Quantity: {item.quantity})
                                        </li>
                                    ))}
                            </ul>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default OrderList;