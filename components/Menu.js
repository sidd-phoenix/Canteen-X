import React from 'react'
import MenuButtons from '../components/MenuButtons'
import MenuContent from '../components/MenuContent'
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