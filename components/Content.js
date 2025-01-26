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
import Orders from './Orders'

export const Content = () => {
  const { view } = useView()
  const { data: session } = useSession()

  return (
    <div className="content-container">
      <div className="content-body">
        {view === 'default' && (
          "Default view"
        )}
        {view === 'user_profile' && (
          <UserProfile />
        )}
        {view === 'order_history' && (
          <OrderHistory />
        )}
        {view === 'menu' && (
          <MenuList />
          )}
        {view === 'add_order_taker' && (
          <Addordertaker />
        )}
        {view === 'remove_order_taker' && (
          <Removeordertaker />
        )}
        {view === 'orders' && (
          <Orders />
        )}
        {view === 'menu_admin' && (
          <Menu />
        )}
      </div>
    </div>
  )
}
