import React from 'react'
import "@/styles/Content.css"
import { useView } from '@/context/ViewContext'
import { useSession } from 'next-auth/react'
import UserProfile from './UserProfile'
import OrderHistory from './OrderHistory'
import Menu from './Menu'
import MenuList from './MenuList'
import Addordertaker from './Addordertaker'
import Removeordertaker from './Removeordertaker'
import ActiveOrders from './ActiveOrders'
import OrderList from './OrderList'
import OrderTaker from './OrderTaker'


export const Content = () => {
  const { view } = useView()
  const { data: session } = useSession()
  if (!session)
    return (
      <div className="content-container">
        <div className="content-body">
          <MenuList />
        </div>
      </div>
    )


  return (
    <div className="content-container">
      <div className="content-body">
        {view === 'default' && session.user.role === 'customer' &&(
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

    </div>
  )
}
