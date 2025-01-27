'use client'; // For Next.js app directory

import React, { useState } from 'react';
import '@/styles/OrderTaker.css';

const AddOrderTaker = () => {
    const [email, setEmail] = useState('');
    const [counter, setCounter] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    // const [itemsServed, setItemsServed] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('/api/admin/addOrderTaker', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, counter }),
            });

            // Check if the response is valid JSON
            const contentType = response.headers.get("content-type");
            let data;
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                const text = await response.text(); // Get the response text for debugging
                throw new Error(`Unexpected response format: ${text}`);
            }

            if (!response.ok) {
                // Show alert with the error message from the server
                alert(data.message || 'Something went wrong');
                throw new Error(data.message || 'Something went wrong');
            }

            // Show success alert
            alert(data.message);
        } catch (error) {
            // Show error message in alert
            setMessage('Error: ' + error.message);
            console.log('Error updating Order Taker: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Counter Number:</label>
                <input
                    type="number"
                    value={counter}
                    onChange={(e) => setCounter(e.target.value)}
                    required
                />
            </div>
            {/* <div>
                <label>Items Served (comma-separated):</label>
                <input
                    type="text"
                    value={itemsServed}
                    onChange={(e) => setItemsServed(e.target.value)}
                />
            </div> */}
            <button type="submit">Add Order Taker</button>
        </form>
    );
};

export default AddOrderTaker;
