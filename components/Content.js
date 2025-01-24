import React from 'react'
import "../styles/Content.css"
import { useSession } from 'next-auth/react'
import { useView } from '@/context/ViewContext'
import UserProfile from './UserProfile'
import OrderHistory from './OrderHistory'
import Menu from './Menu'
import MenuList from './MenuList'
import Addordertaker from './Addordertaker'
import Removeordertaker from './Removeordertaker'

export const Content = () => {
  const { view } = useView()
  const { data: session } = useSession()

  return (
    <div className="content-container">
      <div className="content-body">
        {view === 'default' && (
          <MenuList />
        )}
        {view === 'user_profile' && (
          <UserProfile />
        )}
        {view === 'order_history' && (
          <OrderHistory />
        )}
        {view === 'menu' && (
          <Menu />
          )}
        {view === 'addordertaker' && (
          <Addordertaker />
        )}
        {view === 'removeordertaker' && (
          <Removeordertaker />
        )}
      </div>
    </div>
  )
}
