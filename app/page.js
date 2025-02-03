"use client";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { Content } from "../components/Content";
import Footer from "@/components/Footer";
import { ViewProvider } from "@/context/ViewContext";
import { UserProvider } from "@/context/UserContext";
import { CartProvider } from '@/context/CartContext';

export default function Home() {
  return (
    <CartProvider>
      <UserProvider>
        <ViewProvider>
          <Navbar />
          <div className="page-container">
            <Sidebar />
            <Content />
          </div>
          <Footer />
        </ViewProvider>
      </UserProvider>
    </CartProvider>
  );
}