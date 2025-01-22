'use client'
import React, { useState } from 'react'

const Menu = () => {
  const [menuItem, setMenuItem] = useState({
    name: '',
    counter: '',
    price: 0
  })
  const [message, setMessage] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setMenuItem(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/AddMenuItem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: menuItem.name,
          price: Number(menuItem.price),
          counter: Number(menuItem.counter),
          category: 'default',
          isAvailable: true
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add item')
      }

      setMessage('Item added successfully!')
      setMenuItem({ name: '', counter: '', price: 0 })
    } catch (error) {
      console.error('Error details:', error)
      setMessage('Error adding item: ' + error.message)
    }
  }

  return (
    <div className="menu-container">
      <h2>Add Menu Item</h2>
      {message && <div className="message">{message}</div>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Item Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={menuItem.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="counter">Counter Number:</label>
          <input
            type="text"
            id="counter"
            name="counter"
            value={menuItem.counter}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={menuItem.price}
            onChange={handleInputChange}
            min="0"
            step="0.01"
            required
          />
        </div>

        <button type="submit">Add Item</button>
      </form>
    </div>
  )
}

export default Menu