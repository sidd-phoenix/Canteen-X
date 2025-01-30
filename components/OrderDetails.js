"use client"
import React, { useEffect, useState } from 'react';
const OrderDetails = ({ order_id }) => {
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrderDetails = async () => {
        try {
            const response = await fetch(`https://sandbox.cashfree.com/pg/orders/${order_id}/extended`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    // "x-client-id": process.env.CASHFREE_CLIENT_ID,
                    // "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
                    "x-api-version": process.env.CASHFREE_VERSION,
                },
            });

            if (!response.ok) {
                throw new Error(`Error fetching order details: ${response.statusText}`);
            }

            const data = await response.json();
            setOrderData(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (order_id) {
            fetchOrderDetails();
        }
    }, [order_id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Order Details</h2>
            <pre>{JSON.stringify(orderData, null, 2)}</pre> {/* Display order details */}
        </div>
    );
};

export default OrderDetails; 