'use client'; // For Next.js app directory

import React, { useState } from 'react';
import '../styles/OrderTaker.css';

const AddOrderTaker = () => {
    const [email, setEmail] = useState('');
    const [counter, setCounter] = useState('');
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

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            console.log('Order Taker updated successfully:', data);
        } catch (error) {
            console.error('Error updating Order Taker:', error.message);
            setMessage('Error: ' + error.message);
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
