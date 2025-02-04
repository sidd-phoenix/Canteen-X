"use client"
import React, { useEffect } from 'react';

const OrderPage = ({ params }) => {
    const { order_id } = params; // Get order_id from the URL parameter

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                console.log(order_id)
                const response = await fetch(`/api/payment/${order_id}`); // Call the API route
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                console.log(result)
            } catch (error) {
                console.log(error)
            }
        };

        fetchOrderData();
    }, [order_id]); // Dependency on order_id

    return (
        <div>
           
        </div>
    );
};

export default OrderPage;
