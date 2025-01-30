// components/OrderList.js
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'; // Import useSession
import eventEmitter from '@/app/EventEmitter'; // Import the event emitter
// import '../styles/OrderList.css';

const OrderList = () => {
    const { data: session } = useSession(); // Get session data
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!session?.user?.email) {
                    console.error('User email not found');
                return;
            }

            try {
                const response = await fetch('/api/orders', { // Ensure the correct API endpoint is used
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ counter: session.user.counter }), // Pass email to fetch orders
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }

                const data = await response.json();
                setOrders(data.orders || []); // Set orders state
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [session]); // Dependency on session

    const handleCheckboxChange = async (orderId, itemId) => {
        try {
            const response = await fetch('/api/orders/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderId, itemId }),
            });

            if (!response.ok) {
                throw new Error('Failed to update item status');
            }

            const data = await response.json();
            console.log('Update response:', data);

            // Update the orders state to remove the item that is now ready
            setOrders(prevOrders => 
                prevOrders.map(order => {
                    if (order._id === orderId) {
                        return {
                            ...order,
                            items: order.items.filter(item => item.menuItemId !== itemId) // Remove the item from the order
                        };
                    }
                    return order;
                })
            );

            // Emit an event after updating the order
            eventEmitter.emit('orderUpdated', orderId);
        } catch (error) {
            console.error('Error updating item status:', error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2>Orders for Counter: {session.user.counter}</h2>
            <ul>
                {orders
                    .filter(order => order.status === 'pending') // Filter orders with status 'pending'
                    .map(order => (
                        <li key={order._id}>
                            <ul>
                                {order.items
                                    .filter(item => item.assignedCounter === session.user.counter && item.status === 'pending') // Filter items by assignedCounter and status
                                    .map(item => (
                                        <li key={item.menuItemId}>
                                            <input 
                                                type="checkbox" 
                                                onChange={() => handleCheckboxChange(order._id, item.menuItemId)} 
                                            /> {/* Checkbox for each item */}
                                            {item.name} - ${item.price} (Quantity: {item.quantity}) - Order ID: {order._id}

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