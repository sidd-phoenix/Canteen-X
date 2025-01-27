import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'; // Import useSession

const OrderList = () => {
    const { data: session } = useSession(); // Get session data
    const [counterNumber, setCounterNumber] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCounterNumber = async () => {
            if (!session || !session.user || !session.user.email) {
                setError('Order taker email is required');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/admin/getCustomerId?email=${encodeURIComponent(session.user.email)}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                console.log('response', response);
                if (!response.ok) {
                    throw new Error('Failed to fetch counter number');
                }
                const data = await response.json();
                setCounterNumber(data.counterNumber); // Assuming the response contains counterNumber
            } catch (err) {
                console.error('Error fetching counter number:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCounterNumber();
    }, [session]); // Depend on session

    useEffect(() => {
        const fetchOrders = async () => {
            if (!counterNumber) {
                return; // Wait until counterNumber is available
            }

            try {
                const response = await fetch(`/api/admin/getOrders?counterNumber=${encodeURIComponent(counterNumber)}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                console.log('response', response);
                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }
                const data = await response.json();
                setOrders(data.orders);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError(err.message);
            }
        };

        fetchOrders();
    }, [counterNumber]); // Depend on counterNumber

    const handleCheckboxChange = async (orderId, itemId, currentStatus) => {
        console.log('currentStatus', currentStatus);
        const newStatus = currentStatus === 'preparing' ? 'ready' : 'preparing'; // Toggle status
        console.log('newStatus', newStatus);
        try {
            console.log('Updating item status:', { orderId, itemId, status: newStatus }); // Log the payload
            const response = await fetch(`/api/admin/updateOrderItemStatus`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderId, itemId, status: newStatus }), // Set status to 'ready' or 'preparing'
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
                                item.menuItemId === itemId ? { ...item, status: newStatus } : item
                            ),
                        };
                    }
                    return order;
                })
            );
        } catch (error) {
            console.error('Error updating item status:', error);
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
                                            checked={item.status === 'ready'}
                                            onChange={() => handleCheckboxChange(order._id, item.menuItemId , item.status)}
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