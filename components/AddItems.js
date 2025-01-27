import React, { useState } from 'react';

const AddItems = () => {
  const [menuItem, setMenuItem] = useState({
    name: '',
    assignedCounter: '', // To match schema
    price: '',
    imageUrl: '', // New field for image URL
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

  const convertGoogleDriveLinkToDirectLink = (url) => {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
    return url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const directImageUrl = convertGoogleDriveLinkToDirectLink(menuItem.imageUrl);
      console.log('Converted Image URL:', directImageUrl); // Log the converted URL

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
          assignedCounter: menuItem.assignedCounter,
          imageUrl: directImageUrl, // Use the converted direct link
        }),
      });

      const responseText = await response.text();
      const data = JSON.parse(responseText);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add item');
      }

      setMessage('Item added successfully!');
      setMenuItem({ name: '', assignedCounter: '', price: 0, imageUrl: '' });
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
          min="1"
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
        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={menuItem.imageUrl}
          onChange={handleInputChange}
        />
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
};

export default AddItems;
