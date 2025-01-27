import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const OrderStatus = () => {
    const router = useRouter();
    const { orderId } = router.query;
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderStatus = async () => {
            if (!orderId) return;
            
            try {
                const response = await fetch(`/api/order-status/${orderId}`);
                const data = await response.json();
                
                if (data.success) {
                    setOrderDetails(data.orderDetails);
                } else {
                    console.error('Failed to fetch order details');
                }
            } catch (error) {
                console.error('Error fetching order status:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderStatus();
    }, [orderId]);

    if (loading) {
        return <div>Loading order details...</div>;
    }

    return (
        <div className="order-status-container">
            <h1>Order Status</h1>
            {orderDetails ? (
                <div className="order-details">
                    <h2>Order ID: {orderId}</h2>
                    <p>Status: {orderDetails.status}</p>
                    <p>Amount: ₹{orderDetails.amount}</p>
                    <p>Payment Method: {orderDetails.paymentMethod}</p>
                    <p>Transaction ID: {orderDetails.transactionId}</p>
                    {/* Add more order details as needed */}
                </div>
            ) : (
                <p>Order details not found</p>
            )}
            
            <div className="action-buttons">
                <Link href="/">
                    <button className="continue-shopping">Continue Shopping</button>
                </Link>
            </div>
        </div>
    );
};

export default OrderStatus; 