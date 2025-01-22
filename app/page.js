"use client";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { Content } from "../components/Content"
import { ViewProvider } from "@/context/ViewContext";

export default function Home() {

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <ViewProvider>
          <Sidebar />
          <Content />
        </ViewProvider>
      </div>
    </div>
  );
}