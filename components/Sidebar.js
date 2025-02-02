import React, { useState, useEffect } from 'react'
import '@/styles/Sidebar.css'
import { useSession } from "next-auth/react"; // Import NextAuth hooks
import Sidebar_customer from './Sidebar_customer';
import Sidebar_admin from './Sidebar_admin'
import Sidebar_order_taker from './Sidebar_order_taker'
import SidebarSkeleton from './SidebarSkeleton'

export const Sidebar = () => {
  const { data: session, status } = useSession(); // Get session data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for session check
    if (status !== 'loading') {
      setLoading(false);
    }
  }, [status]);

  if (loading) {
    return <SidebarSkeleton />;
  }

  return (
    <>
      {session && session.user.role === 'admin' && (
        <Sidebar_admin />
      )}
      {session && session.user.role === 'order_taker' && (
        <Sidebar_order_taker />
      )}
      {session && session.user.role === 'customer' && (
        <Sidebar_customer />
      )}
    </>
  )
}

export default Sidebar;