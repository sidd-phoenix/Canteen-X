import React, { useState } from 'react';

const AddItems = () => {
  const [menuItem, setMenuItem] = useState({
    name: '',
    assignedCounter: '', // To match schema
    price: 0,
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMenuItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/admin/addMenuItem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: menuItem.name,
          price: Number(menuItem.price),
          category: 'default',
          isAvailable: true,
          assignedCounter: menuItem.assignedCounter, // Pass as string (ObjectId)
        }),
      });

      const responseText = await response.text();
      const data = JSON.parse(responseText);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add item');
      }

      setMessage('Item added successfully!');
      setMenuItem({ name: '', assignedCounter: '', price: 0 });
    } catch (error) {
      console.error('Error details:', error);
      setError('Error adding item: ' + error.message);
    }
  };

  return (
    <div>
      <h1>Add Items</h1>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={menuItem.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={menuItem.price}
          onChange={handleInputChange}
          min="0"
          required
        />
        <input
          type="text"
          name="assignedCounter"
          placeholder="Counter (ObjectId)"
          value={menuItem.assignedCounter}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
};

export default AddItems;
