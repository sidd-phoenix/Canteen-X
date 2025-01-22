import React from 'react'
import '../styles/Sidebar.css'
import { useSession } from "next-auth/react"; // Import NextAuth hooks
import Sidebar_customer from './Sidebar_customer';
import Sidebar_admin from './Sidebar_admin'
import Sidebar_order_taker from './Sidebar_order_taker'

export const Sidebar = () => {
  const { data: session } = useSession(); // Get session data

  return (
    <>
      {session && session.user.role === 'admin' && (
        <Sidebar_admin />
      )}
      {session && session.user.role === 'order_taker' && (
        <Sidebar_admin />
      )}
      {session && session.user.role === 'customer' && (
        <Sidebar_admin />
      )}
    </>
  )
}
