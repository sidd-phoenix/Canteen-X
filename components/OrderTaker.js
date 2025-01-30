import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

const OrderTaker = () => {
    const { data: session } = useSession();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const counterNumber = session?.user?.counter; // Get the counter number from the session

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

                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }

                const data = await response.json();
                // Filter orders for the current counter and pending status
                const filteredOrders = data.orders?.filter(order => 
                    order.items.some(item => item.assignedCounter === counterNumber && item.status === 'pending')
                ) || [];
                
                setOrders(filteredOrders);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setError(error.message); // Set error message
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [session, counterNumber]);

    const markAsReady = async (orderId, itemId) => {
        try {
            await fetch(`/api/orders/${orderId}/items/${itemId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'ready' }),
            });
            // Optionally, refresh the orders after updating
            // fetchOrders();
        } catch (error) {
            console.error('Error updating item status:', error);
            setError('Failed to update item status'); // Set error message
        }
    };

    return (
        <div className="order-taker-container">
            <h1>Orders for Counter {counterNumber}</h1>
            {loading && <p>Loading orders...</p>}
            {error && <p className="error-message">{error}</p>}
            {(!loading && orders.length === 0) && <p>No pending orders available.</p>}
            <ul className="order-list">
                {orders.map(order => (
                    <li key={order._id} className="order-card">
                        <h2>Order ID: {order._id}</h2>
                        <ul>
                            {order.items.filter(item => item.assignedCounter === counterNumber && item.status === 'pending').map(item => (
                                <li key={item.menuItemId}>
                                    <span>{item.name} - Quantity: {item.quantity}</span>
                                    <button onClick={() => markAsReady(order._id, item.menuItemId)}>Tick as Ready</button>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderTaker; 