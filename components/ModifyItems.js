import React, { useEffect, useState } from 'react'
import '../styles/ModifyItems.css' // Import the CSS file

const ModifyItems = () => {
  const [menuItems, setMenuItems] = useState([])

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('/api/menu') // Adjust the API endpoint as needed
        if (!response.ok) {
          throw new Error('Network response was not ok')
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
      // console.log(id)
      const response = await fetch(`/api/menu/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        console.log(response)
        throw new Error('Failed to delete item')
      }
      setMenuItems(menuItems.filter(item => item._id !== id)) // Update state to remove the item
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  const handleToggleAvailability = async (id, currentStatus) => {
    try {
      const response = await fetch(`/api/menu/${id}`, {
        method: 'PATCH', // Use PATCH to update the item
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isAvailable: !currentStatus }), // Toggle the current status
      });
      if (!response.ok) {
        throw new Error('Failed to update availability');
      }
      const updatedItem = await response.json(); // Get the updated item
      setMenuItems(menuItems.map(item => (item._id === id ? updatedItem : item))); // Update state with the new item
    } catch (error) {
      console.error('Error updating availability:', error);
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
            <th>Available</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {menuItems.map(item => (
            <tr key={item._id}>
              <td>{item._id}</td>
              <td>{item.name}</td>
              <td>${item.price}</td>
              <td>{item.category}</td>
              <td>
                <input 
                  type="checkbox" 
                  checked={item.isAvailable} 
                  onChange={() => handleToggleAvailability(item._id, item.isAvailable)}
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