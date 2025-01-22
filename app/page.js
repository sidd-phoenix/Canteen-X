"use client";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { Content } from "../components/Content"

export default function Home() {

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <Sidebar />
        <Content />
      </div>
    </div>
  );
}