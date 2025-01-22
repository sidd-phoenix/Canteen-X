'use client'; // For Next.js app directory

import React, { useState } from 'react';

const AddOrderTaker = () => {
    const [email, setEmail] = useState('');
    const [counter, setCounter] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('/api/admin/updateOrderTaker', {
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

            setMessage('Order Taker updated successfully!');
            setEmail('');
            setCounter('');
        } catch (error) {
            console.error('Error updating Order Taker:', error.message);
            setMessage('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2>Add Order Taker</h2>
            {message && <div className={`message ${message.startsWith('Error') ? 'error' : 'success'}`}>{message}</div>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="counter">Counter Number:</label>
                    <input
                        type="number"
                        id="counter"
                        value={counter}
                        onChange={(e) => setCounter(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Add Order Taker'}
                </button>
            </form>

            <style jsx>{`
                .container {
                    width: 300px;
                    margin: 0 auto;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                }

                .message {
                    margin: 10px 0;
                    padding: 10px;
                    border-radius: 5px;
                }

                .success {
                    background-color: #d4edda;
                    color: #155724;
                }

                .error {
                    background-color: #f8d7da;
                    color: #721c24;
                }

                form div {
                    margin-bottom: 15px;
                }

                label {
                    display: block;
                    margin-bottom: 5px;
                }

                input {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #ccc;
                    border-radius: 3px;
                }

                button {
                    padding: 10px 15px;
                    background-color: #007bff;
                    color: #fff;
                    border: none;
                    border-radius: 3px;
                    cursor: pointer;
                }

                button:disabled {
                    background-color: #aaa;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
};

export default AddOrderTaker;
