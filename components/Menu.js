import React from 'react'
import MenuButtons from './MenuButtons'
import MenuContent from './MenuContent'
import { MenuProvider } from '../context/MenuContext'
import '../styles/Menu.css'

const Menu = () => {
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