import React from 'react'
import "../styles/Content.css"
import { useSession } from 'next-auth/react'
import { useView } from '@/context/ViewContext'
import UserProfile from './UserProfile'
import OrderHistory from './OrderHistory'
import Menu from './Menu'
import Addordertaker from './Addordertaker'
import Removeordertaker from './Removeordertaker'
import MenuList from './MenuList'

export const Content = () => {
  const { view } = useView()
  const { data: session } = useSession()
  return (
    <div className='content-container'>
      {view == 'default' && (
        <MenuList />
      )}
      {view == 'user_profile' && (
        <UserProfile />
      )}
      {view == 'order_history' && (
        <OrderHistory />
      )}
      {view == 'menu' && (
        <Menu />
      )}
      {view == 'addordertaker' && (
        <Addordertaker />
      )}
      {view == 'removeordertaker' && (
        <Removeordertaker />
      )}
    </div>
  )
}
