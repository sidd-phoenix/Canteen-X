"use client"
import React, { useEffect, useState } from 'react';
import '@/styles/OrderPage.css'; // Import the new CSS file

const OrderPage = ({ params }) => {
    const { order_id } = params; // Get order_id from the URL parameter
    const [status, setStatus] = useState(null);
    const [countdown, setCountdown] = useState(5); // Initialize countdown

    // Function to clear the cart from localStorage
    const clearCart = () => {
        localStorage.removeItem('cart'); // Clear the cart variable from localStorage
        console.log("Cart cleared from localStorage!"); // Optional: Log for confirmation
    };
    
    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                // console.log(order_id)
                const response = await fetch(`/api/payment/${order_id}`); // Call the API route
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                console.log(result)
                setStatus(result.status)

                // Clear the cart if the order is successful
                if (result.status === 'PAID') {
                    clearCart(); // Call the function to clear the cart
                }
                
            } catch (error) {
                console.log(error)
            }
        };

        fetchOrderData();
    }, [order_id]); // Dependency on order_id

    useEffect(() => {
        if (status !== null) {
            const timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev === 1) {
                        clearInterval(timer);
                        window.location.href = '/'; // Redirect to homepage
                    }
                    return prev - 1;
                });
            }, 1000); // Decrease countdown every second

            return () => clearInterval(timer); // Cleanup the timer on component unmount
        }
    }, [status]); // Dependency on status

    // Use skeleton loading while data is being fetched
    if (status === null) return (
        <div />
    )

    return (
        <div className="order-page-container">
            {status === 'PAID' ? (
                <div>
                    <h1>Order Placed Successfully!</h1>
                    <div className="tick-mark">✔️</div>
                    <p>Redirecting to home page in {countdown} seconds...</p>
                </div>
            ) : (
                <div>
                    <h1>Order Failed</h1>
                    <div className="tick-mark">❌</div>
                    <p>Redirecting to home page in {countdown} seconds...</p>
                </div>
            )}    
        
        </div>
    );
};

export default OrderPage;
