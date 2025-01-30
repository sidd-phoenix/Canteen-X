"use client";
import { useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { Content } from "../components/Content";
import { ViewProvider } from "@/context/ViewContext";
import { UserProvider } from "@/context/UserContext";
import { CartProvider } from '@/context/CartContext';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <CartProvider>
      <UserProvider>
        <ViewProvider>
          <Navbar />
          <div className="page-container">
            <Sidebar />
            <Content />
          </div>
        </ViewProvider>
      </UserProvider>
    </CartProvider>
  );
}