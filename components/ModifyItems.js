import React, { useEffect, useState } from 'react'
import '@/styles/ModifyItems.css' // Import the CSS file

const ModifyItems = () => {
  const [menuItems, setMenuItems] = useState([])

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('/api/menu') // Adjust the API endpoint as needed
        if (!response.ok) {
          const errorDetails = await response.text()
          throw new Error(`Network response was not ok: ${errorDetails}`)
        }
        const data = await response.json()
        setMenuItems(data)
      } catch (error) {
        console.error('Error fetching menu items:', error)
      }
    }

    fetchMenuItems()
  }, [])

  const handleRemove = async (id) => {
    try {
      const response = await fetch(`/api/menu?id=${id}`, { // Ensure the ID is included in the query string
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorMessage = await response.text(); // Get the error message from the response
        throw new Error(`Failed to delete item: ${errorMessage}`);
      }
      setMenuItems(menuItems.filter(item => item._id !== id)); // Update state to remove the item from the frontend
    } catch (error) {
      console.error('Error removing item:', error);
    }
  }

  const handleToggleAvailability = async (id, currentStatus) => {
    try {
      const response = await fetch(`/api/menu?id=${id}`, { // Include the ID in the query string
        method: 'PATCH', // Use PATCH to update the item
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isAvailable: !currentStatus }), // Toggle the current status
      });
      if (!response.ok) {
        const errorMessage = await response.text(); // Get the error message from the response
        throw new Error(`Failed to update availability: ${errorMessage}`);
      }
      const updatedItem = await response.json(); // Get the updated item
      setMenuItems(menuItems.map(item => (item._id === id ? updatedItem : item))); // Update state with the new item
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  }

  const handlePriceChange = async (id, newPrice) => {
    try {
      const response = await fetch(`/api/menu?id=${id}`, { // Include the ID in the query string
        method: 'PATCH', // Use PATCH to update the item
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ price: newPrice }), // Send the new price
      });
      if (!response.ok) {
        const errorMessage = await response.text(); // Get the error message from the response
        throw new Error(`Failed to update price: ${errorMessage}`);
      }
      const updatedItem = await response.json(); // Get the updated item
      setMenuItems(menuItems.map(item => (item._id === id ? updatedItem : item))); // Update state with the new item
    } catch (error) {
      console.error('Error updating price:', error);
    }
  }

  const handleCounterChange = async (id, newCounter) => {
    try {
      const response = await fetch(`/api/menu?id=${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assignedCounter: parseInt(newCounter) || 1 }),
      });
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to update counter: ${errorMessage}`);
      }
      const updatedItem = await response.json();
      setMenuItems(menuItems.map(item => (item._id === id ? updatedItem : item)));
    } catch (error) {
      console.error('Error updating counter:', error);
    }
  }

  return (
    <div>
      <h2>Modify Menu Items</h2>
      <table className="menu-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Counter</th>
            <th>Available</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {menuItems.map(item => (
            <tr key={item._id}>
              <td>{item._id}</td>
              <td>{item.name}</td>
              <td>
                <input
                  type="number"
                  value={item.price}
                  min="1" // Sets a minimum value of 1 for UI
                  onChange={(e) => {
                    const newPrice = e.target.value; // Keep it as a string during typing
                    if (newPrice === "" || parseFloat(newPrice) > 0) {
                      // Allow empty input for intermediate states or valid prices
                      handlePriceChange(item._id, newPrice);
                    }
                  }}
                  onBlur={(e) => {
                    // Ensure the value is valid after the user leaves the input field
                    if (!e.target.value || parseFloat(e.target.value) <= 0) {
                      handlePriceChange(item._id, "1"); // Reset to minimum value
                    }
                  }}
                />
              </td>
              <td>{item.category}</td>
              <td>
                <input
                  type="number"
                  value={item.assignedCounter || 1}
                  min="1"
                  onChange={(e) => {
                    const newCounter = e.target.value;
                    if (newCounter === "" || parseInt(newCounter) > 0) {
                      handleCounterChange(item._id, newCounter);
                    }
                  }}
                  onBlur={(e) => {
                    if (!e.target.value || parseInt(e.target.value) <= 0) {
                      handleCounterChange(item._id, "1");
                    }
                  }}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={item.isAvailable}
                  onChange={() => handleToggleAvailability(item._id, item.isAvailable)} // Call the toggle function
                />
              </td>
              <td>
                <button onClick={() => handleRemove(item._id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ModifyItems