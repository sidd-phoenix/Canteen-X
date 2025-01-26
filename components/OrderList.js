import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'; // Import useSession from next-auth

const OrderList = () => {
    const { data: session } = useSession();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('Session data:', session); // Log session data

        const fetchOrders = async () => {
            if (!session || !session.user || !session.user.email) {
                setError('User not authenticated');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/admin/getOrders`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.accessToken}` // Ensure token is sent if needed
                    }
                });
                console.log('response',response);
                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }
                const data = await response.json();
                setOrders(data.orders);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [session]);

    const handleCheckboxChange = async (orderId, itemId) => {
        try {
            const response = await fetch(`/api/admin/updateOrderItemStatus`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderId, itemId, status: 'completed' }),
            });

            if (!response.ok) {
                throw new Error('Failed to update item status');
            }

            // Update the local state to reflect the change
            setOrders(prevOrders =>
                prevOrders.map(order => {
                    if (order._id === orderId) {
                        return {
                            ...order,
                            items: order.items.map(item => 
                                item.menuItemId === itemId ? { ...item, status: 'completed' } : item
                            ),
                        };
                    }
                    return order;
                })
            );
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div>Loading orders...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Orders List</h2>
            <ul>
                {orders.map(order => (
                    <li key={order._id}>
                        <h3>Order ID: {order._id}</h3>
                        <p>Total Amount: ${order.totalAmount.toFixed(2)}</p>
                        <p>Status: {order.status}</p>
                        <p>Placed At: {new Date(order.placedAt).toLocaleString()}</p>
                        <h4>Items:</h4>
                        <ul>
                            {order.items.map(item => (
                                <li key={item.menuItemId}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={item.status === 'completed'}
                                            onChange={() => handleCheckboxChange(order._id, item.menuItemId)}
                                        />
                                        {item.name} - ${item.price} x {item.quantity} (Status: {item.status})
                                    </label>
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