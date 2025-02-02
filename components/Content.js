import React from 'react'
import "@/styles/Content.css"
import { useView } from '@/context/ViewContext'
import UserProfile from './UserProfile'
import OrderHistory from './OrderHistory'
import Menu from './Menu'
import MenuList from './MenuList'
import Addordertaker from './Addordertaker'
import Removeordertaker from './Removeordertaker'
import ActiveOrders from './ActiveOrders'
import OrderList from './OrderList'
import OrderTaker from './OrderTaker'
import Footer from './Footer'

export const Content = () => {
  const { view } = useView()

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
        {view === 'active_orders' && (
          <ActiveOrders />
        )}
        {view === 'orders' && (
          <OrderList />
        )}
        {view === 'order_taker' && (
          <OrderTaker />
        )}
      </div>

      <Footer />
      
    </div>
  )
}
