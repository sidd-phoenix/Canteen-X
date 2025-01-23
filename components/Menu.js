import React from 'react'
import MenuButtons from './MenuButtons'
import MenuContent from './MenuContent'
import '../styles/Menu.css'
import { MenuProvider } from '@/context/MenuContext'

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
      const response = await fetch('/api/admin/addMenuItem', {
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
        if (response.status === 409) {
          throw new Error('Food item already exists')
        }
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
    <div className='menu'>
      <MenuProvider>
        <MenuButtons />
        <MenuContent />
      </MenuProvider>
    </div>
  )
}

export default Menu