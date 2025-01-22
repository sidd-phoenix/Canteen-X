import React, { useState } from 'react';

const AddOrderTaker = () => {
    const [email, setEmail] = useState('');
    const [counter, setCounter] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/admin/addOrderTaker', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, counter }),
            });
            console.log(response)

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            alert('Order Taker updated successfully');
        } catch (error) {
            console.error('Error updating Order Taker:', error.message);
            alert(error.message);
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
            <button type="submit">Add Order Taker</button>
        </form>
    );
};

export default AddOrderTaker;