import React from 'react'
import MenuButtons from './MenuButtons'
import MenuContent from './MenuContent'
import '../styles/Menu.css'
import { MenuProvider } from '@/context/MenuContext'

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